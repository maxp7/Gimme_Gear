import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();
const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'https://gimmegear.netlify.app'] }));
app.use(express.json());


app.use(routes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
