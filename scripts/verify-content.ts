import { loadEnvConfig } from '@next/env';
import { createClient } from '@sanity/client';
import { websiteSchema } from '../src/lib/cms/model';
import { websiteQuery } from '../src/lib/cms/query';

async function main() {
  loadEnvConfig(process.cwd());
  const { defaultWebsite } = await import('../src/lib/cms/defaults');
  const client = createClient({ projectId: process.env.SANITY_PROJECT_ID, dataset: process.env.SANITY_DATASET, apiVersion: '2026-02-01', useCdn: false, perspective: 'published' });
  const website = websiteSchema.parse(await client.fetch(websiteQuery));
  // Asset URLs necessarily change on import. Compare all non-image editorial content.
  const images = new Set(['heroPhoto', 'founderPhoto', 'logoPhoto', 'socialPhoto', 'communityPhotos']);
  const changed = Object.keys(defaultWebsite).filter(key => !images.has(key) && JSON.stringify(website[key as keyof typeof website]) !== JSON.stringify(defaultWebsite[key as keyof typeof defaultWebsite]));
  console.log(changed.length ? `Valid CMS content; editorial changes from original: ${changed.join(', ')}` : 'Published CMS content validates and matches the initial editorial snapshot.');
}
main().catch(() => { console.error('Verification failed: check project configuration and published content.'); process.exitCode = 1; });
