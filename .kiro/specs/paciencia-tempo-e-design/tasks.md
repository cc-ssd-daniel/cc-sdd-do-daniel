# Implementation Plan — Paciência por tempo e design Apple

- [ ] 1. Decaimento da Paciência por tempo (core/patience.ts)
  - Adicionar `startDecay(ratePerSecond)` e `stopDecay()` com temporizador interno.
  - A cada tick, aplicar delta negativo via o `applyDelta` existente (reuso do evento e da checagem de derrota).
  - Garantir que `startDecay` limpe qualquer timer anterior antes de criar outro.
  - Definir a taxa em um único ponto de configuração.
  - Observable: com o jogo ativo, a paciência cai sozinha; ao zerar, dispara game-over.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.4_

- [ ] 2. Controle do decaimento por estado (core/loop.ts)
  - Ligar `startDecay` ao entrar em ROOM/REPAIR e `stopDecay` em MENU/GAME_OVER.
  - Observable: no menu a paciência não cai; na sala/conserto ela cai; no game-over para.
  - _Requirements: 2.1, 2.2, 2.3_
  - _Depends: 1_

- [ ] 3. HUD com barra de paciência (core/loop.ts + style.css)
  - Renderizar barra proporcional + número; atualizar no evento `game:patience-changed`.
  - Estado crítico (<=30%) indicado por cor e rótulo textual.
  - Observable: a barra encolhe conforme a paciência cai e muda para alerta quando baixa.
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 4. Design system global (style.css)
  - Substituir o template do Vite pelos tokens Apple (cores, tipografia, espaçamento, raios).
  - Estilizar telas do loop (menu, sala, conserto, game-over), botões (cápsula azul) e HUD.
  - Observable: telas do core com visual coeso, um único azul, muito respiro, sem chrome supérfluo.
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 5. Alinhar CSS dos minigames ao design system
  - Ajustar FocoMilimetrico.css e RebootGame.css aos tokens; aplicar classes ao que for possível na Roleta.
  - Observable: os três minigames compartilham a mesma linguagem visual do core.
  - _Requirements: 4.1, 4.4, 4.5_
  - _Depends: 4_

- [ ] 6. Verificação (build + dev)
  - `npm run build` sem erros; `npm run dev` e checar o fluxo completo e o decaimento.
  - Observable: build verde e jogo funcional com pressão de tempo e novo layout.
  - _Requirements: 5.1, 5.2, 5.3_
  - _Depends: 1, 2, 3, 4, 5_
