const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (!(err instanceof ApiError)) {
    // Protect internal message leak in production
    console.error(err);
  }

  res.status(statusCode).json({
    statusCode,
    message
  });
};

module.exports = errorHandler;
