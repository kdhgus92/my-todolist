const test = require('node:test');
const assert = require('node:assert');
const usersController = require('../src/controllers/users.controller');
const usersService = require('../src/services/users.service');
const AppError = require('../src/utils/appError');

function createMockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
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

test('updateMe responds 200 with the updated user on success', async () => {
  const user = { id: 1, email: 'user@example.com', name: '새이름', createdAt: '2026-01-01T00:00:00.000Z' };
  const req = { user: { id: 1 }, body: { name: '새이름' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(usersService, 'updateProfile', async () => user, () => usersController.updateMe(req, res, next));

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body, user);
  assert.strictEqual(next.calls.length, 0);
});

test('updateMe passes req.user.id and req.body.name to usersService.updateProfile', async () => {
  const req = { user: { id: 42 }, body: { name: '홍길동' } };
  const res = createMockRes();
  const next = createMockNext();
  let calledWith;

  await withMock(
    usersService,
    'updateProfile',
    async (userId, data) => {
      calledWith = { userId, data };
      return { id: 42, email: 'x@example.com', name: '홍길동', createdAt: '2026-01-01T00:00:00.000Z' };
    },
    () => usersController.updateMe(req, res, next),
  );

  assert.deepStrictEqual(calledWith, { userId: 42, data: { name: '홍길동' } });
});

test('updateMe only forwards name to the service even when req.body includes email (BR-07)', async () => {
  const req = { user: { id: 1 }, body: { name: '홍길동', email: 'hacked@example.com' } };
  const res = createMockRes();
  const next = createMockNext();
  let calledWith;

  await withMock(
    usersService,
    'updateProfile',
    async (userId, data) => {
      calledWith = { userId, data };
      return { id: 1, email: 'user@example.com', name: '홍길동', createdAt: '2026-01-01T00:00:00.000Z' };
    },
    () => usersController.updateMe(req, res, next),
  );

  assert.deepStrictEqual(calledWith.data, { name: '홍길동' });
  assert.strictEqual(calledWith.data.email, undefined);
  assert.ok(!('email' in calledWith.data));
});

test('updateMe calls next(err) when usersService.updateProfile throws', async () => {
  const err = new AppError(404, 'NOT_FOUND', '사용자를 찾을 수 없습니다.');
  const req = { user: { id: 1 }, body: { name: '새이름' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(usersService, 'updateProfile', async () => { throw err; }, () => usersController.updateMe(req, res, next));

  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0], err);
});
