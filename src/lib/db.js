import { Pool } from "pg";
import dotenv from "dotenv"

dotenv.config();

const requiredEnvVars = ["DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Environment variable ${varName} is not set.`);
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

console.log("DB_USER", process.env.DB_USER);
console.log("DB_PASSWORD", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);

const pool = new Pool({
user:process.env.DB_USER,
host:process.env.DB_HOST,
database:process.env.DB_NAME,
password:process.env.DB_PASSWORD,
port:process.env.DB_PORT
});
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Database connected successfully');
        pool.query("SELECT 1", (err, res) => {
          if (err) {
            console.error("Database connection test failed:", err);
          } else {
            console.log("Database connection test succeeded:", res.rows);
          }
        });
    }
    release();
});

export { pool };