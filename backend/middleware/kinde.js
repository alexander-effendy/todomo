const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const getUserFromToken = async (authorizationHeader) => {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const token = authorizationHeader.split(' ')[1];
  console.log('Token: ' + token);

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.KINDE_PUBLIC_KEY, {
      algorithms: ['RS256']
    });

    return decoded;
  } catch (err) {
    throw new Error('Unauthorized');
  }
};

module.exports = {
  getUserFromToken,
};
