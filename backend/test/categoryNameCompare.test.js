const test = require('node:test');
const assert = require('node:assert');
const { normalizeCategoryName, areCategoryNamesEqual } = require('../src/utils/categoryRules');

test('areCategoryNamesEqual returns true for identical strings', () => {
  assert.strictEqual(areCategoryNamesEqual('work', 'work'), true);
});

test('areCategoryNamesEqual returns true when only case differs', () => {
  assert.strictEqual(areCategoryNamesEqual('Work', 'work'), true);
});

test('areCategoryNamesEqual returns true when only leading/trailing whitespace differs', () => {
  assert.strictEqual(areCategoryNamesEqual('  work  ', 'work'), true);
});

test('areCategoryNamesEqual returns true when both case and whitespace differ', () => {
  assert.strictEqual(areCategoryNamesEqual('  Work  ', 'work'), true);
});

test('areCategoryNamesEqual returns false for completely different names', () => {
  assert.strictEqual(areCategoryNamesEqual('work', 'study'), false);
});

test('areCategoryNamesEqual returns false when internal whitespace count differs', () => {
  assert.strictEqual(areCategoryNamesEqual('my work', 'my  work'), false);
});

test('areCategoryNamesEqual returns true for two empty strings', () => {
  assert.strictEqual(areCategoryNamesEqual('', ''), true);
});

test('areCategoryNamesEqual returns true for empty string vs whitespace-only string', () => {
  assert.strictEqual(areCategoryNamesEqual('', '   '), true);
});

test('normalizeCategoryName trims and lowercases the input', () => {
  assert.strictEqual(normalizeCategoryName('  Work  '), 'work');
});
