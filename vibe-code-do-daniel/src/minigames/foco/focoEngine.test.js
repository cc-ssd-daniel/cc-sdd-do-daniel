// Testes unitários do focoEngine (regra pura). FOC-06
import { createFocoEngine } from './focoEngine';

const baseConfig = {
  min: 0,
  max: 100,
  focusStart: 45,
  focusEnd: 55,
  focusTargetMs: 1000,
  overshootLimit: 90,
  penaltyPerOvershoot: 1,
  failPenalty: 3,
  roundMs: 10000,
  overshootPatienceDelta: -5,
  driftMax: 0, // sem deriva nos testes de regra (determinístico)
  driftChangeMs: 700,
  startOffset: 0, // começa no centro da faixa para os testes de lógica
};

// RNG fixo para os testes que dependem de deriva.
const noDrift = { random: () => 0.5 }; // 0.5 => drift 0 quando driftMax=0

describe('focoEngine — movimento e limites (Req 2)', () => {
  test('move respeita o máximo (2.4)', () => {
    const e = createFocoEngine(baseConfig, noDrift);
    e.move(1000);
    expect(e.getState().position).toBe(100);
  });

  test('move respeita o mínimo (2.4)', () => {
    const e = createFocoEngine(baseConfig, noDrift);
    e.move(-1000);
    expect(e.getState().position).toBe(0);
  });

  test('estado inicial com startOffset 0 começa no centro da faixa e running (2.1)', () => {
    const e = createFocoEngine(baseConfig, noDrift);
    const s = e.getState();
    expect(s.position).toBe(50);
    expect(s.status).toBe('running');
  });
});

describe('focoEngine — faixa de foco e sucesso (Req 3)', () => {
  test('acumula tempo em foco e emite success ao atingir o alvo (3.1, 3.2)', () => {
    const e = createFocoEngine(baseConfig, noDrift); // inicia em 50, dentro da faixa 45-55
    expect(e.getState().inFocus).toBe(true);
    let events = [];
    for (let i = 0; i < 25; i++) {
      events = e.tick(50);
      if (events.some((ev) => ev.type === 'success')) break;
    }
    expect(events.some((ev) => ev.type === 'success')).toBe(true);
    expect(e.getState().status).toBe('success');
  });

  test('sair da faixa interrompe a contagem (3.3)', () => {
    const e = createFocoEngine(baseConfig, noDrift);
    e.tick(500); // 500ms em foco
    expect(e.getState().timeInFocus).toBe(500);
    e.move(-20); // vai para 30, fora da faixa
    expect(e.getState().inFocus).toBe(false);
    expect(e.getState().timeInFocus).toBe(0);
  });
});

describe('focoEngine — overshoot e falha (Req 4)', () => {
  test('overshoot emite evento com patienceDelta negativo (4.1, 4.3)', () => {
    const e = createFocoEngine(baseConfig, noDrift);
    const events = e.move(45); // 50 -> 95, acima do overshootLimit 90
    const overshoot = events.find((ev) => ev.type === 'overshoot');
    expect(overshoot).toBeDefined();
    expect(overshoot.patienceDelta).toBe(-5);
  });

  test('penalidade acumulada no limite causa fail=overshoot (4.2)', () => {
    const e = createFocoEngine({ ...baseConfig, failPenalty: 1 }, noDrift);
    const events = e.move(45);
    expect(events.some((ev) => ev.type === 'fail' && ev.reason === 'overshoot')).toBe(true);
    expect(e.getState().status).toBe('fail');
  });

  test('tempo esgotado causa fail=timeout (4.4)', () => {
    const e = createFocoEngine({ ...baseConfig, roundMs: 100, focusTargetMs: 999999 }, noDrift);
    const events = e.tick(150);
    expect(events.some((ev) => ev.type === 'fail' && ev.reason === 'timeout')).toBe(true);
  });
});

describe('focoEngine — deriva automática (jogo desafiador)', () => {
  test('a deriva move o indicador sozinho ao longo do tempo', () => {
    // random fixo em 1 => drift = +driftMax a cada mudança
    const e = createFocoEngine(
      { ...baseConfig, driftMax: 2, startOffset: 0 },
      { random: () => 1 }
    );
    const start = e.getState().position;
    for (let i = 0; i < 5; i++) e.tick(50);
    expect(e.getState().position).toBeGreaterThan(start);
  });

  test('sem deriva (driftMax 0) o indicador não se move sozinho', () => {
    const e = createFocoEngine({ ...baseConfig, driftMax: 0, startOffset: 0 }, noDrift);
    const start = e.getState().position;
    e.tick(50);
    expect(e.getState().position).toBe(start);
  });
});

describe('focoEngine — reset (Req 1.4)', () => {
  test('reset restaura o estado inicial', () => {
    const e = createFocoEngine(baseConfig, noDrift);
    e.move(30);
    e.tick(300);
    e.reset();
    const s = e.getState();
    expect(s.position).toBe(50); // startOffset 0 => centro
    expect(s.timeInFocus).toBe(0);
    expect(s.penalty).toBe(0);
    expect(s.status).toBe('running');
  });
});
