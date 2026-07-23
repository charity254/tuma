const { body, validationResult } = require('express-validator');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');
const AppError = require('../utils/AppError');

const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return next(new AppError(firstError, HTTP_STATUS.BAD_REQUEST));
  }
  next();
};

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
