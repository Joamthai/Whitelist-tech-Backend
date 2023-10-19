const { rateLimit } = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10000000,
  message: 'TOO MANY REQUEST FROM THIS IP',
});
