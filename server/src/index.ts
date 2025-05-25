import express from 'express';
import cors from 'cors';
import pool from './db';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://gimmegear.netlify.app']
}));

app.get('/api/hello', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: `DB time is ${result.rows[0].now}` });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
