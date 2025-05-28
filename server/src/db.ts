import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Loads .env in local only

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Needed for most hosted Postgres (like Render)
  },
});

export default pool;
