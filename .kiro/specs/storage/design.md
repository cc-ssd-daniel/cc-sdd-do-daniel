# Persistência — PER-01 e PER-02

Responsável: Cadu. Spec completa do adapter de configurações e progresso. Código, spec e testes ficam nesta pasta exclusiva; nenhuma tela é dependência.

## Requisitos
### 1. Configurações e recuperação
- 1.1 When executado pela primeira vez, the adapter shall retornar configurações padrão e progresso vazio sem exigir escrita.
- 1.2 When configurações válidas são salvas, the adapter shall recuperar os mesmos valores em outra instância.
- 1.3 If dados estão corrompidos, incompletos ou têm versão desconhecida, the adapter shall retornar padrões para campos inválidos sem lançar erro nem apagar dados automaticamente.
### 2. Progresso
- 2.1 When uma pontuação válida é registrada, the adapter shall preservar a maior pontuação, contar a partida e acumular conclusões para o identificador informado.
- 2.2 If identificador, pontuação ou configuração de entrada é inválido, the adapter shall rejeitar a gravação e preservar os dados anteriores.
### 3. Isolamento
- 3.1 If armazenamento é indisponível ou excede a cota, the adapter shall manter a sessão em memória e informar que a gravação não foi persistida.
- 3.2 When usado sem navegador, the adapter shall funcionar com Storage injetado e sem telas.
- 3.3 When dados são retornados, the adapter shall fornecer cópias independentes para evitar mutações externas do estado.

## Design e schema
Boundary: `src/storage`. Out of Boundary: migração de consumidores preexistentes, telas, regras de pontuação dos jogos e estado global. Allowed Dependencies: schema próprio, API Storage nativa injetada. Revalidation Triggers: alteração de chaves, schema, versão ou defaults requer testes de recuperação e round trip.

Chaves exclusivas: `projetor-simulator:settings` e `projetor-simulator:progress`. Ambas guardam `{version: 1, data: ...}` em JSON. Não usar clear(), nem apagar chaves de outros aplicativos. Versão desconhecida resulta em padrões de leitura; gravação explícita substitui apenas a chave correspondente pela versão 1. Não há formatos anteriores versionados neste repo, portanto não há migração presumida.

Settings: `{reducedFlash:false, reducedMotion:false, reducedTimePressure:false, soundCues:true}`. Campos conhecidos aceitam somente boolean; desconhecidos são ignorados na leitura e rejeitados na escrita. `saveSettings(patch)` mescla com valores válidos existentes.

Progress: `{games:{[gameId]:{bestScore:0, plays:0, completions:0}}}`. IDs aceitos: 1–64 caracteres ASCII alfanuméricos, hífen ou sublinhado, começando com letra/número; `__proto__`, `constructor` e `prototype` são proibidos. Scores finitos não negativos; contagens inteiras seguras, conclusões <= partidas. Entradas inválidas são ignoradas individualmente. Incrementos saturam em MAX_SAFE_INTEGER.

API `createStorageAdapter({storage}?)`: `getSettings()`, `saveSettings(patch)`, `getProgress()`, `recordResult(gameId,{score,completed})`. Leituras retornam dados. Escritas retornam `{data, persisted, reason}`; reason é null ou `storage-unavailable`. Entrada inválida lança TypeError antes de gravar. Getter de window.localStorage protegido por try/catch e executado só ao construir sem storage explícito. `storage: null` força memória, inclusive em testes.

Após falha de leitura/escrita, o adapter desabilita Storage naquela instância e mantém a memória mais recente; isso evita voltar para um valor antigo após gravação recusada. Nova instância tenta novamente. Leituras normais consultam Storage para ver gravações de outras instâncias; updates são síncronos, sem garantia transacional entre abas simultâneas. Uma configuração salva não altera progresso e vice-versa.

## Plano e aceite
- [x] PER-01: schema, chaves, versão, padrões, corrupção e regra de recorde documentados.
- [ ] PER-02: implementar adapter e testar 1.1–3.3 sem React/DOM.

Arquivo `storageAdapter.js`: validação, normalização, acesso protegido e memória. Arquivo `storageAdapter.test.js`: memória fake, reload, corrupção, versão futura, schema parcial, recorde, erros de Storage, isolamento e rejeição de entrada. Evidências consolidadas em `.kiro/specs/roleta/evidence.md`.
