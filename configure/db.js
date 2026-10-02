const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
     database: "conversion",
    password: "Hammad01",
    port: 5432
});

module.exports = pool;