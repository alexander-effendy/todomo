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
router.get('/tasks', verifyToken, async (req, res) => {
  const categoryId = req.query.categoryId;
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE category = $1', [categoryId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new task for the authenticated user
router.post('/tasks', verifyToken, async (req, res) => {
  console.log('backend adding taskkkkk non general');
  const { taskName, taskStatus, taskDescription, subcategoryId, categoryId } = req.body;
  console.log(taskName, taskStatus, taskDescription, subcategoryId, categoryId);
  try {
    const result = await pool.query(
      'INSERT INTO tasks (task_name, task_status, task_description, subcategory, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [taskName, taskStatus, taskDescription, subcategoryId, categoryId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;