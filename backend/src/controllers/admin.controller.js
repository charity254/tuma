const runnerModel = require('../models/runner.model');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../middleware/error.middleware');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../constants');

const verifyRunner = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { status } = req.body;

  const profile = await runnerModel.getProfileByUserId(userId);
  if (!profile) {
    return next(new AppError(ERROR_MESSAGES.RUNNER_PROFILE_NOT_FOUND, HTTP_STATUS.NOT_FOUND));
  }

  const updatedProfile = await runnerModel.updateVerificationStatus(userId, status);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.RUNNER_VERIFICATION_UPDATED,
    data: updatedProfile,
  });
});

module.exports = {
  verifyRunner,
};
