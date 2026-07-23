const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const emailService = require('../services/email.service');
const AppError = require('../utils/AppError');
const { generateOTP, getOTPExpiry } = require('../utils/otp.utils');
const { asyncHandler } = require('../middleware/error.middleware');
const { 
  HTTP_STATUS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES, 
  ROLES, 
  MODES, 
  AUTH_PROVIDERS 
} = require('../constants');

const register = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    // SECURITY: Prevent timing attacks by running a dummy bcrypt hash computation
    const salt = await bcrypt.genSalt(12);
    await bcrypt.hash(password, salt);

    await emailService.sendAccountExistsEmail(email, existingUser.name);

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
    });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const otpCode = generateOTP();
  const otpExpiresAt = getOTPExpiry();

  const dbRole = ROLES.USER;
  const activeMode = role === 'runner' ? MODES.RUNNER : MODES.POSTER;

  await userModel.createUser({
    name,
    email,
    phone,
    passwordHash,
    role: dbRole,
    activeMode,
    authProvider: AUTH_PROVIDERS.EMAIL,
    otpCode,
    otpExpiresAt,
  });

  await emailService.sendOTPEmail(email, otpCode);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
  });
});

const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otpCode } = req.body;

  const user = await userModel.findByEmail(email);
  if (!user) {
    return next(new AppError(ERROR_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST));
  }

  if (user.is_verified) {
    return next(new AppError(ERROR_MESSAGES.ACCOUNT_ALREADY_VERIFIED, HTTP_STATUS.BAD_REQUEST));
  }

  if (user.otp_code !== otpCode) {
    return next(new AppError(ERROR_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST));
  }

  const now = new Date();
  const expiry = new Date(user.otp_expires_at);
  if (now > expiry) {
    return next(new AppError(ERROR_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST));
  }

  await userModel.updateVerificationStatus(user.id, true);

  if (user.active_mode === MODES.RUNNER) {
    await userModel.createRunnerProfile(user.id);
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.OTP_VERIFIED,
  });
});

const resendOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findByEmail(email);
  if (!user) {
    return next(new AppError(ERROR_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST));
  }

  if (user.is_verified) {
    return next(new AppError(ERROR_MESSAGES.ACCOUNT_ALREADY_VERIFIED, HTTP_STATUS.BAD_REQUEST));
  }

  const otpCode = generateOTP();
  const otpExpiresAt = getOTPExpiry();

  await userModel.updateUserOTP(user.id, otpCode, otpExpiresAt);

  await emailService.sendOTPEmail(email, otpCode);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.OTP_RESENT,
  });
});

module.exports = {
  register,
  verifyOTP,
  resendOTP,
};
