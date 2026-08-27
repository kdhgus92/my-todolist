const test = require('node:test');
const assert = require('node:assert');
const { parseCookie } = require('../src/utils/cookies');

test('returns the cookie value when present', () => {
  const value = parseCookie('refresh_token=abc123; other=xyz', 'refresh_token');

  assert.strictEqual(value, 'abc123');
});

test('returns the correct value when multiple cookies are present', () => {
  const value = parseCookie('foo=bar; refresh_token=abc123; baz=qux', 'refresh_token');

  assert.strictEqual(value, 'abc123');
});

test('returns null when the named cookie is not present', () => {
  const value = parseCookie('foo=bar; baz=qux', 'refresh_token');

  assert.strictEqual(value, null);
});

test('returns null when cookieHeader is undefined', () => {
  const value = parseCookie(undefined, 'refresh_token');

  assert.strictEqual(value, null);
});

test('returns null when name is missing', () => {
  const value = parseCookie('refresh_token=abc123', undefined);

  assert.strictEqual(value, null);
});

test('returns null for an empty cookie header', () => {
  const value = parseCookie('', 'refresh_token');

  assert.strictEqual(value, null);
});
