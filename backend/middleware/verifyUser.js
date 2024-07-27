const jwt = require('jsonwebtoken');
const getKey = require('../utils/getKey');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized!!' });
  }

  try {
    const public_key = await getKey();
    const decoded = jwt.verify(token, public_key, {
      algorithms: ['RS256'],
    });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
};

module.exports = verifyToken;
