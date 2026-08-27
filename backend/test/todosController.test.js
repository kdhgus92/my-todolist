const test = require('node:test');
const assert = require('node:assert');
const todosController = require('../src/controllers/todos.controller');
const todosService = require('../src/services/todos.service');
const AppError = require('../src/utils/appError');

function createMockRes() {
  return {
    statusCode: null,
    body: null,
    sent: false,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    send(body) {
      this.sent = true;
      if (body !== undefined) {
        this.body = body;
      }
      return this;
    },
  };
}

function createMockNext() {
  const calls = [];
  const next = (err) => calls.push(err);
  next.calls = calls;
  return next;
}

function withMock(target, name, impl, fn) {
  const original = target[name];
  target[name] = impl;
  return Promise.resolve(fn()).finally(() => {
    target[name] = original;
  });
}

test('list responds 200 with the array of todos and forwards categoryId/status query params', async () => {
  const todos = [{ id: 1, title: 'A', status: '진행중' }];
  const req = { user: { id: 1 }, query: { categoryId: '2', status: '진행중' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(
    todosService,
    'listTodos',
    async (userId, opts) => {
      assert.strictEqual(userId, 1);
      assert.deepStrictEqual(opts, { categoryId: '2', status: '진행중' });
      return todos;
    },
    () => todosController.list(req, res, next),
  );

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body, todos);
  assert.strictEqual(next.calls.length, 0);
});

test('list calls next(err) when the service throws', async () => {
  const err = new Error('db down');
  const req = { user: { id: 1 }, query: {} };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(todosService, 'listTodos', async () => { throw err; }, () => todosController.list(req, res, next));

  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.calls[0], err);
});

test('create responds 201 with the created todo and forwards req.body', async () => {
  const body = { title: '할일', startDate: '2026-08-01', endDate: '2026-08-10' };
  const created = { id: 1, ...body, status: '진행중' };
  const req = { user: { id: 1 }, body };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(
    todosService,
    'createTodo',
    async (userId, data) => {
      assert.strictEqual(userId, 1);
      assert.deepStrictEqual(data, body);
      return created;
    },
    () => todosController.create(req, res, next),
  );

  assert.strictEqual(res.statusCode, 201);
  assert.deepStrictEqual(res.body, created);
  assert.strictEqual(next.calls.length, 0);
});

test('create calls next(err) when the service throws', async () => {
  const err = new AppError(400, 'VALIDATION_ERROR', '종료일은 시작일 이후여야 합니다.');
  const req = { user: { id: 1 }, body: {} };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(todosService, 'createTodo', async () => { throw err; }, () => todosController.create(req, res, next));

  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.calls[0], err);
});

test('update responds 200 with the updated todo and forwards params.id/body', async () => {
  const body = { title: '수정된 제목' };
  const updated = { id: 5, title: '수정된 제목', status: '진행중' };
  const req = { user: { id: 1 }, params: { id: '5' }, body };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(
    todosService,
    'updateTodo',
    async (userId, todoId, patch) => {
      assert.strictEqual(userId, 1);
      assert.strictEqual(todoId, '5');
      assert.deepStrictEqual(patch, body);
      return updated;
    },
    () => todosController.update(req, res, next),
  );

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body, updated);
  assert.strictEqual(next.calls.length, 0);
});

test('update calls next(err) when the service throws (e.g. 404 not found)', async () => {
  const err = new AppError(404, 'NOT_FOUND', '할 일을 찾을 수 없습니다.');
  const req = { user: { id: 1 }, params: { id: '999' }, body: {} };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(todosService, 'updateTodo', async () => { throw err; }, () => todosController.update(req, res, next));

  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.calls[0], err);
});

test('remove responds 204 with no body and forwards params.id', async () => {
  const req = { user: { id: 1 }, params: { id: '5' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(
    todosService,
    'deleteTodo',
    async (userId, todoId) => {
      assert.strictEqual(userId, 1);
      assert.strictEqual(todoId, '5');
      return undefined;
    },
    () => todosController.remove(req, res, next),
  );

  assert.strictEqual(res.statusCode, 204);
  assert.strictEqual(res.sent, true);
  assert.strictEqual(res.body, null);
  assert.strictEqual(next.calls.length, 0);
});

test('remove calls next(err) when the service throws (e.g. 403 forbidden)', async () => {
  const err = new AppError(403, 'FORBIDDEN', '리소스에 대한 권한이 없습니다.');
  const req = { user: { id: 1 }, params: { id: '5' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(todosService, 'deleteTodo', async () => { throw err; }, () => todosController.remove(req, res, next));

  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.calls[0], err);
});
