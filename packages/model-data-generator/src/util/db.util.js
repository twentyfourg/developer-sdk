const { createPool } = require('mysql2/promise');

let currentPool = false;

module.exports.createPool = async () => {
  const { READER_SQL_HOST, SQL_DATABASE, SQL_HOST, SQL_USER, SQL_PASSWORD } = process.env;
  const config = {
    timezone: 'Z',
    host: READER_SQL_HOST || SQL_HOST,
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
  };
  currentPool = createPool(config);
  return currentPool;
};

module.exports.getPool = async () => {
  if (currentPool) return currentPool;
  return this.createPool();
};

module.exports.end = async () => {
  if (currentPool) await currentPool.end();
};
