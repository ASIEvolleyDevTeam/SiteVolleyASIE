// db.js
const fs = require("fs");
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: useCa
    ? {
        ca: fs.readFileSync("./ca.pem"), // Aiven requires SSL
        rejectUnauthorized: true,
      }
    : false,
});

module.exports = pool.promise();
