import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import type { NextRequest } from 'next/server';
import { cmsEnabled, getSanityClient } from '@/lib/cms/client';

export async function GET(request: NextRequest) {
  if (!cmsEnabled() || !process.env.SANITY_API_READ_TOKEN) return new Response('Preview is not configured', { status: 503 });
  // Sanity validates its short-lived preview secret before setting Next's draft cookie.
  const { GET } = defineEnableDraftMode({ client: getSanityClient(true) });
  return GET(request);
}
