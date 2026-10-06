/** Pure winner selection, shared by the browser coordinator and regression tests. */
export type PlaybackCandidate = { id: string; ratio: number; paused: boolean; failed: boolean };
export function selectVideo(candidates: PlaybackCandidate[], manual: string | null, automatic: boolean, visible: boolean): string | null {
  if (!visible) return null;
  const eligible = candidates.filter(item => item.ratio >= 0.15 && !item.paused && !item.failed);
  if (manual && eligible.some(item => item.id === manual)) return manual;
  if (!automatic) return null;
  return eligible.reduce<PlaybackCandidate | null>((best, item) => !best || item.ratio > best.ratio ? item : best, null)?.id ?? null;
}
