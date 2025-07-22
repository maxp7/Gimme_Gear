
import { Router } from 'express';
import pool from '../db';
import { verifyAdminToken } from './auth';

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

router.patch('/:reservationnumber', async (req, res):Promise<any>  => {
  const { reservationnumber } = req.params;
  const { startdate, enddate, status } = req.body;

  console.log(`Received PATCH for reservationnumber: ${reservationnumber}`);
  console.log('Request body:', req.body);

  try {
    const result = await pool.query(
      `UPDATE reservations
       SET startdate = $1, enddate = $2, status = $3
       WHERE reservationnumber = $4
       RETURNING *`,
      [startdate, enddate, status, reservationnumber]
    );

    console.log(`Update query result rowCount: ${result.rowCount}`);
    if (result.rowCount === 0) {
      console.log('No reservation found with that reservationnumber.');
      return res.status(404).json({ error: "Reservation not found" });
    }

    console.log('Reservation updated:', result.rows[0]);
    res.json({ reservation: result.rows[0] });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete('/:reservationnumber', async (req, res):Promise<any>  => {
  const reservationnumber = Number(req.params.reservationnumber);
  try {
    const result = await pool.query(
      'DELETE FROM reservations WHERE reservationnumber = $1 RETURNING *',
      [reservationnumber]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted', reservation: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});


export default router;
