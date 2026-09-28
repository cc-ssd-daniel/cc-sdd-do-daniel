export const rebootConfig = {
  targetHoldMs: 3500,
  safeWindowStartMs: 3000,
  safeWindowEndMs: 4000,
  warningThresholdMs: 2500,
  retryEnabled: true,
};

export function evaluateRebootResult(durationMs, config = rebootConfig) {
  if (durationMs < config.safeWindowStartMs) {
    return {
      success: false,
      reason: 'too-early',
      holdDurationMs: durationMs,
    };
  }

  if (durationMs > config.safeWindowEndMs) {
    return {
      success: false,
      reason: 'too-late',
      holdDurationMs: durationMs,
    };
  }

  return {
    success: true,
    reason: 'success',
    holdDurationMs: durationMs,
  };
}
