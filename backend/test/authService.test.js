const test = require('node:test');
const assert = require('node:assert');
const authService = require('../src/services/auth.service');
const usersRepo = require('../src/repositories/users.repository');
const categoriesRepo = require('../src/repositories/categories.repository');
const { hashPassword } = require('../src/utils/password');
const { signRefreshToken } = require('../src/utils/jwt');

function withMocks(mocks, fn) {
  const originals = {};
  for (const [target, methods] of Object.entries(mocks)) {
    originals[target] = {};
    for (const [name, impl] of Object.entries(methods)) {
      originals[target][name] = target === 'usersRepo' ? usersRepo[name] : categoriesRepo[name];
      const repo = target === 'usersRepo' ? usersRepo : categoriesRepo;
      repo[name] = impl;
    }
  }

  return fn().finally(() => {
    for (const [target, methods] of Object.entries(mocks)) {
      const repo = target === 'usersRepo' ? usersRepo : categoriesRepo;
      for (const name of Object.keys(methods)) {
        repo[name] = originals[target][name];
      }
    }
  });
}

test('signup returns the created user without the password field', async () => {
  const createdUser = {
    id: 1,
    email: 'new@example.com',
    password: 'hashed-value',
    name: '홍길동',
    createdAt: '2026-01-01T00:00:00.000Z',
  };
  let createCalled = false;
  let createDefaultCalled = false;

  const result = await withMocks(
    {
      usersRepo: {
        findByEmail: async () => null,
        create: async () => {
          createCalled = true;
          return createdUser;
        },
      },
      categoriesRepo: {
        createDefault: async () => {
          createDefaultCalled = true;
          return { id: 1, userId: 1, name: '기본', isDefault: true };
        },
      },
    },
    () => authService.signup({ email: 'new@example.com', password: 'password1', name: '홍길동' }),
  );

  assert.ok(createCalled);
  assert.ok(createDefaultCalled);
  assert.deepStrictEqual(result, {
    id: 1,
    email: 'new@example.com',
    name: '홍길동',
    createdAt: '2026-01-01T00:00:00.000Z',
  });
  assert.strictEqual(result.password, undefined);
});

test('signup throws 409 CONFLICT when the email is already registered, without creating a user', async () => {
  let createCalled = false;

  await assert.rejects(
    () =>
      withMocks(
        {
          usersRepo: {
            findByEmail: async () => ({ id: 1, email: 'dup@example.com' }),
            create: async () => {
              createCalled = true;
              return {};
            },
          },
          categoriesRepo: {
            createDefault: async () => ({}),
          },
        },
        () => authService.signup({ email: 'dup@example.com', password: 'password1', name: '홍길동' }),
      ),
    (err) => {
      assert.strictEqual(err.statusCode, 409);
      assert.strictEqual(err.code, 'CONFLICT');
      assert.strictEqual(err.message, '이미 등록된 이메일입니다.');
      return true;
    },
  );

  assert.strictEqual(createCalled, false);
});

test('login returns tokens and the user without a password field on success', async () => {
  const hashed = await hashPassword('password1');

  const result = await withMocks(
    {
      usersRepo: {
        findByEmail: async () => ({
          id: 1,
          email: 'user@example.com',
          password: hashed,
          name: '홍길동',
          createdAt: '2026-01-01T00:00:00.000Z',
        }),
      },
      categoriesRepo: {},
    },
    () => authService.login({ email: 'user@example.com', password: 'password1' }),
  );

  assert.strictEqual(typeof result.accessToken, 'string');
  assert.strictEqual(typeof result.refreshToken, 'string');
  assert.deepStrictEqual(result.user, {
    id: 1,
    email: 'user@example.com',
    name: '홍길동',
    createdAt: '2026-01-01T00:00:00.000Z',
  });
});

test('login throws the same 401 INVALID_CREDENTIALS error when the email does not exist', async () => {
  await assert.rejects(
    () =>
      withMocks(
        {
          usersRepo: { findByEmail: async () => null },
          categoriesRepo: {},
        },
        () => authService.login({ email: 'nobody@example.com', password: 'password1' }),
      ),
    (err) => {
      assert.strictEqual(err.statusCode, 401);
      assert.strictEqual(err.code, 'INVALID_CREDENTIALS');
      assert.strictEqual(err.message, '이메일 또는 비밀번호가 올바르지 않습니다.');
      return true;
    },
  );
});

test('login throws the identical 401 INVALID_CREDENTIALS error when the password does not match (anti user-enumeration)', async () => {
  const hashed = await hashPassword('correct-password');

  let wrongPasswordError;
  let noUserError;

  try {
    await withMocks(
      {
        usersRepo: {
          findByEmail: async () => ({
            id: 1,
            email: 'user@example.com',
            password: hashed,
            name: '홍길동',
            createdAt: '2026-01-01T00:00:00.000Z',
          }),
        },
        categoriesRepo: {},
      },
      () => authService.login({ email: 'user@example.com', password: 'wrong-password' }),
    );
  } catch (err) {
    wrongPasswordError = err;
  }

  try {
    await withMocks(
      {
        usersRepo: { findByEmail: async () => null },
        categoriesRepo: {},
      },
      () => authService.login({ email: 'nobody@example.com', password: 'wrong-password' }),
    );
  } catch (err) {
    noUserError = err;
  }

  assert.ok(wrongPasswordError);
  assert.ok(noUserError);
  assert.strictEqual(wrongPasswordError.statusCode, noUserError.statusCode);
  assert.strictEqual(wrongPasswordError.code, noUserError.code);
  assert.strictEqual(wrongPasswordError.message, noUserError.message);
});

test('refresh returns a new accessToken for a valid refreshToken', async () => {
  const refreshToken = signRefreshToken({ id: 1, email: 'user@example.com' });

  const result = await authService.refresh(refreshToken);

  assert.strictEqual(typeof result.accessToken, 'string');
});

test('refresh throws 401 INVALID_REFRESH_TOKEN for an invalid token', async () => {
  await assert.rejects(() => authService.refresh('not-a-real-token'), (err) => {
    assert.strictEqual(err.statusCode, 401);
    assert.strictEqual(err.code, 'INVALID_REFRESH_TOKEN');
    assert.strictEqual(err.message, '다시 로그인해 주세요.');
    return true;
  });
});
