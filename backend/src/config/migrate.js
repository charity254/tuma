const fs = require('fs');
const path = require('path');
const { pool } = require('./db');
const { ERROR_MESSAGES } = require('../constants');

const migrate = async () => {
  const client = await pool.connect();
  try {
    console.log('Starting database migrations...');
    await client.query('BEGIN');

    // Ensure extension exists for uuid generation
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('Created uuid-ossp extension (if not exists).');

    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migration files to run.`);

    for (const file of files) {
      console.log(`Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      if (sql.trim()) {
        await client.query(sql);
      }
    }

    await client.query('COMMIT');
    console.log('All database migrations completed successfully.');
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(ERROR_MESSAGES.DATABASE_MIGRATION_FAILED, error);
    process.exit(1);
  } finally {
    client.release();
  }
};

migrate();
