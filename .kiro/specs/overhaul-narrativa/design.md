# Overhaul de Narrativa e 6 Minigames
## Visão Geral
O jogo atual será transformado para incluir uma visão em primeira pessoa, cutscenes cômicas com diálogos e um total de 6 minigames (3 novos adicionados aos 3 existentes).

## Elementos de Narrativa
- **Cutscenes:** Antes de cada jogo, um diálogo será exibido na tela, introduzindo o problema de forma bem-humorada (ex: professor desesperado, TI sofrendo).
- **Primeira Pessoa (FP):** Os minigames adotarão uma estética onde o mouse controla a 'mão' ou a visão do jogador, com elementos na tela como cabos, teclados, etc.

## Novos Minigames
1. **Cabo VGA Cego:** Plugar o cabo VGA enquanto o projetor dispara flashes que cegam o jogador.
2. **Equilíbrio na Cadeira:** Manter o mouse centralizado para não cair da cadeira giratória enquanto conserta algo no teto.
3. **Senha do Wi-Fi:** Digitar uma senha complexa rapidamente sob a pressão da turma.

## Refatoração
Os jogos existentes (Foco, Reboot, Roleta) serão integrados ao novo fluxo de cutscenes e ajustados visualmente para a nova estética.

## Ciclo de vida e integração

- O `CoreLoop` recria seu conteúdo de tela em cada transição de estado. Antes de exibir uma cutscene, o `CutsceneManager` deve garantir que sua camada esteja anexada novamente ao contêiner principal.
- A paciência decai nos estados `ROOM` e `REPAIR`; deve parar em `MENU`, `GAME_OVER` e `VICTORY`.
- Ao chegar a zero, o decaimento para e o evento de game over é emitido uma única vez até que a paciência seja recuperada.
