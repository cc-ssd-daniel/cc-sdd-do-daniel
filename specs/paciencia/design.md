# Design: Paciência da Turma

## Arquitetura e Estado

O módulo será um Singleton gerindo o estado global, ou um CustomEvent listener atrelado ao `window` (ou um gerenciador no core loop).
Foi decidido usar o sistema de eventos do DOM (ou equivalente no Core Loop) para desacoplamento.

### Estrutura de Dados
```typescript
interface PatienceState {
    current: number; // 0 a 100
    max: number; // 100
}
```

### Contrato de Eventos
- Escutar: `game:delta-patience` -> Lida com `{ detail: { delta: number } }`
- Emitir: `game:patience-changed` -> `{ detail: { current: number } }`
- Emitir: `game:game-over` -> Disparado quando `current === 0`

### Módulos
- `src/core/patience.ts`: Contém a classe `PatienceMeter` que inicializa o estado, escuta eventos e despacha as atualizações.

## Integração
O `CoreLoop` instanciará o `PatienceMeter` e escutará `game:game-over` para transitar para a tela de Derrota.
A tela (HUD) escutará `game:patience-changed` para atualizar a barra de vida.
