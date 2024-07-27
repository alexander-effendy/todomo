const express = require('express');
const verifyToken = require('../middleware/verifyUser');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const router = express.Router();

router.post('/auth', verifyToken, async (req, res) =>  {
  const { id, email, given_name, family_name } = req.body;
  try {
    // Check if user already exists
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      // Insert new user if not exists
      await pool.query(
        'INSERT INTO users (kinde_user_id, email, username, given_name, family_name) VALUES ($1, $2, $3, $4, $5)',
        [id, email, email, given_name, family_name]
      );
      return res.json({ message: 'User registered and added to the database' });
    } else {
      return res.json({ message: 'User already exists in the database. No new user will be added.' });
    }
  } catch (err) {
    console.error('Error inserting user into database:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
