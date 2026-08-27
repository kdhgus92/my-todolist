const todosRepo = require('../repositories/todos.repository');
const categoriesRepo = require('../repositories/categories.repository');
const AppError = require('../utils/appError');
const { assertOwnership } = require('../utils/ownership');
const { isValidDateRange, computeStatus } = require('../utils/todoRules');

const VALID_STATUSES = ['시작전', '진행중', '완료', '기한초과'];

async function listTodos(userId, { categoryId, status } = {}) {
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    throw new AppError(400, 'VALIDATION_ERROR', '유효하지 않은 status 값입니다.');
  }
  const todos = await todosRepo.findAllByUserId(userId, { categoryId });
  const withStatus = todos.map((t) => ({ ...t, status: computeStatus(t) }));
  return status ? withStatus.filter((t) => t.status === status) : withStatus;
}

async function createTodo(userId, { title, startDate, endDate, categoryId }) {
  if (!isValidDateRange(startDate, endDate)) {
    throw new AppError(400, 'VALIDATION_ERROR', '종료일자는 시작일자보다 빠를 수 없습니다.');
  }
  let finalCategoryId = categoryId;
  if (!finalCategoryId) {
    const defaultCategory = await categoriesRepo.findDefaultByUserId(userId);
    finalCategoryId = defaultCategory.id;
  }
  const todo = await todosRepo.create({ userId, categoryId: finalCategoryId, title, startDate, endDate });
  return { ...todo, status: computeStatus(todo) };
}

async function updateTodo(userId, todoId, patch) {
  const existing = await todosRepo.findById(todoId);
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', '할일을 찾을 수 없습니다.');
  }
  assertOwnership(existing.userId, userId);

  const merged = {
    title: patch.title ?? existing.title,
    startDate: patch.startDate ?? existing.startDate,
    endDate: patch.endDate ?? existing.endDate,
    categoryId: patch.categoryId ?? existing.categoryId,
    isDone: patch.isDone ?? existing.isDone,
  };

  if (!isValidDateRange(merged.startDate, merged.endDate)) {
    throw new AppError(400, 'VALIDATION_ERROR', '종료일자는 시작일자보다 빠를 수 없습니다.');
  }

  const updated = await todosRepo.update(todoId, merged);
  return { ...updated, status: computeStatus(updated) };
}

async function deleteTodo(userId, todoId) {
  const existing = await todosRepo.findById(todoId);
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', '할일을 찾을 수 없습니다.');
  }
  assertOwnership(existing.userId, userId);
  await todosRepo.remove(todoId);
}

module.exports = { listTodos, createTodo, updateTodo, deleteTodo };
