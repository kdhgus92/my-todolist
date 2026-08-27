const test = require('node:test');
const assert = require('node:assert');
const authenticate = require('../src/middlewares/auth');
const { signAccessToken, signRefreshToken } = require('../src/utils/jwt');

function createMockNext() {
  const calls = [];
  const next = (err) => calls.push(err);
  next.calls = calls;
  return next;
}

test('calls next() with no args when a valid Bearer token is present', () => {
  const token = signAccessToken({ id: 1, email: 'user@example.com' });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = {};
  const next = createMockNext();

  authenticate(req, res, next);

  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0], undefined);
  assert.deepStrictEqual(req.user, { id: 1, email: 'user@example.com' });
});

test('calls next(err 401) when Authorization header is missing', () => {
  const req = { headers: {} };
  const res = {};
  const next = createMockNext();

  authenticate(req, res, next);

  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0].statusCode, 401);
  assert.strictEqual(next.calls[0].code, 'UNAUTHORIZED');
});

test('calls next(err 401) when Authorization header has no Bearer prefix', () => {
  const req = { headers: { authorization: 'sometoken' } };
  const res = {};
  const next = createMockNext();

  authenticate(req, res, next);

  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0].statusCode, 401);
  assert.strictEqual(next.calls[0].code, 'UNAUTHORIZED');
});

test('calls next(err 401) when token is invalid/malformed', () => {
  const req = { headers: { authorization: 'Bearer not-a-real-token' } };
  const res = {};
  const next = createMockNext();

  authenticate(req, res, next);

  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0].statusCode, 401);
  assert.strictEqual(next.calls[0].code, 'UNAUTHORIZED');
});

test('calls next(err 401) when a refresh token is used instead of an access token', () => {
  const refreshToken = signRefreshToken({ id: 1, email: 'user@example.com' });
  const req = { headers: { authorization: `Bearer ${refreshToken}` } };
  const res = {};
  const next = createMockNext();

  authenticate(req, res, next);

  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0].statusCode, 401);
  assert.strictEqual(next.calls[0].code, 'UNAUTHORIZED');
});
