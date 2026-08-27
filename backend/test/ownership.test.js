const test = require('node:test');
const assert = require('node:assert');
const { assertOwnership } = require('../src/utils/ownership');
const AppError = require('../src/utils/appError');

test('does not throw when resourceOwnerId equals requestUserId', () => {
  assert.doesNotThrow(() => assertOwnership(1, 1));
});

test('returns undefined when ownership matches', () => {
  const result = assertOwnership(5, 5);

  assert.strictEqual(result, undefined);
});

test('throws AppError when resourceOwnerId differs from requestUserId', () => {
  assert.throws(() => assertOwnership(1, 2), AppError);
});

test('thrown error has 403 status and FORBIDDEN code', () => {
  try {
    assertOwnership(1, 2);
    assert.fail('expected assertOwnership to throw');
  } catch (err) {
    assert.strictEqual(err.statusCode, 403);
    assert.strictEqual(err.code, 'FORBIDDEN');
  }
});
