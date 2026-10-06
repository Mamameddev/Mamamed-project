import 'server-only';
import { createClient } from 'next-sanity';

export const cmsEnabled = () => process.env.SANITY_ENABLED === 'true';
export function getSanityClient(preview = false) {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  if (!projectId || !dataset) throw new Error('Set SANITY_PROJECT_ID and SANITY_DATASET before enabling the CMS');
  if (preview && !process.env.SANITY_API_READ_TOKEN) throw new Error('Set the server-only SANITY_API_READ_TOKEN for preview');
  return createClient({
    projectId, dataset, apiVersion: '2026-02-01', useCdn: false,
    perspective: preview ? 'drafts' : 'published',
    token: preview ? process.env.SANITY_API_READ_TOKEN : undefined,
  });
}
