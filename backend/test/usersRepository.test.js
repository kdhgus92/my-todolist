const test = require('node:test');
const assert = require('node:assert');
const { findByEmail, create } = require('../src/repositories/users.repository');

test('findByEmail returns camelCase user row when found', async () => {
  const row = {
    id: 1,
    email: 'user@example.com',
    password: 'hashed',
    name: '홍길동',
    created_at: '2026-01-01T00:00:00.000Z',
  };
  const client = { query: async () => ({ rows: [row] }) };

  const result = await findByEmail('user@example.com', client);

  assert.deepStrictEqual(result, {
    id: 1,
    email: 'user@example.com',
    password: 'hashed',
    name: '홍길동',
    createdAt: '2026-01-01T00:00:00.000Z',
  });
});

test('findByEmail returns null when not found', async () => {
  const client = { query: async () => ({ rows: [] }) };

  const result = await findByEmail('nobody@example.com', client);

  assert.strictEqual(result, null);
});

test('findByEmail passes the email as a query parameter', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return { rows: [] };
    },
  };

  await findByEmail('user@example.com', client);

  assert.strictEqual(calls.length, 1);
  assert.ok(calls[0].params.includes('user@example.com'));
});

test('create inserts the given fields and returns the camelCase row', async () => {
  const calls = [];
  const client = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return {
        rows: [
          {
            id: 1,
            email: 'user@example.com',
            password: 'already-hashed',
            name: '홍길동',
            created_at: '2026-01-01T00:00:00.000Z',
          },
        ],
      };
    },
  };

  const result = await create(
    { email: 'user@example.com', password: 'already-hashed', name: '홍길동' },
    client,
  );

  assert.strictEqual(calls.length, 1);
  assert.ok(calls[0].params.includes('already-hashed'));
  assert.deepStrictEqual(result, {
    id: 1,
    email: 'user@example.com',
    password: 'already-hashed',
    name: '홍길동',
    createdAt: '2026-01-01T00:00:00.000Z',
  });
});
