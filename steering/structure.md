# Project Structure

## Organization Philosophy

O projeto é organizado por domínios exclusivos. Cada integrante é dono de sua área, garantindo independência e evitando conflitos de alteração.

## Directory Patterns

### Core / Fundação
**Location**: `src/core/`
**Responsável**: Vitor
**Purpose**: Contrato comum, medidor de paciência da turma e fluxo principal (core loop).
**Limites**: Outros pacotes não devem alterar esta pasta. O core é exposto via interfaces e eventos padronizados.

### Minigames
**Location**: `src/minigames/`
**Responsável**: Lívia (Foco), Nathan (Reboot), Cadu (Roleta)
**Purpose**: Lógica interna e componentes dos minigames.
**Limites**: Cada minigame (`src/minigames/foco`, `src/minigames/reboot`, `src/minigames/roleta`) é alterável apenas por seu dono. Eles não dependem uns dos outros, comunicando-se apenas via contrato comum (core).

### Persistência
**Location**: `src/persistence/`
**Responsável**: Cadu
**Purpose**: Adapter de acesso ao localStorage (progresso e configurações).
**Limites**: Nenhuma outra área acessa o localStorage diretamente. O consumo é feito exclusivamente por este adapter.

### Telas / UX
**Location**: `src/ui/`
**Responsável**: Vitor (Modo Conserto), Lívia (fluxo completo)
**Purpose**: Interface de navegação, telas do jogo principal e montagem do fluxo.
**Limites**: A UI consome o core e os minigames, mas não contém lógica de negócio dos jogos.

## Naming Conventions

- **Arquivos TS/JS**: kebab-case (ex: `roleta-game.ts`)
- **Classes/Interfaces**: PascalCase (ex: `RoletaState`, `MinigameContract`)
- **Funções/Variáveis**: camelCase (ex: `startGame`, `patienceLevel`)

## Code Organization Principles

- **Independência de Módulos**: Minigames não acessam o estado um do outro e nem o core diretamente. Tudo ocorre via eventos ou funções expostas pelo contrato comum.
- **Isolamento de Persistência**: Toda leitura/escrita no localStorage passa pelo `src/persistence/`.

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
