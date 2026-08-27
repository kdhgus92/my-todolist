const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

function freshAppWithNodeEnv(nodeEnv) {
  const originalNodeEnv = process.env.NODE_ENV;
  if (nodeEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = nodeEnv;
  }

  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(path.join(__dirname, '..', 'src'))) {
      delete require.cache[key];
    }
  }

  const { app } = require('../src/app');

  if (originalNodeEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalNodeEnv;
  }

  return app;
}

function hasApiDocsRoute(app) {
  return app.router.stack.some((layer) => layer.name === 'serveStatic' || layer.name === 'swaggerInitFn');
}

test('mounts /api-docs when NODE_ENV is not production (development default)', () => {
  const app = freshAppWithNodeEnv(undefined);
  assert.strictEqual(hasApiDocsRoute(app), true);
});

test('mounts /api-docs when NODE_ENV is development', () => {
  const app = freshAppWithNodeEnv('development');
  assert.strictEqual(hasApiDocsRoute(app), true);
});

test('does not mount /api-docs when NODE_ENV is production', () => {
  const app = freshAppWithNodeEnv('production');
  assert.strictEqual(hasApiDocsRoute(app), false);
});
