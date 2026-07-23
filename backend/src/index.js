const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const rateLimit = require('express-rate-limit');

const { connectDB } = require('./config/db');
const apiRoutes = require('./routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors({
    origin: [
        process.env.ADMIN_URL || 'http://localhost:3000',
        'http://localhost:19006',
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(passport.initialize());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many login attempts, please try again later.',
});

app.use('/api/', limiter);
app.use('/api/auth', authLimiter);

// Centralized API routes
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handling middleware (must be registered after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Tuma API running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

start();
