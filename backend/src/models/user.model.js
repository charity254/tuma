const { query } = require('../config/db');

const findByEmail = async (email) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

const createUser = async ({ name, email, phone, passwordHash, role, activeMode, authProvider, otpCode, otpExpiresAt }) => {
  const result = await query(
    `INSERT INTO users (name, email, phone, password_hash, role, active_mode, auth_provider, otp_code, otp_expires_at) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
     RETURNING *`,
    [name, email, phone, passwordHash, role, activeMode, authProvider, otpCode, otpExpiresAt]
  );
  return result.rows[0];
};

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

const createRunnerProfile = async (userId) => {
  const result = await query(
    'INSERT INTO runner_profiles (user_id, total_earnings) VALUES ($1, 0.00) RETURNING *',
    [userId]
  );
  return result.rows[0];
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateVerificationStatus,
  updateUserOTP,
  createRunnerProfile,
};
