// routes/categories.ts
import { Router } from 'express';
import pool from '../db';

const router = Router();

const prefixMap: Record<string, string> = {
  'Laptops': 'lp',
  'VR Headsets': 'vr',
  'Equipment': 'eq',
  'Audio & Lighting': 'al',
};

router.get('/:name', async (req, res):Promise<any> => {
  const { name: rawName } = req.params;
  const { start, end } = req.query as { start?: string; end?: string };

  const name = decodeURIComponent(rawName);
  const prefix = prefixMap[name];

  if (!prefix) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const sql = !start || !end
      ? `SELECT * FROM devices WHERE deviceid LIKE $1 AND status = 'Available' ORDER BY deviceid`
      : `
        SELECT d.*
        FROM devices d
        WHERE d.deviceid LIKE $1
          AND d.status = 'Available'
          AND NOT EXISTS (
            SELECT 1 FROM reservations r
            WHERE r.deviceid = d.deviceid
              AND r.status IN ('Reserved', 'Rented out')
              AND daterange(r.startdate, r.enddate, '[)') && daterange($2::date, $3::date, '[]')
          )
        ORDER BY d.deviceid
      `;

    const values = !start || !end ? [`${prefix}%`] : [`${prefix}%`, start, end];
    const result = await pool.query(sql, values);
    res.json({ devices: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category devices' });
  }
});

export default router;
