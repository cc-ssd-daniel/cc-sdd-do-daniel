// focoContract.js — Adapter do Foco Milimétrico para o contrato comum dos minigames.
// Contrato: start(config, services) / complete(result) / fail(reason) / reset() / dispose()
// Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.3

import { createFocoEngine } from './focoEngine';

const TICK_MS = 50;

/**
 * @typedef {Object} FocoResult
 * @property {number} score
 * @property {number} timeUsedMs
 * @property {number} patienceDelta
 */

/**
 * Cria o adapter de contrato do Foco.
 * @param {{
 *   onComplete: (result: FocoResult) => void,
 *   onFail: (reason: string) => void,
 *   onState?: (state: import('./focoEngine').FocoState) => void,
 *   scheduler?: { setInterval: Function, clearInterval: Function },
 *   tickMs?: number
 * }} deps
 */
export function createFocoContract(deps) {
  const {
    onComplete,
    onFail,
    onState,
    // setInterval/clearInterval precisam manter o `this` do host (window no browser),
    // senão o navegador lança "Illegal invocation". Por isso usamos wrappers.
    scheduler = {
      setInterval: (fn, ms) => setInterval(fn, ms),
      clearInterval: (id) => clearInterval(id),
    },
    tickMs = TICK_MS,
  } = deps;

  /** @type {ReturnType<typeof createFocoEngine> | null} */
  let engine = null;
  /** @type {*} */
  let timer = null;
  /** @type {*} */
  let services = null;
  let totalPatienceDelta = 0;
  let disposed = false; // após dispose, nenhum callback pode disparar (evita update em componente desmontado)

  function stopTimer() {
    if (timer !== null) {
      scheduler.clearInterval(timer);
      timer = null;
    }
  }

  function emitState() {
    if (!disposed && onState && engine) onState(engine.getState());
  }

  /**
   * Aplica os efeitos externos de uma lista de eventos do engine. (4.3)
   * @param {import('./focoEngine').FocoEvent[]} events
   */
  function handleEvents(events) {
    for (const ev of events) {
      if (ev.type === 'overshoot' && typeof ev.patienceDelta === 'number') {
        totalPatienceDelta += ev.patienceDelta;
        if (services && services.patience) services.patience.applyDelta(ev.patienceDelta);
        if (services && services.audio) services.audio.vibrate(120);
      }
      if (ev.type === 'success') {
        finishSuccess();
      }
      if (ev.type === 'fail') {
        finishFail(ev.reason || 'fail');
      }
    }
  }

  function finishSuccess() {
    if (disposed || !engine) return;
    const s = engine.getState();
    stopTimer();
    if (services && services.audio) services.audio.play('foco-success');
    /** @type {FocoResult} */
    const result = {
      score: Math.max(0, Math.round(s.timeRemaining)),
      timeUsedMs: engine.config.roundMs - s.timeRemaining,
      patienceDelta: totalPatienceDelta,
    };
    if (onComplete) onComplete(result); // (1.2)
  }

  function finishFail(reason) {
    if (disposed) return;
    stopTimer();
    if (services && services.audio) services.audio.play('foco-fail');
    if (onFail) onFail(reason); // (1.3)
  }

  /**
   * Inicia o minigame. (Requirement 1.1)
   * @param {object} config
   * @param {*} svc  serviços patience/audio/storage (fake ou real)
   */
  function start(config, svc) {
    dispose(); // garante estado limpo
    disposed = false;
    services = svc;
    totalPatienceDelta = 0;
    engine = createFocoEngine(config); // valida config; lança se inválida (6.3)

    emitState();

    timer = scheduler.setInterval(() => {
      if (disposed || !engine) return;
      const events = engine.tick(tickMs);
      emitState();
      handleEvents(events);
    }, tickMs);
  }

  /**
   * Encaminha movimento do jogador ao engine e trata eventos resultantes.
   * @param {number} delta
   */
  function move(delta) {
    if (disposed || !engine) return;
    const events = engine.move(delta);
    emitState();
    handleEvents(events);
  }

  /** Limpa apenas o estado interno. (Requirement 1.4) */
  function reset() {
    if (engine) engine.reset();
    totalPatienceDelta = 0;
    emitState();
  }

  /** Remove timers e libera referências. (Requirement 1.5) */
  function dispose() {
    disposed = true;
    stopTimer();
    engine = null;
    services = null;
  }

  return { start, move, reset, dispose };
}
