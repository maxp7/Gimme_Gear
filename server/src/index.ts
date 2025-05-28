import express from 'express';
import cors from 'cors';
import pool from './db'; // PostgreSQL pool

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'https://gimmegear.netlify.app'] }));
app.use(express.json()); 

app.get('/dbui', async (_req, res) => {
  try {
    const devicesResult = await pool.query('SELECT * FROM devices');
    res.json({ devices: devicesResult.rows });
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.post('/dbui', async (req, res) => {
  const {deviceid, devicename, devicedescription, status, comments } = req.body;

  try {
const result = await pool.query(
  'INSERT INTO devices (deviceid, devicename, devicedescription, status, comments) VALUES ($1, $2, $3, $4, $5) RETURNING *',
  [deviceid, devicename, devicedescription, status, comments]
);

    console.log('Inserted device:', result.rows[0]); // Add this!
    res.status(201).json({ message: 'Device added', device: result.rows[0] });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Failed to add device' });
  }
});
app.delete('/dbui/:deviceid', async (req, res):Promise<any> => {
  const deviceid = String(req.params.deviceid);

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
    console.error(err);
    res.status(500).json({ error: 'Failed to delete device' });
  }
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
