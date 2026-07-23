const errandModel = require('../models/errand.model');
const pricingService = require('../services/pricing.service');
const { getDistanceBetweenCoords } = require('../utils/geo.utils');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../middleware/error.middleware');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');

const estimatePrice = asyncHandler(async (req, res, next) => {
  const { pickupLat, pickupLng, dropoffLat, dropoffLng, transportMode } = req.body;

  const distanceKm = getDistanceBetweenCoords(
    parseFloat(pickupLat),
    parseFloat(pickupLng),
    parseFloat(dropoffLat),
    parseFloat(dropoffLng)
  );

  const priceDetails = await pricingService.calculateErrandPrice(transportMode, distanceKm);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      distanceKm,
      ...priceDetails,
    },
  });
});

const createErrand = asyncHandler(async (req, res, next) => {
  const {
    description,
    parcelType,
    specialInstructions,
    pickupLat,
    pickupLng,
    pickupAddress,
    dropoffLat,
    dropoffLng,
    dropoffAddress,
    transportMode,
  } = req.body;

  const distanceKm = getDistanceBetweenCoords(
    parseFloat(pickupLat),
    parseFloat(pickupLng),
    parseFloat(dropoffLat),
    parseFloat(dropoffLng)
  );

  const priceDetails = await pricingService.calculateErrandPrice(transportMode, distanceKm);

  const errand = await errandModel.createErrand({
    posterId: req.user.id,
    description,
    parcelType,
    specialInstructions,
    pickupLat: parseFloat(pickupLat),
    pickupLng: parseFloat(pickupLng),
    pickupAddress,
    dropoffLat: parseFloat(dropoffLat),
    dropoffLng: parseFloat(dropoffLng),
    dropoffAddress,
    distanceKm,
    transportMode,
    ...priceDetails,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: errand,
  });
});

const getErrandDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const errand = await errandModel.findById(id);
  if (!errand) {
    return next(new AppError(ERROR_MESSAGES.ERRAND_NOT_FOUND, HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: errand,
  });
});

const listErrands = asyncHandler(async (req, res, next) => {
  const { mode } = req.query;

  let errands;
  if (mode === 'runner') {
    errands = await errandModel.findPublishedErrands();
  } else {
    errands = await errandModel.findByPosterId(req.user.id);
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: errands,
  });
});

module.exports = {
  estimatePrice,
  createErrand,
  getErrandDetails,
  listErrands,
};
