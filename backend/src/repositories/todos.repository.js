const pool = require('../config/db');
const { toCamelCase } = require('../utils/caseMapper');

async function create({ userId, categoryId, title, startDate, endDate }, client = pool) {
  const result = await client.query(
    'INSERT INTO todos (user_id, category_id, title, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, categoryId, title, startDate, endDate]
  );
  return toCamelCase(result.rows[0]);
}

async function findById(id, client = pool) {
  const result = await client.query('SELECT * FROM todos WHERE id = $1', [id]);
  return toCamelCase(result.rows[0]) || null;
}

async function findAllByUserId(userId, { categoryId } = {}, client = pool) {
  if (categoryId) {
    const result = await client.query(
      'SELECT * FROM todos WHERE user_id = $1 AND category_id = $2 ORDER BY created_at ASC',
      [userId, categoryId]
    );
    return result.rows.map(toCamelCase);
  }
  const result = await client.query(
    'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at ASC',
    [userId]
  );
  return result.rows.map(toCamelCase);
}

async function update(id, { title, startDate, endDate, categoryId, isDone }, client = pool) {
  const result = await client.query(
    `UPDATE todos SET
       title = COALESCE($2, title),
       start_date = COALESCE($3, start_date),
       end_date = COALESCE($4, end_date),
       category_id = COALESCE($5, category_id),
       is_done = COALESCE($6, is_done)
     WHERE id = $1 RETURNING *`,
    [id, title, startDate, endDate, categoryId, isDone]
  );
  return toCamelCase(result.rows[0]);
}

async function remove(id, client = pool) {
  await client.query('DELETE FROM todos WHERE id = $1', [id]);
}

module.exports = { create, findById, findAllByUserId, update, remove };
