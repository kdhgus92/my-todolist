const test = require('node:test');
const assert = require('node:assert');
const {
  createDefault,
  findAllByUserId,
  findById,
  findDefaultByUserId,
  create,
  remove,
  reassignTodosToCategory,
} = require('../src/repositories/categories.repository');

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

test('findAllByUserId returns camelCase rows ordered by created_at for the given user', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return {
        rows: [
          { id: 1, user_id: 1, name: '기본', is_default: true, created_at: '2026-01-01T00:00:00.000Z' },
          { id: 2, user_id: 1, name: '업무', is_default: false, created_at: '2026-01-02T00:00:00.000Z' },
        ],
      };
    },
  };

  const result = await findAllByUserId(1, client);

  assert.strictEqual(calls.length, 1);
  assert.deepStrictEqual(calls[0].params, [1]);
  assert.match(calls[0].sql, /user_id\s*=\s*\$1/);
  assert.deepStrictEqual(result, [
    { id: 1, userId: 1, name: '기본', isDefault: true, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 2, userId: 1, name: '업무', isDefault: false, createdAt: '2026-01-02T00:00:00.000Z' },
  ]);
});

test('findAllByUserId returns an empty array when the user has no categories', async () => {
  const client = { query: async () => ({ rows: [] }) };

  const result = await findAllByUserId(999, client);

  assert.deepStrictEqual(result, []);
});

test('findById returns the camelCase row when found', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return { rows: [{ id: 5, user_id: 1, name: '기본', is_default: true }] };
    },
  };

  const result = await findById(5, client);

  assert.deepStrictEqual(calls[0].params, [5]);
  assert.deepStrictEqual(result, { id: 5, userId: 1, name: '기본', isDefault: true });
});

test('findById returns null when not found', async () => {
  const client = { query: async () => ({ rows: [] }) };

  const result = await findById(999, client);

  assert.strictEqual(result, null);
});

test('findDefaultByUserId returns the camelCase default category row', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return { rows: [{ id: 1, user_id: 1, name: '기본', is_default: true }] };
    },
  };

  const result = await findDefaultByUserId(1, client);

  assert.deepStrictEqual(calls[0].params, [1]);
  assert.deepStrictEqual(result, { id: 1, userId: 1, name: '기본', isDefault: true });
});

test('findDefaultByUserId returns null when the user has no default category', async () => {
  const client = { query: async () => ({ rows: [] }) };

  const result = await findDefaultByUserId(1, client);

  assert.strictEqual(result, null);
});

test('create inserts a category and returns the camelCase row', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return { rows: [{ id: 3, user_id: 1, name: '취미', is_default: false }] };
    },
  };

  const result = await create({ userId: 1, name: '취미' }, client);

  assert.deepStrictEqual(calls[0].params, [1, '취미']);
  assert.deepStrictEqual(result, { id: 3, userId: 1, name: '취미', isDefault: false });
});

test('create propagates a 23505 unique-violation error without catching it', async () => {
  const err = new Error('duplicate key value violates unique constraint');
  err.code = '23505';
  const client = {
    query: async () => {
      throw err;
    },
  };

  await assert.rejects(() => create({ userId: 1, name: '기본' }, client), (thrown) => {
    assert.strictEqual(thrown, err);
    assert.strictEqual(thrown.code, '23505');
    return true;
  });
});

test('remove deletes the category by id and returns nothing', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return { rows: [] };
    },
  };

  const result = await remove(7, client);

  assert.deepStrictEqual(calls[0].params, [7]);
  assert.strictEqual(result, undefined);
});

test('reassignTodosToCategory updates todos from one category to another and returns nothing', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return { rows: [] };
    },
  };

  const result = await reassignTodosToCategory(7, 1, client);

  assert.deepStrictEqual(calls[0].params, [7, 1]);
  assert.match(calls[0].sql, /UPDATE todos/i);
  assert.strictEqual(result, undefined);
});
