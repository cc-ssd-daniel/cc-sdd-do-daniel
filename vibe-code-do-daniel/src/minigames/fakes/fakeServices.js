// fakeServices.js — Serviços fake para execução e teste isolados dos minigames.
// Permite rodar o Foco antes dos adapters reais (patience/audio/storage).
// Requirements: 1.1, 4.3

/**
 * Cria um conjunto de serviços fake que registram as chamadas recebidas,
 * para inspeção em testes e no harness isolado.
 * @returns {{
 *   patience: { applyDelta: (n:number)=>void, deltas: number[], total: number },
 *   audio: { play: (id:string)=>void, vibrate: (ms:number)=>void, played: string[], vibrations: number[] },
 *   storage: { get: (k:string)=>unknown, set: (k:string,v:unknown)=>void, data: Record<string, unknown> }
 * }}
 */
export function createFakeServices() {
  const patience = {
    deltas: /** @type {number[]} */ ([]),
    total: 0,
    applyDelta(n) {
      this.deltas.push(n);
      this.total += n;
    },
  };

  const audio = {
    played: /** @type {string[]} */ ([]),
    vibrations: /** @type {number[]} */ ([]),
    play(id) {
      this.played.push(id);
    },
    vibrate(ms) {
      this.vibrations.push(ms);
    },
  };

  const storage = {
    data: /** @type {Record<string, unknown>} */ ({}),
    get(key) {
      return this.data[key];
    },
    set(key, value) {
      this.data[key] = value;
    },
  };

  return { patience, audio, storage };
}
