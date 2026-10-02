# Projetor Simulator: Chamados da TI

Protótipo finalizado de jogo web em que a pessoa jogadora resolve problemas cômicos de projetores em uma sala de aula, passando por uma sequência de seis minigames. A documentação cc-sdd registra o processo e as decisões do projeto; ela não indica trabalho de implementação ainda planejado.

## Requisitos e comandos

- Node.js e npm

```sh
npm install
npm run dev
npm run build
npm run preview
```

O script `build` executa a checagem TypeScript e, em seguida, gera a versão de produção com Vite. Atualmente, o `package.json` não define um script `test` nem configura um runner de testes. Registre as verificações disponíveis e seus resultados nas evidências da spec; a ausência de um runner, por si só, não significa que o projeto esteja incompleto.

## Estrutura

- `.kiro/steering/`: contexto estável do produto, arquitetura e contratos.
- `.kiro/specs/<feature>/`: requisitos, design, tarefas e, quando necessário, evidências de implementação/validação.
- `.kiro/settings/templates/`: modelos usados pelo workflow.
- `src/core/`: fluxo principal, estado do jogo e contratos compartilhados.
- `src/minigames/`: wrappers e implementações isoladas dos minigames.

## Workflow cc-sdd

Para uma ideia nova, o ciclo usado neste repositório é:

1. `/kiro-discovery "descrição da ideia"` para esclarecer problema e escopo.
2. `/kiro-spec-init "descrição da feature"` para iniciar a pasta da spec.
3. `/kiro-spec-requirements <feature>` para definir **o que** o sistema deve fazer.
4. `/kiro-spec-design <feature>` para definir **como** a solução será estruturada.
5. `/kiro-spec-tasks <feature>` para decompor o trabalho.
6. `/kiro-impl <feature>` para implementar as tarefas aprovadas.
7. `/kiro-validate-impl <feature>` para registrar a validação disponível: testes configurados, build, execução, cobertura e integração, conforme aplicável ao projeto.

`spec.json` acompanha o idioma, a fase e o estado das etapas. `generated` indica que o documento foi produzido; `approved` indica que ele foi explicitamente aprovado. São estados diferentes: a existência de um documento não prova sua aprovação. `ready_for_implementation` indica prontidão para começar a implementação, não que a feature já foi concluída.

Testes fazem parte da estratégia de design e das tarefas de implementação; seus resultados são evidência para a validação, não uma fase separada do cc-sdd. Registre também as evidências disponíveis de build, execução, cobertura dos requisitos e integração. Se alguma verificação não existir ou não puder ser executada, deixe explícito o limite da evidência, sem confundir essa limitação com tarefas de implementação em aberto.

Consulte `AGENTS.md` para as instruções detalhadas do projeto e `.kiro/steering/` antes de alterar arquitetura, contratos ou estrutura.
