// index.js
require('dotenv').config();

const { Client } = require('pg');

// Replace with your PostgreSQL connection details
const client = new Client({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
});

async function main() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL");

    // Create table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        date DATE NOT NULL
      )
    `);

    // Insert a sample booking
    await client.query(
      `INSERT INTO bookings (name, date) VALUES ($1, $2)`,
      ['Alice', '2025-06-01']
    );

    // Read bookings
    const res = await client.query('SELECT * FROM bookings');
    console.log("📄 Bookings:", res.rows);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.end();
    console.log("🔌 Disconnected");
  }
}

main();
