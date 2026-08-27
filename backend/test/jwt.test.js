const test = require('node:test');
const assert = require('node:assert');
const {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require('../src/utils/jwt');

const payload = { id: 1, email: 'user@example.com' };

test('signAccessToken returns a string token', () => {
  const token = signAccessToken(payload);

  assert.strictEqual(typeof token, 'string');
  assert.ok(token.length > 0);
});

test('signRefreshToken returns a string token', () => {
  const token = signRefreshToken(payload);

  assert.strictEqual(typeof token, 'string');
  assert.ok(token.length > 0);
});

test('verifyAccessToken returns the original payload fields for a valid access token', () => {
  const token = signAccessToken(payload);

  const decoded = verifyAccessToken(token);

  assert.strictEqual(decoded.id, payload.id);
  assert.strictEqual(decoded.email, payload.email);
});

test('verifyRefreshToken returns the original payload fields for a valid refresh token', () => {
  const token = signRefreshToken(payload);

  const decoded = verifyRefreshToken(token);

  assert.strictEqual(decoded.id, payload.id);
  assert.strictEqual(decoded.email, payload.email);
});

test('verifyAccessToken throws for a malformed token', () => {
  assert.throws(() => verifyAccessToken('not-a-valid-token'));
});

test('verifyRefreshToken throws for a malformed token', () => {
  assert.throws(() => verifyRefreshToken('not-a-valid-token'));
});

test('verifyAccessToken throws when given a refresh token (different secret)', () => {
  const refreshToken = signRefreshToken(payload);

  assert.throws(() => verifyAccessToken(refreshToken));
});

test('verifyRefreshToken throws when given an access token (different secret)', () => {
  const accessToken = signAccessToken(payload);

  assert.throws(() => verifyRefreshToken(accessToken));
});
