// focoConfig.js — Defaults e validação de configuração do Foco Milimétrico.
// Requirements: 6.1, 6.2, 6.3

/**
 * @typedef {Object} FocoConfig
 * @property {number} min           Posição mínima do indicador.
 * @property {number} max           Posição máxima do indicador.
 * @property {number} focusStart    Início da faixa de foco (min..max).
 * @property {number} focusEnd      Fim da faixa de foco (min..max).
 * @property {number} focusTargetMs Tempo-alvo de permanência na faixa (ms).
 * @property {number} overshootLimit Limite de overshoot além da faixa antes de penalizar.
 * @property {number} penaltyPerOvershoot Penalidade aplicada por overshoot.
 * @property {number} failPenalty   Penalidade acumulada que causa falha.
 * @property {number} roundMs       Tempo máximo da rodada (ms).
 * @property {number} overshootPatienceDelta Delta de paciência emitido no overshoot (negativo).
 * @property {number} driftMax       Deriva automática máxima por tick.
 * @property {number} driftChangeMs  Intervalo para trocar a direção da deriva (ms).
 * @property {number} startOffset    Deslocamento inicial a partir do centro da faixa.
 */

/** @type {FocoConfig} Defaults documentados (Requirement 6.2). */
export const DEFAULT_CONFIG = Object.freeze({
  min: 0,
  max: 100,
  focusStart: 47,
  focusEnd: 53,
  focusTargetMs: 2500,
  overshootLimit: 94,
  penaltyPerOvershoot: 1,
  failPenalty: 4,
  roundMs: 13000,
  overshootPatienceDelta: -5,
  // Perturbação: o indicador deriva sozinho e o jogador precisa corrigir.
  driftMax: 0.55,       // deriva máxima por tick (em unidades de posição)
  driftChangeMs: 900,   // com que frequência a direção da deriva muda (ms)
  startOffset: 16,      // deslocamento inicial em relação ao centro da faixa
});

const NUMERIC_KEYS = Object.keys(DEFAULT_CONFIG);

/**
 * Valida a config, aplicando defaults para os parâmetros ausentes e recusando
 * parâmetros inválidos. (Requirements 6.1, 6.2, 6.3)
 * @param {Partial<FocoConfig>} [input]
 * @returns {FocoConfig}
 * @throws {Error} quando um parâmetro é inválido, nomeando o parâmetro.
 */
export function validateConfig(input = {}) {
  if (input === null || typeof input !== 'object') {
    throw new Error('focoConfig: config deve ser um objeto');
  }

  /** @type {FocoConfig} */
  const merged = { ...DEFAULT_CONFIG };

  for (const key of NUMERIC_KEYS) {
    if (input[key] === undefined) continue; // aplica default (6.2)
    const value = input[key];
    if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
      throw new Error(`focoConfig: parâmetro inválido "${key}" (esperado número finito)`);
    }
    merged[key] = value;
  }

  // Regras de coerência entre parâmetros (6.3).
  if (merged.min >= merged.max) {
    throw new Error('focoConfig: parâmetro inválido "min" (deve ser menor que "max")');
  }
  if (merged.focusStart < merged.min || merged.focusEnd > merged.max) {
    throw new Error('focoConfig: parâmetro inválido "focusStart/focusEnd" (fora de min..max)');
  }
  if (merged.focusStart >= merged.focusEnd) {
    throw new Error('focoConfig: parâmetro inválido "focusStart" (deve ser menor que "focusEnd")');
  }
  if (merged.focusTargetMs <= 0) {
    throw new Error('focoConfig: parâmetro inválido "focusTargetMs" (deve ser positivo)');
  }
  if (merged.roundMs <= 0) {
    throw new Error('focoConfig: parâmetro inválido "roundMs" (deve ser positivo)');
  }
  if (merged.failPenalty <= 0) {
    throw new Error('focoConfig: parâmetro inválido "failPenalty" (deve ser positivo)');
  }

  return merged;
}
