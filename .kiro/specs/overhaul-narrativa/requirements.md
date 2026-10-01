# Requisitos - Overhaul Narrativa

1. **Sistema de Cutscenes**
   - Deve ser possível exibir diálogos antes de cada minigame.
   - Deve suportar múltiplos interlocutores (Prof. Carlos, TI, Turma).

2. **Novos Minigames (Contrato Padrão)**
   - Devem seguir a interface \MinigameContract\ (start, onSuccess, onFailure, restart).
   - **Cabo VGA Cego:** Jogador deve mover o cabo até a porta sem mover o mouse durante o flash.
   - **Equilíbrio na Cadeira:** Jogador deve manter um indicador centralizado por X segundos.
   - **Senha do Wi-Fi:** Jogador deve digitar uma string exata em Y segundos.

3. **Modo Primeira Pessoa**
   - O core loop deve englobar as mecânicas com uma interface que simule a visão do jogador, integrando as mecânicas.

4. **Quantidade Total de Jogos**
   - A fila de minigames do CoreLoop deve conter exatos 6 minigames.
