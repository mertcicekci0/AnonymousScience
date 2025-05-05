const crypto = require('crypto');
console.log(crypto.randomBytes(64).toString('hex')); 

// node generate-key.js > .env 
// JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
