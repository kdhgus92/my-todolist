const test = require('node:test');
const assert = require('node:assert');
const { createHealthHandler } = require('../src/app');

function createMockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test('responds 200 with ok status when db query succeeds', async () => {
  const mockPool = { query: async () => ({ rows: [{ '?column?': 1 }] }) };
  const handler = createHealthHandler(mockPool);
  const req = {};
  const res = createMockRes();

  await handler(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body, { status: 'ok', db: 'ok' });
});

test('responds 503 with error status when db query fails', async () => {
  const mockPool = { query: async () => { throw new Error('connection refused'); } };
  const handler = createHealthHandler(mockPool);
  const req = {};
  const res = createMockRes();

  await handler(req, res);

  assert.strictEqual(res.statusCode, 503);
  assert.deepStrictEqual(res.body, { status: 'error', db: 'error' });
});
