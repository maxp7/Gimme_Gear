import express, { Request, Response } from 'express';
import cors from 'cors';

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

app.get('/api/hello', (_req: Request, res: Response) => {
  console.log('Route /api/hello wurde aufgerufen');
  res.json({ message: 'Hello from Express minimal server!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});