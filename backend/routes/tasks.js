const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new task
router.post('/tasks', async (req, res) => {
  const { content, username } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (username, content) VALUES ($1, $2) RETURNING *',
      [username, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
