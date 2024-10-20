// authenticateToken.js
const jwt = require('jsonwebtoken');
const secret = 'your_secret_key'; // Use environment variables for secrets

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (token == null) return res.sendStatus(401); // If no token

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403); // If token is invalid
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
