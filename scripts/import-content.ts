import { loadEnvConfig } from '@next/env';
import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { omitEmptyMedia } from '../src/lib/cms/optional-media';
import { WEBSITE_ID } from '../src/lib/cms/model';

async function main() {
  loadEnvConfig(process.cwd());
  const { defaultWebsite } = await import('../src/lib/cms/defaults');
  if (process.argv.includes('--dry-run')) {
    console.log(`Validated local snapshot: ${Object.keys(defaultWebsite).length} fields, ${defaultWebsite.videos.length + defaultWebsite.gallery.length + (defaultWebsite.testimonial ? 1 : 0)} videos. No remote writes.`);
    return;
  }
  const { SANITY_PROJECT_ID: projectId, SANITY_DATASET: dataset, SANITY_IMPORT_TOKEN: token } = process.env;
  if (!projectId || !dataset || !token) throw new Error('Set project ID, dataset and local-only SANITY_IMPORT_TOKEN first.');
  const client = createClient({ projectId, dataset, token, apiVersion: '2026-02-01', useCdn: false, perspective: 'raw' });
  const exists = () => client.fetch<number>('count(*[_id in $ids])', { ids: [WEBSITE_ID, `drafts.${WEBSITE_ID}`] });
  if (await exists()) { console.log('Website content already exists (published or draft). Nothing changed.'); return; }
  const document: Record<string, unknown> = { ...defaultWebsite, _id: WEBSITE_ID, _type: 'websiteContent' };
  for (const key of ['heroPhoto', 'founderPhoto', 'logoPhoto', 'socialPhoto'] as const) {
    const photo = defaultWebsite[key];
    if (!photo) continue;
    const bytes = photo.src.startsWith('/images/') ? await readFile(resolve('public', photo.src.slice(1))) : await fetch(photo.src).then(async response => { if (!response.ok) throw new Error('Could not download approved image'); return Buffer.from(await response.arrayBuffer()); });
    const asset = await client.assets.upload('image', bytes, { filename: photo.src.split('/').pop() });
    document[key] = { _type: 'websitePhoto', asset: { _type: 'reference', _ref: asset._id }, alt: photo.alt };
  }
  for (const key of ['videos', 'milestones'] as const) {
    document[key] = defaultWebsite[key].map((value, index) => ({ ...value, _key: `${key}-${index}`, _type: key === 'milestones' ? 'milestone' : 'outreachVideo' }));
  }
  document.gallery = defaultWebsite.gallery.map((item, index) => { if (item.kind !== 'video') throw new Error('Seed expects video gallery'); return { ...item.video, _key: `gallery-${index}`, _type: 'outreachVideo' }; });
  if (defaultWebsite.testimonial) document.testimonial = { ...defaultWebsite.testimonial, _type: 'outreachVideo' };
  if (await exists()) { console.log('Content was created during import. Existing content preserved.'); return; }
  await client.createIfNotExists(omitEmptyMedia(document) as { _id: string; _type: string });
  console.log('Imported Website Content and image assets. CMS delivery remains controlled by SANITY_ENABLED.');
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Import failed'); process.exitCode = 1; });
