const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.CLOUD_DB,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = pool;