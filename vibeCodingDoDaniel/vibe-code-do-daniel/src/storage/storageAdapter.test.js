/** @jest-environment node */
import { createStorageAdapter, STORAGE_KEYS } from './storageAdapter';

function memoryStorage() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}

test('1.1, 1.2: primeira execução, configurações e reload sem telas', () => {
  const storage = memoryStorage(); const adapter = createStorageAdapter({ storage });
  expect(adapter.getSettings()).toEqual({ reducedFlash: false, reducedMotion: false, reducedTimePressure: false, soundCues: true });
  expect(adapter.getProgress()).toEqual({ games: {} });
  expect(storage.getItem(STORAGE_KEYS.settings)).toBeNull();
  expect(adapter.saveSettings({ reducedMotion: true })).toMatchObject({ persisted: true, reason: null });
  expect(createStorageAdapter({ storage }).getSettings().reducedMotion).toBe(true);
});

test.each(['{bad', 'null', '[]', '{"version":99,"data":{"soundCues":false}}', '{"version":1,"data":null}'])('1.3: corrupção/versão inválida preservada: %s', raw => {
  const storage = memoryStorage(); storage.setItem(STORAGE_KEYS.settings, raw);
  const adapter = createStorageAdapter({ storage });
  expect(adapter.getSettings().soundCues).toBe(true);
  expect(storage.getItem(STORAGE_KEYS.settings)).toBe(raw);
});

test('1.3: valida campos individualmente e ignora jogos inválidos', () => {
  const storage = memoryStorage();
  storage.setItem(STORAGE_KEYS.settings, JSON.stringify({ version: 1, data: { reducedMotion: true, soundCues: 'false', extra: true } }));
  storage.setItem(STORAGE_KEYS.progress, JSON.stringify({ version: 1, data: { games: { good: { bestScore: 4, plays: 2, completions: 1 }, bad: { bestScore: -1, plays: 1, completions: 9 } } } }));
  const adapter = createStorageAdapter({ storage });
  expect(adapter.getSettings()).toEqual({ reducedFlash: false, reducedMotion: true, reducedTimePressure: false, soundCues: true });
  expect(Object.keys(adapter.getProgress().games)).toEqual(['good']);
});

test('2.1: melhor pontuação monotônica, contagens e chaves isoladas', () => {
  const storage = memoryStorage(); const adapter = createStorageAdapter({ storage });
  storage.setItem('outro-app', 'intocado');
  adapter.saveSettings({ reducedFlash: true });
  adapter.recordResult('roleta-input', { score: 90, completed: true });
  adapter.recordResult('roleta-input', { score: 20, completed: false });
  const other = createStorageAdapter({ storage });
  other.recordResult('roleta-input', { score: 95, completed: true });
  expect(adapter.getProgress().games['roleta-input']).toEqual({ bestScore: 95, plays: 3, completions: 2 });
  expect(adapter.getSettings().reducedFlash).toBe(true);
  expect(storage.getItem('outro-app')).toBe('intocado');
});

test('2.2: dados inválidos não são gravados', () => {
  const storage = memoryStorage(); const adapter = createStorageAdapter({ storage });
  for (const patch of [null, [], { soundCues: 1 }, { extra: true }]) expect(() => adapter.saveSettings(patch)).toThrow(TypeError);
  for (const id of ['__proto__', 'constructor', 'prototype', '', 'a.b']) expect(() => adapter.recordResult(id, { score: 1, completed: true })).toThrow(TypeError);
  for (const score of [-1, NaN, Infinity, '1']) expect(() => adapter.recordResult('roleta', { score, completed: true })).toThrow(TypeError);
  expect(() => adapter.recordResult('roleta', { score: 1, completed: 'yes' })).toThrow(TypeError);
  expect(storage.getItem(STORAGE_KEYS.progress)).toBeNull();
});

test.each(['toString', 'valueOf', 'hasOwnProperty'])('2.1: ID válido herdado não corrompe recorde: %s', gameId => {
  const storage = memoryStorage(); const adapter = createStorageAdapter({ storage });
  adapter.recordResult(gameId, { score: 10, completed: true });
  expect(createStorageAdapter({ storage }).getProgress().games[gameId]).toEqual({ bestScore: 10, plays: 1, completions: 1 });
});

test('3.1: cota excedida mantém última sessão mesmo se disco contém dados antigos', () => {
  const storage = memoryStorage(); const adapter = createStorageAdapter({ storage });
  adapter.saveSettings({ reducedMotion: true });
  storage.setItem = () => { throw new Error('quota'); };
  expect(adapter.saveSettings({ soundCues: false })).toMatchObject({ persisted: false, reason: 'storage-unavailable' });
  expect(adapter.getSettings()).toMatchObject({ reducedMotion: true, soundCues: false });
  expect(adapter.recordResult('roleta', { score: 10, completed: true }).persisted).toBe(false);
  expect(adapter.getProgress().games.roleta.bestScore).toBe(10);
});

test('3.1–3.3: falha de leitura, ausência do navegador e cópias independentes', () => {
  const blocked = createStorageAdapter({ storage: { getItem: () => { throw new Error('denied'); } } });
  expect(blocked.getProgress()).toEqual({ games: {} });
  expect(blocked.saveSettings({ reducedMotion: true }).persisted).toBe(false);
  const adapter = createStorageAdapter();
  const saved = adapter.recordResult('roleta', { score: 10, completed: true });
  saved.data.games.roleta.bestScore = 999;
  expect(adapter.getProgress().games.roleta.bestScore).toBe(10);
  expect(saved.persisted).toBe(false);
});
