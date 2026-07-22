const { body, validationResult } = require('express-validator');
const { HTTP_STATUS } = require('../constants');
const AppError = require('../utils/AppError');

/**
 * Common middleware to verify validation results.
 * If errors are present, passes the first error message to the global errorHandler.
 */
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return next(new AppError(firstError, HTTP_STATUS.BAD_REQUEST));
  }
  next();
};

/**
 * Validation rules for user registration.
 */
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email cannot exceed 255 characters'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[0-9]\d{8,14}$/)
    .withMessage('Please enter a valid phone number (e.g. 0712345678 or +254712345678)'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .isLength({ max: 128 })
    .withMessage('Password cannot exceed 128 characters'),
  body('role')
    .trim()
    .isIn(['user', 'runner'])
    .withMessage('Please select a valid role (user or runner)'),
  validateResults
];

/**
 * Validation rules for OTP verification.
 */
const validateVerifyOTP = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('otpCode')
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('Verification code must be exactly 6 digits')
    .isNumeric()
    .withMessage('Verification code must contain numbers only'),
  validateResults
];

/**
 * Validation rules for resending OTP.
 */
const validateResendOTP = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  validateResults
];

module.exports = {
  validateRegister,
  validateVerifyOTP,
  validateResendOTP,
};
