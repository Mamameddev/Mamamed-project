import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MediaGrid } from '../src/components/media/Gallery';
import type { GalleryItem, OutreachVideo } from '../src/lib/content';

const video: OutreachVideo = {
  id: 'outreach', title: 'Our first outreach', description: 'Internal note',
  src: 'https://res.cloudinary.com/test/video/upload/preview.mp4',
  fullSrc: 'https://res.cloudinary.com/test/video/upload/full.mp4',
  poster: 'https://res.cloudinary.com/test/image/upload/poster.webp',
  duration: '0:21',
};
const photo: GalleryItem = { kind: 'photo', id: 'photo', photo: { src: '/images/kasite-ugo-beke.webp', width: 591, height: 887, alt: 'MamaMeds volunteers supporting women at our outreach' } };
const render = (props: Parameters<typeof MediaGrid>[0]) => renderToStaticMarkup(createElement(MediaGrid, props));

test('an empty gallery renders nothing', () => {
  assert.equal(render({ items: [] }), '');
});

test('video tiles render a lazy poster and an accessible open action, but no video file', () => {
  const html = render({ items: [{ kind: 'video', video }] });
  assert(html.includes('aria-label="Play Our first outreach with sound"'));
  assert(html.includes('loading="lazy"'));
  assert(!html.includes('<video'));
  assert(!html.includes('.mp4'));
});

test('tiles stay clean: no titles, captions, durations or carousel controls', () => {
  const html = render({ items: [{ kind: 'video', video }, photo] });
  for (const text of ['Internal note', '0:21', 'Watch video', 'of 2', 'Swipe', 'Next outreach moment', '<h3']) assert(!html.includes(text), text);
});

test('photos carry descriptive alt text and open in the viewer', () => {
  const html = render({ items: [photo] });
  assert(html.includes('alt="MamaMeds volunteers supporting women at our outreach"'));
  assert(html.includes('aria-haspopup="dialog"'));
  assert(html.includes('<dialog'));
});

test('a single story tile can show its title', () => {
  const html = render({ items: [{ kind: 'video', video: { ...video, title: 'Tobi’s story' } }], showTitles: true });
  assert(html.includes('Tobi’s story</h3>'));
  assert(!html.includes('Internal note'));
});
