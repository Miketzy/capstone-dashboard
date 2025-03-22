import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();  // Load .env variables

const pool = new Pool({
  connectionString: "postgresql://reposatory:71YyyVsRMV2544ho7UjtQcGw3UcHXUSg@dpg-cvemttd2ng1s73ci1oag-a.oregon-postgres.render.com/reposatory",
  ssl: { rejectUnauthorized: false }, // Required for cloud databases like Render
});

export default pool;
