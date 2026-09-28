// Event names and envelope mirror the existing common contract.
const EVENTS = {
  start: 'minigame:started',
  complete: 'minigame:succeeded',
  fail: 'minigame:failed',
  reset: 'minigame:restarted',
  patience: 'phase:patience-delta',
};

export function createContractAdapter(services = {}, now = Date.now) {
  return {
    emit(action, payload = {}) {
      services.onEvent?.({ type: EVENTS[action], gameId: 'roleta-input', payload, at: now() });
      if (action === 'complete') services.complete?.(payload);
      if (action === 'fail') services.fail?.(payload.reason);
    },
    cue(name) {
      // Audio is optional feedback: an unavailable device must not stop gameplay.
      try { services.audio?.cue?.(name); } catch { /* Text feedback remains available. */ }
    },
  };
}
