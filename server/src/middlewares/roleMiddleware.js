const ApiError = require('../utils/ApiError');

const normalizeRole = (role) => {
  const value = typeof role === 'string' ? role.trim().toLowerCase() : '';
  if (value === 'administrator' || value === 'superadmin') return 'admin';
  if (value === 'admin' || value === 'viewer') return value;
  return value;
};

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'User not authenticated'));
    }

    const userRole = normalizeRole(req.user.role);
    const allowedRoles = roles.map(normalizeRole);

    if (!allowedRoles.includes(userRole)) {
      return next(new ApiError(403, `Access denied. Required role: ${allowedRoles.join(' or ')}`));
    }

    next();
  };
};

module.exports = allowRoles;
