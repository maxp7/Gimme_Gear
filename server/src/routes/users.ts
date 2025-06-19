import { Router } from 'express';
import pool from '../db';

const router = Router();

router.post('/', async (req, res) => {
  const { firstname, secondname, matrikelnumber, email } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO users (firstname, secondname, matrikelnumber, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstname, secondname, matrikelnumber, email]
    );
    res.status(201).json({ message: 'User added', user: result.rows[0] });
  } catch (err) {
    console.error('User insert error:', err);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

export default router;
