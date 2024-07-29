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
  console.log(categoryId);
  console.log('backend is trying hard')
  try {
    const result = await pool.query('SELECT * FROM subcategories WHERE category = $1', [categoryId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new task for the authenticated user
router.post('/subcategories', verifyToken, async (req, res) => {
  console.log('backend adding subcategories')
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

module.exports = router;