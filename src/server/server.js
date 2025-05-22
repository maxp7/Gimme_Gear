// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { Client } = require('pg');
const app = express();
app.use(cors());
app.use(bodyParser.json()); // parse JSON from POST body



// Replace with your PostgreSQL connection details
const client = new Client({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
});

client.connect();

// GET all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM bookings');
    res.json(result.rows);
  } catch (err) {
    console.error("❌ DB error:", err);
    res.status(500).send("Error");
  }
});

// POST new booking
app.post('/api/bookings', async (req, res) => {
  const { name, date, device } = req.body;

  if (!name || !date || !device) {
    return res.status(400).send("Missing fields");
  }

  try {
    await client.query(
      'INSERT INTO bookings (name, date, device) VALUES ($1, $2, $3)',
      [name, date, device]
    );
    res.status(201).send("Booking added");
  } catch (err) {
    console.error("❌ Insert error:", err);
    res.status(500).send("Insert failed");
  }
});

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
