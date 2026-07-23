// User roles
const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Auth providers
const AUTH_PROVIDERS = {
  EMAIL: 'email',
  GOOGLE: 'google',
};

// Active mode
const MODES = {
  POSTER: 'poster',
  RUNNER: 'runner',
};

// Errand statuses
const ERRAND_STATUS = {
  OPEN: 'open',
  ACCEPTED: 'accepted',
  PICKED_UP: 'picked_up',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  DISPUTED: 'disputed',
  CANCELLED: 'cancelled',
};

// Transport modes
const TRANSPORT_MODES = {
  FOOT: 'foot',
  BICYCLE: 'bicycle',
  MOTORBIKE: 'motorbike',
};

// Payment statuses
const PAYMENT_STATUS = {
  PENDING: 'pending',
  HELD: 'held',
  RELEASED: 'released',
  REFUNDED: 'refunded',
  DISPUTED: 'disputed',
};

// Runner verification statuses
const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Support ticket statuses
const TICKET_STATUS = {
  OPEN: 'open',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

// Dispute statuses
const DISPUTE_STATUS = {
  OPEN: 'open',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER: 500,
};

// Error messages
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_NOT_VERIFIED: 'Please verify your email to continue',
  ACCOUNT_SUSPENDED: 'Your account has been suspended',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  INTERNAL_SERVER: 'Something went wrong, please try again',
  INVALID_OTP: 'Invalid or expired verification code',
  GOOGLE_AUTH_ONLY: 'Please sign in with Google',
  EMAIL_AUTH_ONLY: 'Please sign in with email and password',
  RUNNER_NOT_VERIFIED: 'Your runner profile is pending verification',
  ERRAND_NOT_FOUND: 'Errand not found',
  UNAUTHORIZED_ACTION: 'You are not authorized to perform this action',
  DATABASE_MIGRATION_FAILED: 'Database migration failed:',
  DATABASE_SEED_FAILED: 'Database seeding failed:',
  ACCOUNT_ALREADY_VERIFIED: 'Account is already verified',
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_LONG: 'Name cannot exceed 100 characters',
  EMAIL_INVALID: 'Please enter a valid email address',
  EMAIL_TOO_LONG: 'Email cannot exceed 255 characters',
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_INVALID: 'Please enter a valid phone number (e.g. 0712345678 or +254712345678)',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  PASSWORD_TOO_LONG: 'Password cannot exceed 128 characters',
  ROLE_INVALID: 'Please select a valid role (user or runner)',
  OTP_CODE_LENGTH: 'Verification code must be exactly 6 digits',
  OTP_CODE_NUMERIC: 'Verification code must contain numbers only',
  PASSWORD_REQUIRED: 'Password is required',
  TOKEN_REQUIRED: 'Authentication token is required',
  TOKEN_INVALID: 'Invalid or expired token',
  NATIONAL_ID_REQUIRED: 'National ID number is required',
  TRANSPORT_MODE_REQUIRED: 'Transport mode is required',
  TRANSPORT_MODE_INVALID: 'Please select a valid transport mode (walk, bicycle, or motorbike)',
  VERIFICATION_STATUS_INVALID: 'Please select a valid verification status (approved or rejected)',
  RUNNER_PROFILE_NOT_FOUND: 'Runner profile not found',
  ID_FRONT_REQUIRED: 'ID front image is required',
  ID_BACK_REQUIRED: 'ID back image is required',
  SELFIE_REQUIRED: 'Selfie image is required',
};

// Success messages
const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Please check your email for a verification code',
  OTP_VERIFIED: 'Email verified successfully',
  OTP_RESENT: 'Verification code resent successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  RUNNER_PROFILE_SUBMITTED: 'Runner verification profile submitted successfully',
  RUNNER_VERIFICATION_UPDATED: 'Runner verification status updated successfully',
};

// OTP
const OTP_EXPIRY_MINUTES = 10;

module.exports = {
  ROLES,
  AUTH_PROVIDERS,
  MODES,
  ERRAND_STATUS,
  TRANSPORT_MODES,
  PAYMENT_STATUS,
  VERIFICATION_STATUS,
  TICKET_STATUS,
  DISPUTE_STATUS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  OTP_EXPIRY_MINUTES,
};