import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'  // nur die URL deiner React-App erlauben
}));

app.get('/api/hello', (_req, res) => {
  console.log('Route /api/hello wurde aufgerufen');
  res.json({ message: 'Hello from Express minimal server!' });
});

app.listen(8000, () => {
  console.log('Server läuft auf http://localhost:8000');
});
