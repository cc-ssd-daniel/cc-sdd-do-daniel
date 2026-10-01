# Documento de Requisitos

## Descrição do Projeto
O objetivo foi centralizar documentação e tarefas e unificar as implementações em uma única base Vite/TypeScript com componentes React integrados. Também foi necessário implementar o fluxo sequencial para que, ao finalizar um minigame, o próximo inicie automaticamente.

## Requisitos de Negócio
- **R1:** Unificar as implementações dos minigames na base Vite principal, mantendo os componentes React adaptados pelos wrappers TypeScript.
- **R2:** Execução Sequencial de Minigames. Quando um minigame (ex: Fake, Foco, Reboot, Roleta) acabar, o próximo deve ser carregado e exibido na sequência, criando uma experiência contínua.
- **R3:** Centralização de Documentação. O status e tasks completas de ambos os projetos devem ser agrupados de forma coerente no projeto principal.
- **R4:** A base anterior deverá permanecer fora do repositório final após a migração dos códigos e regras de negócio.

## Regras de Negócio e Lógica Sequencial
- **Regra de Sequência:** O jogo deve possuir um `Loop` ou `Controller` mestre que dita a ordem. Ex: `Menu -> Fake -> Foco -> Reboot -> Roleta -> Tela Final`.
- **Regra de Estado:** A pontuação ou o resultado de cada minigame deve ser salvo temporariamente para exibir um consolidado ao final de todos os jogos, se aplicável.

## Requisitos Técnicos
- **T1:** A base de código resultante deve usar Vite e TypeScript (padrão do projeto root).
- **T2:** Os componentes React migrados devem funcionar na arquitetura Vite atual por meio dos wrappers TypeScript em `src/minigames/`.
- **T3:** Preservar testes e arquivos CSS originais, ajustando apenas a sintaxe para integração com Vite.
