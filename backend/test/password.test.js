const test = require('node:test');
const assert = require('node:assert');
const { hashPassword, verifyPassword } = require('../src/utils/password');

test('hashPassword returns a string hash different from the plain password', async () => {
  const hash = await hashPassword('mySecret123!');

  assert.strictEqual(typeof hash, 'string');
  assert.notStrictEqual(hash, 'mySecret123!');
});

test('hashing the same password twice yields different hashes (salted)', async () => {
  const hash1 = await hashPassword('mySecret123!');
  const hash2 = await hashPassword('mySecret123!');

  assert.notStrictEqual(hash1, hash2);
});

test('verifyPassword returns true for matching password/hash pair', async () => {
  const hash = await hashPassword('correct-password');

  const result = await verifyPassword('correct-password', hash);

  assert.strictEqual(result, true);
});

test('verifyPassword returns false for non-matching password', async () => {
  const hash = await hashPassword('correct-password');

  const result = await verifyPassword('wrong-password', hash);

  assert.strictEqual(result, false);
});
