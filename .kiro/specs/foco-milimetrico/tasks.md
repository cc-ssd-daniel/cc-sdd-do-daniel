# Implementation Plan — Foco Milimétrico

- [ ] 1. Config de dificuldade (`src/minigames/react-apps/foco/focoConfig.jsx`)
  - Definir os defaults documentados: largura da faixa, tempo-alvo de permanência, limite de overshoot, tempo máximo da rodada, min/max do indicador.
  - Implementar `validateConfig(config)` que aplica defaults para parâmetros ausentes e recusa parâmetros inválidos informando qual.
  - Observable: chamar `validateConfig({})` retorna os defaults; chamar com um parâmetro inválido lança/retorna erro nomeando o parâmetro.
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 2. Motor de regra puro (`src/minigames/react-apps/foco/focoEngine.jsx`)
  - [ ] 2.1 Estado e movimento do indicador
    - Criar `createFocoEngine(config)` com estado inicial (`position`, `timeInFocus`, `penalty`, `timeRemaining`, `status`, `inFocus`).
    - Implementar `move(delta)` respeitando os limites min/max.
    - Observable: `move` além do máximo mantém `position` no máximo; abaixo do mínimo, no mínimo.
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [ ] 2.2 Faixa de foco e sucesso
    - Implementar `tick(dtMs)` acumulando `timeInFocus` só quando dentro da faixa; emitir evento `success` ao atingir o tempo-alvo.
    - Zerar a contagem corrente quando o indicador sai da faixa.
    - Observable: sequência de ticks dentro da faixa até o alvo emite `success`; sair no meio interrompe a contagem.
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ] 2.3 Overshoot e falha
    - Aplicar penalidade quando `position` ultrapassa o limite de overshoot; emitir evento `overshoot` com `patienceDelta` negativo.
    - Emitir `fail` com `reason='overshoot'` quando a penalidade atinge o limite e `reason='timeout'` quando o tempo esgota.
    - Observable: overshoot gera evento com delta negativo; penalidade no limite e tempo esgotado geram `fail` com o motivo correto.
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [ ] 2.4 Reset do estado interno
    - Implementar `reset()` restaurando o estado inicial sem efeitos externos.
    - Observable: após `reset`, `getState()` retorna o estado inicial.
    - _Requirements: 1.4_

- [ ] 3. Serviços fake para execução isolada
  - Implementar `patience.applyDelta`, `audio.play`, `audio.vibrate`, `storage.get/set` como fakes que registram chamadas.
  - Observable: os fakes podem ser inspecionados nos testes (ex.: lista de deltas aplicados).
  - _Requirements: 1.1, 4.3_

- [ ] 4. Adapter do contrato interno (`src/minigames/react-apps/foco/focoContract.jsx`)
  - Implementar `createFocoContract({ onComplete, onFail })` com `start(config, services)`, `reset()`, `dispose()`.
  - `start` valida config, cria o engine, guarda `services` e inicia o loop de tempo; sucesso chama `onComplete(result)`, falha chama `onFail(reason)`; overshoot chama `services.patience.applyDelta`.
  - `dispose` remove timers/listeners.
  - Observable: com fakeServices, um cenário de sucesso chama `onComplete` com `result`; um de falha chama `onFail(reason)`; `dispose` para o loop.
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 4.3_
  - _Depends: 1, 2, 3_

- [ ] 5. Hook de tempo (`src/minigames/react-apps/foco/useFocoEngine.jsx`)
  - Rodar o engine no tempo com `requestAnimationFrame`/timer, expor estado e handlers de entrada, limpar no unmount.
  - Observable: o hook avança o estado ao longo do tempo e para ao desmontar.
  - _Requirements: 2.1, 3.1_
  - _Depends: 2_

- [ ] 6. Componente de apresentação (`src/minigames/react-apps/foco/FocoMilimetrico.jsx` + `.css`)
  - Renderizar faixa, indicador e feedback; capturar entrada por teclado (setas) e ponteiro; indicar foco por mais de um canal (cor + texto/ícone); respeitar `prefers-reduced-motion`; emitir vibração no overshoot quando suportado.
  - Observable: setas movem o indicador; estado de foco tem indicação textual além de cor; feedback de sucesso/falha aparece.
  - _Requirements: 2.2, 5.1, 5.2, 5.3, 5.4, 7.1, 7.2, 7.3, 7.4_
  - _Depends: 5_

- [ ] 7. Testes e evidências (FOC-06)
  - [ ] 7.1 Testes unitários do engine
    - Cobrir movimento/limites, faixa/sucesso, overshoot/falha, reset.
    - Observable: `npm test` roda os testes do engine e passam.
    - _Requirements: 2.4, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 1.4_
  - [ ] 7.2 Testes de config
    - Defaults aplicados e config inválida recusada.
    - _Requirements: 6.2, 6.3_
  - [ ] 7.3 Testes de integração do contrato (com fakeServices)
    - Sucesso → `onComplete`; falha → `onFail`; `reset`/`dispose`.
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [ ] 7.4 Testes de UI
    - Controle por teclado; indicação multicanal do foco; feedback de sucesso/falha.
    - _Requirements: 5.4, 7.1, 7.3_
  - [ ] 7.5 Checklist de evidências
    - Registrar em `docs/qa` (ou no próprio spec) o resultado por requisito.
    - Observable: existe um checklist com resultado registrado para cada requisito.
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1_
