/** Pure winner selection, shared by the browser coordinator and regression tests. */
export type PlaybackCandidate = { id: string; ratio: number; failed: boolean };
/** Picks the single muted preview: a hovered tile first, otherwise the most visible one. */
export function selectVideo(candidates: PlaybackCandidate[], hovered: string | null, automatic: boolean, visible: boolean): string | null {
  if (!visible || !automatic) return null;
  const eligible = candidates.filter(item => item.ratio >= 0.15 && !item.failed);
  if (hovered && eligible.some(item => item.id === hovered)) return hovered;
  return eligible.reduce<PlaybackCandidate | null>((best, item) => !best || item.ratio > best.ratio ? item : best, null)?.id ?? null;
}
