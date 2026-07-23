const express = require('express');
const router = express.Router();
const errandController = require('../controllers/errand.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateErrandPriceEstimation, validateErrandCreation } = require('../middleware/validation.middleware');

router.post('/estimate', authenticateToken, validateErrandPriceEstimation, errandController.estimatePrice);
router.post('/', authenticateToken, validateErrandCreation, errandController.createErrand);
router.get('/', authenticateToken, errandController.listErrands);
router.get('/:id', authenticateToken, errandController.getErrandDetails);

module.exports = router;