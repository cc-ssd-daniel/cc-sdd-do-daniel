// Testes de integração do adapter de contrato com fakeServices. FOC-06 (Req 1, 4.3)
import { createFocoContract } from './focoContract';
import { createFakeServices } from '../fakes/fakeServices';

const cfg = {
  min: 0,
  max: 100,
  focusStart: 45,
  focusEnd: 55,
  focusTargetMs: 200,
  overshootLimit: 90,
  penaltyPerOvershoot: 1,
  failPenalty: 1,
  roundMs: 10000,
  overshootPatienceDelta: -5,
  driftMax: 0, // sem deriva para o teste ser determinístico
  driftChangeMs: 700,
  startOffset: 0, // começa no centro da faixa (sucesso previsível)
};

// Scheduler fake: guarda o callback do "intervalo" para dispararmos manualmente.
function makeScheduler() {
  let cb = null;
  return {
    scheduler: {
      setInterval: (fn) => {
        cb = fn;
        return 1;
      },
      clearInterval: () => {
        cb = null;
      },
    },
    tickOnce: () => cb && cb(),
    isRunning: () => cb !== null,
  };
}

test('start inicia e sucesso chama onComplete com result (1.1, 1.2)', () => {
  const services = createFakeServices();
  const onComplete = jest.fn();
  const onFail = jest.fn();
  const sched = makeScheduler();

  const c = createFocoContract({ onComplete, onFail, scheduler: sched.scheduler, tickMs: 50 });
  c.start(cfg, services); // inicia em 50 (dentro do foco)

  for (let i = 0; i < 10 && onComplete.mock.calls.length === 0; i++) sched.tickOnce();

  expect(onComplete).toHaveBeenCalledTimes(1);
  const result = onComplete.mock.calls[0][0];
  expect(result).toHaveProperty('score');
  expect(result).toHaveProperty('timeUsedMs');
  expect(result).toHaveProperty('patienceDelta');
  expect(services.audio.played).toContain('foco-success');
});

test('overshoot aplica delta de paciência e falha chama onFail (1.3, 4.3)', () => {
  const services = createFakeServices();
  const onComplete = jest.fn();
  const onFail = jest.fn();
  const sched = makeScheduler();

  const c = createFocoContract({ onComplete, onFail, scheduler: sched.scheduler });
  c.start(cfg, services);
  c.move(45); // 50 -> 95, overshoot; failPenalty=1 => fail imediato

  expect(services.patience.deltas).toContain(-5);
  expect(onFail).toHaveBeenCalledWith('overshoot');
});

test('dispose para o loop (1.5)', () => {
  const services = createFakeServices();
  const sched = makeScheduler();
  const c = createFocoContract({
    onComplete: jest.fn(),
    onFail: jest.fn(),
    scheduler: sched.scheduler,
  });
  c.start(cfg, services);
  expect(sched.isRunning()).toBe(true);
  c.dispose();
  expect(sched.isRunning()).toBe(false);
});

test('start com config inválida lança erro (6.3)', () => {
  const services = createFakeServices();
  const c = createFocoContract({ onComplete: jest.fn(), onFail: jest.fn() });
  expect(() => c.start({ min: 100, max: 0 }, services)).toThrow();
  c.dispose();
});
