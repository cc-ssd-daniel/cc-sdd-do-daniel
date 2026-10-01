# Contexto para agentes

O projeto é o **Projetor Simulator: Chamados da TI**, uma SPA de prototipação de jogos curtos sobre suporte técnico em sala de aula.

## Fonte de verdade

1. `.kiro/steering/` contém as regras estáveis do produto, tecnologia, estrutura e contratos.
2. `.kiro/specs/` contém o ciclo de cada feature.
3. `src/` contém a implementação atual; quando houver conflito, o código e a validação devem ser comparados com a spec antes de decidir.

## Stack e execução

O projeto usa Vite, TypeScript, React 19 e React DOM. Os comandos são `npm run dev` e `npm run build`. Não presumir Create React App, `react-scripts`, `npm start` ou uma pasta `vibe-code-do-daniel`.

## Arquitetura

`src/core/loop.ts` coordena o fluxo. Os wrappers em `src/minigames/` adaptam componentes e engines internos ao contrato público do core. Os três minigames integrados são Foco Milimétrico, Reboot de 10 segundos e Roleta do Input.

Antes de adicionar uma feature, confira:

- limites do domínio em `.kiro/steering/structure.md`;
- contrato em `.kiro/steering/contract.md`;
- spec da feature;
- testes e scripts disponíveis no `package.json`.

Documentação nova do workflow deve ficar em `.kiro`, e Markdown de specs deve seguir o idioma definido no `spec.json`.

## Atalho do workflow

Para uma ideia nova, use `/kiro-discovery`. Para uma feature já delimitada, use `/kiro-spec-init`, depois `/kiro-spec-requirements`, `/kiro-spec-design`, `/kiro-spec-tasks` e `/kiro-impl`. Consulte o andamento com `/kiro-spec-status` e valide com `/kiro-validate-impl`.
