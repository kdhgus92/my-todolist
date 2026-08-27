const test = require('node:test');
const assert = require('node:assert');
const { validateEnv } = require('../src/config/env');

const baseEnv = {
  POSTGRES_CONNECTION_STRING: 'postgres://user:pass@localhost:5432/db',
  PORT: '3000',
  JWT_ACCESS_SECRET: 'access-secret',
  JWT_REFRESH_SECRET: 'refresh-secret',
  JWT_ACCESS_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',
};

test('returns expected shape when all required keys are present', () => {
  const result = validateEnv(baseEnv);

  assert.deepStrictEqual(result, {
    port: 3000,
    dbConnectionString: 'postgres://user:pass@localhost:5432/db',
    nodeEnv: 'development',
    corsOrigin: 'http://localhost:5173',
    jwt: {
      accessSecret: 'access-secret',
      refreshSecret: 'refresh-secret',
      accessExpiresIn: '15m',
      refreshExpiresIn: '7d',
    },
  });
});

test('throws when POSTGRES_CONNECTION_STRING is missing', () => {
  const { POSTGRES_CONNECTION_STRING, ...rest } = baseEnv;
  assert.throws(() => validateEnv(rest), Error);
});

test('throws when PORT is missing', () => {
  const { PORT, ...rest } = baseEnv;
  assert.throws(() => validateEnv(rest), Error);
});

test('throws when JWT_ACCESS_SECRET is missing', () => {
  const { JWT_ACCESS_SECRET, ...rest } = baseEnv;
  assert.throws(() => validateEnv(rest), Error);
});

test('throws when JWT_REFRESH_SECRET is missing', () => {
  const { JWT_REFRESH_SECRET, ...rest } = baseEnv;
  assert.throws(() => validateEnv(rest), Error);
});

test('coerces PORT string to a number', () => {
  const result = validateEnv({ ...baseEnv, PORT: '3000' });
  assert.strictEqual(result.port, 3000);
  assert.strictEqual(typeof result.port, 'number');
});

test('uses the given FRONTEND_ORIGIN when provided', () => {
  const result = validateEnv({ ...baseEnv, FRONTEND_ORIGIN: 'https://my-todolist.example.com' });
  assert.strictEqual(result.corsOrigin, 'https://my-todolist.example.com');
});

test('defaults nodeEnv to development when NODE_ENV is not set', () => {
  const result = validateEnv(baseEnv);
  assert.strictEqual(result.nodeEnv, 'development');
});

test('uses the given NODE_ENV when provided', () => {
  const result = validateEnv({ ...baseEnv, NODE_ENV: 'production' });
  assert.strictEqual(result.nodeEnv, 'production');
});
