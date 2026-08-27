const { Pool } = require('pg');
const { dbConnectionString } = require('./env');

const pool = new Pool({
  connectionString: dbConnectionString,
  max: 20,
});

module.exports = pool;
