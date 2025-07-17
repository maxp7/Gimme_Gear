import { Router } from 'express';
import pool from '../db';

const router = Router();

router.post('/', async (req, res) => {
  try {
    await pool.query(`
      ALTER TABLE devices
      ADD COLUMN IF NOT EXISTS full_description TEXT;
    `);
    res.json({ message: '✅ Column full_description added (if not already present).' });
  } catch (error) {
    console.error('Error altering table:', error);
    res.status(500).json({ error: '❌ Failed to alter table.' });
  }
});

export default router;
