const { Pool, types } = require('pg');
const { dbConnectionString } = require('./env');

// DATE 컬럼(oid 1082)을 JS Date 대신 'YYYY-MM-DD' 문자열로 반환(todos.start_date/end_date 문자열 비교용)
types.setTypeParser(1082, (val) => val);

const pool = new Pool({
  connectionString: dbConnectionString,
  max: 20,
});

module.exports = pool;
