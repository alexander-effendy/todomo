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
    const result = await pool.query('SELECT * FROM tasks WHERE category = $1 ORDER BY created_at ASC', [categoryId]);
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

router.delete('/tasks/:id', verifyToken, async (req, res) => {
  const taskId = req.params.id;
  console.log('backend deleting task with id: ', taskId);
  try {
    // Start a transaction

    // Delete task using id
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);

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

// Rename a generalTask by ID
router.put('/tasks/:id', verifyToken, async (req, res) => {
  const taskId = req.params.id;
  const { newTaskName } = req.body;
  console.log(newTaskName, taskId);
  try {
    const result = await pool.query(
      'UPDATE tasks SET task_name = $1 WHERE id = $2 RETURNING *',
      [newTaskName, taskId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update task status
router.put('/tasks/check/:id', verifyToken, async (req, res) => {
  console.log('backenddd edittt status tadk id ')
  const taskId = req.params.id;
  console.log('backend trying to edit this task stayus with is: ', taskId);
  try {
    const result = await pool.query(
      'UPDATE tasks SET task_status = NOT task_status where id = $1 RETURNING *',
      [taskId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'task not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;