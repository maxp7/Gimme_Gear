
import { Router } from 'express';
import pool from '../db';
import { verifyAdminToken } from './auth'; // Assuming you have this middleware

const router = Router();


router.use(verifyAdminToken);

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservations');
    res.json({ reservations: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});


export default router;
