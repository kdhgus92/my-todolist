const test = require('node:test');
const assert = require('node:assert');
const todosService = require('../src/services/todos.service');
const todosRepo = require('../src/repositories/todos.repository');
const categoriesRepo = require('../src/repositories/categories.repository');

function withMocks(repo, repoMocks, fn) {
  const originals = {};
  for (const [name, impl] of Object.entries(repoMocks)) {
    originals[name] = repo[name];
    repo[name] = impl;
  }

  return fn().finally(() => {
    for (const name of Object.keys(repoMocks)) {
      repo[name] = originals[name];
    }
  });
}

test('listTodos returns all todos with computed status when no status filter is given', async () => {
  const rows = [
    { id: 1, userId: 1, categoryId: 1, title: 'A', startDate: '2026-08-01', endDate: '2026-08-10', isDone: false },
    { id: 2, userId: 1, categoryId: 1, title: 'B', startDate: '2026-08-01', endDate: '2026-08-10', isDone: true },
  ];

  const result = await withMocks(
    todosRepo,
    { findAllByUserId: async (userId, opts) => (userId === 1 ? rows : []) },
    () => todosService.listTodos(1, {}),
  );

  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[1].status, '완료');
});

test('listTodos passes categoryId filter through to the repository', async () => {
  let receivedOpts;
  const rows = [{ id: 1, userId: 1, categoryId: 5, title: 'A', startDate: '2026-08-01', endDate: '2026-08-10', isDone: false }];

  await withMocks(
    todosRepo,
    {
      findAllByUserId: async (userId, opts) => {
        receivedOpts = opts;
        return rows;
      },
    },
    () => todosService.listTodos(1, { categoryId: 5 }),
  );

  assert.deepStrictEqual(receivedOpts, { categoryId: 5 });
});

test('listTodos filters mapped results by status when a valid status is given', async () => {
  const today = new Date();
  const past = '2020-01-01';
  const rows = [
    { id: 1, userId: 1, categoryId: 1, title: 'done', startDate: past, endDate: past, isDone: true },
    { id: 2, userId: 1, categoryId: 1, title: 'overdue', startDate: past, endDate: past, isDone: false },
  ];

  const result = await withMocks(
    todosRepo,
    { findAllByUserId: async () => rows },
    () => todosService.listTodos(1, { status: '완료' }),
  );

  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].id, 1);
  assert.strictEqual(result[0].status, '완료');
});

test('listTodos throws 400 VALIDATION_ERROR when status is not one of the allowed values', async () => {
  await assert.rejects(
    () => withMocks(todosRepo, { findAllByUserId: async () => [] }, () => todosService.listTodos(1, { status: '알수없음' })),
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.code, 'VALIDATION_ERROR');
      return true;
    },
  );
});

test('createTodo uses the given categoryId when provided', async () => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  let categoryIdPassedToRepo;
  const created = { id: 1, userId: 1, categoryId: 9, title: '할일', startDate: todayStr, endDate: tomorrowStr, isDone: false };

  const result = await withMocks(
    todosRepo,
    {
      create: async (data) => {
        categoryIdPassedToRepo = data.categoryId;
        return created;
      },
    },
    () =>
      withMocks(
        categoriesRepo,
        {
          findDefaultByUserId: async () => {
            throw new Error('should not be called when categoryId is given');
          },
        },
        () => todosService.createTodo(1, { title: '할일', startDate: todayStr, endDate: tomorrowStr, categoryId: 9 }),
      ),
  );

  assert.strictEqual(categoryIdPassedToRepo, 9);
  assert.strictEqual(result.status, '진행중');
});

test('createTodo falls back to the default category when categoryId is not given', async () => {
  let categoryIdPassedToRepo;
  const defaultCategory = { id: 1, userId: 1, name: '기본', isDefault: true };
  const created = { id: 1, userId: 1, categoryId: 1, title: '할일', startDate: '2026-08-01', endDate: '2026-08-10', isDone: false };

  const result = await withMocks(
    todosRepo,
    {
      create: async (data) => {
        categoryIdPassedToRepo = data.categoryId;
        return created;
      },
    },
    () =>
      withMocks(
        categoriesRepo,
        { findDefaultByUserId: async (userId) => (userId === 1 ? defaultCategory : null) },
        () => todosService.createTodo(1, { title: '할일', startDate: '2026-08-01', endDate: '2026-08-10' }),
      ),
  );

  assert.strictEqual(categoryIdPassedToRepo, 1);
  assert.ok(result.status);
});

test('createTodo throws 400 VALIDATION_ERROR when endDate is before startDate', async () => {
  await assert.rejects(
    () =>
      withMocks(
        todosRepo,
        { create: async () => { throw new Error('should not be called'); } },
        () => todosService.createTodo(1, { title: '할일', startDate: '2026-08-10', endDate: '2026-08-01', categoryId: 1 }),
      ),
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.code, 'VALIDATION_ERROR');
      return true;
    },
  );
});

