import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultWebsite } from '../src/lib/cms/defaults';
import { websiteSchema, cloudinaryVideo } from '../src/lib/cms/model';
import { isWebsiteEvent } from '../src/lib/cms/webhook';

test('migration snapshot retains approved content and seven videos', () => {
  const page = websiteSchema.parse(defaultWebsite);
  assert.equal(page.founderTitle, "Hi, I'm Kasite Ugo-Beke.");
  assert.equal(page.womenReached, 250);
  assert.equal(page.outreachCount, 2);
  assert.equal(page.videos.length + page.outreachMoments.length + (page.testimonial ? 1 : 0), 7);
  assert.equal(page.volunteerFormUrl, 'https://forms.gle/mC6JL1Rn1bkPRVxu7');
  assert.equal(page.founderBiography.length, 3);
});

test('rejects malformed public data rather than caching or rendering it', () => {
  for (const patch of [{ womenReached: -1 }, { email: 'invalid' }, { volunteerFormUrl: 'javascript:alert(1)' }, { heroTitle: ' ' }, { seoTitle: '' }, { founderPhoto: { src: 'https://evil.test/image.jpg', width: 1, height: 1, alt: 'portrait' } }]) {
    assert.equal(websiteSchema.safeParse({ ...defaultWebsite, ...patch }).success, false);
  }
});

test('only accepts Cloudinary upload MP4 links and unique video ids', () => {
  assert.equal(cloudinaryVideo.safeParse(defaultWebsite.videos[0].src).success, true);
  for (const url of ['https://res.cloudinary.com.evil.test/a/video/upload/test.mp4', 'http://res.cloudinary.com/a/video/upload/test.mp4', 'https://res.cloudinary.com/a/image/upload/test.mp4']) assert.equal(cloudinaryVideo.safeParse(url).success, false);
  assert.equal(websiteSchema.safeParse({ ...defaultWebsite, outreachMoments: [defaultWebsite.videos[0]] }).success, false);
});

test('webhook events only target the published singleton', () => {
  assert.equal(isWebsiteEvent({ _id: 'websiteContent', _type: 'websiteContent' }), true);
  for (const value of [null, {}, { _id: 'drafts.websiteContent', _type: 'websiteContent' }, { _id: 'other', _type: 'websiteContent' }]) assert.equal(isWebsiteEvent(value), false);
});
