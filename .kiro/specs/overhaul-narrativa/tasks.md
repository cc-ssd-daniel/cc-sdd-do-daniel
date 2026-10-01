# Tarefas - Overhaul Narrativa

- [x] 1. Criar sistema de Cutscenes (\src/core/cutscenes.ts\)
  - Implementar \CutsceneManager\ capaz de renderizar as falas estilo Visual Novel antes do minigame iniciar.

- [x] 2. Implementar Minigame 4: Cabo VGA Cego (\src/minigames/cabo/CaboMinigame.ts\)
  - Mecânica de seguir o mouse e dano ao mover durante o flash.

- [x] 3. Implementar Minigame 5: Equilíbrio na Cadeira (\src/minigames/equilibrio/EquilibrioMinigame.ts\)
  - Mecânica de gravidade invertida e correção do mouse.

- [x] 4. Implementar Minigame 6: Senha do Wi-Fi (\src/minigames/senha/SenhaMinigame.ts\)
  - Mecânica de \	yping\ com pressão de tempo.

- [x] 5. Ajustar Core Loop (\src/core/loop.ts\)
  - Atualizar fila para 6 jogos em ordem lógica.
  - Injetar cutscenes entre as chamadas dos minigames.
  - Atualizar HUD e estilos para acomodar o modo primeira pessoa.

