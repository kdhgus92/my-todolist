const test = require('node:test');
const assert = require('node:assert');
const { toCamelCase } = require('../src/utils/caseMapper');

test('converts snake_case keys to camelCase for a single object', () => {
  const row = { user_id: 1, created_at: '2026-01-01', name: 'hi' };

  const result = toCamelCase(row);

  assert.deepStrictEqual(result, { userId: 1, createdAt: '2026-01-01', name: 'hi' });
});

test('converts each element when given an array', () => {
  const rows = [
    { todo_id: 1, is_done: false },
    { todo_id: 2, is_done: true },
  ];

  const result = toCamelCase(rows);

  assert.deepStrictEqual(result, [
    { todoId: 1, isDone: false },
    { todoId: 2, isDone: true },
  ]);
});

test('returns a new array, not the original reference', () => {
  const rows = [{ user_id: 1 }];

  const result = toCamelCase(rows);

  assert.notStrictEqual(result, rows);
});

test('returns a new object, not the original reference', () => {
  const row = { user_id: 1 };

  const result = toCamelCase(row);

  assert.notStrictEqual(result, row);
});

test('returns null as-is', () => {
  assert.strictEqual(toCamelCase(null), null);
});

test('returns undefined as-is', () => {
  assert.strictEqual(toCamelCase(undefined), undefined);
});

test('returns empty array as-is (empty)', () => {
  assert.deepStrictEqual(toCamelCase([]), []);
});

test('does not deeply convert nested objects', () => {
  const row = { user_id: 1, nested_field: { inner_key: 2 } };

  const result = toCamelCase(row);

  assert.deepStrictEqual(result.nestedField, { inner_key: 2 });
});

test('leaves keys without underscores unchanged', () => {
  const row = { id: 1, email: 'a@b.com' };

  const result = toCamelCase(row);

  assert.deepStrictEqual(result, { id: 1, email: 'a@b.com' });
});
