# Evidências — Foco Milimétrico

Este arquivo registra a cobertura esperada e separa evidência histórica de validação reproduzida na base atual.

## Arquivos atuais relacionados

- `src/minigames/foco/foco.tsx` — wrapper usado pelo `CoreLoop`.
- `src/minigames/react-apps/foco/focoEngine.jsx` — regra do minigame.
- `src/minigames/react-apps/foco/focoConfig.jsx` — configuração e defaults.
- `src/minigames/react-apps/foco/focoContract.jsx` — contrato interno.
- `src/minigames/react-apps/foco/*.test.jsx` — testes co-localizados.

## Cobertura planejada

| Área | Evidência esperada | Estado |
|---|---|---|
| Configuração | defaults e rejeição de parâmetros inválidos | Implementado no código e testes co-localizados |
| Motor | limites, foco, overshoot, timeout e reset | Implementado no código e testes co-localizados |
| Contrato | start, complete, fail, reset e dispose | Implementado no contrato interno |
| Interface | feedback textual, teclado e estados visuais | Implementado no componente |
| Integração | wrapper público e sequência do core | Implementado em `src/minigames/foco/foco.tsx` |

## Validação

Os testes foram migrados de uma base anterior e estão dentro de `src/minigames/react-apps/foco`. O `package.json` atual ainda não declara um runner de testes, portanto os resultados históricos do Create React App não devem ser tratados como uma execução válida da aplicação Vite atual.

**Próxima validação necessária:** escolher e registrar um runner compatível com Vite/React, executar os testes co-localizados e anexar a saída reproduzível aqui.
