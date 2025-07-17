import { Router } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM devices');
    res.json({ devices: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

router.get('/schema', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name IN ('devices', 'reservations', 'users')
      ORDER BY table_name, ordinal_position
    `);

    console.log('Devices table schema:');
    console.table(result.rows);

    res.json({ schema: result.rows });
  } catch (err) {
    console.error('Error fetching schema:', err);
    res.status(500).json({ error: 'Failed to fetch schema' });
  }
});

router.post('/', async (req, res) => {
  const { deviceid, devicename, devicedescription, full_description, status, owner, location, comments } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO devices (deviceid, devicename, devicedescription, full_description, status, owner, location, comments)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [deviceid, devicename, devicedescription, full_description, status,  owner, location, comments]
    );
    res.status(201).json({ message: 'Device added', device: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add device' });
  }
});

router.delete('/:deviceid', async (req, res):Promise<any>  => {
  const { deviceid } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM devices WHERE deviceid = $1 RETURNING *',
      [deviceid]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }
    res.json({ message: 'Device deleted', device: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete device' });
  }
});

export default router;
