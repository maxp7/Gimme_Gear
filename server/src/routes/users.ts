import { Router } from 'express';
import pool from '../db';

const router = Router();

router.post('/addUser', async (req, res) => {
  const { firstname, secondname, matrikelnumber, email } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO users (firstname, secondname, matrikelnumber, email) VALUES ($1, $2, $3, $4) ON CONFLICT (matrikelnumber) DO NOTHING RETURNING *',
      [firstname, secondname, matrikelnumber, email]
    );
    res.status(201).json({ message: 'User added', user: result.rows[0] });
  } catch (err) {
    console.error('User insert error:', err);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

router.get('/getUsers', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT matrikelnumber, firstname, secondname, email FROM users ORDER BY matrikelnumber ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.delete('/deleteUser/:matrikelnumber', async (req, res): Promise<any> => {
  const { matrikelnumber } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE matrikelnumber = $1',
      [matrikelnumber]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('User delete error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.put('/updateUser/:matrikelnumber', async (req, res): Promise<any> => {
  const { matrikelnumber } = req.params;
  const { firstname, secondname, email } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET firstname = $1, secondname = $2, email = $3 
       WHERE matrikelnumber = $4
       RETURNING *`,
      [firstname, secondname, email, matrikelnumber]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated', user: result.rows[0] });
  } catch (err) {
    console.error('User update error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});
export default router;
