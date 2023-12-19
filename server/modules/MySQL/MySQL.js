const MySQL = require("mysql2/promise");
module.exports = PoolQuerys = MySQL.createPool({
    host: "localhost",
    user: "root",
    database: "cite",
    password:  ""
});