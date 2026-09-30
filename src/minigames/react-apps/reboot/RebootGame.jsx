import { useEffect, useRef, useState } from 'react';
import './RebootGame.css';
import { evaluateRebootResult, rebootConfig } from './rebootConfig';

function RebootGame({ onComplete, config = rebootConfig }) {
  const [phase, setPhase] = useState('idle');
  const [attemptNumber, setAttemptNumber] = useState(0);
  const [holdDuration, setHoldDuration] = useState(0);
  const [result, setResult] = useState(null);
  const pressStartRef = useRef(null);
  const tickRef = useRef(null);

  useEffect(() => {
    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
      }
    };
  }, []);

  const stopHoldTicker = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const startAttempt = () => {
    stopHoldTicker();
    const nextAttemptNumber = attemptNumber + 1;

    setPhase('active');
    setResult(null);
    setHoldDuration(0);
    setAttemptNumber(nextAttemptNumber);
    pressStartRef.current = null;

    return nextAttemptNumber;
  };

  const finishAttempt = (durationMs, currentAttemptNumber = attemptNumber) => {
    const nextResult = evaluateRebootResult(durationMs, config);
    const nextPhase = nextResult.success ? 'success' : 'failure';

    setHoldDuration(durationMs);
    setResult(nextResult);
    setPhase(nextPhase);

    if (onComplete) {
      onComplete({
        ...nextResult,
        attemptNumber: currentAttemptNumber,
      });
    }
  };

  const handlePressStart = () => {
    if (phase !== 'active') {
      return;
    }

    if (pressStartRef.current !== null) {
      return;
    }

    pressStartRef.current = performance.now();
    tickRef.current = setInterval(() => {
      const elapsed = performance.now() - pressStartRef.current;
      setHoldDuration(elapsed);
    }, 16);
  };

  const handlePressEnd = () => {
    if (phase !== 'active' || pressStartRef.current === null) {
      return;
    }

    stopHoldTicker();
    const durationMs = performance.now() - pressStartRef.current;
    pressStartRef.current = null;
    finishAttempt(durationMs, attemptNumber);
  };

  const isDangerZone = holdDuration > config.safeWindowEndMs;
  const isSafeWindow = holdDuration >= config.safeWindowStartMs && holdDuration <= config.safeWindowEndMs;
  const progress = Math.min(100, (holdDuration / config.safeWindowEndMs) * 100);

  return (
    <section className="reboot-game" aria-live="polite">
      <div className="reboot-game__header">
        <p className="reboot-game__eyebrow">Minigame • Reboot</p>
        <h2>Reboot de 10 segundos</h2>
      </div>

      <div className="reboot-game__status-row">
        <span className="reboot-game__status">Tentativa {attemptNumber || 0}</span>
        <span className={`reboot-game__badge reboot-game__badge--${phase}`}>
          {phase === 'idle' && 'Pronto'}
          {phase === 'active' && 'Em andamento'}
          {phase === 'success' && 'Sucesso'}
          {phase === 'failure' && 'Falhou'}
        </span>
      </div>

      <p className="reboot-game__instruction">
        Segure o botão até o projeto voltar ao ar, e solte quando a luz ficar estável.
      </p>

      <div className="reboot-game__meter" aria-label="Janela de tempo segura para soltar o botão">
        <div className="reboot-game__meter-track">
          <div
            className={`reboot-game__meter-fill ${
              isSafeWindow ? 'safe' : isDangerZone ? 'danger' : ''
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="reboot-game__safe-zone" style={{ left: `${(config.safeWindowStartMs / config.safeWindowEndMs) * 100}%`, width: `${((config.safeWindowEndMs - config.safeWindowStartMs) / config.safeWindowEndMs) * 100}%` }} />
      </div>

      <div className="reboot-game__readout">
        <span>Tempo</span>
        <strong>{Math.round(holdDuration)} ms</strong>
      </div>

      <button
        className={`reboot-game__button ${phase === 'active' ? 'is-pressed' : ''}`}
        type="button"
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        aria-label="Botão de reboot do projetor"
      >
        {phase === 'active' ? 'Segurando...' : 'Botão de reboot'}
      </button>

      {result && (
        <div className={`reboot-game__result reboot-game__result--${result.reason}`}>
          {result.success ? 'Sucesso! O projetor voltou.' : result.reason === 'too-early' ? 'Soltou cedo. O reboot falhou.' : 'Soltou tarde demais. O sistema travou.'}
        </div>
      )}

      {phase !== 'active' && (
        <button type="button" className="reboot-game__start" onClick={startAttempt}>
          {phase === 'idle' ? 'Iniciar reboot' : 'Tentar de novo'}
        </button>
      )}
    </section>
  );
}

export default RebootGame;
