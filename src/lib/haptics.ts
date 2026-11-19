/** Progressive enhancement — no-op when Vibration API is unavailable. */
export function haptic(ms: number | number[] = 10) {
  if (typeof navigator === "undefined") return;
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* ignore */
  }
}
