// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.log("Database Connection Failed", err);
//   } else {
//     console.log("MySQL Connected Successfully");
//   }
// });

// module.exports = db;

const mysql = require("mysql2/promise");

if (!process.env.MYSQL_URL) {
  console.error("❌ MYSQL_URL is missing in environment");
}

const pool = mysql.createPool(process.env.MYSQL_URL);

module.exports = pool;