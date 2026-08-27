const pool = require('../config/db');
const { toCamelCase } = require('../utils/caseMapper');

async function createDefault({ userId, name = '기본' }, client = pool) {
  const result = await client.query(
    'INSERT INTO categories (user_id, name, is_default) VALUES ($1, $2, true) RETURNING *',
    [userId, name]
  );
  return toCamelCase(result.rows[0]);
}

async function findAllByUserId(userId, client = pool) {
  const result = await client.query('SELECT * FROM categories WHERE user_id = $1 ORDER BY created_at ASC', [userId]);
  return result.rows.map(toCamelCase);
}

async function findById(id, client = pool) {
  const result = await client.query('SELECT * FROM categories WHERE id = $1', [id]);
  return toCamelCase(result.rows[0]) || null;
}

async function findDefaultByUserId(userId, client = pool) {
  const result = await client.query('SELECT * FROM categories WHERE user_id = $1 AND is_default = true', [userId]);
  return toCamelCase(result.rows[0]) || null;
}

async function create({ userId, name }, client = pool) {
  const result = await client.query(
    'INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING *',
    [userId, name]
  );
  return toCamelCase(result.rows[0]);
}

async function remove(id, client = pool) {
  await client.query('DELETE FROM categories WHERE id = $1', [id]);
}

async function reassignTodosToCategory(fromCategoryId, toCategoryId, client = pool) {
  await client.query('UPDATE todos SET category_id = $2 WHERE category_id = $1', [fromCategoryId, toCategoryId]);
}

module.exports = { createDefault, findAllByUserId, findById, findDefaultByUserId, create, remove, reassignTodosToCategory };
