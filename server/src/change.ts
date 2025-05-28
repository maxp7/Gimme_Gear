import { Pool } from 'pg';
// just to change the DB fields for a test
const pool = new Pool({
  connectionString: 'postgresql://postgres:4Ctfp%26zjLP-UpE%3F@db.popwyadrdgulohlzjajf.supabase.co:5432/postgres' // or your config
});

async function changeDeviceIdToText(): Promise<void> {
  try {
    await pool.query(`
      ALTER TABLE devices
      ALTER COLUMN deviceid TYPE text USING deviceid::text;
    `);
    console.log('deviceid column type changed to text');
  } catch (err) {
    console.error('Error changing deviceid column type:', err);
  } finally {
    await pool.end();
  }
}

changeDeviceIdToText();
