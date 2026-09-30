export const ROULETTE_FIXTURE = Object.freeze({ target: 'HDMI 2' });

export function createFakePatience(initialValue = 100) {
  let value = initialValue;
  return {
    onEvent(event) {
      if (event.type === 'phase:patience-delta') value += event.payload.delta;
    },
    snapshot: () => value,
  };
}
