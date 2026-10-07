import { cookies, draftMode } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) return new Response('Forbidden', { status: 403 });
  (await draftMode()).disable();
  // The Presentation iframe uses CHIPS cookies; expire that copy as well.
  const store = await cookies();
  if (store.has('sanity-preview-partitioned')) {
    store.set('__prerender_bypass', '', { path: '/', maxAge: 0, httpOnly: true, secure: true, sameSite: 'none', partitioned: true });
    store.set('sanity-preview-partitioned', '', { path: '/', maxAge: 0, httpOnly: true, secure: true, sameSite: 'none', partitioned: true });
  }
  return NextResponse.redirect(new URL('/', request.url), { status: 303, headers: { 'Cache-Control': 'no-store' } });
}
