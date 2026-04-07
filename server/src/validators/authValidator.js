const { body } = require('express-validator');

const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('email must be a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters long'),
  body('role')
    .trim()
    .isIn(['admin', 'viewer', 'Administrator', 'superadmin'])
    .withMessage('role must be admin or viewer')
];

module.exports = {
  registerValidator
};
