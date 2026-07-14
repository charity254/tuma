const { Pool } = require('pg')

// Enable SSL for production or Neon database hosts
const isNeon = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon.tech');
const useSSL = process.env.NODE_ENV === 'production' || isNeon;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
});

// Register error listener on the pool to handle idle client connection terminations gracefully
pool.on('error', (err) => {
    console.error('Unexpected error on idle database client:', err.message);
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to database');
        client.release();
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};
const query = (text, params) => pool.query(text, params);
module.exports = { connectDB, query, pool };