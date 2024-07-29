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

// Delete a category by ID
router.delete('/categories/:id', verifyToken, async (req, res) => {
  const categoryId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [categoryId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rename a category by ID
router.put('/categories/:id', verifyToken, async (req, res) => {
  const categoryId = req.params.id;
  const { newName } = req.body;
  try {
    const result = await pool.query(
      'UPDATE categories SET category_name = $1 WHERE id = $2 RETURNING *',
      [newName, categoryId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;