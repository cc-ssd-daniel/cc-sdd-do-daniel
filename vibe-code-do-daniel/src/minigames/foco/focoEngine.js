// focoEngine.js — Regra pura do Foco Milimétrico (sem React, sem DOM).
// Requirements: 2.1-2.4, 3.1-3.4, 4.1-4.4, 1.4

import { validateConfig } from './focoConfig';

/**
 * @typedef {'idle'|'running'|'success'|'fail'} FocoStatus
 * @typedef {Object} FocoState
 * @property {number} position
 * @property {number} timeInFocus
 * @property {number} penalty
 * @property {number} timeRemaining
 * @property {FocoStatus} status
 * @property {boolean} inFocus
 * @typedef {Object} FocoEvent
 * @property {'focus'|'unfocus'|'overshoot'|'success'|'fail'} type
 * @property {string} [reason]
 * @property {number} [patienceDelta]
 */

/**
 * Cria o motor de regra do Foco Milimétrico.
 * @param {import('./focoConfig').FocoConfig | Partial<import('./focoConfig').FocoConfig>} [config]
 * @param {{ random?: () => number }} [opts]  RNG injetável (para testes determinísticos).
 */
export function createFocoEngine(config, opts = {}) {
  const cfg = validateConfig(config);
  const random = opts.random || Math.random;

  const focusCenter = (cfg.focusStart + cfg.focusEnd) / 2;

  /** @returns {FocoState} */
  function initialState() {
    // Começa deslocado da faixa, exigindo correção imediata. (mais desafiador)
    const startPos = clamp(focusCenter + cfg.startOffset);
    return {
      position: startPos,
      timeInFocus: 0,
      penalty: 0,
      timeRemaining: cfg.roundMs,
      status: 'running',
      inFocus: isInFocus(startPos),
    };
  }

  /** @type {FocoState} */
  let state = initialState();

  // Deriva automática: direção/intensidade que muda periodicamente.
  let driftVelocity = 0; // unidades por tick
  let driftTimer = 0;    // acumulador para trocar a deriva

  function pickDrift() {
    // valor entre -driftMax e +driftMax
    driftVelocity = (random() * 2 - 1) * cfg.driftMax;
  }
  pickDrift();

  function clamp(v) {
    return Math.min(cfg.max, Math.max(cfg.min, v));
  }

  function isInFocus(pos) {
    return pos >= cfg.focusStart && pos <= cfg.focusEnd;
  }

  /**
   * Move o indicador respeitando os limites. (Requirements 2.2, 2.4)
   * Overshoot: ultrapassar o overshootLimit aplica penalidade. (Requirement 4.1, 4.3)
   * @param {number} delta
   * @returns {FocoEvent[]}
   */
  function move(delta) {
    if (state.status !== 'running') return [];
    if (typeof delta !== 'number' || !Number.isFinite(delta)) return [];

    const events = [];
    const wasInFocus = state.inFocus;
    const raw = state.position + delta;
    state.position = clamp(raw); // (2.4) limita a min/max

    // Overshoot: posição além do limite configurado. (4.1)
    if (state.position >= cfg.overshootLimit) {
      state.penalty += cfg.penaltyPerOvershoot;
      events.push({ type: 'overshoot', patienceDelta: cfg.overshootPatienceDelta }); // (4.3)
      if (state.penalty >= cfg.failPenalty) {
        state.status = 'fail';
        events.push({ type: 'fail', reason: 'overshoot' }); // (4.2)
        state.inFocus = false;
        return events;
      }
    }

    // Transição de foco. (3.4)
    state.inFocus = isInFocus(state.position);
    if (state.inFocus && !wasInFocus) {
      events.push({ type: 'focus' });
    } else if (!state.inFocus && wasInFocus) {
      state.timeInFocus = 0; // sair da faixa interrompe a contagem (3.3)
      events.push({ type: 'unfocus' });
    }
    return events;
  }

  /**
   * Avança o tempo em dtMs. Acumula tempo em foco e detecta sucesso/timeout.
   * (Requirements 3.1, 3.2, 4.4)
   * @param {number} dtMs
   * @returns {FocoEvent[]}
   */
  function tick(dtMs) {
    if (state.status !== 'running') return [];
    if (typeof dtMs !== 'number' || !Number.isFinite(dtMs) || dtMs <= 0) return [];

    const events = [];
    state.timeRemaining = Math.max(0, state.timeRemaining - dtMs);

    // Aplica a deriva automática: o indicador se move sozinho e o jogador corrige.
    driftTimer += dtMs;
    if (driftTimer >= cfg.driftChangeMs) {
      driftTimer = 0;
      pickDrift();
    }
    if (driftVelocity !== 0) {
      const wasInFocus = state.inFocus;
      state.position = clamp(state.position + driftVelocity);
      state.inFocus = isInFocus(state.position);
      if (!state.inFocus && wasInFocus) {
        state.timeInFocus = 0; // a deriva pode tirar do foco (3.3)
        events.push({ type: 'unfocus' });
      } else if (state.inFocus && !wasInFocus) {
        events.push({ type: 'focus' });
      }
    }

    if (state.inFocus) {
      state.timeInFocus += dtMs; // (3.1)
      if (state.timeInFocus >= cfg.focusTargetMs) {
        state.status = 'success';
        events.push({ type: 'success' }); // (3.2)
        return events;
      }
    }

    if (state.timeRemaining <= 0) {
      state.status = 'fail';
      events.push({ type: 'fail', reason: 'timeout' }); // (4.4)
    }
    return events;
  }

  /** Limpa apenas o estado interno. (Requirement 1.4) */
  function reset() {
    state = initialState();
    driftTimer = 0;
    pickDrift();
  }

  /** @returns {FocoState} cópia imutável do estado atual. */
  function getState() {
    return { ...state };
  }

  return { move, tick, reset, getState, config: cfg };
}
