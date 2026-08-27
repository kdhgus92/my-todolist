const test = require('node:test');
const assert = require('node:assert');
const { createDefault } = require('../src/repositories/categories.repository');

test('createDefault inserts a default category and returns the camelCase row', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return {
        rows: [
          {
            id: 10,
            user_id: 1,
            name: '기본',
            is_default: true,
          },
        ],
      };
    },
  };

  const result = await createDefault({ userId: 1 }, client);

  assert.strictEqual(calls.length, 1);
  assert.ok(calls[0].params.includes(1));
  assert.ok(calls[0].params.includes('기본'));
  assert.deepStrictEqual(result, {
    id: 10,
    userId: 1,
    name: '기본',
    isDefault: true,
  });
});

test('createDefault uses the given name when provided', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return { rows: [{ id: 11, user_id: 2, name: '업무', is_default: true }] };
    },
  };

  await createDefault({ userId: 2, name: '업무' }, client);

  assert.ok(calls[0].params.includes('업무'));
});
