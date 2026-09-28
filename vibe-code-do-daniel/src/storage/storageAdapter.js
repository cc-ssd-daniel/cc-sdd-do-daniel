export const STORAGE_KEYS = Object.freeze({
  settings: 'projetor-simulator:settings',
  progress: 'projetor-simulator:progress',
});
export const STORAGE_VERSION = 1;
export const DEFAULT_SETTINGS = Object.freeze({
  reducedFlash: false, reducedMotion: false, reducedTimePressure: false, soundCues: true,
});

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const validId = id => typeof id === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/.test(id) &&
  !['__proto__', 'constructor', 'prototype'].includes(id);
const validScore = score => Number.isFinite(score) && score >= 0;
const validCount = count => Number.isSafeInteger(count) && count >= 0;

function normalizeSettings(data) {
  const settings = { ...DEFAULT_SETTINGS };
  if (isObject(data)) for (const key of Object.keys(settings)) {
    if (Object.hasOwn(data, key) && typeof data[key] === 'boolean') settings[key] = data[key];
  }
  return settings;
}

function normalizeProgress(data) {
  const games = {};
  if (isObject(data) && isObject(data.games)) for (const [id, game] of Object.entries(data.games)) {
    if (validId(id) && isObject(game) && validScore(game.bestScore) && validCount(game.plays) &&
        validCount(game.completions) && game.completions <= game.plays) {
      games[id] = { bestScore: game.bestScore, plays: game.plays, completions: game.completions };
    }
  }
  return { games };
}

function browserStorage() {
  try { return typeof window === 'undefined' ? null : window.localStorage; } catch { return null; }
}

/** Storage-like object is injectable; passing null explicitly selects memory-only mode. */
export function createStorageAdapter(options = {}) {
  let storage = Object.hasOwn(options, 'storage') ? options.storage : browserStorage();
  const memory = { settings: normalizeSettings(), progress: normalizeProgress() };
  const normalizers = { settings: normalizeSettings, progress: normalizeProgress };

  const read = kind => {
    if (storage) {
      let raw;
      try { raw = storage.getItem(STORAGE_KEYS[kind]); } catch { storage = null; }
      if (storage) {
        let data;
        try {
          const envelope = JSON.parse(raw);
          if (isObject(envelope) && envelope.version === STORAGE_VERSION) data = envelope.data;
        } catch { /* Invalid data reads as defaults without destructive repair. */ }
        memory[kind] = normalizers[kind](data);
      }
    }
    return clone(memory[kind]);
  };
  const write = (kind, data) => {
    memory[kind] = clone(data);
    let persisted = false;
    if (storage) {
      try {
        storage.setItem(STORAGE_KEYS[kind], JSON.stringify({ version: STORAGE_VERSION, data }));
        persisted = true;
      } catch { storage = null; }
    }
    return { data: clone(data), persisted, reason: persisted ? null : 'storage-unavailable' };
  };
  return {
    getSettings: () => read('settings'),
    getProgress: () => read('progress'),
    saveSettings(patch) {
      if (!isObject(patch) || Object.keys(patch).some(key => !Object.hasOwn(DEFAULT_SETTINGS, key) || typeof patch[key] !== 'boolean')) {
        throw new TypeError('Configurações devem conter apenas flags booleanas conhecidas');
      }
      return write('settings', { ...read('settings'), ...patch });
    },
    recordResult(gameId, result) {
      if (!validId(gameId) || !isObject(result) || !validScore(result.score) || typeof result.completed !== 'boolean') {
        throw new TypeError('Resultado inválido');
      }
      const progress = read('progress');
      const previous = Object.hasOwn(progress.games, gameId)
        ? progress.games[gameId]
        : { bestScore: 0, plays: 0, completions: 0 };
      progress.games[gameId] = {
        bestScore: Math.max(previous.bestScore, result.score),
        plays: Math.min(Number.MAX_SAFE_INTEGER, previous.plays + 1),
        completions: Math.min(Number.MAX_SAFE_INTEGER, previous.completions + (result.completed ? 1 : 0)),
      };
      return write('progress', progress);
    },
  };
}
