// Testes de configuração. FOC-06 (Req 6)
import { validateConfig, DEFAULT_CONFIG } from './focoConfig';

describe('focoConfig.validateConfig (Req 6)', () => {
  test('aplica defaults quando parâmetro ausente (6.2)', () => {
    const cfg = validateConfig({});
    expect(cfg).toEqual(DEFAULT_CONFIG);
  });

  test('sobrescreve apenas o parâmetro informado (6.1)', () => {
    const cfg = validateConfig({ roundMs: 5000 });
    expect(cfg.roundMs).toBe(5000);
    expect(cfg.focusTargetMs).toBe(DEFAULT_CONFIG.focusTargetMs);
  });

  test('recusa parâmetro não numérico nomeando-o (6.3)', () => {
    expect(() => validateConfig({ roundMs: 'x' })).toThrow(/roundMs/);
  });

  test('recusa min >= max (6.3)', () => {
    expect(() => validateConfig({ min: 100, max: 10 })).toThrow(/min/);
  });

  test('recusa faixa de foco fora de min..max (6.3)', () => {
    expect(() => validateConfig({ focusEnd: 999 })).toThrow(/focusStart\/focusEnd/);
  });
});
