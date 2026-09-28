# Contrato Comum dos Minigames

Este documento define a interface padrão que todos os minigames devem implementar para serem integrados ao Core Loop.

## Interface `MinigameContract`

Cada minigame deve expor as seguintes funções:

- `start()`: Inicia a execução do minigame e exibe a sua interface no contêiner fornecido pelo core.
- `onSuccess(callback: (result: MinigameResult) => void)`: Registra um callback para ser chamado quando o jogador vence o minigame.
- `onFailure(callback: (result: MinigameResult) => void)`: Registra um callback para ser chamado quando o jogador falha no minigame.
- `restart()`: Reinicia o estado do minigame e permite tentar novamente.

## Payload de Resultado `MinigameResult`

Quando o minigame termina, ele deve emitir o resultado contendo:

- `success: boolean`: Indica se o conserto foi bem-sucedido.
- `score: number`: A pontuação obtida, usada para incrementar os pontos ou registrar no localStorage.

## Eventos Globais

Os minigames devem despachar eventos globais para que módulos externos, como o medidor de Paciência da Turma, possam reagir sem acoplamento direto:

- `game:delta-patience`: Emitido com um valor (positivo ou negativo) para alterar a paciência global da turma.
  - Payload: `{ detail: { delta: number } }`
