const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const errandRoutes = require('./errand.routes');
const runnerRoutes = require('./runner.routes');
const paymentRoutes = require('./payment.routes');
const adminRoutes = require('./admin.routes');
const notificationRoutes = require('./notification.routes');
const supportRoutes = require('./support.routes');
const zoneRoutes = require('./zone.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/errands', errandRoutes);
router.use('/runners', runnerRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);
router.use('/support', supportRoutes);
router.use('/zones', zoneRoutes);

module.exports = router;
