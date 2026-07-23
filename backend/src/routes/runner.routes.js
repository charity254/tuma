const express = require('express');
const router = express.Router();
const runnerController = require('../controllers/runner.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { uploadFields } = require('../middleware/upload.middleware');
const { validateRunnerProfileSetup } = require('../middleware/validation.middleware');

router.post('/profile', authenticateToken, uploadFields, validateRunnerProfileSetup, runnerController.setupProfile);
router.get('/profile', authenticateToken, runnerController.getProfile);

module.exports = router;