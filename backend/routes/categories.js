const express = require('express');
const pool = require('../config/db');
const ensureUserExists = require('../middleware/ensureUserExists');
const router = express.Router();

// Get all tasks for the authenticated user
router.get('/categories', ensureUserExists, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories WHERE userId = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new task for the authenticated user
router.post('/categories', ensureUserExists, async (req, res) => {
  const { title, category_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categories (userId, id, title) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, category_id, title]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
