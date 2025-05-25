import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './db';  
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://gimmegear.netlify.app'
];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.get('/api/hello', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: `DB time is ${result.rows[0].now}` });
  } catch (error: unknown) {
    console.error(error);

    // Narrow error type for safer handling:
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});