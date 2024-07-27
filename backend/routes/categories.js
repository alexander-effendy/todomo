const express = require('express');
const verifyToken = require('../middleware/verifyUser');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const router = express.Router();

// Get all tasks for the authenticated user
router.get('/categories', verifyToken, async (req, res) => {
  const email = req.query.email;
  console.log(email);
  try {
    const result = await pool.query('SELECT * FROM categories WHERE user_email = $1', [email]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new task for the authenticated user
router.post('/categories', verifyToken, async (req, res) => {
  const { name, userEmail } = req.body;
  console.log(name, userEmail);
  try {
    const result = await pool.query(
      'INSERT INTO categories (user_email, category_name) VALUES ($1, $2) RETURNING *',
      [userEmail, name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;