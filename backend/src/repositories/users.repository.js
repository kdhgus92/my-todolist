const pool = require('../config/db');
const { toCamelCase } = require('../utils/caseMapper');

async function findByEmail(email, client = pool) {
  const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
  return toCamelCase(result.rows[0]) || null;
}

async function create({ email, password, name }, client = pool) {
  const result = await client.query(
    'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
    [email, password, name]
  );
  return toCamelCase(result.rows[0]);
}

module.exports = { findByEmail, create };
