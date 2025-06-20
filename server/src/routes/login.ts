import { Router } from 'express';
import jwt from 'jsonwebtoken';
require('dotenv').config();
const router = Router();

const SECRET = process.env.SECRET;

if (!SECRET) {
  throw new Error('SECRET environment variable is not defined');
}

const adminLogin = process.env.adminLogin;
const adminPasswort = process.env.adminPasswort;

if (!adminLogin || !adminPasswort) {
  throw new Error('Admin login credentials are not defined in environment variables');
}

const adminCredentials = {
  username: adminLogin,
  password: adminPasswort,
};

router.post('/', async (req, res):Promise<any> => {
  try {
    const { username, password } = req.body;

    if (username === adminCredentials.username && password === adminCredentials.password) {
      const token = jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '1h' });
      return res.json({ token });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
