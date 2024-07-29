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
  // console.log(email);
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
  // console.log(name, userEmail);
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
  console.log(categoryId);
  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Delete all general tasks related to the category
    await pool.query('DELETE FROM generalTasks WHERE category = $1', [categoryId]);

    // Delete all tasks related to the subcategories of the category
    await pool.query(`
      DELETE FROM tasks 
      WHERE subcategory IN (SELECT id FROM subcategories WHERE category = $1)
    `, [categoryId]);

    // Delete all subcategories related to the category
    await pool.query('DELETE FROM subcategories WHERE category = $1', [categoryId]);

    // Delete the category
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [categoryId]);

    // Commit the transaction
    await pool.query('COMMIT');

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    // Rollback the transaction in case of an error
    await pool.query('ROLLBACK');
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