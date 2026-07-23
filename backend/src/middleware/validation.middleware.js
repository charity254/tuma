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

const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage(ERROR_MESSAGES.EMAIL_INVALID),
  body('password')
    .notEmpty()
    .withMessage(ERROR_MESSAGES.PASSWORD_REQUIRED),
  validateResults
];

const validateRunnerProfileSetup = [
  body('nationalIdNumber')
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGES.NATIONAL_ID_REQUIRED),
  body('transportMode')
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGES.TRANSPORT_MODE_REQUIRED)
    .isIn(['walk', 'bicycle', 'motorbike'])
    .withMessage(ERROR_MESSAGES.TRANSPORT_MODE_INVALID),
  validateResults
];

const validateVerifyRunner = [
  body('status')
    .trim()
    .isIn(['approved', 'rejected'])
    .withMessage(ERROR_MESSAGES.VERIFICATION_STATUS_INVALID),
  validateResults
];

const validateErrandPriceEstimation = [
  body('pickupLat')
    .isFloat()
    .withMessage(ERROR_MESSAGES.LATITUDE_INVALID),
  body('pickupLng')
    .isFloat()
    .withMessage(ERROR_MESSAGES.LONGITUDE_INVALID),
  body('dropoffLat')
    .isFloat()
    .withMessage(ERROR_MESSAGES.LATITUDE_INVALID),
  body('dropoffLng')
    .isFloat()
    .withMessage(ERROR_MESSAGES.LONGITUDE_INVALID),
  body('transportMode')
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGES.TRANSPORT_MODE_REQUIRED)
    .isIn(['foot', 'bicycle', 'motorbike'])
    .withMessage(ERROR_MESSAGES.TRANSPORT_MODE_INVALID),
  validateResults
];

const validateErrandCreation = [
  body('description')
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGES.DESCRIPTION_REQUIRED),
  body('pickupLat')
    .isFloat()
    .withMessage(ERROR_MESSAGES.LATITUDE_INVALID),
  body('pickupLng')
    .isFloat()
    .withMessage(ERROR_MESSAGES.LONGITUDE_INVALID),
  body('dropoffLat')
    .isFloat()
    .withMessage(ERROR_MESSAGES.LATITUDE_INVALID),
  body('dropoffLng')
    .isFloat()
    .withMessage(ERROR_MESSAGES.LONGITUDE_INVALID),
  body('pickupAddress')
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGES.PICKUP_ADDRESS_REQUIRED),
  body('dropoffAddress')
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGES.DROPOFF_ADDRESS_REQUIRED),
  body('transportMode')
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGES.TRANSPORT_MODE_REQUIRED)
    .isIn(['foot', 'bicycle', 'motorbike'])
    .withMessage(ERROR_MESSAGES.TRANSPORT_MODE_INVALID),
  validateResults
];

module.exports = {
  validateRegister,
  validateVerifyOTP,
  validateResendOTP,
  validateLogin,
  validateRunnerProfileSetup,
  validateVerifyRunner,
  validateErrandPriceEstimation,
  validateErrandCreation,
};
