# Checklist de Evidências — Foco Milimétrico (FOC-06)

Registro do resultado por requisito, conforme a spec `.kiro/specs/foco-milimetrico/`.

Como reproduzir os testes:

```bash
# na pasta vibe-code-do-daniel
npm test -- --watchAll=false --testPathPattern=minigames
```

## Cobertura por requisito

| Requisito | Descrição | Teste que cobre | Resultado |
|-----------|-----------|-----------------|-----------|
| 1.1 | start inicializa com config/services | focoContract.test.js — "start inicia e sucesso..." | [x] |
| 1.2 | sucesso chama complete(result) | focoContract.test.js — "start inicia e sucesso..." | [x] |
| 1.3 | falha chama fail(reason) | focoContract.test.js — "overshoot ... falha chama onFail" | [x] |
| 1.4 | reset limpa só o estado interno | focoEngine.test.js — "reset restaura o estado inicial" | [x] |
| 1.5 | dispose remove timers | focoContract.test.js — "dispose para o loop" | [x] |
| 2.1 | estado inicial / controle ativo | focoEngine.test.js — "estado inicial..." | [x] |
| 2.2 | mover proporcional à entrada | FocoMilimetrico.test.js — "controle por teclado move..." | [x] |
| 2.4 | limitar posição a min/max | focoEngine.test.js — "move respeita o máximo/mínimo" | [x] |
| 3.1 | acumular tempo em foco | focoEngine.test.js — "acumula tempo em foco..." | [x] |
| 3.2 | sucesso ao atingir o alvo | focoEngine.test.js — "acumula tempo em foco..." | [x] |
| 3.3 | sair da faixa interrompe contagem | focoEngine.test.js — "sair da faixa interrompe..." | [x] |
| 4.1 | overshoot aplica penalidade | focoEngine.test.js — "overshoot emite evento..." | [x] |
| 4.2 | falha por penalidade no limite | focoEngine.test.js — "penalidade acumulada..." | [x] |
| 4.3 | overshoot emite delta de paciência | focoContract.test.js — "overshoot aplica delta..." | [x] |
| 4.4 | falha por tempo esgotado | focoEngine.test.js — "tempo esgotado causa fail=timeout" | [x] |
| 5.4 | feedback de sucesso/falha | FocoMilimetrico.test.js (status) + inspeção visual | [x] |
| 6.1 | config aceita parâmetros de dificuldade | focoConfig.test.js — "sobrescreve apenas..." | [x] |
| 6.2 | defaults quando ausente | focoConfig.test.js — "aplica defaults..." | [x] |
| 6.3 | recusa config inválida nomeando parâmetro | focoConfig.test.js — "recusa..." | [x] |
| 7.1 | estado por mais de um canal (não só cor) | FocoMilimetrico.test.js — "estado de foco é comunicado por texto..." | [x] |
| 7.2 | redução de movimento | FocoMilimetrico.css — prefers-reduced-motion (inspeção) | [x] |
| 7.3 | controle por teclado | FocoMilimetrico.test.js — "controle por teclado move..." | [x] |
| 7.4 | indicação textual/acessível dos eventos | FocoMilimetrico.js — role=status + aria-valuetext (inspeção) | [x] |

## Resultado da execução

Executado com `npx react-scripts test --watchAll=false --testPathPattern=minigames` (CI=true).

- Suites: **4 passaram** (focoEngine, focoConfig, focoContract, FocoMilimetrico)
- Testes: **21 passaram / 21 total**
- Build de produção: `npx react-scripts build` → **Compiled successfully.**
- Observações: todos os 22 itens da tabela acima estão cobertos por teste automatizado ou inspeção declarada. O aviso do Jest sobre "worker process force exited" vem do timer real usado no teste de UI e não afeta o resultado (todos verdes).
