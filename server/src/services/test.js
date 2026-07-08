require("dotenv").config({
    path: "../../.env",
});
const pool = require("../config/DbConnection");

console.log(process.env.CLOUD_DB, "my bd connection inside test.js");
const FunckingFunction = async () => {
    const dbInfo = await pool.query(`
        SELECT
            current_database(),
            current_schema(),
            inet_server_addr(),
            inet_server_port(),
            version();
        `);

console.log(dbInfo.rows);
}

console.log(pool.options);

FunckingFunction()
