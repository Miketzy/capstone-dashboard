import { Pool } from "pg";  // Directly import Pool from pg
import dotenv from "dotenv";

dotenv.config();  // Load environment variables from .env file

const pool = new Pool({
  connectionString: process.env.PG_HOST,  // Using the full connection string from the .env file
  ssl: { rejectUnauthorized: false },  // For Render Database SSL configuration
});

// Test database connection
pool.query("SELECT 1")
  .then(() => console.log("✅ Connected to PostgreSQL Database"))
  .catch((err) => console.error("❌ Database Connection Failed:", err));

export default pool;  // Export pool for use in other parts of your application
