const test = require('node:test');
const assert = require('node:assert');
const { create, findById, findAllByUserId, update, remove } = require('../src/repositories/todos.repository');

test('create inserts a todo and returns the camelCase row', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return {
        rows: [
          {
            id: 1,
            user_id: 1,
            category_id: 2,
            title: '운동하기',
            start_date: '2026-08-01',
            end_date: '2026-08-10',
            is_done: false,
          },
        ],
      };
    },
  };

  const result = await create(
    { userId: 1, categoryId: 2, title: '운동하기', startDate: '2026-08-01', endDate: '2026-08-10' },
    client,
  );

  assert.strictEqual(calls.length, 1);
  assert.match(calls[0].sql, /INSERT INTO todos/i);
  assert.ok(calls[0].params.includes(1));
  assert.ok(calls[0].params.includes(2));
  assert.ok(calls[0].params.includes('운동하기'));
  assert.deepStrictEqual(result, {
    id: 1,
    userId: 1,
    categoryId: 2,
    title: '운동하기',
    startDate: '2026-08-01',
    endDate: '2026-08-10',
    isDone: false,
  });
});

test('findById returns the camelCase row when found', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return {
        rows: [
          {
            id: 5,
            user_id: 1,
            category_id: 2,
            title: '독서',
            start_date: '2026-08-01',
            end_date: '2026-08-05',
            is_done: false,
          },
        ],
      };
    },
  };

  const result = await findById(5, client);

  assert.deepStrictEqual(calls[0].params, [5]);
  assert.deepStrictEqual(result, {
    id: 5,
    userId: 1,
    categoryId: 2,
    title: '독서',
    startDate: '2026-08-01',
    endDate: '2026-08-05',
    isDone: false,
  });
});

test('findById returns null when not found', async () => {
  const client = { query: async () => ({ rows: [] }) };

  const result = await findById(999, client);

  assert.strictEqual(result, null);
});

test('findAllByUserId without categoryId filter queries only by user_id, ordered by created_at ASC', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return {
        rows: [
          { id: 1, user_id: 1, category_id: 1, title: 'A', start_date: '2026-08-01', end_date: '2026-08-01', is_done: false },
          { id: 2, user_id: 1, category_id: 2, title: 'B', start_date: '2026-08-02', end_date: '2026-08-02', is_done: false },
        ],
      };
    },
  };

  const result = await findAllByUserId(1, {}, client);

  assert.strictEqual(calls.length, 1);
  assert.deepStrictEqual(calls[0].params, [1]);
  assert.match(calls[0].sql, /user_id\s*=\s*\$1/);
  assert.match(calls[0].sql, /ORDER BY created_at ASC/i);
  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0].userId, 1);
  assert.strictEqual(result[0].categoryId, 1);
});

test('findAllByUserId with categoryId filter adds a category_id condition and param', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return {
        rows: [
          { id: 2, user_id: 1, category_id: 2, title: 'B', start_date: '2026-08-02', end_date: '2026-08-02', is_done: false },
        ],
      };
    },
  };

  const result = await findAllByUserId(1, { categoryId: 2 }, client);

  assert.deepStrictEqual(calls[0].params, [1, 2]);
  assert.match(calls[0].sql, /category_id\s*=\s*\$2/);
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].categoryId, 2);
});

test('findAllByUserId returns an empty array when the user has no todos', async () => {
  const client = { query: async () => ({ rows: [] }) };

  const result = await findAllByUserId(999, {}, client);

  assert.deepStrictEqual(result, []);
});

test('update sets provided fields and returns the camelCase row', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return {
        rows: [
          {
            id: 1,
            user_id: 1,
            category_id: 3,
            title: '수정된 제목',
            start_date: '2026-08-05',
            end_date: '2026-08-15',
            is_done: true,
          },
        ],
      };
    },
  };

  const result = await update(
    1,
    { title: '수정된 제목', startDate: '2026-08-05', endDate: '2026-08-15', categoryId: 3, isDone: true },
    client,
  );

  assert.match(calls[0].sql, /UPDATE todos/i);
  assert.strictEqual(calls[0].params[0], 1);
  assert.ok(calls[0].params.includes('수정된 제목'));
  assert.ok(calls[0].params.includes(true));
  assert.deepStrictEqual(result, {
    id: 1,
    userId: 1,
    categoryId: 3,
    title: '수정된 제목',
    startDate: '2026-08-05',
    endDate: '2026-08-15',
    isDone: true,
  });
});

test('remove deletes the todo by id and returns nothing', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return { rows: [] };
    },
  };

  const result = await remove(7, client);

  assert.match(calls[0].sql, /DELETE FROM todos/i);
  assert.deepStrictEqual(calls[0].params, [7]);
  assert.strictEqual(result, undefined);
});
