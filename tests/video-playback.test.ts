import assert from 'node:assert/strict';
import test from 'node:test';
import { selectVideo } from '../src/lib/video-playback';
const candidates = [
  { id: 'a', ratio: 0.4, failed: false },
  { id: 'b', ratio: 0.8, failed: false },
  { id: 'c', ratio: 0.05, failed: false },
];
test('only the most visible eligible video previews, with deterministic ties', () => {
  assert.equal(selectVideo(candidates, null, true, true), 'b');
  assert.equal(selectVideo(candidates.map(c => ({ ...c, ratio: 1 })), null, true, true), 'a');
});
test('a hovered tile takes over while on screen; hidden tabs or an open viewer never preview', () => {
  assert.equal(selectVideo(candidates, 'a', true, true), 'a');
  assert.equal(selectVideo(candidates, 'c', true, true), 'b');
  assert.equal(selectVideo(candidates, 'a', true, false), null);
});
test('reduced motion/data saving blocks every muted preview, including hover', () => {
  assert.equal(selectVideo(candidates, null, false, true), null);
  assert.equal(selectVideo(candidates, 'a', false, true), null);
});
test('failed previews cannot restart automatically', () => {
  assert.equal(selectVideo(candidates.map(c => ({ ...c, failed: c.id === 'b' })), null, true, true), 'a');
  assert.equal(selectVideo(candidates.map(c => ({ ...c, failed: true })), null, true, true), null);
});
