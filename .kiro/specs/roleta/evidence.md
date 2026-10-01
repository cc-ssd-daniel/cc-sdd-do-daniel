# Evidências — Roleta do Input

## Implementação atual

- `src/minigames/roleta/roleta.tsx` — wrapper usado pelo `CoreLoop`.
- `src/minigames/react-apps/roleta/roulette.jsx` — motor da roleta.
- `src/minigames/react-apps/roleta/contractAdapter.jsx` — adapter de eventos.
- `src/minigames/react-apps/roleta/InputRoulette.jsx` — interface.
- `src/minigames/react-apps/roleta/RouletteHarness.jsx` — harness isolado.

## Rastreabilidade

| Área | Evidência esperada | Estado |
|---|---|---|
| Pista e seleção | alvo, avanço circular e acerto único | Implementado no motor |
| Erros | feedback, penalidade e limite configurável | Implementado no motor |
| Ciclo de vida | reset, dispose e cancelamento de timers | Implementado no motor/adapter |
| Acessibilidade | botões nativos, texto e pressão reduzida | Implementado na interface |
| Integração | resultado convertido para o contrato do core | Implementado em `roleta.tsx` |

## Limite da evidência

Registros antigos citavam `tests/roleta`, Webpack, Create React App e `src/storage`, mas esses caminhos não existem na base atual. Eles não são considerados evidência reproduzível desta versão e foram removidos deste registro.

O `package.json` atual ainda não declara um runner de testes. Antes de marcar a feature como validada, é necessário configurar ou documentar um runner compatível com Vite/React e registrar sua saída aqui.
