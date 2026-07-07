const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.CLOUD_DB,
});

module.exports = pool;