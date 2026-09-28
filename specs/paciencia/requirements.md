# Requirements: Paciência da Turma

## Objetivo
Gerenciar o nível de paciência global da turma. Este medidor dita a condição de derrota do jogo. Quando a paciência chega a zero, o jogador perde a partida.

## Regras de Negócio

- **Valor Inicial**: 100% de paciência no início de cada partida.
- **Limites**: O valor deve ser contido sempre entre 0 e 100.
- **Eventos de Alteração (Deltas)**:
  - Os minigames emitem eventos com deltas.
  - Se um minigame emite delta negativo (ex: falha parcial ou lentidão), o medidor de paciência decresce.
  - Se um minigame emite delta positivo (ex: bônus), o medidor aumenta (até o máximo de 100).
- **Condição de Derrota**:
  - Quando a paciência atinge 0, um evento de derrota global é acionado.
- **Feedback**:
  - A UI do core (ou HUD) deve atualizar visualmente o nível de paciência sempre que ele mudar.
