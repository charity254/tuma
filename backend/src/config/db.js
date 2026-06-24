const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false} : false,
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