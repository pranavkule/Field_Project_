const bcrypt = require('bcrypt');
const hash = '$2b$10$.fjgikMCnBvLv8ij5XbPhOi4GcYrbCNPZET3kvFutYw82PA68nwm.';
const password = 'ruturaj';
console.log('match:', bcrypt.compareSync(password, hash));
