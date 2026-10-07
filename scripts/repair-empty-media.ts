import { loadEnvConfig } from '@next/env';
import { createClient } from '@sanity/client';
import { isDeepStrictEqual } from 'node:util';
import { emptyMediaPaths, omitEmptyMedia } from '../src/lib/cms/optional-media';

async function main() {
  loadEnvConfig(process.cwd());
  const { SANITY_PROJECT_ID: projectId, SANITY_DATASET: dataset, SANITY_IMPORT_TOKEN: token } = process.env;
  if (!projectId || !dataset || !token) throw new Error('Configure the local import token first.');
  const client = createClient({ projectId, dataset, token, apiVersion: '2026-02-01', perspective: 'raw', useCdn: false });
  for (const id of ['websiteContent', 'drafts.websiteContent']) {
    const document = await client.getDocument(id);
    if (!document) continue;
    const paths = emptyMediaPaths(document);
    if (!paths.length) { console.log(`${id}: no empty media values to repair.`); continue; }
    // A concurrent edit causes a revision conflict instead of being overwritten.
    const updated = await client.patch(id).ifRevisionId(document._rev).unset(paths).commit();
    const expected = omitEmptyMedia(document);
    if (!isDeepStrictEqual(expected, { ...updated, _rev: document._rev, _updatedAt: document._updatedAt })) {
      throw new Error('Unexpected repair result; inspect the document before further changes.');
    }
    console.log(`${id}: removed ${paths.join(', ')}; other fields preserved.`);
  }
}
main().catch(() => { console.error('Repair failed or content changed concurrently. No full-document overwrite was attempted.'); process.exitCode = 1; });
