# Contrato dos minigames

Este documento define a fronteira entre o `CoreLoop` e os minigames.

## Contrato público do CoreLoop

Cada wrapper de minigame usado pelo core implementa:

```ts
interface MinigameContract {
  start(): void;
  onSuccess(callback: (result: MinigameResult) => void): void;
  onFailure(callback: (result: MinigameResult) => void): void;
  restart(): void;
  unmount?(): void;
}
```

O tipo correspondente está em `src/core/contract.ts`.

`start()` monta ou inicia a interface no contêiner fornecido pelo core. `onSuccess` e `onFailure` registram os resultados da rodada. `restart()` inicia uma nova tentativa. `unmount()` é opcional para permitir a limpeza da raiz React, listeners e timers.

## Resultado público

```ts
interface MinigameResult {
  success: boolean;
  score: number;
}
```

O wrapper pode receber um resultado interno mais detalhado, mas deve convertê-lo para esse formato antes de chamar o core.

## Contrato interno dos componentes

Alguns minigames possuem uma camada interna mais rica, especialmente os componentes desenvolvidos isoladamente:

```text
start(config, services)
complete(result)
fail(reason)
reset()
dispose()
```

Esse contrato não substitui o contrato público do core. A classe em `src/minigames/<nome>/<nome>.tsx` funciona como adapter entre o componente React e o `CoreLoop`.

## Paciência da Turma

Minigames podem emitir o evento global `game:delta-patience` com o formato:

```ts
{ detail: { delta: number } }
```

O minigame informa apenas o delta. O `PatienceMeter` é responsável por limitar o valor entre 0 e 100, atualizar o HUD e emitir game over quando a paciência chega a zero.

## Regras de isolamento

- Um minigame não importa a implementação interna de outro.
- O core não conhece regras específicas de timing, foco ou seleção.
- `unmount`/`dispose` deve cancelar timers, listeners e efeitos ativos.
- O acumulado de paciência de um resultado não deve ser reaplicado pelo consumidor se os deltas individuais já foram emitidos.
