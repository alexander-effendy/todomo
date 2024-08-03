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
router.get('/subcategories', verifyToken, async (req, res) => {
  const categoryId = req.query.categoryId;
  // console.log(categoryId);
  // console.log('backend is trying hard')
  try {
    const result = await pool.query('SELECT * FROM subcategories WHERE category = $1', [categoryId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new task for the authenticated user
router.post('/subcategories', verifyToken, async (req, res) => {
  // console.log('backend adding subcategories')
  const { subcategoryName, categoryId } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO subcategories (subcategory_name, category, subcategories_status) VALUES ($1, $2, $3) RETURNING *',
      [subcategoryName, categoryId, false]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a category by ID
router.delete('/subcategories/:id', verifyToken, async (req, res) => {
  const subcategoryId = req.params.id;
  console.log('backend deleting subcategory with id: ', subcategoryId);
  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Delete all tasks related to the subcategory
    await pool.query('DELETE FROM tasks WHERE subcategory = $1', [subcategoryId]);
    console.log('deleted tasks');
    const result = await pool.query('DELETE FROM subcategories WHERE id = $1', [subcategoryId]);
    console.log('deleted subcategory');

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

// Rename a subcategory by ID
router.put('/subcategories/:id', verifyToken, async (req, res) => {
  const subcategoryId = req.params.id;
  const { newSubcategoryName } = req.body;
  try {
    const result = await pool.query(
      'UPDATE subcategories SET subcategory_name = $1 WHERE id = $2 RETURNING *',
      [newSubcategoryName, subcategoryId]
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