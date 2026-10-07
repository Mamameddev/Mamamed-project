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
  assert.equal(page.videos.length + page.gallery.length + (page.testimonial ? 1 : 0), 7);
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
  assert.equal(websiteSchema.safeParse({ ...defaultWebsite, gallery: [{ kind: 'video', video: defaultWebsite.videos[0] }] }).success, false);
});

test('webhook events only target the published singleton', () => {
  assert.equal(isWebsiteEvent({ _id: 'websiteContent', _type: 'websiteContent' }), true);
  for (const value of [null, {}, { _id: 'drafts.websiteContent', _type: 'websiteContent' }, { _id: 'other', _type: 'websiteContent' }]) assert.equal(isWebsiteEvent(value), false);
});

test('photo gallery entries require descriptive alt text and dimensions', () => {
  const photo = { kind: 'photo', id: 'community-photo', photo: defaultWebsite.founderPhoto, caption: 'A community moment' };
  assert.equal(websiteSchema.safeParse({ ...defaultWebsite, gallery: [photo] }).success, true);
  assert.equal(websiteSchema.safeParse({ ...defaultWebsite, gallery: [{ ...photo, photo: { ...photo.photo, alt: '' } }] }).success, false);
});

test('GROQ resolves uploaded images and preserves mixed gallery ordering', async () => {
  const { parse, evaluate } = await import('groq-js');
  const { websiteQuery } = await import('../src/lib/cms/query');
  const image = { _type: 'websitePhoto', alt: 'Women at an outreach', asset: { _type: 'reference', _ref: 'image-test' } };
  const doc = { ...defaultWebsite, _id: 'websiteContent', _type: 'websiteContent', heroPhoto: image, founderPhoto: image, logoPhoto: image, socialPhoto: image,
    workPhotos: { medications: image },
    gallery: [{ _type: 'galleryPhoto', _key: 'photo-one', photo: image }, { _type: 'outreachVideo', _key: 'video-one', ...defaultWebsite.gallery[0].kind === 'video' ? defaultWebsite.gallery[0].video : {} }],
  };
  const asset = { _id: 'image-test', _type: 'sanity.imageAsset', url: 'https://cdn.sanity.io/images/tpfdrq4k/mamameds_data/test-600x900.jpg', metadata: { dimensions: { width: 600, height: 900 } } };
  const result = await (await evaluate(parse(websiteQuery), { dataset: [doc, asset] })).get();
  const page = websiteSchema.parse(result);
  assert.equal(page.gallery[0].kind, 'photo');
  assert.equal(page.gallery[1].kind, 'video');
  assert.equal(page.workPhotos.medications?.width, 600);
  assert.equal(page.workPhotos.education, null);
  assert.equal(page.gallery[0].kind === 'photo' && page.gallery[0].caption, '');
});

test('Sanity import omits empty media without removing uploaded photos or edits', async () => {
  const { emptyMediaPaths, omitEmptyMedia } = await import('../src/lib/cms/optional-media');
  const photo = { _type: 'websitePhoto', asset: { _ref: 'uploaded-photo', _type: 'reference' }, alt: 'Outreach' };
  const document = { heroPhoto: photo, founderPhoto: null, testimonial: null, heroTitle: 'Recently edited', workPhotos: { medications: null, education: photo, outreach: null }, gallery: [{ photo }] };
  assert.deepEqual(emptyMediaPaths(document), ['founderPhoto', 'testimonial', 'workPhotos.medications', 'workPhotos.outreach']);
  const clean = omitEmptyMedia(document);
  assert.deepEqual(clean, { heroPhoto: photo, heroTitle: 'Recently edited', workPhotos: { education: photo }, gallery: [{ photo }] });
  assert.deepEqual(emptyMediaPaths(clean), []);
  assert.equal(document.workPhotos.medications, null, 'input is not mutated');
});
