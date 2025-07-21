import { Router } from 'express';
import pool from '../db';

const router = Router();

router.get('/getDevices', async (_req, res) => {
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

router.post('/addDevice', async (req, res) => {
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

router.delete('/deleteDevice/:deviceid', async (req, res):Promise<any>  => {
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

router.put('/updateDevice/:deviceid', async (req, res):Promise<any> => {
  const { deviceid } = req.params;
  const {
    devicename,
    devicedescription,
    full_description,
    status,
    owner,
    location,
    comments,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE devices
       SET devicename = $1,
           devicedescription = $2,
           full_description = $3,
           status = $4,
           owner = $5,
           location = $6,
           comments = $7
       WHERE deviceid = $8
       RETURNING *`,
      [
        devicename,
        devicedescription,
        full_description,
        status,
        owner,
        location,
        comments,
        deviceid,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ message: 'Device updated', device: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update device' });
  }
});


router.delete('/deleteDeviceByName/:devicename', async (req, res):Promise <any> => {
  const { devicename } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM devices WHERE devicename = $1 RETURNING *',
      [devicename]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ message: 'Device deleted', device: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete device by name' });
  }
});


export default router;
