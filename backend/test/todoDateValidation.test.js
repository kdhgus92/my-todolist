const test = require('node:test');
const assert = require('node:assert');
const { isValidDateRange } = require('../src/utils/todoRules');

test('isValidDateRange returns true when endDate is after startDate', () => {
  assert.strictEqual(isValidDateRange('2026-08-01', '2026-08-10'), true);
});

test('isValidDateRange returns true when endDate equals startDate', () => {
  assert.strictEqual(isValidDateRange('2026-08-01', '2026-08-01'), true);
});

test('isValidDateRange returns false when endDate is before startDate', () => {
  assert.strictEqual(isValidDateRange('2026-08-10', '2026-08-01'), false);
});

test('isValidDateRange returns false when endDate is one day before startDate', () => {
  assert.strictEqual(isValidDateRange('2026-08-02', '2026-08-01'), false);
});

test('isValidDateRange handles cross-month ranges correctly', () => {
  assert.strictEqual(isValidDateRange('2026-08-31', '2026-09-01'), true);
  assert.strictEqual(isValidDateRange('2026-09-01', '2026-08-31'), false);
});
