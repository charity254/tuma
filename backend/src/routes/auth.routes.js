const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { 
  validateRegister, 
  validateVerifyOTP, 
  validateResendOTP,
  validateLogin,
} = require('../middleware/validation.middleware');

router.post('/register', validateRegister, authController.register);
router.post('/verify-otp', validateVerifyOTP, authController.verifyOTP);
router.post('/resend-otp', validateResendOTP, authController.resendOTP);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;