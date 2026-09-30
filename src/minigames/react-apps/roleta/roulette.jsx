import { createContractAdapter } from './contractAdapter';

export const DEFAULT_CONFIG = Object.freeze({
  inputs: Object.freeze(['HDMI 1', 'HDMI 2', 'VGA', 'DisplayPort']),
  target: 'HDMI 2', intervalMs: 700, minIntervalMs: 180,
  accelerationMs: 130, patiencePenalty: -8, maxErrors: 5,
});
const ACCESSIBILITY = Object.freeze({
  reducedMotion: false, reducedFlash: false, reducedTimePressure: false, soundCues: true,
});
const copy = value => JSON.parse(JSON.stringify(value));

export function normalizeConfig(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError('Configuração inválida');
  const config = { ...DEFAULT_CONFIG, ...value };
  if (!Array.isArray(config.inputs) || !config.inputs.length ||
      config.inputs.some(input => typeof input !== 'string' || !input.trim()) ||
      new Set(config.inputs).size !== config.inputs.length || !config.inputs.includes(config.target)) {
    throw new TypeError('Entradas e alvo inválidos');
  }
  for (const key of ['intervalMs', 'minIntervalMs', 'accelerationMs', 'patiencePenalty']) {
    if (!Number.isFinite(config[key])) throw new TypeError(`Valor inválido: ${key}`);
  }
  if (config.intervalMs <= 0 || config.minIntervalMs <= 0 || config.minIntervalMs > config.intervalMs ||
      config.accelerationMs < 0 || config.patiencePenalty > 0 || !Number.isSafeInteger(config.maxErrors) || config.maxErrors < 1) {
    throw new TypeError('Dificuldade inválida');
  }
  if (value.accessibility !== undefined && (!value.accessibility || typeof value.accessibility !== 'object' || Array.isArray(value.accessibility))) {
    throw new TypeError('Acessibilidade inválida');
  }
  const accessibility = { ...ACCESSIBILITY, ...value.accessibility };
  if (Object.keys(ACCESSIBILITY).some(key => typeof accessibility[key] !== 'boolean')) throw new TypeError('Flag de acessibilidade inválida');
  const factor = accessibility.reducedTimePressure ? 2 : 1;
  if (config.intervalMs * factor > 2147483647) throw new TypeError('Intervalo fora do limite do timer');
  return { ...config, inputs: [...config.inputs], accessibility,
    intervalMs: config.intervalMs * factor, minIntervalMs: config.minIntervalMs * factor,
    accelerationMs: config.accelerationMs * factor };
}

export function createRoulette({ now = Date.now, setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
  let config = normalizeConfig();
  let adapter = createContractAdapter({}, now);
  let timer = null;
  let startedAt = null;
  let state;
  const listeners = new Set();
  const snapshot = () => copy({ ...state, selected: config.inputs[state.index], target: config.target,
    inputs: config.inputs, accessibility: config.accessibility });
  const notify = () => listeners.forEach(listener => listener(snapshot()));
  const cancel = () => { if (timer !== null) clearTimer(timer); timer = null; };
  const clearState = () => {
    startedAt = null;
    state = { status: 'idle', index: 0, errors: 0, patienceDelta: 0,
      intervalMs: config.intervalMs, feedback: 'Selecione a entrada indicada pela pista.', result: null };
  };
  const schedule = () => {
    cancel();
    if (state.status !== 'running') return;
    timer = setTimer(() => {
      timer = null;
      if (state.status !== 'running') return;
      state.index = (state.index + 1) % config.inputs.length;
      notify(); schedule();
    }, state.intervalMs);
  };
  const resultData = () => ({
    score: Math.max(0, 100 - state.errors * 10),
    durationMs: Math.max(0, now() - startedAt),
    selected: config.inputs[state.index], errors: state.errors, patienceDelta: state.patienceDelta,
    evidence: { target: config.target, intervalMs: state.intervalMs, reducedTimePressure: config.accessibility.reducedTimePressure },
  });
  const finish = (status, action, result, feedback) => {
    if (state.status !== 'running') return snapshot();
    cancel(); state.status = status; state.result = result; state.feedback = feedback;
    notify(); adapter.emit(action, copy(result));
    if (config.accessibility.soundCues) adapter.cue(action);
    return snapshot();
  };
  clearState();
  const api = {
    start(value = {}, services = {}) {
      const nextConfig = normalizeConfig(value);
      cancel(); config = nextConfig; adapter = createContractAdapter(services, now); clearState();
      state.status = 'running'; startedAt = now();
      schedule(); notify(); adapter.emit('start', { target: config.target });
      return snapshot();
    },
    select() {
      if (state.status !== 'running') return snapshot();
      if (config.inputs[state.index] === config.target) return api.complete();
      state.errors += 1; state.patienceDelta += config.patiencePenalty;
      state.intervalMs = Math.max(config.minIntervalMs, state.intervalMs - config.accelerationMs);
      state.feedback = `Entrada incorreta: ${config.inputs[state.index]}. Procure ${config.target}. Paciência ${config.patiencePenalty}.`;
      adapter.emit('patience', { delta: config.patiencePenalty, reason: 'wrong-input' });
      if (state.errors >= config.maxErrors) return api.fail('wrong-input-limit');
      schedule(); notify();
      if (config.accessibility.soundCues) adapter.cue('error');
      return snapshot();
    },
    complete(result = {}) {
      return finish('success', 'complete', { ...copy(result), ...resultData() }, 'Entrada correta selecionada.');
    },
    fail(reason = 'cancelled') {
      if (typeof reason !== 'string' || !reason.trim()) throw new TypeError('Motivo inválido');
      return finish('failed', 'fail', { ...resultData(), score: 0, reason, canRestart: true },
        reason === 'wrong-input-limit' ? 'Limite de erros atingido. Reinicie para tentar novamente.' : 'Partida encerrada. Reinicie para tentar novamente.');
    },
    reset() { cancel(); clearState(); notify(); adapter.emit('reset'); return snapshot(); },
    dispose() { cancel(); clearState(); listeners.clear(); adapter = createContractAdapter({}, now); },
    snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  };
  return api;
}
