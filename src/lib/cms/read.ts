import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { draftMode } from 'next/headers';
import { cmsEnabled, getSanityClient } from './client';
import { defaultWebsite } from './defaults';
import { websiteSchema, WEBSITE_TAG } from './model';
import { websiteQuery } from './query';

async function fetchWebsite(preview: boolean) {
  const result = await getSanityClient(preview).fetch(websiteQuery, {}, { cache: 'no-store' });
  // Throw on missing/invalid documents. Never replace good cached content with a fallback on failure.
  return websiteSchema.parse(result);
}

export const getWebsite = cache(async () => {
  if (!cmsEnabled()) return { website: defaultWebsite, preview: false };
  const preview = (await draftMode()).isEnabled;
  if (preview) return { website: await fetchWebsite(true), preview: true };
  // Cache the validated result, not the raw response. Next retains the last good value if background refresh fails.
  const readPublished = unstable_cache(() => fetchWebsite(false),
    ['website-v1', process.env.SANITY_PROJECT_ID!, process.env.SANITY_DATASET!],
    { tags: [WEBSITE_TAG], revalidate: 60 });
  return { website: await readPublished(), preview: false };
});
