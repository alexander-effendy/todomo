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

// function toconvert jwt public key
const jose = require('node-jose');
const jwks = {
  keys: [
    {
      e: "AQAB",
      n: "lPz7A_f7kxFatGRg-fNVd1IBuIhLPeFNe3vOouul9Z9iDfrxBI0D0536XV0ooCFIYD_IP4SeRrbYpDTda82MisZnP5TBCIOFBkwjjRzRegGscpNLmHWago0gS9RbUuMjs1EAcBqzTt2RiUHoqyguvwm2RUbCxkIe0Ts9c6fO_LLw5fR0l2CNvIR3riHef_SYMt5X-94THCamp72Sdbt21qFhcowWbAvprHKq7ZKwEzxdXqRKs6ElBCMOdhuQD3RH4apOJBme4VuSU2osPlFO8pMyDwkcLdA32_aGll4MBHik5YBFHeAg1ufLYpfFY-imVk9hU6DEAz4LyWGalxekXw",
      alg: "RS256",
      kid: "ea:5f:92:57:a0:24:4b:3a:4b:2b:11:65:c5:ff:d5:46",
      kty: "RSA",
      use: "sig"
    }
  ]
};

async function getKey() {
  const keystore = await jose.JWK.asKeyStore(jwks);
  const key = keystore.get({ use: 'sig' });
  const publicKey = key.toPEM(false);
  console.log(publicKey);
  return publicKey;
}

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('token non')
    return res.status(401).json({ message: 'Unauthorized!!' });
  }\

  try {
    console.log('token is: ', token);
    const public_key = await getKey();
    console.log('public keyg is: ', public_key);
    const decoded = jwt.verify(token, public_key, {
      algorithms: ['RS256'],
    });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
};

app.post('/api/auth', verifyToken, async (req, res) =>  {
  const { id, email, given_name, family_name } = req.body;
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
