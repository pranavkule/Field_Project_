const { body, custom } = require('express-validator');

const createChildValidator = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('first_name is required'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('last_name is required'),
  body('date_of_birth')
    .notEmpty()
    .withMessage('date_of_birth is required')
    .custom(value => {
      const dob = new Date(value);
      const today = new Date();
      if (dob >= today) {
        throw new Error('date_of_birth must be a past date');
      }
      return true;
    }),
  body('gender')
    .trim()
    .notEmpty()
    .withMessage('gender is required'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('status is required'),
  body('guardian_name')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('guardian_contact')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('address')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('blood_group')
    .trim()
    .notEmpty()
    .withMessage('blood_group is required'),
  body('medical_condition')
    .trim()
    .notEmpty()
    .withMessage('medical_condition is required'),
  body('education_level')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
];

module.exports = {
  createChildValidator
};
