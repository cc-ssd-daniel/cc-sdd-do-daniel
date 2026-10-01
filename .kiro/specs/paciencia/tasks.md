# Tarefas — Paciência da Turma

- [x] 1. Implementar o estado inicial e os limites do medidor
  - Confirmar valor inicial de 100 e clamp entre 0 e 100.
  - _Requisitos: 1.1, 1.2, 1.3_

- [x] 2. Implementar aplicação de deltas por evento
  - Receber `game:delta-patience` e atualizar o estado global.
  - _Requisitos: 2.1, 2.2, 2.3_

- [x] 3. Integrar feedback e game over ao core
  - Atualizar o HUD e emitir `game:game-over` quando o valor chegar a zero.
  - _Requisitos: 3.1, 3.2, 3.3_

- [ ] 4. Adicionar testes automatizados do medidor
  - Cobrir estado inicial, clamp, deltas positivos/negativos e game over.
  - Observable: os cenários passam no comando de testes adotado pelo projeto.
  - _Requisitos: 1.1, 1.2, 2.1, 2.2, 3.1_
