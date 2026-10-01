# Instruções do projeto

## Contexto

Este repositório contém o protótipo web **Projetor Simulator: Chamados da TI**, desenvolvido com Vite, TypeScript e React. O jogo transforma problemas cômicos de suporte a projetores em uma sequência de minigames.

## Memória e specs

- Leia `.kiro/steering/` antes de alterar arquitetura, contratos ou estrutura.
- Cada feature deve ter uma pasta em `.kiro/specs/<feature>/`.
- O ciclo esperado é `requirements.md` → `design.md` → `tasks.md` → implementação e validação.
- Use `spec.json` para registrar idioma, fase, aprovações e prontidão.
- Não crie novas fontes de verdade em `steering/` ou `specs/` na raiz.

## Desenvolvimento

- Stack: Vite, TypeScript, React 19 e React DOM.
- Rodar desenvolvimento: `npm run dev`.
- Validar produção: `npm run build`.
- O contrato público dos minigames está em `src/core/contract.ts` e `.kiro/steering/contract.md`.
- Preserve a separação entre `src/core/` e `src/minigames/`.

## Alterações

- Leia o código e a spec relacionada antes de editar.
- Faça mudanças pequenas, testáveis e alinhadas ao escopo da feature.
- Atualize requirements/design/tasks/evidence quando o comportamento ou contrato mudar.
- Não declare uma feature concluída sem validação correspondente.
