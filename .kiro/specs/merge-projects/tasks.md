# Plano de Tasks

## Fase 1: Centralização e Preparação
- [x] 1. Centralizar documentação e anotações nos respectivos diretórios de specs em `.kiro/specs/`.
- [x] 2. Analisar quais partes dos componentes React precisavam ser adaptadas para os wrappers TypeScript do projeto Vite.
- [x] 3. Copiar os assets necessários para `src/assets` ou `public`.

## Fase 2: Implementação da Interface Contratual dos Minigames
- [x] 4. Atualizar o `core/contract.ts` (ou criar um se não existir) para definir uma interface forte de montagem/desmontagem de minigames (ex: `mount(container, onComplete)`).
- [x] 5. Refatorar `fake.ts` para implementar o contrato.
- [x] 6. Refatorar `foco.ts` para implementar o contrato.
- [x] 7. Refatorar `reboot.ts` para implementar o contrato.
- [x] 8. Refatorar `roleta.ts` para implementar o contrato.

## Fase 3: Controlador de Fluxo Sequencial
- [x] 9. Criar um controlador em `core/GameController.ts` que recebe uma lista da ordem dos jogos.
- [x] 10. Integrar `main.ts` para iniciar o `GameController` na inicialização do app.
- [x] 11. Implementar a lógica de limpeza (`unmount`) quando um minigame emite `onComplete`, limpando o DOM e lançando o próximo.

## Fase 4: Limpeza (Sunset do projeto antigo)
- [x] 12. Confirmar a execução sequencial com os estilos migrados e manter somente a base Vite atual.
- [x] 13. Validar se não há menções residuais ou scripts do projeto anterior no `package.json`.
