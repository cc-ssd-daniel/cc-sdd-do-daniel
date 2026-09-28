// FocoHarness.js — Tela de teste isolada do Foco Milimétrico (uso da Lívia).
// Renderiza o minigame com os services fake, sem depender do core/telas do Vitor.
// Não faz parte da integração final; serve para jogar e validar isoladamente.

import React, { useMemo, useState } from 'react';
import FocoMilimetrico from './FocoMilimetrico';
import { DEFAULT_CONFIG } from './focoConfig';
import { createFakeServices } from '../fakes/fakeServices';

export default function FocoHarness() {
  const [round, setRound] = useState(0);
  const [outcome, setOutcome] = useState(null);
  const [patienceLog, setPatienceLog] = useState([]);

  // Novos services fake a cada rodada, para o log começar limpo.
  // `round` entra no cálculo para forçar a recriação e satisfazer o lint.
  const services = useMemo(() => {
    void round;
    return createFakeServices();
  }, [round]);

  function handleComplete(result) {
    setOutcome({ type: 'sucesso', result });
    setPatienceLog([...services.patience.deltas]);
  }

  function handleFail(reason) {
    setOutcome({ type: 'falha', reason });
    setPatienceLog([...services.patience.deltas]);
  }

  function novaRodada() {
    setOutcome(null);
    setPatienceLog([]);
    setRound((r) => r + 1);
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.3rem' }}>Harness de teste — Foco Milimétrico</h1>
      <p style={{ color: '#64748b', maxWidth: 520 }}>
        Tela isolada para testar o minigame com serviços fake. Use as setas do teclado
        para mover o indicador até a faixa verde e segurar lá até vencer.
      </p>

      <FocoMilimetrico
        key={round}
        config={DEFAULT_CONFIG}
        services={services}
        onComplete={handleComplete}
        onFail={handleFail}
      />

      <div style={{ marginTop: 24, maxWidth: 520 }}>
        <button type="button" onClick={novaRodada} style={{ padding: '8px 16px' }}>
          Nova rodada
        </button>

        {outcome && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              background: outcome.type === 'sucesso' ? '#e7f6ec' : '#fdeceb',
            }}
          >
            <strong>Resultado: {outcome.type}</strong>
            {outcome.type === 'sucesso' && (
              <pre style={{ margin: '8px 0 0' }}>
                {JSON.stringify(outcome.result, null, 2)}
              </pre>
            )}
            {outcome.type === 'falha' && <div>Motivo: {outcome.reason}</div>}
            <div style={{ marginTop: 8 }}>
              Deltas de paciência emitidos: {patienceLog.length ? patienceLog.join(', ') : 'nenhum'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
