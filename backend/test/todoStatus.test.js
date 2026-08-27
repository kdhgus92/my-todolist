const test = require('node:test');
const assert = require('node:assert');
const { computeStatus } = require('../src/utils/todoRules');

const today = new Date('2026-08-25');

test('computeStatus returns 완료 when isDone is true, regardless of dates', () => {
  const result = computeStatus(
    { startDate: '2026-08-01', endDate: '2026-08-10', isDone: true },
    today,
  );
  assert.strictEqual(result, '완료');
});

test('computeStatus returns 완료 when isDone is true even if dates are in the future', () => {
  const result = computeStatus(
    { startDate: '2026-09-01', endDate: '2026-09-10', isDone: true },
    today,
  );
  assert.strictEqual(result, '완료');
});

test('computeStatus returns 시작전 when today is before startDate', () => {
  const result = computeStatus(
    { startDate: '2026-08-26', endDate: '2026-08-30', isDone: false },
    today,
  );
  assert.strictEqual(result, '시작전');
});

test('computeStatus returns 진행중 when today is between startDate and endDate', () => {
  const result = computeStatus(
    { startDate: '2026-08-20', endDate: '2026-08-30', isDone: false },
    today,
  );
  assert.strictEqual(result, '진행중');
});

test('computeStatus returns 진행중 when today equals startDate (boundary)', () => {
  const result = computeStatus(
    { startDate: '2026-08-25', endDate: '2026-08-30', isDone: false },
    today,
  );
  assert.strictEqual(result, '진행중');
});

test('computeStatus returns 진행중 when today equals endDate (boundary)', () => {
  const result = computeStatus(
    { startDate: '2026-08-20', endDate: '2026-08-25', isDone: false },
    today,
  );
  assert.strictEqual(result, '진행중');
});

test('computeStatus returns 기한초과 when today is after endDate', () => {
  const result = computeStatus(
    { startDate: '2026-08-01', endDate: '2026-08-24', isDone: false },
    today,
  );
  assert.strictEqual(result, '기한초과');
});

test('computeStatus defaults today to the current time when not provided', () => {
  const future = new Date();
  future.setFullYear(future.getFullYear() + 1);
  const startDate = future.toISOString().slice(0, 10);
  const result = computeStatus({ startDate, endDate: startDate, isDone: false });
  assert.strictEqual(result, '시작전');
});
