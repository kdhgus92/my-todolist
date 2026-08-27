const test = require('node:test');
const assert = require('node:assert');
const errorHandler = require('../src/middlewares/errorHandler');
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

test('responds with the error statusCode/code/message for an AppError', () => {
  const err = new AppError(404, 'NOT_FOUND', '찾을 수 없습니다.');
  const req = {};
  const res = createMockRes();
  const next = () => {};

  errorHandler(err, req, res, next);

  assert.strictEqual(res.statusCode, 404);
  assert.deepStrictEqual(res.body, { error: { code: 'NOT_FOUND', message: '찾을 수 없습니다.' } });
});

test('defaults to 500 and INTERNAL_ERROR for a plain Error without statusCode/code', () => {
  const err = new Error('unexpected failure');
  const req = {};
  const res = createMockRes();
  const next = () => {};

  errorHandler(err, req, res, next);

  assert.strictEqual(res.statusCode, 500);
  assert.deepStrictEqual(res.body, { error: { code: 'INTERNAL_ERROR', message: 'unexpected failure' } });
});

test('uses provided statusCode/code even when not an AppError instance', () => {
  const err = { statusCode: 409, code: 'CONFLICT', message: '이미 존재합니다.' };
  const req = {};
  const res = createMockRes();
  const next = () => {};

  errorHandler(err, req, res, next);

  assert.strictEqual(res.statusCode, 409);
  assert.deepStrictEqual(res.body, { error: { code: 'CONFLICT', message: '이미 존재합니다.' } });
});
