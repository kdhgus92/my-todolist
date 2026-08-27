const test = require('node:test');
const assert = require('node:assert');
const AppError = require('../src/utils/appError');

test('sets statusCode, code, message properties', () => {
  const err = new AppError(404, 'NOT_FOUND', '리소스를 찾을 수 없습니다.');

  assert.strictEqual(err.statusCode, 404);
  assert.strictEqual(err.code, 'NOT_FOUND');
  assert.strictEqual(err.message, '리소스를 찾을 수 없습니다.');
});

test('is an instance of Error', () => {
  const err = new AppError(400, 'VALIDATION_ERROR', 'bad request');

  assert.ok(err instanceof Error);
  assert.ok(err instanceof AppError);
});

test('has a stack trace', () => {
  const err = new AppError(500, 'INTERNAL_ERROR', 'oops');

  assert.strictEqual(typeof err.stack, 'string');
});
