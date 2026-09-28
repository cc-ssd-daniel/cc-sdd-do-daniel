import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoulette } from './roulette';

export default function InputRoulette({ config = {}, accessibility = {}, onEvent, services = {} }) {
  const game = useMemo(() => createRoulette(), []);
  const [state, setState] = useState(game.snapshot);
  const current = useRef({ onEvent, services });
  current.current = { onEvent, services };
  const configKey = JSON.stringify({ ...config, accessibility: { ...config.accessibility, ...accessibility } });
  const stableServices = useMemo(() => ({
    onEvent: event => {
      const active = current.current;
      active.onEvent?.(event);
      if (active.services.onEvent !== active.onEvent) active.services.onEvent?.(event);
    },
    complete: result => current.current.services.complete?.(result),
    fail: reason => current.current.services.fail?.(reason),
    audio: { cue: name => current.current.services.audio?.cue?.(name) },
  }), []);

  useEffect(() => {
    const unsubscribe = game.subscribe(setState);
    game.start(JSON.parse(configKey), stableServices);
    return () => { unsubscribe(); game.dispose(); };
  }, [game, configKey, stableServices]);

  const restart = () => { game.reset(); game.start(JSON.parse(configKey), stableServices); };
  return (
    <section aria-label="Roleta do Input">
      <h1>Roleta do Input</h1>
      <p>Entrada correta: <strong>{state.target}</strong>. Selecione quando esse nome aparecer.</p>
      <p>Cada erro acelera a troca e reduz a paciência. Use Tab para navegar e Enter ou Espaço para selecionar.</p>
      <p>Entrada atual: <strong aria-label="Entrada atual" aria-live="polite" aria-atomic="true">{state.selected}</strong></p>
      <button type="button" onClick={() => game.select()} disabled={state.status !== 'running'}>Selecionar entrada</button>
      <button type="button" onClick={restart}>Reiniciar</button>
      <p role="status" aria-live="polite" aria-atomic="true">{state.feedback}</p>
      <p>Erros: {state.errors}. Intervalo: {state.intervalMs} ms.</p>
      {state.accessibility.reducedTimePressure && <p>Menor pressão de tempo ativada.</p>}
      <p>Sem animações ou flashes. A pista e o feedback são textuais.</p>
      {state.result && <p>Pontuação: {state.result.score}. Tempo: {state.result.durationMs} ms.</p>}
    </section>
  );
}
