import { Router } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const devicenameRaw = req.query.devicename;
  const devicename = typeof devicenameRaw === 'string' ? devicenameRaw : undefined;

  console.log('Received devicename filter:', devicename);

  try {
    let sql = `
      SELECT
    u.firstname,
    u.secondname,
    r.reservationnumber,
    r.startdate,
    r.enddate,
    r.status,
    r.matrikelnumber,
    d.deviceid,
    d.devicename
  FROM reservations r
  JOIN devices d ON r.deviceid = d.deviceid
  JOIN users u ON r.matrikelnumber = u.matrikelnumber
  WHERE 1=1
`;
const params: any[] = [];

    if (devicename) {
      sql += ' AND d.devicename = $1';
      params.push(devicename);
    }

    sql += ' ORDER BY r.startdate ASC';

    const result = await pool.query(sql, params);

    res.json({ reservations: result.rows });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/add-description', async (req, res) => {
  try {
    await pool.query(`
      ALTER TABLE devices
      ADD COLUMN IF NOT EXISTS full_description TEXT;
    `);
    res.json({ message: 'Column full_description added (if not already present).' });
  } catch (error) {
    console.error('Error altering table:', error);
    res.status(500).json({ error: 'Failed to alter table.' });
  }
});
export default router;
