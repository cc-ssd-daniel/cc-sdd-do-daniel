# Requirements Document

## Introduction

O **Foco Milimétrico** é um dos três minigames do jogo. O jogador precisa ajustar um controle contínuo até que um indicador fique dentro de uma **faixa de foco** estreita e mantê-lo ali pelo tempo exigido, sem ultrapassar o limite (overshoot). O minigame é curto, tenso e depende de precisão.

Este minigame é desenvolvido de forma independente, respeitando o **contrato comum** dos minigames (`start`, `complete`, `fail`, `reset`, `dispose`) e emitindo deltas para o medidor global de **Paciência da Turma** por meio dos serviços recebidos na entrada. Ele deve rodar isoladamente com serviços fake (estado, áudio e persistência) até que os adapters reais estejam disponíveis.

## Boundary Context

- **In scope**: mecânica de controle e faixa de foco; detecção de sucesso, overshoot e falha; feedback visual e tátil (vibração); reinício do estado interno; parâmetros de dificuldade configuráveis; requisitos de acessibilidade do próprio minigame.
- **Out of scope**: lógica interna do medidor de Paciência da Turma (apenas emite deltas por evento); acesso direto ao `localStorage` (usa o adapter de persistência recebido); navegação do core loop; implementação interna dos outros minigames (Reboot, Roleta).
- **Adjacent expectations**: o core fornece `config` e `services` em `start`; o resultado é devolvido via `complete(result)`; a acessibilidade segue as convenções globais definidas no steering do projeto.

## Requirements

### Requirement 1: Ciclo de vida pelo contrato comum

**Objective:** As a dono do core loop, I want que o Foco Milimétrico obedeça ao contrato comum, so that ele possa ser integrado sem alterar sua lógica interna.

#### Acceptance Criteria
1. When o core chama `start(config, services)`, the Foco Milimétrico shall inicializar seu estado interno a partir de `config` e usar os adapters recebidos em `services`.
2. When o jogador atinge a condição de sucesso, the Foco Milimétrico shall chamar `complete(result)` com pontuação, tempo usado e deltas de paciência.
3. If a condição de falha ocorre, then the Foco Milimétrico shall chamar `fail(reason)` com um motivo padronizado.
4. When `reset()` é chamado, the Foco Milimétrico shall limpar apenas o seu estado interno sem afetar o core ou outros minigames.
5. When `dispose()` é chamado, the Foco Milimétrico shall remover listeners, timers e efeitos ativos antes de devolver o controle ao core.

### Requirement 2: Controle contínuo do indicador

**Objective:** As a jogador, I want mover um indicador de forma contínua, so that eu possa buscar a faixa de foco com precisão.

#### Acceptance Criteria
1. While o minigame está ativo, the Foco Milimétrico shall exibir um indicador cuja posição responde às entradas do jogador.
2. When o jogador aumenta a entrada de controle, the Foco Milimétrico shall mover o indicador na direção correspondente de forma proporcional.
3. While não há entrada do jogador, the Foco Milimétrico shall manter o indicador estável na última posição.
4. The Foco Milimétrico shall limitar a posição do indicador aos valores mínimo e máximo definidos em `config`.

### Requirement 3: Faixa de foco e condição de sucesso

**Objective:** As a jogador, I want manter o indicador dentro da faixa de foco pelo tempo exigido, so that eu consiga vencer a rodada.

#### Acceptance Criteria
1. While o indicador está dentro da faixa de foco, the Foco Milimétrico shall acumular o tempo de permanência.
2. When o tempo acumulado dentro da faixa atinge o alvo definido em `config`, the Foco Milimétrico shall registrar sucesso e chamar `complete(result)`.
3. If o indicador sai da faixa de foco antes de atingir o alvo, then the Foco Milimétrico shall interromper a contagem de permanência.
4. While o indicador está dentro da faixa, the Foco Milimétrico shall sinalizar visualmente o estado de foco ativo.

### Requirement 4: Overshoot e falha

**Objective:** As a designer do jogo, I want penalizar o excesso de correção, so that o minigame exija precisão e não força bruta.

#### Acceptance Criteria
1. If o indicador ultrapassa o limite de overshoot definido em `config`, then the Foco Milimétrico shall aplicar uma penalidade conforme a regra configurada.
2. When a penalidade acumulada atinge o limite de falha, the Foco Milimétrico shall registrar falha e chamar `fail(reason)`.
3. When ocorre overshoot, the Foco Milimétrico shall emitir um delta negativo de paciência por meio do serviço recebido em `start`.
4. If o tempo máximo da rodada se esgota sem sucesso, then the Foco Milimétrico shall chamar `fail(reason)` com o motivo de tempo esgotado.

### Requirement 5: Feedback visual e tátil

**Objective:** As a jogador, I want receber retorno imediato das minhas ações, so that eu entenda o resultado de cada ajuste.

#### Acceptance Criteria
1. When o indicador entra na faixa de foco, the Foco Milimétrico shall apresentar feedback visual distinto do estado fora de foco.
2. When ocorre overshoot, the Foco Milimétrico shall apresentar feedback visual de erro.
3. Where o dispositivo suporta vibração, the Foco Milimétrico shall emitir vibração no overshoot conforme a intensidade configurada.
4. When o jogador vence ou perde a rodada, the Foco Milimétrico shall apresentar feedback de sucesso ou falha correspondente.

### Requirement 6: Parâmetros de dificuldade configuráveis

**Objective:** As a integrador, I want ajustar a dificuldade por configuração, so that o minigame se adapte ao ritmo do jogo sem mudança de código.

#### Acceptance Criteria
1. The Foco Milimétrico shall aceitar por `config` a largura da faixa de foco, o tempo-alvo de permanência, o limite de overshoot e o tempo máximo da rodada.
2. When um parâmetro de dificuldade não é informado em `config`, the Foco Milimétrico shall usar um valor padrão documentado.
3. If um parâmetro de `config` é inválido, then the Foco Milimétrico shall recusar a inicialização e reportar o parâmetro inválido.

### Requirement 7: Acessibilidade

**Objective:** As a jogador com necessidades de acessibilidade, I want jogar sem depender apenas de cor ou de um único sentido, so that o minigame seja utilizável por mais pessoas.

#### Acceptance Criteria
1. The Foco Milimétrico shall indicar o estado de foco por mais de um canal, não dependendo somente de cor.
2. Where o jogador ativa a opção de redução de movimento, the Foco Milimétrico shall reduzir animações não essenciais.
3. The Foco Milimétrico shall permitir controle por teclado além de qualquer outro método de entrada.
4. When ocorre um evento relevante de jogo (foco, overshoot, sucesso, falha), the Foco Milimétrico shall expor uma indicação textual ou acessível do evento.
