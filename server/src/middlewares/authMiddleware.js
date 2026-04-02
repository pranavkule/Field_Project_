const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next(new ApiError(401, 'Authorization token missing'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      user_id: decoded.user_id,
      role: decoded.role,
      name: decoded.name,
      email: decoded.email
    };
    next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid token'));
  }
};

module.exports = authMiddleware;
