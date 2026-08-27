const test = require('node:test');
const assert = require('node:assert');
const categoriesController = require('../src/controllers/categories.controller');
const categoriesService = require('../src/services/categories.service');
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

test('list responds 200 with the array of categories from the service', async () => {
  const categories = [{ id: 1, userId: 1, name: '기본', isDefault: true }];
  const req = { user: { id: 1 } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(categoriesService, 'listCategories', async (userId) => {
    assert.strictEqual(userId, 1);
    return categories;
  }, () => categoriesController.list(req, res, next));

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body, categories);
  assert.strictEqual(next.calls.length, 0);
});

test('list calls next(err) when the service throws', async () => {
  const err = new Error('db down');
  const req = { user: { id: 1 } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(categoriesService, 'listCategories', async () => {
    throw err;
  }, () => categoriesController.list(req, res, next));

  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0], err);
});

test('create responds 201 with the created category', async () => {
  const created = { id: 2, userId: 1, name: '업무', isDefault: false };
  const req = { user: { id: 1 }, body: { name: '업무' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(categoriesService, 'createCategory', async (userId, name) => {
    assert.strictEqual(userId, 1);
    assert.strictEqual(name, '업무');
    return created;
  }, () => categoriesController.create(req, res, next));

  assert.strictEqual(res.statusCode, 201);
  assert.deepStrictEqual(res.body, created);
  assert.strictEqual(next.calls.length, 0);
});

test('create calls next(err) when the service throws (e.g. 409 duplicate name)', async () => {
  const err = new AppError(409, 'CATEGORY_NAME_ALREADY_EXISTS', '이미 존재하는 카테고리명입니다.');
  const req = { user: { id: 1 }, body: { name: '기본' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(categoriesService, 'createCategory', async () => {
    throw err;
  }, () => categoriesController.create(req, res, next));

  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0], err);
});

test('remove responds 204 with no body on success', async () => {
  const req = { user: { id: 1 }, params: { id: '5' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(categoriesService, 'deleteCategory', async (userId, categoryId) => {
    assert.strictEqual(userId, 1);
    assert.strictEqual(categoryId, '5');
    return undefined;
  }, () => categoriesController.remove(req, res, next));

  assert.strictEqual(res.statusCode, 204);
  assert.strictEqual(res.sent, true);
  assert.strictEqual(res.body, null);
  assert.strictEqual(next.calls.length, 0);
});

test('remove calls next(err) when the service throws (e.g. 404 not found)', async () => {
  const err = new AppError(404, 'NOT_FOUND', '카테고리를 찾을 수 없습니다.');
  const req = { user: { id: 1 }, params: { id: '999' } };
  const res = createMockRes();
  const next = createMockNext();

  await withMock(categoriesService, 'deleteCategory', async () => {
    throw err;
  }, () => categoriesController.remove(req, res, next));

  assert.strictEqual(res.statusCode, null);
  assert.strictEqual(next.calls.length, 1);
  assert.strictEqual(next.calls[0], err);
});
