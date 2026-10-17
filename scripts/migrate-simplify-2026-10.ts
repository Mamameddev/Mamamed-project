/**
 * One-off migration for Kasite's October 2026 simplification (About copy, Gallery, Tobi's story, menu).
 * Patches only the affected fields of the live Website Content (and any unpublished draft), keeping other edits.
 *
 *   npm run cms:migrate            # dry run: prints the changes, writes nothing
 *   npm run cms:migrate -- --apply # writes the changes
 *
 * Run it right after deploying the code that introduced it.
 */
import { loadEnvConfig } from '@next/env';
import { createClient, type SanityClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { WEBSITE_ID } from '../src/lib/cms/model';

type Doc = Record<string, unknown> & { _id: string; _rev: string };
type Video = Record<string, unknown> & { id?: string; src?: string; _key?: string; _type?: string };

/** Approved copy changes. Anything else Kasite has edited is left as it is. */
const copy = {
  directionTitle: 'About MamaMeds',
  directionStatus: 'MamaMeds is a registered 501(c)(3) nonprofit working to reduce maternal mortality in Nigeria.',
  // The live body already absorbed the 501(c)(3) sentence; reset it so the sentence isn't shown twice.
  directionBody: 'Today, we deliver antenatal medications and education through community outreach. Next, we’re building a model to help community health workers prevent postpartum hemorrhage, one of the leading causes of maternal death, starting with a pilot in 2027.',
  galleryTitle: 'Gallery',
  galleryIntro: 'Moments from our outreach.',
  testimonialEyebrow: 'In her words',
  testimonialIntro: 'Tobi shares her experience with MamaMeds.',
  navAbout: 'About', navImpact: 'Our impact', navGallery: 'Gallery', navFounder: 'Founder', navInvolved: 'Get involved', navContact: 'Contact',
};
const removed = ['directionEyebrow', 'womenLabel', 'outreachesLabel', 'womenReached', 'womenReachedSuffix', 'outreachCount', 'storiesEyebrow', 'storiesTitle', 'storiesIntro', 'testimonialTitle', 'testimonialButton', 'galleryHint', 'navVolunteer', 'videos'];
/** The four short clips Kasite asked to remove. */
const retiredClips = ['leaving-outreach', 'community-moment', 'care-to-take-home', 'mamameds-in-hand'];

async function main() {
  loadEnvConfig(process.cwd());
  const apply = process.argv.includes('--apply');
  const { defaultWebsite } = await import('../src/lib/cms/defaults');
  const { cloudinaryVideoFile, cloudinaryVideoSources } = await import('../src/lib/content');
  const { SANITY_PROJECT_ID: projectId, SANITY_DATASET: dataset, SANITY_IMPORT_TOKEN: token } = process.env;
  if (!projectId || !dataset || !token) throw new Error('Set project ID, dataset and local-only SANITY_IMPORT_TOKEN first.');
  const client = createClient({ projectId, dataset, token, apiVersion: '2026-02-01', useCdn: false, perspective: 'raw' });

  /** Uses the light silent preview and adds the compressed viewer file. */
  const withSources = <T extends Video>(video: T): T => {
    const file = typeof video.src === 'string' ? cloudinaryVideoFile(video.src) : null;
    if (!file) return video;
    const sources = cloudinaryVideoSources(file);
    return { ...video, src: sources.src, fullSrc: video.fullSrc ?? sources.fullSrc };
  };

  const uploads = new Map<string, string>();
  const uploadPhoto = async (src: string) => {
    if (!uploads.has(src)) {
      const bytes = src.startsWith('/images/') ? await readFile(resolve('public', src.slice(1))) : await fetch(src).then(async response => { if (!response.ok) throw new Error(`Could not download ${src}`); return Buffer.from(await response.arrayBuffer()); });
      const asset = await client.assets.upload('image', bytes, { filename: src.split('/').pop() });
      uploads.set(src, asset._id);
    }
    return uploads.get(src)!;
  };

  const docs = (await client.fetch<Doc[]>('*[_id in $ids]', { ids: [WEBSITE_ID, `drafts.${WEBSITE_ID}`] }));
  if (!docs.length) throw new Error('No Website Content found. Nothing changed.');

  for (const doc of docs) {
    const featured = ((doc.videos ?? []) as Video[]).map(video => ({ ...withSources(video), _type: 'outreachVideo' }));
    const kept = ((doc.gallery ?? []) as Video[]).filter(item => !(item._type === 'outreachVideo' && retiredClips.includes(item.id ?? ''))).map(item => item._type === 'outreachVideo' ? withSources(item) : item);
    const present = new Set([...featured, ...kept].map(item => item._type === 'outreachVideo' ? item.id : item._key));
    const added = defaultWebsite.gallery.filter(item => !present.has(item.kind === 'video' ? item.video.id : item.id));
    const milestones = ((doc.milestones ?? []) as Record<string, unknown>[]).map(step => step.label === '2027 plan' ? { ...step, title: 'Pilot launch', text: undefined } : step);
    const testimonial = doc.testimonial ? { ...withSources(doc.testimonial as Video), description: undefined, duration: undefined } : undefined;

    const changes = { ...copy, milestones, ...(testimonial && { testimonial }) };
    console.log(`\n${doc._id} (rev ${doc._rev})`);
    for (const [key, value] of Object.entries(copy)) if (doc[key] !== value) console.log(`  ${key}: ${JSON.stringify(doc[key] ?? null)} → ${JSON.stringify(value)}`);
    console.log(`  gallery: ${featured.length} featured outreach video(s) moved in, ${((doc.gallery ?? []) as unknown[]).length - kept.length} short clip(s) removed, ${kept.length} kept, ${added.length} new: ${added.map(item => item.kind === 'video' ? item.video.id : item.photo.src).join(', ') || 'none'}`);
    console.log(`  milestones: ${milestones.map(step => step.title).join(' · ')}`);
    console.log(`  testimonial: ${testimonial ? 'caption removed, full-size source added' : 'none'}`);
    console.log(`  remove: ${removed.filter(key => key in doc).join(', ') || 'nothing'}`);
    if (!apply) continue;

    const newItems = [];
    for (const item of added) {
      newItems.push(item.kind === 'video'
        ? { ...item.video, _key: item.video.id, _type: 'outreachVideo' }
        : { _key: item.id, _type: 'galleryPhoto', photo: { _type: 'websitePhoto', alt: item.photo.alt, asset: { _type: 'reference', _ref: await uploadPhoto(item.photo.src) } } });
    }
    const gallery = [...featured.map(video => ({ ...video, _key: video._key ?? video.id })), ...kept, ...newItems];
    await patch(client, doc, { ...changes, gallery }, removed);
    console.log('  ✓ applied');
  }
  if (!apply) console.log('\nDry run only. Re-run with --apply to write these changes.');
}

/** Field-level patch, refused if the document changed while the migration was running. */
async function patch(client: SanityClient, doc: Doc, set: Record<string, unknown>, unset: string[]) {
  const clean = JSON.parse(JSON.stringify(set)) as Record<string, unknown>;
  await client.patch(doc._id).ifRevisionId(doc._rev).set(clean).unset(unset.filter(key => key in doc)).commit();
}

main().catch(error => { console.error(error instanceof Error ? error.message : 'Migration failed'); process.exitCode = 1; });
