const { body } = require('express-validator');

const logVitalsValidator = [
  body('child_id')
    .trim()
    .notEmpty()
    .withMessage('child_id is required'),
  body('weight')
    .notEmpty()
    .withMessage('weight is required')
    .isFloat({ min: 0 })
    .withMessage('weight must be a positive number'),
  body('height')
    .notEmpty()
    .withMessage('height is required')
    .isFloat({ min: 0 })
    .withMessage('height must be a positive number'),
  body('temperature')
    .notEmpty()
    .withMessage('temperature is required')
    .isFloat({ min: 0 })
    .withMessage('temperature must be a positive number'),
  body('blood_pressure')
    .trim()
    .notEmpty()
    .withMessage('blood_pressure is required'),
  body('pulse')
    .notEmpty()
    .withMessage('pulse is required')
    .isInt({ min: 0 })
    .withMessage('pulse must be a positive integer'),
  body('record_date')
    .notEmpty()
    .withMessage('record_date is required')
];

module.exports = {
  logVitalsValidator
};
