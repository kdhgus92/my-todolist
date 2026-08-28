const test = require('node:test');
const assert = require('node:assert');
const authController = require('../src/controllers/auth.controller');
const authService = require('../src/services/auth.service');
const AppError = require('../src/utils/appError');

function createMockRes() {
  return {
    statusCode: null,
    body: null,
    cookieCalls: [],
    clearCookieCalls: [],
    sendCalled: false,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    cookie(name, value, options) {
      this.cookieCalls.push({ name, value, options });
      return this;
    },
    clearCookie(name, options) {
      this.clearCookieCalls.push({ name, options });
      return this;
    },
    send() {
      this.sendCalled = true;
      return this;
    },
  };
}

function createMockNext() {
  const calls = [];
  const next = (err) => calls.push(err);
  next.calls = calls;
  return next;
}

function withMock(target, name, impl, fn) {
  const original = target[name];
  target[name] = impl;
  return Promise.resolve(fn()).finally(() => {
    target[name] = original;
  });
}

test('signup responds 201 with the created user on success', async () => {
  const user = { id: 1, email: 'new@example.com', name: '홍길동', createdAt: '2026-01-01T00:00:00.000Z' };
  const req = { body: { email: 'new@example.com', password: 'password1', name: '홍길동' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(authService, 'signup', async () => user, () => authController.signup(req, res, next));

  assert.strictEqual(res.statusCode, 201);
  assert.deepStrictEqual(res.body, user);
  assert.strictEqual(next.calls.length, 0);
});

test('signup calls next(err) when authService.signup throws', async () => {
  const err = new AppError(409, 'CONFLICT', '이미 등록된 이메일입니다.');
  const req = { body: { email: 'dup@example.com', password: 'password1', name: '홍길동' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(authService, 'signup', async () => { throw err; }, () => authController.signup(req, res, next));

  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0], err);
});

test('login sets the refresh_token cookie and responds 200 with accessToken and user on success', async () => {
  const user = { id: 1, email: 'user@example.com', name: '홍길동', createdAt: '2026-01-01T00:00:00.000Z' };
  const loginResult = { accessToken: 'access-token', refreshToken: 'refresh-token', user };
  const req = { body: { email: 'user@example.com', password: 'password1' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(authService, 'login', async () => loginResult, () => authController.login(req, res, next));

  assert.strictEqual(res.cookieCalls.length, 1);
  assert.strictEqual(res.cookieCalls[0].name, 'refresh_token');
  assert.strictEqual(res.cookieCalls[0].value, 'refresh-token');
  assert.deepStrictEqual(res.cookieCalls[0].options, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body, { accessToken: 'access-token', user });
  assert.strictEqual(next.calls.length, 0);
});

test('login calls next(err) when authService.login throws', async () => {
  const err = new AppError(401, 'INVALID_CREDENTIALS', '이메일 또는 비밀번호가 올바르지 않습니다.');
  const req = { body: { email: 'user@example.com', password: 'wrong' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(authService, 'login', async () => { throw err; }, () => authController.login(req, res, next));

  assert.strictEqual(res.cookieCalls.length, 0);
  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0], err);
});

test('refresh responds 200 with a new accessToken when the refresh_token cookie is valid', async () => {
  const req = { headers: { cookie: 'refresh_token=valid-token; other=x' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(
    authService,
    'refresh',
    async (token) => {
      assert.strictEqual(token, 'valid-token');
      return { accessToken: 'new-access-token' };
    },
    () => authController.refresh(req, res, next),
  );

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body, { accessToken: 'new-access-token' });
  assert.strictEqual(next.calls.length, 0);
});

test('refresh calls next(AppError 401) when the refresh_token cookie is missing', async () => {
  const req = { headers: {} };
  const res = createMockRes();
  const next = createMockNext();

  await authController.refresh(req, res, next);

  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0].statusCode, 401);
  assert.strictEqual(next.calls[0].code, 'INVALID_REFRESH_TOKEN');
});

test('refresh calls next(err) when authService.refresh throws', async () => {
  const err = new AppError(401, 'INVALID_REFRESH_TOKEN', '다시 로그인해 주세요.');
  const req = { headers: { cookie: 'refresh_token=bad-token' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(authService, 'refresh', async () => { throw err; }, () => authController.refresh(req, res, next));

  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0], err);
});

test('logout clears the refresh_token cookie and responds 204', async () => {
  const req = {};
  const res = createMockRes();
  const next = createMockNext();

  await authController.logout(req, res, next);

  assert.strictEqual(res.clearCookieCalls.length, 1);
  assert.strictEqual(res.clearCookieCalls[0].name, 'refresh_token');
  assert.deepStrictEqual(res.clearCookieCalls[0].options, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  assert.strictEqual(res.statusCode, 204);
  assert.strictEqual(res.sendCalled, true);
  assert.strictEqual(next.calls.length, 0);
});
