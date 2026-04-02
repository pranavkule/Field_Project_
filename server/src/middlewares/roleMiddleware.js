const ApiError = require('../utils/ApiError');

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Access denied. Required role: ${roles.join(' or ')}`));
    }

    next();
  };
};

module.exports = allowRoles;