test('updateTodo keeps existing values for fields not provided in the patch', async () => {
  const existing = { id: 1, userId: 1, categoryId: 1, title: '기존 제목', startDate: '2026-08-01', endDate: '2026-08-10', isDone: false };
  let mergedPassedToRepo;
  const updated = { ...existing, title: '새 제목' };

  const result = await withMocks(todosRepo, {
    findById: async (id) => (id === 1 ? existing : null),
    update: async (id, fields) => {
      mergedPassedToRepo = fields;
      return updated;
    },
  }, () => todosService.updateTodo(1, 1, { title: '새 제목' }));

  assert.deepStrictEqual(mergedPassedToRepo, {
    title: '새 제목',
    startDate: '2026-08-01',
    endDate: '2026-08-10',
    categoryId: 1,
    isDone: false,
  });
  assert.strictEqual(result.title, '새 제목');
  assert.ok(result.status);
});

test('updateTodo throws 404 NOT_FOUND when the todo does not exist', async () => {
  await assert.rejects(
    () => withMocks(todosRepo, { findById: async () => null }, () => todosService.updateTodo(1, 999, { title: 'x' })),
    (err) => {
      assert.strictEqual(err.statusCode, 404);
      assert.strictEqual(err.code, 'NOT_FOUND');
      return true;
    },
  );
});

test('updateTodo throws 403 FORBIDDEN when the todo belongs to another user', async () => {
  const existing = { id: 1, userId: 2, categoryId: 1, title: 'T', startDate: '2026-08-01', endDate: '2026-08-10', isDone: false };

  await assert.rejects(
    () => withMocks(todosRepo, { findById: async () => existing }, () => todosService.updateTodo(1, 1, { title: 'x' })),
    (err) => {
      assert.strictEqual(err.statusCode, 403);
      assert.strictEqual(err.code, 'FORBIDDEN');
      return true;
    },
  );
});

test('updateTodo throws 400 VALIDATION_ERROR when merged date range is invalid', async () => {
  const existing = { id: 1, userId: 1, categoryId: 1, title: 'T', startDate: '2026-08-10', endDate: '2026-08-20', isDone: false };

  await assert.rejects(
    () =>
      withMocks(
        todosRepo,
        { findById: async () => existing, update: async () => { throw new Error('should not be called'); } },
        () => todosService.updateTodo(1, 1, { endDate: '2026-08-01' }),
      ),
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.code, 'VALIDATION_ERROR');
      return true;
    },
  );
});

test('updateTodo checks NOT_FOUND before FORBIDDEN (validation order)', async () => {
  await assert.rejects(
    () => withMocks(todosRepo, { findById: async () => null }, () => todosService.updateTodo(1, 1, { title: 'x' })),
    (err) => {
      assert.strictEqual(err.code, 'NOT_FOUND');
      return true;
    },
  );
});

test('updateTodo checks FORBIDDEN before date VALIDATION_ERROR (validation order)', async () => {
  const existing = { id: 1, userId: 2, categoryId: 1, title: 'T', startDate: '2026-08-10', endDate: '2026-08-20', isDone: false };

  await assert.rejects(
    () =>
      withMocks(todosRepo, { findById: async () => existing }, () =>
        todosService.updateTodo(1, 1, { endDate: '2026-08-01' }),
      ),
    (err) => {
      assert.strictEqual(err.code, 'FORBIDDEN');
      return true;
    },
  );
});

test('deleteTodo removes the todo on success', async () => {
  const existing = { id: 1, userId: 1, categoryId: 1, title: 'T', startDate: '2026-08-01', endDate: '2026-08-10', isDone: false };
  let removedId;

  const result = await withMocks(
    todosRepo,
    {
      findById: async () => existing,
      remove: async (id) => {
        removedId = id;
      },
    },
    () => todosService.deleteTodo(1, 1),
  );

  assert.strictEqual(removedId, 1);
  assert.strictEqual(result, undefined);
});

test('deleteTodo throws 404 NOT_FOUND when the todo does not exist', async () => {
  await assert.rejects(
    () => withMocks(todosRepo, { findById: async () => null }, () => todosService.deleteTodo(1, 999)),
    (err) => {
      assert.strictEqual(err.statusCode, 404);
      assert.strictEqual(err.code, 'NOT_FOUND');
      return true;
    },
  );
});

test('deleteTodo throws 403 FORBIDDEN when the todo belongs to another user', async () => {
  const existing = { id: 1, userId: 2, categoryId: 1, title: 'T', startDate: '2026-08-01', endDate: '2026-08-10', isDone: false };

  await assert.rejects(
    () => withMocks(todosRepo, { findById: async () => existing }, () => todosService.deleteTodo(1, 1)),
    (err) => {
      assert.strictEqual(err.statusCode, 403);
      assert.strictEqual(err.code, 'FORBIDDEN');
      return true;
    },
  );
});
