const test = require('node:test');
const assert = require('node:assert');
const validate = require('../src/middlewares/validate');

function createMockNext() {
  const calls = [];
  const next = (err) => calls.push(err);
  next.calls = calls;
  return next;
}

test('calls next() with no args when all fields pass validation', () => {
  const schema = {
    email: (value) => (value ? null : 'email is required'),
  };
  const req = { body: { email: 'user@example.com' } };
  const res = {};
  const next = createMockNext();

  validate(schema)(req, res, next);

  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0], undefined);
});

test('calls next(AppError 400) with the first validation error message', () => {
  const schema = {
    email: (value) => (value ? null : '이메일은 필수입니다.'),
  };
  const req = { body: {} };
  const res = {};
  const next = createMockNext();

  validate(schema)(req, res, next);

  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0].statusCode, 400);
  assert.strictEqual(next.calls[0].code, 'VALIDATION_ERROR');
  assert.strictEqual(next.calls[0].message, '이메일은 필수입니다.');
});

test('stops at the first failing field and does not report later fields', () => {
  const schema = {
    email: () => '이메일 오류',
    password: () => '비밀번호 오류',
  };
  const req = { body: {} };
  const res = {};
  const next = createMockNext();

  validate(schema)(req, res, next);

  assert.strictEqual(next.calls[0].message, '이메일 오류');
});

test('passes the full req.body as the second argument to each validator', () => {
  const receivedBodies = [];
  const schema = {
    password: (value, body) => {
      receivedBodies.push(body);
      return null;
    },
  };
  const req = { body: { email: 'a@b.com', password: 'pw' } };
  const res = {};
  const next = createMockNext();

  validate(schema)(req, res, next);

  assert.deepStrictEqual(receivedBodies[0], req.body);
});

test('calls next() when schema is empty (no fields to validate)', () => {
  const req = { body: {} };
  const res = {};
  const next = createMockNext();

  validate({})(req, res, next);

  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0], undefined);
});
