// FocoMilimetrico.js — Componente de apresentação e entrada do minigame.
// Requirements: 2.2, 5.1-5.4, 7.1-7.4

import React, { useEffect, useMemo, useRef } from 'react';
import { useFocoEngine } from './useFocoEngine';
import { DEFAULT_CONFIG } from './focoConfig';
import './FocoMilimetrico.css';

const STEP = 4; // deslocamento por toque de tecla

/**
 * @param {object} props
 * @param {object} [props.config]
 * @param {*} props.services
 * @param {(result: import('./focoContract').FocoResult) => void} props.onComplete
 * @param {(reason: string) => void} props.onFail
 */
export default function FocoMilimetrico({ config = DEFAULT_CONFIG, services, onComplete, onFail }) {
  const { state, move, restart } = useFocoEngine({ config, services, onComplete, onFail });
  const areaRef = useRef(null);

  // Foco de teclado na área ao montar (acessibilidade / role=slider). (7.3)
  useEffect(() => {
    if (areaRef.current) areaRef.current.focus();
  }, []);

  // Mantém referências atuais para o listener global não usar valores obsoletos.
  const moveRef = useRef(move);
  const restartRef = useRef(restart);
  const statusRef = useRef(state ? state.status : 'running');
  moveRef.current = move;
  restartRef.current = restart;
  statusRef.current = state ? state.status : 'running';

  // Captura as setas na janela: funciona independente de onde está o foco. (7.3)
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        moveRef.current(STEP);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        moveRef.current(-STEP);
      } else if ((e.key === 'Enter' || e.key === ' ') && statusRef.current !== 'running') {
        e.preventDefault();
        restartRef.current();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function handleKeyDown() {
    // A captura real acontece no listener de window (acima); mantido para o role=slider.
  }

  const pct = useMemo(() => {
    if (!state) return 0;
    const range = config.max - config.min || 1;
    return ((state.position - config.min) / range) * 100;
  }, [state, config]);

  const focusStartPct = ((config.focusStart - config.min) / (config.max - config.min || 1)) * 100;
  const focusWidthPct = ((config.focusEnd - config.focusStart) / (config.max - config.min || 1)) * 100;

  const status = state ? state.status : 'running';
  const inFocus = state ? state.inFocus : false;

  const statusText =
    status === 'success'
      ? 'Sucesso! Foco atingido.'
      : status === 'fail'
      ? 'Falha. Tente novamente.'
      : inFocus
      ? 'No foco — segure!'
      : 'Fora do foco';

  return (
    <div className="foco" data-status={status} data-in-focus={inFocus ? 'true' : 'false'}>
      <h2 className="foco__title">Foco Milimétrico</h2>

      {/* Indicação textual do estado — mais de um canal além da cor (7.1, 7.4) */}
      <p className="foco__status" role="status" aria-live="polite">
        {statusText}
      </p>

      <div
        ref={areaRef}
        className="foco__track"
        role="slider"
        tabIndex={0}
        aria-label="Indicador de foco"
        aria-valuemin={config.min}
        aria-valuemax={config.max}
        aria-valuenow={state ? Math.round(state.position) : config.min}
        aria-valuetext={statusText}
        onKeyDown={handleKeyDown}
      >
        <div
          className="foco__zone"
          style={{ left: `${focusStartPct}%`, width: `${focusWidthPct}%` }}
          aria-hidden="true"
        />
        <div
          className={`foco__indicator ${inFocus ? 'foco__indicator--focus' : ''}`}
          style={{ left: `${pct}%` }}
          aria-hidden="true"
        />
      </div>

      {state && (
        <div className="foco__meters">
          <span>Tempo: {(state.timeRemaining / 1000).toFixed(1)}s</span>
          <span>Em foco: {(state.timeInFocus / 1000).toFixed(1)}s</span>
        </div>
      )}

      <p className="foco__hint">Use as setas para ajustar o foco. Enter reinicia ao terminar.</p>

      {status !== 'running' && (
        <button type="button" className="foco__restart" onClick={restart}>
          Reiniciar
        </button>
      )}
    </div>
  );
}
