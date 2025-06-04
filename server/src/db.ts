import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, './.env') });

import { Pool, types } from 'pg';

// 👇 Add this line: override the DATE parser (OID 1082)
types.setTypeParser(1082, (val) => val); // returns the raw 'YYYY-MM-DD' string

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL not set');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // for Render DB
});

export default pool;
