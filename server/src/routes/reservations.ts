// routes/userReservations.ts
import { Router } from 'express';
import pool from '../db';
import nodemailer from 'nodemailer';

const router = Router();

router.post('/', async (req, res):Promise<any> => {
  const {
    firstname, secondname, email, matrikelnumber, devicename,
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
    }
  }

    const reservation = await client.query(
      `INSERT INTO reservations (matrikelnumber, startdate, enddate, status, deviceid)
       VALUES ($1, $2, $3, 'Reserved', $4)
       RETURNING *`,
      [matrikelnumber, startdate, enddate, deviceid]
    );

    await client.query('COMMIT');

    // Send email (same as before)...
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
      text: `Lieber ${firstname} ${secondname},

wir freuen uns, Ihnen mitteilen zu können, dass Ihre Buchung erfolgreich war!

Hier sind die Details Ihrer Reservierung:
Gerätename: ${devicename}
Startdatum: ${startdate}
Enddatum: ${enddate}

Bitte bewahren Sie diese E-Mail als Bestätigung Ihrer Buchung auf. 
Denken Sie daran, das Gerät rechtzeitig zurückzugeben, um eventuelle Gebühren zu vermeiden. 

Bei Fragen oder weiteren Anliegen stehen wir Ihnen gerne zur Verfügung. 

Vielen Dank, dass Sie unser Verleihsystem nutzen!

Mit freundlichen Grüßen,
Dein GimmeGear-Team
`,
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
router.delete('/admin/:reservationnumber', async (req, res):Promise<any>  => {
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
