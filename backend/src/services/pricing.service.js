const { query } = require('../config/db');
const AppError = require('../utils/AppError');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');

const calculateErrandPrice = async (transportMode, distanceKm) => {
  const result = await query(
    `SELECT base_price FROM pricing_rules 
     WHERE transport_mode = $1 
       AND distance_min_km <= $2 
       AND distance_max_km >= $2`,
    [transportMode, distanceKm]
  );

  const rule = result.rows[0];
  if (!rule) {
    throw new AppError(ERROR_MESSAGES.PRICING_RULE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
  }

  const grossAmount = parseFloat(rule.base_price);
  const platformFee = parseFloat((grossAmount * 0.20).toFixed(2));
  const runnerPayout = parseFloat((grossAmount * 0.80).toFixed(2));

  return {
    grossAmount,
    platformFee,
    runnerPayout,
  };
};

module.exports = {
  calculateErrandPrice,
};
