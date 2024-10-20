const crypto = require('crypto');

// Generate a secure random key
const secret = crypto.randomBytes(64).toString('hex');

console.log(`Generated JWT Secret: ${secret}`);
