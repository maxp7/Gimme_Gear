import express from 'express';
import cors from 'cors';
import pool from './db';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://gimmegear.netlify.app']
}));

app.get('/api/hello', async (_req, res) => {
  try {
    const usersResult = await pool.query('SELECT * FROM users');
    const devicesResult = await pool.query('SELECT * FROM devices');
    const reservationsResult = await pool.query('SELECT * FROM reservations');

    res.json({
      users: usersResult.rows,
      devices: devicesResult.rows,
      reservations: reservationsResult.rows,
    });
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
