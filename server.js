require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database table
const initDB = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS guestbook (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    client.release();
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

// API Routes
app.get('/api/guestbook', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM guestbook ORDER BY created_at DESC LIMIT 50'
    );
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching guestbook entries:', err);
    res.status(500).json({ error: 'Failed to fetch guestbook entries' });
  }
});

app.post('/api/guestbook', async (req, res) => {
  const { name, message } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  if (name.length > 100) {
    return res.status(400).json({ error: 'Name must be less than 100 characters' });
  }
  
  if (message && message.length > 500) {
    return res.status(400).json({ error: 'Message must be less than 500 characters' });
  }
  
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO guestbook (name, message) VALUES ($1, $2) RETURNING *',
      [name.trim(), message ? message.trim() : null]
    );
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding guestbook entry:', err);
    res.status(500).json({ error: 'Failed to add guestbook entry' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
const start = async () => {
  await initDB();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

start();