import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: 'postgresql://postgres:4Ctfp%26zjLP-UpE%3F@db.popwyadrdgulohlzjajf.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
