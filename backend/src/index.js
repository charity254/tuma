const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const rateLimit = require('express-rate-limit');

const {connectDB } = require ('./config/db');
const app = express();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const errandRoutes = require('./routes/errand.routes');
const runnerRoutes = require('./routes/runner.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');
const notificationRoutes = require('./routes/notification.routes');
const supportRoutes = require('./routes/support.routes');
const zoneRoutes = require('./routes/zone.routes');


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/errands', errandRoutes);
app.use('/api/runners', runnerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/zones', zoneRoutes);

app.use(helmet());
app.use(cors({
    origin: [
        process.env.ADMIN_URL || 'http://localhost:3000',
    'http://localhost:19006',
    ],
    credentials: true
}));

const limiter = rateLimit({
    windowMs : 15 * 60 * 1000, 
    max : 100, 
    message: 'Too many requests, please try again later.'
});

const authLimiter = rateLimit ({
    windowMs : 15 * 60 * 1000,
    max : 20,
    message: 'Too many login attempts, please try again later.',
});

app.use('api/', limiter);
app.use('api/', authLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(passport.initialize());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Tuma API running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

start();
