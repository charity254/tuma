const { query } = require('../config/db');

const updateRunnerProfile = async (userId, { nationalIdNumber, transportMode, idFrontUrl, idBackUrl, selfieUrl }) => {
  const result = await query(
    `UPDATE runner_profiles 
     SET national_id_number = $1, 
         transport_mode = $2, 
         id_front_url = $3, 
         id_back_url = $4, 
         selfie_url = $5, 
         verification_status = 'pending', 
         updated_at = CURRENT_TIMESTAMP 
     WHERE user_id = $6 
     RETURNING *`,
    [nationalIdNumber, transportMode, idFrontUrl, idBackUrl, selfieUrl, userId]
  );
  return result.rows[0];
};

const getProfileByUserId = async (userId) => {
  const result = await query(
    `SELECT u.id, u.name, u.email, u.phone, u.role, u.active_mode, u.is_verified, 
            rp.national_id_number, rp.verification_status, rp.transport_mode, rp.total_earnings, rp.id_front_url, rp.id_back_url, rp.selfie_url, rp.created_at, rp.updated_at
     FROM users u
     LEFT JOIN runner_profiles rp ON u.id = rp.user_id
     WHERE u.id = $1`,
    [userId]
  );
  return result.rows[0] || null;
};

const updateVerificationStatus = async (userId, status) => {
  const result = await query(
    `UPDATE runner_profiles 
     SET verification_status = $1, 
         updated_at = CURRENT_TIMESTAMP 
     WHERE user_id = $2 
     RETURNING *`,
    [status, userId]
  );
  return result.rows[0];
};

module.exports = {
  updateRunnerProfile,
  getProfileByUserId,
  updateVerificationStatus
};
