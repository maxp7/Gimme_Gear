// routes/reservations.ts
import { Router } from 'express';
import pool from '../db';
import nodemailer from 'nodemailer';

const router = Router();

router.get('/', async (_req, res):Promise<any>  => {
  try {
    const result = await pool.query('SELECT * FROM reservations');
    res.json({ reservations: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

router.post('/', async (req, res):Promise<any>  => {
  const {
    firstname, secondname, email, matrikelnumber,
    deviceid, startdate, enddate
  } = req.body;

  if (!firstname || !secondname || !email || !matrikelnumber || !deviceid || !startdate || !enddate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO users (matrikelnumber, email, firstname, secondname)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (matrikelnumber) DO UPDATE SET
         email = EXCLUDED.email,
         firstname = EXCLUDED.firstname,
         secondname = EXCLUDED.secondname`,
      [matrikelnumber, email, firstname, secondname]
    );

    const conflict = await client.query(
      `SELECT 1 FROM reservations WHERE deviceid = $1
       AND status IN ('Reserved', 'Rented out')
       AND NOT ($3::date < startdate OR $2::date > enddate)
       LIMIT 1`,
      [deviceid, startdate, enddate]
    );

     if(conflict.rowCount){
      if (conflict.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: 'Device is already reserved or rented out for the requested period',
      });
    }}

    const reservation = await client.query(
      `INSERT INTO reservations (matrikelnumber, startdate, enddate, status, deviceid)
       VALUES ($1, $2, $3, 'Reserved', $4)
       RETURNING *`,
      [matrikelnumber, startdate, enddate, deviceid]
    );

    await client.query('COMMIT');

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'gimmegear.mailagent@gmail.com',
        pass: 'xapuyerbkukazypb',
      },
    });

    const admin = process.env.ADMIN;
    await transporter.sendMail({
      from: '"GimmeGear" <gimmegear.mailagent@gmail.com>',
      to: [email, admin],
      subject: 'Reservierungsbestätigung',
      text: `Hallo ${firstname},\n\ndeine Reservierung für das Gerät mit der ID ${deviceid} vom ${startdate} bis ${enddate} wurde erfolgreich erstellt.\n\nViele Grüße,\nDein GimmeGear-Team`,
    });

    res.status(201).json({ message: 'Reservation created', reservation: reservation.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Reservation error:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  } finally {
    client.release();
  }
});

router.delete('/:reservationnumber', async (req, res):Promise<any>  => {
  const reservationnumber = Number(req.params.reservationnumber);
  try {
    const result = await pool.query(
      'DELETE FROM reservations WHERE reservationnumber = $1 RETURNING *',
      [reservationnumber]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted', reservation: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});

export default router;
