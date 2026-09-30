# Documento de Requisitos

## Descrição do Projeto
O objetivo é centralizar os documentos de tasks completas e documentação, além de unificar os dois projetos existentes hoje (o principal `cc-sdd-do-daniel` em TS/Vite e o aninhado `vibe-code-do-daniel` em JS/React) em uma única base de código. Além disso, é necessário implementar um sistema sequencial para que, ao finalizar um minigame, o próximo inicie automaticamente em seguida.

## Requisitos de Negócio
- **R1:** Unificar os dois projetos. A lógica e UI dos minigames em React (`vibe-code-do-daniel`) devem ser integradas ao projeto principal (`cc-sdd-do-daniel`).
- **R2:** Execução Sequencial de Minigames. Quando um minigame (ex: Fake, Foco, Reboot, Roleta) acabar, o próximo deve ser carregado e exibido na sequência, criando uma experiência contínua.
- **R3:** Centralização de Documentação. O status e tasks completas de ambos os projetos devem ser agrupados de forma coerente no projeto principal.
- **R4:** O projeto aninhado `vibe-code-do-daniel` deverá ser removido ou arquivado após a migração de seus códigos e regras de negócio para a estrutura baseada em Vite/TS.

## Regras de Negócio e Lógica Sequencial
- **Regra de Sequência:** O jogo deve possuir um `Loop` ou `Controller` mestre que dita a ordem. Ex: `Menu -> Fake -> Foco -> Reboot -> Roleta -> Tela Final`.
- **Regra de Estado:** A pontuação ou o resultado de cada minigame deve ser salvo temporariamente para exibir um consolidado ao final de todos os jogos, se aplicável.

## Requisitos Técnicos
- **T1:** A base de código resultante deve usar Vite e TypeScript (padrão do projeto root).
- **T2:** Os componentes React do projeto `vibe-code-do-daniel` devem ser convertidos/adaptados para funcionar na arquitetura atual do projeto principal (que parece não usar React, ou se usa, deve ser padronizado). *Nota: o root parece ser Vanilla TS/Vite, precisaremos verificar se manteremos React no root ou converteremos para Vanilla. Como o root já tem os arquivos .ts, portaremos a lógica React para Vanilla, ou importaremos React no root.*
- **T3:** Preservar testes e arquivos CSS originais, ajustando apenas a sintaxe para integração com Vite.
