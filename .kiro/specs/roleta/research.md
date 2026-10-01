# Descoberta local

Base inspecionada: commit 3df57ed, 27/09/2026. Remoto configurado: VitorAPC2/cc-sdd-do-daniel. Existem alterações anteriores em App e arquivos não rastreados em minigames, specs/fluxo-vertical e skill projetor-minigame; são preservados e excluídos do commit deste pacote.

O contrato local tem MinigameController.start/succeed/fail/restart/destroy e eventos em envelope `{type, gameId, payload, at}`. O backlog pede start/complete/fail/reset/dispose. Um adapter local oferece o ciclo de vida do backlog e preserva compatibilidade dos eventos sem modificar o controller; não promete aliases dos seus métodos. Não há import de código não versionado para que uma cópia limpa da branch funcione.

A Roleta inicial em games/InputRoulette.js fornece entradas e parâmetros de velocidade/delta, mas não falha por erros, não recebe acessibilidade e não possui testes próprios. Ela é preservada como trabalho preexistente; a nova entrega está na pasta exclusiva roleta.

Não foram adicionadas bibliotecas específicas para a Roleta. A implementação atual usa React/JSX dentro da aplicação Vite e serviços injetados. Não há `tests/roleta` nem runner Jest declarado no `package.json` atual; os registros históricos desses caminhos pertencem à base anterior e não devem ser usados como validação desta versão.

Decisões simplificadoras: seleção por nome em vez de geometria; resultado único por tentativa; timers canceláveis; fixture mínima observa deltas sem assumir limites do módulo global. Nenhuma migração de contrato ou de arquivos dos colegas.
