# Technology Stack

## Stack

This project uses a standard Single Page Application (SPA) built with Create React App and organized around short, self-contained mini-game components. The gameplay loop is intentionally simple: states, timing windows, retry logic, and visual feedback live within a component rather than a full backend.
Webpack, Babel e ESLint (`react-app`, `react-app/jest`) vêm de react-scripts. Testes usam Jest 27 e Testing Library. Node.js/npm executam ferramentas; este pacote foi desenvolvido com Node 24.19.0/npm 11.17.0. Os comandos abaixo são relativos a `vibeCodingDoDaniel/vibe-code-do-daniel` a partir da raiz Git.
SPA em JavaScript/React, criada com Create React App. O `vibe-code-do-daniel/package.json` declara React e React DOM `^19.3.0` e `react-scripts` `5.0.1`; o `package-lock.json` é a fonte das versões instaladas. A stack é mantida sem ejection e sem framework adicional.

Webpack, Babel e ESLint (`react-app`, `react-app/jest`) vêm do `react-scripts`. Testes usam Jest com Testing Library. Node.js/npm executam as ferramentas. Os comandos abaixo são relativos a `vibeCodingDoDaniel/vibe-code-do-daniel` a partir da raiz do repositório.

- **Language**: JavaScript (ES6+)
- **Framework**: React 19.3
- **Runtime**: Node.js
- **Build tool**: `react-scripts` via Create React App
O motor da Roleta expõe start(config, services), complete(result), fail(reason), reset(), dispose(). O adapter preserva os nomes/envelope dos eventos do contrato local: `{type, gameId, payload, at}`. O ID é `roleta-input`. O resultado inclui pontuação, duração, erros, evidências e delta acumulado. Eventos individuais de delta são aplicáveis; o acumulado do resultado é somente auditoria.
## Organização por pacote

Cada minigame vive em `src/minigames/<nome>` e tem sua spec em `.kiro/specs/<nome>`. A persistência é um pacote independente em `src/storage`. O jogo principal (App, telas, registro de jogos, core loop) é um pacote à parte e não é alterado pelos pacotes de minigame.

Pacotes atuais:
- `src/minigames/foco` — minigame Foco Milimétrico
- `src/minigames/roleta` — minigame Roleta do Input
- `src/storage` — adapter de persistência
- `src/minigames/fakes` — serviços fake compartilhados para desenvolvimento isolado

## Contrato comum dos minigames

Todo minigame expõe o mesmo contrato: `start(config, services)`, `complete(result)`, `fail(reason)`, `reset()`, `dispose()`. Os minigames recebem os serviços (paciência, áudio, persistência) por injeção em `start` e não acessam estado global nem o código interno de outro minigame. A comunicação com a Paciência da Turma é feita apenas por deltas emitidos; o dono da Paciência decide a derrota global. A integração final no registro do jogo principal é a tarefa INT-01.

Durante o desenvolvimento, cada pacote roda isolado com serviços fake e um harness próprio, sem depender do core.

- **@testing-library/react**: Component and interaction testing for mini-game behavior
- **@testing-library/user-event**: User interaction tests when the game needs more realistic events
- **web-vitals**: Basic performance measurement support
## Persistência

Somente `src/storage/storageAdapter.js` acessa `window.localStorage`. Consumidores recebem `createStorageAdapter({ storage }?)`; os testes injetam um Storage fake ou nulo. A interface pública (`getSettings`, `saveSettings`, `getProgress`, `recordResult`) não exige React nem DOM. Dados inválidos (JSON quebrado, versão desconhecida, campos fora do schema) caem em padrões seguros, e falha de armazenamento mantém o estado em memória. Detalhes de schema, chaves e limitações entre abas estão em `src/storage/SPEC.md`.

## Padrões de qualidade

- **Lint**: ESLint com as regras padrão `react-app`.
- **Testes**: Jest + React Testing Library. Lógica pura (engines, adapters) é testada sem render; componentes de UI são testados com Testing Library.
- **Sem ejeção**: mantém-se o Create React App para evitar sobrecarga de configuração de build.

### Code Quality
- Prefer focused, readable component logic.
- Keep state transitions explicit and easy to test.
- Use CSS and classes for game feedback instead of hidden logic spread across the app.

### Testing
- Validate mini-game rules with Jest and React Testing Library.
- Test timing outcomes such as early release, late release, and success inside the safe window.

## Development Environment
## Execução e validação

```sh
npm ci
npm start
npm test -- --watchAll=false
npm run build
```

O CRA descobre testes apenas dentro de `src/`. Alguns pacotes mantêm testes fora de `src/` (por exemplo, `tests/roleta`) e fornecem uma configuração de Jest própria; consulte a spec do pacote correspondente para o comando específico.

- Keep the project as a lightweight web app so gameplay prototypes can be built quickly.
- Use component-level state for the game loop and retry logic rather than introducing extra infrastructure.
- Favor clear state transitions and explicit event boundaries for each mini-game.
Build isolado e executável da Roleta:
```sh
node tests/roleta/build-harness.cjs
node tests/roleta/serve-harness.cjs
```
Abrir http://localhost:4173. O build usa o compilador CRA existente com entrada própria e saída `build/roleta`; não altera App. O servidor escuta apenas loopback e serve essa saída. `npm run build` valida a aplicação existente; build-harness também compila a nova Roleta, mesmo antes da integração INT-01.
## Rastreabilidade

As decisões e evidências de cada pacote ficam nas respectivas specs em `.kiro/specs/<nome>` (requirements, design, tasks e evidências). O steering descreve os padrões comuns; os detalhes específicos de cada módulo vivem na sua spec.
