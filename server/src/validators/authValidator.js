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
    .notEmpty()
    .withMessage('role is required')
];

module.exports = {
  registerValidator
};
