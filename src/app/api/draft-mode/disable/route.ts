import { draftMode } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) return new Response('Forbidden', { status: 403 });
  (await draftMode()).disable();
  return NextResponse.redirect(new URL('/', request.url), { status: 303, headers: { 'Cache-Control': 'no-store' } });
}
