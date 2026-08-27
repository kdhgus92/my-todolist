const pool = require('../config/db');
const categoriesRepo = require('../repositories/categories.repository');
const AppError = require('../utils/appError');
const { assertOwnership } = require('../utils/ownership');

async function listCategories(userId) {
  return categoriesRepo.findAllByUserId(userId);
}

async function createCategory(userId, name) {
  try {
    return await categoriesRepo.create({ userId, name });
  } catch (err) {
    if (err.code === '23505') {
      throw new AppError(409, 'CATEGORY_NAME_ALREADY_EXISTS', '이미 존재하는 카테고리명입니다.');
    }
    throw err;
  }
}

async function deleteCategory(userId, categoryId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const category = await categoriesRepo.findById(categoryId, client);
    if (!category) {
      throw new AppError(404, 'NOT_FOUND', '카테고리를 찾을 수 없습니다.');
    }

    assertOwnership(category.userId, userId);

    if (category.isDefault) {
      throw new AppError(403, 'DEFAULT_CATEGORY_DELETE_FORBIDDEN', '기본 카테고리는 삭제할 수 없습니다.');
    }

    const defaultCategory = await categoriesRepo.findDefaultByUserId(userId, client);
    await categoriesRepo.reassignTodosToCategory(categoryId, defaultCategory.id, client);
    await categoriesRepo.remove(categoryId, client);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { listCategories, createCategory, deleteCategory };
