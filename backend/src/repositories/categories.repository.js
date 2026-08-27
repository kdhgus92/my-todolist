const pool = require('../config/db');
const { toCamelCase } = require('../utils/caseMapper');

async function createDefault({ userId, name = '기본' }, client = pool) {
  const result = await client.query(
    'INSERT INTO categories (user_id, name, is_default) VALUES ($1, $2, true) RETURNING *',
    [userId, name]
  );
  return toCamelCase(result.rows[0]);
}

module.exports = { createDefault };
