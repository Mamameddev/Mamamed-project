import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { OutreachVideos, MoreOutreachVideos } from '../src/components/media/OutreachVideos';
import type { OutreachVideo } from '../src/lib/content';

const videos: OutreachVideo[] = [{
  id: 'outreach', title: 'Community story', description: 'A visit with our team.',
  src: 'https://res.cloudinary.com/test/video/upload/outreach.mp4',
  poster: 'https://res.cloudinary.com/test/image/upload/poster.webp',
  duration: '0:21',
  transcript: 'Welcome to our community.',
}];

test('empty media shows an honest message without a fake player', () => {
  const html = renderToStaticMarkup(createElement(OutreachVideos, { videos: [] }));
  assert(html.includes('Stories from our community'));
  assert(!html.includes('<video'));
});

test('initial video card only renders a lazy poster and accessible play action', () => {
  const html = renderToStaticMarkup(createElement(OutreachVideos, { videos }));
  assert(html.includes('aria-label="Play Community story"'));
  assert(html.includes('loading="lazy"'));
  assert(html.includes('0:21'));
  assert(html.includes('Welcome to our community.'));
  assert(!html.includes('<video'));
  assert(!html.includes('<source'));
  assert(!html.includes('outreach.mp4'));
});

test('additional clips do not mount or fetch posters before expansion', () => {
  const html = renderToStaticMarkup(createElement(MoreOutreachVideos, { videos }));
  assert(html.includes('aria-expanded="false"'));
  assert(!html.includes('<img'));
  assert(!html.includes('<video'));
});
