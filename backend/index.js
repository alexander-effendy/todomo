const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173' // Allow requests from your frontend domain
}));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// const getUserFromToken = (authorizationHeader) => {
//   if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
//     console.log('beleblebele')
//     throw new Error('Unauthorized');
//   }
//   console.log('pass')
//   const token = authorizationHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, process.env.KINDE_PUBLIC_KEY, {
//       algorithms: ['RS256'],
//     });
//     return decoded;
//   } catch (err) {
//     throw new Error('Unauthorized getUserFromToken failed');
//   }
// };

// const ensureUserExists = async (req, res, next) => {
//   console.log('checking if user exists');
//   try {
//     console.log('try la')
//     const kindeUser = getUserFromToken(req.headers.authorization);
//     console.log('kinde user is: ', kindeUser);
//     const { sub: kinde_user_id, email, given_name, family_name } = kindeUser;

//     console.log('oe')
//     const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

//     if (userResult.rows.length === 0) {
//       await pool.query(
//         'INSERT INTO users (kinde_user_id, email, username, given_name, family_name) VALUES ($1, $2, $3, $4, $5)',
//         [id, email, email, given_name, family_name]
//       );
//     }

//     req.user = (await pool.query('SELECT * FROM users WHERE email = $1', [email])).rows[0];
//     next();
//   } catch (err) {
//     res.status(401).json({ error: err.message });
//   }
// };

// app.post('/api/auth', ensureUserExists, (req, res) => {
//   res.json({ message: 'User authenticated', user: req.user });
// });

app.post('/api/auth', async (req, res) =>  {
  const { id, email, given_name, family_name } = req.body;
  console.log(id, email, given_name, family_name);
  try {
    // Check if user already exists
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      // Insert new user if not exists
      await pool.query(
        'INSERT INTO users (kinde_user_id, email, username, given_name, family_name) VALUES ($1, $2, $3, $4, $5)',
        [id, email, email, given_name, family_name]
      );
      return res.json({ message: 'User registered and added to the database' });
    } else {
      return res.json({ message: 'User already exists in the database' });
    }
  } catch (err) {
    console.error('Error inserting user into database:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
