import { WEBSITE_ID } from './model';
export function isWebsiteEvent(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;
  const event = body as Record<string, unknown>;
  return event._id === WEBSITE_ID && event._type === 'websiteContent';
}
