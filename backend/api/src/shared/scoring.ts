export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}
