const { query } = require('../config/db');

const createErrand = async ({
  posterId,
  description,
  parcelType,
  specialInstructions,
  pickupLat,
  pickupLng,
  pickupAddress,
  dropoffLat,
  dropoffLng,
  dropoffAddress,
  distanceKm,
  transportMode,
  grossAmount,
  platformFee,
  runnerPayout,
}) => {
  const result = await query(
    `INSERT INTO errands (
      poster_id, description, parcel_type, special_instructions,
      pickup_lat, pickup_lng, pickup_address,
      dropoff_lat, dropoff_lng, dropoff_address,
      distance_km, transport_mode, gross_amount, platform_fee, runner_payout
     ) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
     RETURNING *`,
    [
      posterId,
      description,
      parcelType,
      specialInstructions,
      pickupLat,
      pickupLng,
      pickupAddress,
      dropoffLat,
      dropoffLng,
      dropoffAddress,
      distanceKm,
      transportMode,
      grossAmount,
      platformFee,
      runnerPayout,
    ]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query(
    `SELECT e.*, u.name as poster_name, u.phone as poster_phone 
     FROM errands e 
     JOIN users u ON e.poster_id = u.id 
     WHERE e.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

const findByPosterId = async (posterId) => {
  const result = await query(
    `SELECT * FROM errands WHERE poster_id = $1 ORDER BY created_at DESC`,
    [posterId]
  );
  return result.rows;
};

const findPublishedErrands = async () => {
  const result = await query(
    `SELECT e.*, u.name as poster_name 
     FROM errands e 
     JOIN users u ON e.poster_id = u.id 
     WHERE e.status = 'open' 
     ORDER BY e.created_at DESC`
  );
  return result.rows;
};

module.exports = {
  createErrand,
  findById,
  findByPosterId,
  findPublishedErrands,
};
