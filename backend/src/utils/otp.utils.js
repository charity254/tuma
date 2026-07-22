const crypto = require('crypto');
const { OTP_EXPIRY_MINUTES } = require('../constants');

const generateOTP = () =>
  crypto.randomInt(100000, 999999).toString();

const getOTPExpiry = () =>
  new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

module.exports = { generateOTP, getOTPExpiry };
