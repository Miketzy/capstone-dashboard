import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.PG_HOST,  // Using the full connection string from the .env file
  ssl: { rejectUnauthorized: false }, // Para sa Render
});

// Test database connection
pool.query("SELECT 1")
  .then(() => console.log("✅ Connected to PostgreSQL Database"))
  .catch((err) => console.error("❌ Database Connection Failed:", err));

  export default pool;  // ✅ Dapat "export default pool"