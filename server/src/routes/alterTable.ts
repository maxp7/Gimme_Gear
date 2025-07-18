import { Router } from 'express';
import pool from '../db';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM devices WHERE deviceid = 'lp-356';
    `);

    // log the whole result
    console.log(result);

    // log just the rows (what you care about)
    console.log('Rows:', result.rows);

    res.json({ message: "✅ Query executed", rows: result.rows });
  } catch (error) {
    console.error('Error querying table:', error);
    res.status(500).json({ error: '❌ Failed to query table.' });
  }
});

export default router;
