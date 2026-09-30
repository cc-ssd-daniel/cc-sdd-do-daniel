# Plano de Tasks

## Fase 1: Centralização e Preparação
- [x] 1. Mover documentação e anotações soltas (se houver) do diretório `vibe-code-do-daniel` para os respectivos diretórios de specs em `.kiro/specs/`.
- [x] 2. Analisar quais partes exclusivas de lógica de `vibe-code-do-daniel` (React) faltam ser transportadas para os arquivos `.ts` do projeto Vanilla (`fake.ts`, `foco.ts`, etc.).
- [x] 3. Copiar todos os assets de CSS/Imagens que faltam de `vibe-code-do-daniel` para `cc-sdd-do-daniel/src/assets` ou `public`.

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
- [x] 12. Após confirmar que a execução sequencial funciona com todos os estilos migrados, excluir permanentemente a pasta `vibe-code-do-daniel`.
- [x] 13. Validar se não há menções residuais ou lixos de cache relacionados ao projeto antigo (ex: scripts no package.json).
