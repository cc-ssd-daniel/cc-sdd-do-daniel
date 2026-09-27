# Tecnologia — IA-04 (Cadu)

## Stack existente
SPA em JavaScript/React, criada com Create React App. `vibe-code-do-daniel/package.json` declara React/React DOM ^19.3.0 e react-scripts 5.0.1; package-lock.json é a fonte das versões instaladas. Manter a stack existente sem ejection, atualização incidental de dependências ou framework adicional.

Webpack, Babel e ESLint (`react-app`, `react-app/jest`) vêm de react-scripts. Testes usam Jest 27 e Testing Library. Node.js/npm executam ferramentas; este pacote foi desenvolvido com Node 24.19.0/npm 11.17.0. Os comandos abaixo são relativos a `vibeCodingDoDaniel/vibe-code-do-daniel` a partir da raiz Git.

## Fronteiras e contratos
Roleta: `src/minigames/roleta`; specs em `../.kiro/specs/roleta`; testes exclusivos em `tests/roleta`. Persistência: `src/storage`, incluindo SPEC.md e testes sem telas. O App, o registro de jogos e o controller comum não são alterados por este pacote.

O motor da Roleta expõe start(config, services), complete(result), fail(reason), reset(), dispose(). O adapter preserva os nomes/envelope dos eventos do contrato local: `{type, gameId, payload, at}`. O ID é `roleta-input`. O resultado inclui pontuação, duração, erros, evidências e delta acumulado. Eventos individuais de delta são aplicáveis; o acumulado do resultado é somente auditoria.

Roleta não importa estado global, código de outro minigame ou persistência. Integração final no registro é INT-01 de Vitor. O harness da Roleta consome Paciência fake. Configuração de pressão reduzida dobra intervalos e aceleração; controles e feedback são textuais, sem animações nem flashes.

## Persistência
Somente `src/storage/storageAdapter.js` acessa window.localStorage. Consumidores recebem `createStorageAdapter({storage}?)`; testes injetam Storage fake ou null. `getSettings`, `saveSettings`, `getProgress`, `recordResult` formam a interface pública, sem React/DOM obrigatório.

Chaves `projetor-simulator:settings` e `projetor-simulator:progress`, envelope `{version:1,data}`. Configurações padrão: reducedFlash/reducedMotion/reducedTimePressure false, soundCues true. Recordes nunca diminuem; partidas e conclusões são contadas por ID. JSON inválido, versão desconhecida e campos inválidos usam padrões seguros. Não há migração legada presumida. Falha de Storage mantém memória e retorna `persisted:false`; o consumidor decide se precisa avisar o usuário. Nunca usar clear() global. Veja `src/storage/SPEC.md` para schema e limitações entre abas.

## Execução e validação
```sh
npm ci
npm start
npm test -- --watchAll=false --runInBand
npm run build
```

CRA descobre testes apenas em src. Para incluir a pasta exclusiva de Roleta sem editar a configuração compartilhada:
```sh
node node_modules/jest/bin/jest.js --config tests/roleta/jest.config.cjs --runInBand --watchAll=false
```

Esse comando inclui somente os testes do Cadu. Para toda a cópia de trabalho, executar também o comando CRA acima ou acrescentar `--roots src tests/roleta` ao runner. Persistência declara ambiente Node em seu teste e não usa telas. Timers virtuais tornam os cenários da Roleta reproduzíveis.

Build isolado e executável da Roleta:
```sh
node tests/roleta/build-harness.cjs
node tests/roleta/serve-harness.cjs
```
Abrir http://localhost:4173. O build usa o compilador CRA existente com entrada própria e saída `build/roleta`; não altera App. O servidor escuta apenas loopback e serve essa saída. `npm run build` valida a aplicação existente; build-harness também compila a nova Roleta, mesmo antes da integração INT-01.

Evidências e status das tarefas do Cadu ficam em `../.kiro/specs/roleta/evidence.md`. Não declarar integração final ou aceite dos demais jogos com base nos testes isolados.
