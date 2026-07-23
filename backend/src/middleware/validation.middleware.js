const { body, validationResult } = require('express-validator');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');
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
    .withMessage(ERROR_MESSAGES.NAME_REQUIRED)
    .isLength({ max: 100 })
    .withMessage(ERROR_MESSAGES.NAME_TOO_LONG),
  body('email')
    .trim()
    .isEmail()
    .withMessage(ERROR_MESSAGES.EMAIL_INVALID)
    .isLength({ max: 255 })
    .withMessage(ERROR_MESSAGES.EMAIL_TOO_LONG),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGES.PHONE_REQUIRED)
    .matches(/^\+?[0-9]\d{8,14}$/)
    .withMessage(ERROR_MESSAGES.PHONE_INVALID),
  body('password')
    .isLength({ min: 6 })
    .withMessage(ERROR_MESSAGES.PASSWORD_TOO_SHORT)
    .isLength({ max: 128 })
    .withMessage(ERROR_MESSAGES.PASSWORD_TOO_LONG),
  body('role')
    .trim()
    .isIn(['user', 'runner'])
    .withMessage(ERROR_MESSAGES.ROLE_INVALID),
  validateResults
];

/**
 * Validation rules for OTP verification.
 */
const validateVerifyOTP = [
  body('email')
    .trim()
    .isEmail()
    .withMessage(ERROR_MESSAGES.EMAIL_INVALID),
  body('otpCode')
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage(ERROR_MESSAGES.OTP_CODE_LENGTH)
    .isNumeric()
    .withMessage(ERROR_MESSAGES.OTP_CODE_NUMERIC),
  validateResults
];

/**
 * Validation rules for resending OTP.
 */
const validateResendOTP = [
  body('email')
    .trim()
    .isEmail()
    .withMessage(ERROR_MESSAGES.EMAIL_INVALID),
  validateResults
];

module.exports = {
  validateRegister,
  validateVerifyOTP,
  validateResendOTP,
};
