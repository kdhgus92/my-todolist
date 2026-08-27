const test = require('node:test');
const assert = require('node:assert');
const { updateName, findById } = require('../src/repositories/users.repository');

test('findById returns the camelCase user row when found', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return {
        rows: [
          { id: 1, email: 'user@example.com', password: 'hashed', name: '홍길동', created_at: '2026-01-01T00:00:00.000Z' },
        ],
      };
    },
  };

  const result = await findById(1, client);

  assert.ok(calls[0].params.includes(1));
  assert.strictEqual(result.name, '홍길동');
  assert.strictEqual(result.createdAt, '2026-01-01T00:00:00.000Z');
});

test('findById returns null when not found', async () => {
  const client = { query: async () => ({ rows: [] }) };
  const result = await findById('missing-id', client);
  assert.strictEqual(result, null);
});

test('updateName passes id and name as query parameters and returns the camelCase row', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return {
        rows: [
          {
            id: 1,
            email: 'user@example.com',
            password: 'hashed',
            name: '새이름',
            created_at: '2026-01-01T00:00:00.000Z',
          },
        ],
      };
    },
  };

  const result = await updateName(1, '새이름', client);

  assert.strictEqual(calls.length, 1);
  assert.ok(calls[0].params.includes(1));
  assert.ok(calls[0].params.includes('새이름'));
  assert.deepStrictEqual(result, {
    id: 1,
    email: 'user@example.com',
    password: 'hashed',
    name: '새이름',
    createdAt: '2026-01-01T00:00:00.000Z',
  });
});

test('updateName still issues the query when name is undefined (COALESCE keeps the existing value)', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return {
        rows: [
          {
            id: 1,
            email: 'user@example.com',
            password: 'hashed',
            name: '기존이름',
            created_at: '2026-01-01T00:00:00.000Z',
          },
        ],
      };
    },
  };

  const result = await updateName(1, undefined, client);

  assert.strictEqual(calls.length, 1);
  assert.ok(calls[0].params.includes(1));
  assert.ok(calls[0].params.includes(undefined));
  assert.strictEqual(result.name, '기존이름');
});
