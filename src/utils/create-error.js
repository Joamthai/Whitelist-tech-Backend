const createError = (message, statusCode) => {
  const error = new Error();
  error.statusCode = statusCode;
  return error;
};

module.exports = createError;
