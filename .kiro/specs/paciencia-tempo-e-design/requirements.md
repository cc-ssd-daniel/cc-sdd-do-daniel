# Requirements Document — Paciência por tempo e design Apple

## Introduction

Esta feature adiciona **pressão de tempo** ao jogo "Consertando o Projetor" e **melhora o layout** aplicando um design inspirado no estilo Apple. Hoje o medidor de Paciência da Turma só muda por eventos discretos (acertos, erros, botões); o jogador não sente urgência por demorar. Além disso, a interface usa CSS inline improvisado e o template padrão do Vite.

O objetivo é: (1) fazer a Paciência decair automaticamente com o tempo enquanto o jogo está ativo, criando urgência; e (2) unificar o visual do core e dos minigames sob um sistema de design coeso (Apple-like: canvas claro/escuro, um único azul de ação, tipografia limpa, muito respiro, sem chrome decorativo).

## Boundary Context

- **In scope**: decaimento temporal da Paciência no core; controle de quando o decaimento roda (por estado do jogo); tokens e estilos de design aplicados ao core loop e aos minigames; feedback visual do medidor.
- **Out of scope**: mudar as regras internas de cada minigame (mecânica de foco, reboot, roleta); alterar o contrato comum; persistência; criar novos minigames.
- **Adjacent expectations**: o decaimento reutiliza o canal de evento existente (`game:delta-patience`) e a condição de derrota existente (`game:game-over`); o redesign não altera a lógica, apenas a apresentação.

## Requirements

### Requirement 1: Decaimento da Paciência por tempo

**Objective:** As a jogador, I want que a paciência da turma diminua enquanto eu demoro, so that eu sinta urgência para consertar o projetor rápido.

#### Acceptance Criteria
1. While o jogo está em um estado ativo de jogo, the Paciência shall diminuir automaticamente a uma taxa configurável ao longo do tempo.
2. When a paciência diminui pelo tempo, the sistema shall usar o mesmo fluxo de atualização já existente (evento de mudança de paciência e verificação de derrota).
3. If a paciência chega a zero por decaimento de tempo, then the sistema shall disparar a condição de fim de jogo.
4. The taxa de decaimento shall ser definida em um único ponto de configuração.

### Requirement 2: Decaimento condicionado ao estado do jogo

**Objective:** As a jogador, I want que o tempo só corra quando faz sentido, so that eu não seja penalizado em telas onde não estou jogando.

#### Acceptance Criteria
1. While o jogo está no menu inicial, the decaimento por tempo shall estar pausado.
2. While o jogo está em fim de jogo, the decaimento por tempo shall estar parado.
3. When o jogador entra em um estado ativo (sala ou modo de conserto), the decaimento por tempo shall estar ativo.
4. When o componente de tempo é descartado ou o jogo reinicia, the sistema shall limpar o temporizador para não haver decaimento duplicado.

### Requirement 3: Feedback visual do medidor

**Objective:** As a jogador, I want ver a paciência mudando de forma clara, so that eu perceba a urgência sem ler apenas um número.

#### Acceptance Criteria
1. The medidor shall exibir a paciência atual como uma barra proporcional além do valor numérico.
2. While a paciência está baixa, the medidor shall indicar o estado crítico por mais de um canal (cor e outro sinal visual).
3. When a paciência muda, the medidor shall refletir o novo valor imediatamente.

### Requirement 4: Sistema de design (estilo Apple)

**Objective:** As a jogador, I want uma interface limpa e coesa, so that o jogo pareça polido e agradável.

#### Acceptance Criteria
1. The interface shall usar um conjunto único de tokens de design (cores, tipografia, espaçamento, raios) aplicado ao core e aos minigames.
2. The paleta shall usar um único azul de ação, tinta near-black em fundo claro e branco em fundo escuro, sem gradientes decorativos.
3. The tipografia shall usar uma família sem serifa consistente, com títulos de peso alto e tracking levemente negativo.
4. Where um elemento é interativo (botão), the elemento shall usar o azul de ação e forma de cápsula consistente.
5. The layout shall priorizar respiro (espaçamento generoso) e remover chrome decorativo desnecessário (bordas e sombras supérfluas).

### Requirement 5: Não regressão do jogo

**Objective:** As a integrante do grupo, I want que o redesign e a pressão de tempo não quebrem o jogo, so that a integração continue funcionando.

#### Acceptance Criteria
1. The aplicação shall compilar sem erros (build do Vite/TypeScript).
2. The fluxo existente (menu → sala → conserto → sequência de minigames → fim de jogo) shall continuar funcionando.
3. The eventos existentes (`game:delta-patience`, `game:patience-changed`, `game:game-over`) shall permanecer compatíveis.
