require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const rateLimit = require('express-rate-limit');

const {connectDB } = require ('./config/db');
const app = express();

app.use(helmet());
app.use(cors({
    origin: [
        process.env.ADMIN_URL || 'http://localhost:3000',
    'http://localhost:19006',
    ],
    credentials: true
}));