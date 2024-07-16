const util = require("util");
const mysql2 = require("mysql2");

// Create a MySQL connection pool
const pool = mysql2.createPool({
  connectionLimit: 10, // Adjust as per your application's needs
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  // Add support for old authentication method if necessary
  insecureAuth: true, // Use this cautiously; it reduces security
});

// Test the connection to handle authentication issues
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
    console.error("Error connecting to database:", err);
  }
  if (connection) {
    connection.release();
  }
  return;
});

// Promisify the pool query method
const query = util.promisify(pool.query).bind(pool);

module.exports = { pool, query };
