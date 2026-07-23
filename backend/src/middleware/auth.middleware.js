const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const userModel = require('../models/user.model');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');
const { asyncHandler } = require('./error.middleware');

const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError(ERROR_MESSAGES.TOKEN_REQUIRED, HTTP_STATUS.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return next(new AppError(ERROR_MESSAGES.UNAUTHORIZED_ACTION, HTTP_STATUS.UNAUTHORIZED));
    }

    if (!user.is_verified) {
      return next(new AppError(ERROR_MESSAGES.ACCOUNT_NOT_VERIFIED, HTTP_STATUS.UNAUTHORIZED));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError(ERROR_MESSAGES.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED));
  }
});

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError(ERROR_MESSAGES.UNAUTHORIZED_ACTION, HTTP_STATUS.FORBIDDEN));
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
};
