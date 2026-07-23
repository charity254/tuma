const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const { validateVerifyRunner } = require('../middleware/validation.middleware');

router.put('/runners/:userId/verify', authenticateToken, requireRole(['admin']), validateVerifyRunner, adminController.verifyRunner);

module.exports = router;