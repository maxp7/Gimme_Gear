import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, './.env') });

import { Pool, types } from 'pg';


types.setTypeParser(1082, (val) => val); 

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL not set');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, 
});

export default pool;
