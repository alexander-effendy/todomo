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
  // console.log('backend adding taskkkkk');
  const { generalTaskName, generalTaskDescription, categoryId } = req.body;
  // console.log(generalTaskName, generalTaskDescription, categoryId);
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

router.delete('/generalTasks/:id', verifyToken, async (req, res) => {
  const taskId = req.params.id;
  console.log('backend deleting generalTask with id: ', taskId);
  try {
    // Start a transaction

    // Delete task using id
    const result = await pool.query('DELETE FROM generalTasks WHERE id = $1', [taskId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'taskId not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    // Rollback the transaction in case of an error
    await pool.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;