
import { Router } from 'express';
import pool from '../db';
import { verifyAdminToken } from './auth'; // Assuming you have this middleware

const router = Router();


router.use(verifyAdminToken);

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
    r.reservationnumber,
    r.startdate,
    r.enddate,
    r.status,
    d.comments,
    d.deviceid AS deviceid,
    d.devicename AS devicename,
    u.matrikelnumber,
    u.firstname,
    u.secondname,
    u.email
FROM reservations r
JOIN devices d ON r.deviceid = d.deviceid
JOIN users u ON r.matrikelnumber = u.matrikelnumber
ORDER BY r.startdate;

      
    `);
    res.json({ reservations: result.rows });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
