import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

const pool = new Pool({
  connectionString: process.env.PG_HOST,  // Using the full connection string from the .env file
  ssl: { rejectUnauthorized: false },  // Important for Render
});

// Connect to the database
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL Database"))
  .catch((err) => console.error("❌ Database Connection Failed:", err));

export default pool;
