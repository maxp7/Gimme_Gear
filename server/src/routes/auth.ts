import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

require('dotenv').config();

const SECRET = process.env.SECRET;

if (!SECRET) {
  throw new Error('SECRET environment variable is not defined');
}

const secret: string = SECRET;

interface JwtPayload {
  role: string;
}

export function verifyAdminToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header missing' });
    return;  
  }

  const token = authHeader.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ message: 'Token missing' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as unknown;

    if (typeof payload !== 'object' || payload === null || !('role' in payload)) {
      res.status(401).json({ message: 'Invalid token payload' });
      return;
    }

    const jwtPayload = payload as JwtPayload;

    if (jwtPayload.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden: Admins only' });
      return;
    }

    (req as any).user = jwtPayload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
