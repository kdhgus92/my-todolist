const test = require('node:test');
const assert = require('node:assert');
const usersService = require('../src/services/users.service');
const usersRepo = require('../src/repositories/users.repository');

function withMock(target, name, impl, fn) {
  const original = target[name];
  target[name] = impl;
  return Promise.resolve(fn()).finally(() => {
    target[name] = original;
  });
}

test('updateProfile calls usersRepo.updateName with userId and name, and returns the user without a password field', async () => {
  const updatedRow = {
    id: 1,
    email: 'user@example.com',
    password: 'hashed',
    name: '새이름',
    createdAt: '2026-01-01T00:00:00.000Z',
  };
  let calledWith;

  const result = await withMock(
    usersRepo,
    'updateName',
    async (id, name) => {
      calledWith = { id, name };
      return updatedRow;
    },
    () => usersService.updateProfile(1, { name: '새이름' }),
  );

  assert.deepStrictEqual(calledWith, { id: 1, name: '새이름' });
  assert.deepStrictEqual(result, {
    id: 1,
    email: 'user@example.com',
    name: '새이름',
    createdAt: '2026-01-01T00:00:00.000Z',
  });
  assert.strictEqual(result.password, undefined);
});
