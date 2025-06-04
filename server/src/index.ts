import express from 'express';
import cors from 'cors';
import pool from './db'; // PostgreSQL pool

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'https://gimmegear.netlify.app'] }));
app.use(express.json()); 

// Get all reservations
app.get('/reservations', async (_req, res) => {
  try {
    const reservationsResult = await pool.query(`
      SELECT * from reservations
    `);
    res.json({ reservations: reservationsResult.rows });
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

app.post('/reservations', async (req, res): Promise<any> => {
  const {
    firstname,
    secondname,
    email,
    matrikelnumber,
    deviceid,
    startdate,
    enddate,
  } = req.body;

  // Basic input‑validation
  if (
    !firstname || !secondname || !email || !matrikelnumber ||
    !deviceid || !startdate || !enddate
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // 2️⃣ Upsert / update the user record
    await client.query(
      `INSERT INTO users (matrikelnumber, email, firstname, secondname)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (matrikelnumber) DO UPDATE
       SET email = EXCLUDED.email,
           firstname = EXCLUDED.firstname,
           secondname = EXCLUDED.secondname`,
      [matrikelnumber, email, firstname, secondname]
    );

    // 3️⃣ Check for conflicting reservations in the requested time range
    const conflictCheck = await client.query(
  `SELECT 1 FROM reservations r
   WHERE r.deviceid = $1
     AND r.status IN ('Reserved', 'Rented out')
     AND NOT (
       $3::date < r.startdate OR
       $2::date > r.enddate
     )
   LIMIT 1`,
  [deviceid, startdate, enddate]
);

    if(conflictCheck.rowCount){
      if (conflictCheck.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: 'Device is already reserved or rented out for the requested period',
      });
    }}
    

    // 4️⃣ Insert the reservation row (status = 'Reserved')
    const reservationResult = await client.query(
      `INSERT INTO reservations
         (matrikelnumber, startdate, enddate, status, deviceid)
       VALUES ($1, $2, $3, 'Reserved', $4)
       RETURNING *`,
      [matrikelnumber, startdate, enddate, deviceid]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Reservation created',
      reservation: reservationResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Reservation creation error:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  } finally {
    client.release();
  }
});



// Delete a reservation by reservationnumber
app.delete('/reservations/:reservationnumber', async (req, res):Promise<any> => {
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
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});





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

// GET /:name?start=YYYY-MM-DD&end=YYYY-MM-DD
app.get('/:name', async (req, res):Promise<any> => {
  const rawName = req.params.name;
  const name = decodeURIComponent(rawName);
  const prefixMap: Record<string, string> = {
    'Laptops': 'lp',
    'VR Headsets': 'vr',
    'Equipment': 'eq',
    'Audio & Lighting': 'al',
  };
  const prefix = prefixMap[name];
  if (!prefix) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  const { start, end } = req.query as { start?: string; end?: string };

  try {
    if (!start || !end) {
      // Return all devices that are not broken or under permanent maintenance
      // If you want to exclude those permanently unavailable devices
      const result = await pool.query(
        `SELECT * FROM devices WHERE deviceid LIKE $1 AND status = 'Available' ORDER BY deviceid`,
        [`${prefix}%`]
      );
      return res.json({ devices: result.rows });
    } else {
      // Return only devices available for the given date range
      const sql = `
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
      const result = await pool.query(sql, [`${prefix}%`, start, end]);
      return res.json({ devices: result.rows });
    }
  } catch (err) {
    console.error('availability query error:', err);
    return res.status(500).json({ error: 'Failed to fetch devices' });
  }
});





const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
