const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const normalizeRole = (role) => {
  const value = typeof role === 'string' ? role.trim().toLowerCase() : '';
  if (value === 'administrator' || value === 'superadmin') return 'admin';
  if (value === 'admin' || value === 'viewer') return value;
  return value;
};

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
      role: normalizeRole(decoded.role),
      name: decoded.name,
      email: decoded.email
    };
    next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid token'));
  }
};

module.exports = authMiddleware;
