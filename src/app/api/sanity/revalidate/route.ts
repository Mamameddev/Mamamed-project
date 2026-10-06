import { revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';
import type { NextRequest } from 'next/server';
import { WEBSITE_TAG } from '@/lib/cms/model';
import { isWebsiteEvent } from '@/lib/cms/webhook';

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret || process.env.SANITY_ENABLED !== 'true') return new Response('CMS webhook is not configured', { status: 503 });
  try {
    const { isValidSignature, body } = await parseBody(request, secret);
    if (!isValidSignature) return new Response('Invalid signature', { status: 401 });
    if (!isWebsiteEvent(body)) return Response.json({ ignored: true });
    revalidateTag(WEBSITE_TAG, 'max');
    return Response.json({ revalidated: true });
  } catch {
    return new Response('Invalid webhook request', { status: 400 });
  }
}
