# Tecnologia e padrões técnicos

## Stack atual

O projeto é uma SPA leve executada no navegador, construída com Vite, TypeScript e React. O jogo principal usa TypeScript para o shell e para os adapters de integração; os componentes internos de alguns minigames usam JSX/React e são montados por wrappers TypeScript.

- **Runtime**: Node.js e navegador
- **Linguagens**: TypeScript, JavaScript/JSX
- **UI**: React 19.3 e React DOM
- **Build/dev server**: Vite 8
- **Testes**: testes existentes dos motores e componentes; validar com os comandos disponíveis no `package.json`
- **Persistência**: não assumir backend ou banco; adapters de armazenamento devem ser explícitos e injetáveis

Comandos principais, executados na raiz do repositório:

```sh
npm install
npm run dev
npm run build
```

No Windows, se o shim de `node_modules/.bin` apresentar erro de caminho em uma pasta sincronizada, o Vite pode ser iniciado diretamente:

```powershell
node .\node_modules\vite\bin\vite.js --host 0.0.0.0
```

## Arquitetura de execução

O `src/main.ts` cria o `CoreLoop`. O core controla o menu, a sala, o modo de conserto e o game over. Durante o modo de conserto, ele instancia os minigames em sequência e reage aos callbacks de sucesso ou falha.

Cada minigame possui:

1. Uma implementação interna da mecânica e da interface.
2. Um wrapper/adaptador que monta o componente no contêiner do core.
3. Um resultado padronizado para sucesso ou falha.
4. Limpeza explícita de timers, listeners e raízes React ao sair da etapa.

Os minigames não devem importar a lógica interna uns dos outros. A comunicação com o fluxo principal acontece pelo contrato documentado em `.kiro/steering/contract.md`.

## Regras de implementação

- Manter transições de estado explícitas e fáceis de testar.
- Preferir lógica pura para avaliação de regras de timing, pontuação e limites.
- Manter CSS próximo do minigame quando o estilo for específico dele.
- Não acessar armazenamento global diretamente dentro de um minigame; usar um adapter ou serviço injetado quando essa capacidade existir.
- Expor erros e estados de falha de forma visível; não usar fallback silencioso para invalidar entradas.
- Preservar acessibilidade básica: teclado quando aplicável, feedback textual e não depender somente de cor.
- Atualizar a spec correspondente quando o contrato, a estrutura de arquivos ou o comportamento observável mudar.

## Rastreabilidade

Cada funcionalidade significativa deve ter sua pasta em `.kiro/specs/<feature>/`, com `spec.json`, `requirements.md`, `design.md` e `tasks.md`. `evidence.md` e `research.md` são opcionais quando houver validações ou investigação que precisem ficar registradas.

O steering descreve regras estáveis. Decisões específicas de uma feature pertencem à sua spec; detalhes de implementação pertencem ao código.
