const pool = require('../config/db');
const { getUserFromToken } = require('./kinde');

const ensureUserExists = async (req, res, next) => {
  try {
    const kindeUser = await getUserFromToken(req.headers.authorization);
    const { sub: kinde_user_id, email, given_name, family_name } = kindeUser;

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (kinde_user_id, email, username, given_name, family_name) VALUES ($1, $2, $3, $4, $5)',
        [kinde_user_id, email, email, given_name, family_name]
      );
    }

    req.user = (await pool.query('SELECT * FROM users WHERE email = $1', [email])).rows[0];
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = ensureUserExists;