const express = require('express');
const ensureUserExists = require('../middleware/ensureUserExists');
const router = express.Router();

router.post('/', ensureUserExists, (req, res) => {
  console.log('auth here')
  res.json({ message: 'User authenticated and added to the database', user: req.user });
});

module.exports = router;