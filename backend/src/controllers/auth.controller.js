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

/**
 * Register a new user (customer or runner).
 * Prevents email enumeration by returning a success message even if the email exists.
 * Prevents timing attacks by running a dummy hash calculation if the email exists.
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  // 1. Check if user already exists
  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    // SECURITY: Prevent timing attacks by running a dummy bcrypt hash computation
    const salt = await bcrypt.genSalt(12);
    await bcrypt.hash(password, salt);

    // SECURITY: Send an account-exists notification email to the owner
    await emailService.sendAccountExistsEmail(email, existingUser.name);

    // SECURITY: Return the exact same success response as a new registration
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
    });
  }

  // 2. Hash password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // 3. Generate verification OTP
  const otpCode = generateOTP();
  const otpExpiresAt = getOTPExpiry();

  // 4. Map client registration role to DB role and active mode
  const dbRole = ROLES.USER; // All signups are standard users (admins are seeded)
  const activeMode = role === 'runner' ? MODES.RUNNER : MODES.POSTER;

  // 5. Create user in database
  const user = await userModel.createUser({
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

  // 6. Send OTP verification email
  await emailService.sendOTPEmail(email, otpCode);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
  });
});

/**
 * Verify a user's account using the 6-digit OTP code.
 * If verified as a runner, creates their empty runner profile.
 */
const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otpCode } = req.body;

  // 1. Fetch user
  const user = await userModel.findByEmail(email);
  if (!user) {
    return next(new AppError(ERROR_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST));
  }

  // 2. Check if already verified
  if (user.is_verified) {
    return next(new AppError(ERROR_MESSAGES.ACCOUNT_ALREADY_VERIFIED, HTTP_STATUS.BAD_REQUEST));
  }

  // 3. Validate OTP code
  if (user.otp_code !== otpCode) {
    return next(new AppError(ERROR_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST));
  }

  // 4. Validate OTP expiry
  const now = new Date();
  const expiry = new Date(user.otp_expires_at);
  if (now > expiry) {
    return next(new AppError(ERROR_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST));
  }

  // 5. Update user verification status in DB (clears OTP)
  await userModel.updateVerificationStatus(user.id, true);

  // 6. If active mode is runner, create the runner profile
  if (user.active_mode === MODES.RUNNER) {
    await userModel.createRunnerProfile(user.id);
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.OTP_VERIFIED,
  });
});

/**
 * Resend a new OTP verification code to the user's email.
 */
const resendOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // 1. Fetch user
  const user = await userModel.findByEmail(email);
  if (!user) {
    // Vague/secure error mapping for non-existent emails on auth resends
    return next(new AppError(ERROR_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST));
  }

  // 2. Check if already verified
  if (user.is_verified) {
    return next(new AppError(ERROR_MESSAGES.ACCOUNT_ALREADY_VERIFIED, HTTP_STATUS.BAD_REQUEST));
  }

  // 3. Generate new OTP and expiry
  const otpCode = generateOTP();
  const otpExpiresAt = getOTPExpiry();

  // 4. Save new OTP to database
  await userModel.updateUserOTP(user.id, otpCode, otpExpiresAt);

  // 5. Send new OTP email
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
