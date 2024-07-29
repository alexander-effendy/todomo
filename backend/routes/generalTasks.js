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
router.get('/generalTasks', verifyToken, async (req, res) => {
  const categoryId = req.query.categoryId;
  try {
    const result = await pool.query('SELECT * FROM generalTasks WHERE category = $1', [categoryId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new task for the authenticated user
router.post('/generalTasks', verifyToken, async (req, res) => {
  console.log('backend adding taskkkkk');
  const { generalTaskName, generalTaskDescription, categoryId } = req.body;
  console.log(generalTaskName, generalTaskDescription, categoryId);
  try {
    const result = await pool.query(
      'INSERT INTO generalTasks (task_name, task_status, task_description, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [generalTaskName, false, generalTaskDescription, categoryId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;