import { Pool } from "pg";

if (!process.env.DB_URL) {
  throw new Error("DB_URL is required to create a pool to the database");
}

export const pool = new Pool({
  connectionString: process.env.DB_URL,
});
