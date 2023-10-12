module.exports = (err, req, res, next) => {
  if (err.name === 'ValidationError') err.statusCode = 400;
  if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError')
    err.statusCode = 401;
  res.status(err.statusCode || 500).json({ message: err.message });
};
