const runnerModel = require('../models/runner.model');
const AppError = require('../utils/AppError');
const { uploadToCloudinary } = require('../middleware/upload.middleware');
const { asyncHandler } = require('../middleware/error.middleware');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../constants');

const setupProfile = asyncHandler(async (req, res, next) => {
  const { nationalIdNumber, transportMode } = req.body;

  if (!req.files || !req.files.idFront || !req.files.idFront[0]) {
    return next(new AppError(ERROR_MESSAGES.ID_FRONT_REQUIRED, HTTP_STATUS.BAD_REQUEST));
  }
  if (!req.files.idBack || !req.files.idBack[0]) {
    return next(new AppError(ERROR_MESSAGES.ID_BACK_REQUIRED, HTTP_STATUS.BAD_REQUEST));
  }
  if (!req.files.selfie || !req.files.selfie[0]) {
    return next(new AppError(ERROR_MESSAGES.SELFIE_REQUIRED, HTTP_STATUS.BAD_REQUEST));
  }

  const idFrontFile = req.files.idFront[0];
  const idBackFile = req.files.idBack[0];
  const selfieFile = req.files.selfie[0];

  const [idFrontUrl, idBackUrl, selfieUrl] = await Promise.all([
    uploadToCloudinary(idFrontFile.buffer, 'runner-documents'),
    uploadToCloudinary(idBackFile.buffer, 'runner-documents'),
    uploadToCloudinary(selfieFile.buffer, 'runner-documents'),
  ]);

  const profile = await runnerModel.updateRunnerProfile(req.user.id, {
    nationalIdNumber,
    transportMode,
    idFrontUrl,
    idBackUrl,
    selfieUrl,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.RUNNER_PROFILE_SUBMITTED,
    data: profile,
  });
});

const getProfile = asyncHandler(async (req, res, next) => {
  const profile = await runnerModel.getProfileByUserId(req.user.id);
  if (!profile) {
    return next(new AppError(ERROR_MESSAGES.RUNNER_PROFILE_NOT_FOUND, HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: profile,
  });
});

module.exports = {
  setupProfile,
  getProfile,
};
