import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeSiteUrl } from '../src/lib/site-url';

test('development defaults to localhost and preserves its port', () => {
  assert.equal(normalizeSiteUrl(undefined), 'http://localhost:3000');
  assert.equal(normalizeSiteUrl('http://localhost:4000/'), 'http://localhost:4000');
});
test('normalizes public origins and forces HTTPS', () => {
  for (const value of ['example.org', ' https://example.org/// ', 'http://example.org/']) {
    assert.equal(normalizeSiteUrl(value, true), 'https://example.org');
  }
});
test('rejects missing and local production origins', () => {
  for (const value of [undefined, '', 'localhost:3000', 'http://127.0.0.1:3000', 'http://[::1]', 'http://app.local', 'https://192.168.1.2', 'https://10.0.0.1']) {
    assert.throws(() => normalizeSiteUrl(value, true));
  }
});
test('rejects malformed origins and accidental URL suffixes', () => {
  for (const value of ['https://', 'bad domain', 'ftp://example.org', 'https://name:secret@example.org', 'https://example.org/page', 'https://example.org?q=1', 'https://example.org/#section']) {
    assert.throws(() => normalizeSiteUrl(value, true));
  }
});
