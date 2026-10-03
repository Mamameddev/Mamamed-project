import { isIP } from 'node:net';

/** Keep every public URL on one validated origin. */
export function normalizeSiteUrl(value: string | undefined, production = false): string {
  const input = value?.trim();
  if (!input) {
    if (production) throw new Error('Set NEXT_PUBLIC_SITE_URL to your public HTTPS origin before building.');
    return 'http://localhost:3000';
  }

  let url: URL;
  try {
    url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `https://${input}`);
  } catch {
    throw new Error('NEXT_PUBLIC_SITE_URL must be a valid website origin.');
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.search || url.hash || !/^\/*$/.test(url.pathname)) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without credentials, a path, query, or fragment.');
  }

  const local = url.hostname === 'localhost' || url.hostname.endsWith('.localhost') ||
    url.hostname === '[::1]' || /^127\./.test(url.hostname);
  if (production && (local || isIP(url.hostname.replace(/^\[|\]$/g, '')) !== 0 || !url.hostname.includes('.') || url.hostname.endsWith('.local'))) {
    throw new Error('Production NEXT_PUBLIC_SITE_URL must use a public domain, not localhost.');
  }
  if (!local) url.protocol = 'https:';
  return url.origin;
}
