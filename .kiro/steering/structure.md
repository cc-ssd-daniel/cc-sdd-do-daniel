# Estrutura do projeto

## Organização canônica

```text
.
├── .kiro/
│   ├── settings/templates/   # modelos do workflow
│   ├── specs/                # uma pasta por feature
│   └── steering/             # memória estável do projeto
├── public/                   # arquivos públicos do navegador
├── src/
│   ├── assets/               # imagens e assets processados
│   ├── core/                 # contrato, loop e estado global do jogo
│   ├── minigames/            # implementações isoladas dos desafios
│   ├── main.ts               # ponto de entrada da aplicação
│   └── style.css             # estilos globais
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Limites de domínio

### Core / fundação
**Local:** `src/core/`  
**Responsabilidade:** contrato de integração, fluxo principal e medidor de Paciência da Turma.  
**Limite:** o core coordena minigames, mas não contém suas regras internas.

### Minigames
**Local:** `src/minigames/<nome>/` e `src/minigames/react-apps/<nome>/` quando houver componente React separado.  
**Responsabilidade:** regra, interface, configuração e testes específicos do desafio.  
**Limite:** minigames não dependem uns dos outros; comunicam resultado e efeitos globais apenas por adapters, callbacks ou eventos documentados.

Minigames integrados atualmente:

- `foco` — Foco Milimétrico
- `reboot` — Reboot de 10 segundos
- `roleta` — Roleta do Input

### Documentação e especificações
**Local:** `.kiro/steering/` e `.kiro/specs/`  
**Responsabilidade:** contexto permanente, requisitos, design, tarefas e evidências do desenvolvimento.

Não criar novas specs em `specs/` ou steering em `steering/`. Esses caminhos antigos foram consolidados em `.kiro/`.

## Convenções

- Arquivos TypeScript/JavaScript: kebab-case quando forem módulos; PascalCase para componentes React, seguindo o padrão já existente.
- Classes, interfaces e componentes: PascalCase.
- Funções e variáveis: camelCase.
- Testes: próximos ao módulo testado, com sufixo `.test`.
- Cada arquivo deve ter uma responsabilidade clara.

## Contratos de integração

O contrato público usado pelo `CoreLoop` está em `.kiro/steering/contract.md` e em `src/core/contract.ts`. Componentes React podem possuir um contrato interno mais rico, mas devem ser adaptados antes de serem usados pelo core.
