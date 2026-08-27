const test = require('node:test');
const assert = require('node:assert');
const categoriesService = require('../src/services/categories.service');
const categoriesRepo = require('../src/repositories/categories.repository');
const pool = require('../src/config/db');

function withMocks(repoMocks, fn) {
  const originals = {};
  for (const [name, impl] of Object.entries(repoMocks)) {
    originals[name] = categoriesRepo[name];
    categoriesRepo[name] = impl;
  }

  return fn().finally(() => {
    for (const name of Object.keys(repoMocks)) {
      categoriesRepo[name] = originals[name];
    }
  });
}

function withPoolConnect(client, fn) {
  const original = pool.connect;
  pool.connect = async () => client;
  return fn().finally(() => {
    pool.connect = original;
  });
}

function createFakeClient(queryImpl) {
  const calls = [];
  return {
    calls,
    query: async (sql, params) => {
      calls.push(sql);
      if (queryImpl) {
        return queryImpl(sql, params);
      }
      return { rows: [] };
    },
    release: () => {},
  };
}

test('listCategories returns categoriesRepo.findAllByUserId as-is', async () => {
  const categories = [{ id: 1, userId: 1, name: '기본', isDefault: true }];

  const result = await withMocks(
    { findAllByUserId: async (userId) => (userId === 1 ? categories : []) },
    () => categoriesService.listCategories(1),
  );

  assert.strictEqual(result, categories);
});

test('createCategory returns the created category on success', async () => {
  const created = { id: 2, userId: 1, name: '업무', isDefault: false };

  const result = await withMocks(
    { create: async ({ userId, name }) => (userId === 1 && name === '업무' ? created : null) },
    () => categoriesService.createCategory(1, '업무'),
  );

  assert.deepStrictEqual(result, created);
});

test('createCategory throws 409 CATEGORY_NAME_ALREADY_EXISTS when repo throws a 23505 unique-violation error', async () => {
  const dupErr = new Error('duplicate key');
  dupErr.code = '23505';

  await assert.rejects(
    () =>
      withMocks(
        {
          create: async () => {
            throw dupErr;
          },
        },
        () => categoriesService.createCategory(1, '기본'),
      ),
    (err) => {
      assert.strictEqual(err.statusCode, 409);
      assert.strictEqual(err.code, 'CATEGORY_NAME_ALREADY_EXISTS');
      assert.strictEqual(err.message, '이미 존재하는 카테고리명입니다.');
      return true;
    },
  );
});

test('createCategory rethrows non-unique-violation errors as-is', async () => {
  const otherErr = new Error('connection lost');

  await assert.rejects(
    () =>
      withMocks(
        {
          create: async () => {
            throw otherErr;
          },
        },
        () => categoriesService.createCategory(1, '기본'),
      ),
    (err) => {
      assert.strictEqual(err, otherErr);
      return true;
    },
  );
});

test('deleteCategory throws 404 NOT_FOUND when the category does not exist', async () => {
  const client = createFakeClient();

  await assert.rejects(
    () =>
      withPoolConnect(client, () =>
        withMocks({ findById: async () => null }, () => categoriesService.deleteCategory(1, 999)),
      ),
    (err) => {
      assert.strictEqual(err.statusCode, 404);
      assert.strictEqual(err.code, 'NOT_FOUND');
      assert.strictEqual(err.message, '카테고리를 찾을 수 없습니다.');
      return true;
    },
  );
});

test('deleteCategory throws 403 FORBIDDEN when the category belongs to another user', async () => {
  const client = createFakeClient();
  const category = { id: 1, userId: 2, name: '기본', isDefault: false };

  await assert.rejects(
    () =>
      withPoolConnect(client, () =>
        withMocks({ findById: async () => category }, () => categoriesService.deleteCategory(1, 1)),
      ),
    (err) => {
      assert.strictEqual(err.statusCode, 403);
      assert.strictEqual(err.code, 'FORBIDDEN');
      return true;
    },
  );
});

test('deleteCategory throws 403 DEFAULT_CATEGORY_DELETE_FORBIDDEN when the category is the default category', async () => {
  const client = createFakeClient();
  const category = { id: 1, userId: 1, name: '기본', isDefault: true };

  await assert.rejects(
    () =>
      withPoolConnect(client, () =>
        withMocks({ findById: async () => category }, () => categoriesService.deleteCategory(1, 1)),
      ),
    (err) => {
      assert.strictEqual(err.statusCode, 403);
      assert.strictEqual(err.code, 'DEFAULT_CATEGORY_DELETE_FORBIDDEN');
      assert.strictEqual(err.message, '기본 카테고리는 삭제할 수 없습니다.');
      return true;
    },
  );
});

test('deleteCategory checks NOT_FOUND before FORBIDDEN/DEFAULT checks (validation order)', async () => {
  const client = createFakeClient();

  await assert.rejects(
    () =>
      withPoolConnect(client, () =>
        withMocks({ findById: async () => null }, () => categoriesService.deleteCategory(1, 1)),
      ),
    (err) => {
      assert.strictEqual(err.code, 'NOT_FOUND');
      return true;
    },
  );
});

test('deleteCategory reassigns todos to the default category then removes the category, and commits', async () => {
  const category = { id: 5, userId: 1, name: '취미', isDefault: false };
  const defaultCategory = { id: 1, userId: 1, name: '기본', isDefault: true };
  const client = createFakeClient();

  const callOrder = [];

  const result = await withPoolConnect(client, () =>
    withMocks(
      {
        findById: async () => category,
        findDefaultByUserId: async () => defaultCategory,
        reassignTodosToCategory: async (fromId, toId) => {
          callOrder.push('reassign');
          assert.strictEqual(fromId, 5);
          assert.strictEqual(toId, 1);
        },
        remove: async (id) => {
          callOrder.push('remove');
          assert.strictEqual(id, 5);
        },
      },
      () => categoriesService.deleteCategory(1, 5),
    ),
  );

  assert.deepStrictEqual(callOrder, ['reassign', 'remove']);
  assert.strictEqual(result, undefined);
  assert.ok(client.calls.includes('BEGIN'));
  assert.ok(client.calls.includes('COMMIT'));
  assert.ok(!client.calls.includes('ROLLBACK'));
});

test('deleteCategory rolls back and rethrows when a step inside the transaction fails', async () => {
  const category = { id: 5, userId: 1, name: '취미', isDefault: false };
  const defaultCategory = { id: 1, userId: 1, name: '기본', isDefault: true };
  const client = createFakeClient();
  const failure = new Error('db unavailable');

  await assert.rejects(
    () =>
      withPoolConnect(client, () =>
        withMocks(
          {
            findById: async () => category,
            findDefaultByUserId: async () => defaultCategory,
            reassignTodosToCategory: async () => {
              throw failure;
            },
            remove: async () => {},
          },
          () => categoriesService.deleteCategory(1, 5),
        ),
      ),
    (err) => {
      assert.strictEqual(err, failure);
      return true;
    },
  );

  assert.ok(client.calls.includes('BEGIN'));
  assert.ok(client.calls.includes('ROLLBACK'));
  assert.ok(!client.calls.includes('COMMIT'));
});
