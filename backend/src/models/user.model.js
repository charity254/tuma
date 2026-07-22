const { query } = require('../config/db');

/**
 * Find a user by their email address.
 * @param {string} email - The email to search for
 * @returns {Promise<object|null>} The user object or null if not found
 */
const findByEmail = async (email) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

/**
 * Creates a new user in the database (unverified by default).
 * @param {object} userData
 * @returns {Promise<object>} The newly created user record
 */
const createUser = async ({ name, email, phone, passwordHash, role, activeMode, authProvider, otpCode, otpExpiresAt }) => {
  const result = await query(
    `INSERT INTO users (name, email, phone, password_hash, role, active_mode, auth_provider, otp_code, otp_expires_at) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
     RETURNING *`,
    [name, email, phone, passwordHash, role, activeMode, authProvider, otpCode, otpExpiresAt]
  );
  return result.rows[0];
};

/**
 * Updates a user's verification status, clearing out OTP details.
 * @param {string} userId - User UUID
 * @param {boolean} isVerified - New verification state
 * @returns {Promise<object>} The updated user record
 */
const updateVerificationStatus = async (userId, isVerified) => {
  const result = await query(
    `UPDATE users 
     SET is_verified = $1, otp_code = NULL, otp_expires_at = NULL, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $2 
     RETURNING *`,
    [isVerified, userId]
  );
  return result.rows[0];
};

/**
 * Updates a user's OTP code and its expiration timestamp.
 * @param {string} userId - User UUID
 * @param {string} otpCode - New 6-digit OTP code
 * @param {Date} otpExpiresAt - Expiration Date timestamp
 * @returns {Promise<object>} The updated user record
 */
const updateUserOTP = async (userId, otpCode, otpExpiresAt) => {
  const result = await query(
    `UPDATE users 
     SET otp_code = $1, otp_expires_at = $2, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $3 
     RETURNING *`,
    [otpCode, otpExpiresAt, userId]
  );
  return result.rows[0];
};

/**
 * Creates a default pending runner profile linked to the user.
 * @param {string} userId - Verified user UUID
 * @returns {Promise<object>} The created runner profile record
 */
const createRunnerProfile = async (userId) => {
  const result = await query(
    'INSERT INTO runner_profiles (user_id, total_earnings) VALUES ($1, 0.00) RETURNING *',
    [userId]
  );
  return result.rows[0];
};

module.exports = {
  findByEmail,
  createUser,
  updateVerificationStatus,
  updateUserOTP,
  createRunnerProfile,
};
