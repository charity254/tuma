const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { 
  validateRegister, 
  validateVerifyOTP, 
  validateResendOTP 
} = require('../middleware/validation.middleware');

router.post('/register', validateRegister, authController.register);
router.post('/verify-otp', validateVerifyOTP, authController.verifyOTP);
router.post('/resend-otp', validateResendOTP, authController.resendOTP);

module.exports = router;