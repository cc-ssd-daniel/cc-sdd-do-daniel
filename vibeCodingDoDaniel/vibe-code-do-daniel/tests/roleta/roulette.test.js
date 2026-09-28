import { createRoulette } from '../../src/minigames/roleta/roulette';
import { createFakePatience } from '../../src/minigames/roleta/fixtures';

beforeEach(() => { jest.useFakeTimers(); jest.setSystemTime(1000); });
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

test('1.1–1.3: pista, zona inteira, ciclo circular e sucesso único pelo contrato', () => {
  const onEvent = jest.fn(); const complete = jest.fn();
  const game = createRoulette();
  game.start({}, { onEvent, complete });
  expect(game.snapshot()).toMatchObject({ selected: 'HDMI 1', target: 'HDMI 2', status: 'running' });
  jest.advanceTimersByTime(4 * 700);
  expect(game.snapshot().selected).toBe('HDMI 1');
  jest.advanceTimersByTime(1399);
  game.select(); game.select(); game.complete({}); game.fail('late');
  expect(complete).toHaveBeenCalledTimes(1);
  expect(complete.mock.calls[0][0]).toMatchObject({ score: 100, durationMs: 4199, errors: 0, patienceDelta: 0, selected: 'HDMI 2' });
  expect(onEvent.mock.calls.map(([e]) => e.type)).toEqual(['minigame:started', 'minigame:succeeded']);
  expect(onEvent.mock.calls[1][0]).toMatchObject({ gameId: 'roleta-input', at: 5199 });
  expect(jest.getTimerCount()).toBe(0);
});

test('2.1–2.2: erros aceleram até o mínimo e emitem deltas antes da falha', () => {
  const patience = createFakePatience(); const fail = jest.fn(); const events = [];
  const game = createRoulette();
  game.start({}, { fail, onEvent: e => { events.push(e); patience.onEvent(e); } });
  for (let error = 1; error <= 5; error += 1) {
    game.select();
    expect(game.snapshot().intervalMs).toBe(Math.max(180, 700 - 130 * error));
  }
  expect(patience.snapshot()).toBe(60);
  expect(fail).toHaveBeenCalledTimes(1);
  expect(fail).toHaveBeenCalledWith('wrong-input-limit');
  expect(events[events.length - 1]).toMatchObject({ type: 'minigame:failed', payload: { reason: 'wrong-input-limit', canRestart: true, errors: 5, patienceDelta: -40 } });
  expect(game.snapshot().feedback).toMatch(/Limite de erros/);
  expect(jest.getTimerCount()).toBe(0);
});

test('2.1: próximo intervalo reinicia com velocidade menor; resultado audita erros', () => {
  const game = createRoulette(); game.start();
  jest.advanceTimersByTime(200); game.select();
  jest.advanceTimersByTime(569); expect(game.snapshot().selected).toBe('HDMI 1');
  jest.advanceTimersByTime(1); game.select();
  expect(game.snapshot().result).toMatchObject({ score: 90, errors: 1, patienceDelta: -8, durationMs: 770 });
});

test.each([
  { inputs: [] }, { inputs: ['A', 'A'], target: 'A' }, { inputs: [' '] },
  { target: 'ausente' }, { intervalMs: 0 }, { minIntervalMs: 701 },
  { accelerationMs: -1 }, { patiencePenalty: 1 }, { maxErrors: 1.5 },
  { intervalMs: Infinity }, { accessibility: { reducedMotion: 'yes' } },
])('2.3: rejeita configuração inválida %j antes de efeitos', config => {
  const game = createRoulette(); const onEvent = jest.fn();
  expect(() => game.start(config, { onEvent })).toThrow(TypeError);
  expect(onEvent).not.toHaveBeenCalled(); expect(jest.getTimerCount()).toBe(0);
});

test('3.1–3.3: reset limpa somente estado interno e dispose remove efeitos e assinaturas', () => {
  const game = createRoulette(); const patience = createFakePatience(); const listener = jest.fn(); const events = [];
  game.subscribe(listener);
  const services = { onEvent: e => { patience.onEvent(e); events.push(e.type); } };
  game.start({}, services); game.select(); game.reset();
  expect(game.snapshot()).toMatchObject({ status: 'idle', errors: 0, intervalMs: 700, result: null });
  expect(patience.snapshot()).toBe(92);
  game.start({}, services); expect(jest.getTimerCount()).toBe(1);
  game.start({}, services); expect(jest.getTimerCount()).toBe(1);
  game.dispose(); listener.mockClear();
  jest.advanceTimersByTime(99999); game.select();
  expect(listener).not.toHaveBeenCalled(); expect(jest.getTimerCount()).toBe(0);
  expect(events).toContain('minigame:restarted');
});

test('4.2–4.3: pressão reduzida e áudio opcional', () => {
  const cue = jest.fn(); const game = createRoulette();
  game.start({ accessibility: { reducedTimePressure: true, soundCues: false } }, { audio: { cue } });
  expect(game.snapshot().intervalMs).toBe(1400); game.select();
  expect(game.snapshot().intervalMs).toBe(1140); expect(cue).not.toHaveBeenCalled();
  game.start({}, { audio: { cue: () => { throw new Error('audio offline'); } } });
  expect(() => game.select()).not.toThrow();
  expect(game.snapshot().errors).toBe(1);
});

test('estado público e configuração não expõem referências internas', () => {
  const config = { inputs: ['A', 'B'], target: 'B' };
  const game = createRoulette(); game.start(config); config.inputs[0] = 'B';
  const state = game.snapshot(); state.inputs[0] = 'B';
  expect(game.snapshot().selected).toBe('A');
});
