# Requisitos — Paciência da Turma

## Introdução

O medidor de Paciência da Turma representa a pressão global da missão. Ele recebe deltas produzidos pelo fluxo principal ou pelos minigames, mantém o valor entre 0 e 100 e determina a condição de derrota quando chega a zero.

## Contexto de fronteira

- **Dentro do escopo:** estado do medidor, aplicação de deltas, limites, evento de derrota e atualização do HUD.
- **Fora do escopo:** regras internas dos minigames, persistência, pontuação detalhada e navegação das telas.
- **Expectativas adjacentes:** minigames emitem deltas pelo evento documentado no contrato; o core é responsável por reagir ao game over.

## Requisitos

### Requisito 1: Estado inicial e limites

**Objetivo:** Como jogador, quero começar cada partida com a paciência cheia, para entender claramente a margem disponível.

#### Critérios de aceitação

1. Quando uma nova instância do medidor for criada, o sistema deverá iniciar a paciência em 100.
2. Quando um delta positivo ou negativo for aplicado, o sistema deverá manter o valor entre 0 e 100.
3. O sistema deverá expor o valor atual para o HUD e para o fluxo principal.

### Requisito 2: Aplicação de deltas

**Objetivo:** Como minigame, quero emitir uma alteração de paciência sem conhecer o estado global, para permanecer desacoplado do core.

#### Critérios de aceitação

1. Quando um evento `game:delta-patience` for recebido com `{ detail: { delta } }`, o sistema deverá aplicar o delta ao valor atual.
2. Quando um minigame emitir delta negativo, o sistema deverá reduzir a paciência na mesma quantidade, respeitando o limite mínimo.
3. Quando uma recompensa emitir delta positivo, o sistema deverá aumentar a paciência na mesma quantidade, respeitando o limite máximo.

### Requisito 3: Derrota global e feedback

**Objetivo:** Como fluxo principal, quero receber um evento quando a paciência acabar, para encerrar a missão de forma consistente.

#### Critérios de aceitação

1. Quando a paciência atingir 0, o sistema deverá emitir `game:game-over` uma única vez para aquela condição.
2. Quando a paciência mudar, o sistema deverá emitir um evento ou atualizar o elemento de HUD usado pelo core.
3. O sistema não deverá permitir que uma alteração posterior deixe a partida abaixo de 0 ou acima de 100.
