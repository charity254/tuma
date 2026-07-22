const { pool } = require('./db');

const migrate = async () => {
  const client = await pool.connect();
  try {
    console.log('Starting schema migration...');
    await client.query('BEGIN');

    // Drop existing tables
    await client.query(`
      DROP TABLE IF EXISTS help_articles CASCADE;
      DROP TABLE IF EXISTS support_tickets CASCADE;
      DROP TABLE IF EXISTS notifications CASCADE;
      DROP TABLE IF EXISTS disputes CASCADE;
      DROP TABLE IF EXISTS ratings CASCADE;
      DROP TABLE IF EXISTS transactions CASCADE;
      DROP TABLE IF EXISTS errands CASCADE;
      DROP TABLE IF EXISTS pricing_rules CASCADE;
      DROP TABLE IF EXISTS zones CASCADE;
      DROP TABLE IF EXISTS runner_profiles CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('Dropped existing tables (if any).');

    // Create extensions
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('Created uuid-ossp extension.');

    // 1. users
    await client.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE,
        password_hash VARCHAR(255),
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        active_mode VARCHAR(20) NOT NULL DEFAULT 'poster',
        auth_provider VARCHAR(20) NOT NULL DEFAULT 'email',
        is_verified BOOLEAN NOT NULL DEFAULT FALSE,
        otp_code VARCHAR(6),
        otp_expires_at TIMESTAMP WITH TIME ZONE,
        fcm_token VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created users table.');

    // 2. runner_profiles
    await client.query(`
      CREATE TABLE runner_profiles (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        national_id_number VARCHAR(50) UNIQUE,
        verification_status VARCHAR(20) NOT NULL DEFAULT 'pending',
        transport_mode VARCHAR(20),
        total_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
        id_front_url VARCHAR(255),
        id_back_url VARCHAR(255),
        selfie_url VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created runner_profiles table.');

    // 3. zones
    await client.query(`
      CREATE TABLE zones (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL
      )
    `);
    console.log('Created zones table.');

    // 4. pricing_rules
    await client.query(`
      CREATE TABLE pricing_rules (
        id SERIAL PRIMARY KEY,
        transport_mode VARCHAR(20) NOT NULL,
        distance_min_km NUMERIC(5, 2) NOT NULL,
        distance_max_km NUMERIC(5, 2) NOT NULL,
        base_price NUMERIC(10, 2) NOT NULL,
        CONSTRAINT unique_mode_distance UNIQUE (transport_mode, distance_min_km, distance_max_km)
      )
    `);
    console.log('Created pricing_rules table.');

    // 5. errands
    await client.query(`
      CREATE TABLE errands (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        poster_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        runner_id UUID REFERENCES users(id) ON DELETE SET NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'open',
        description TEXT NOT NULL,
        parcel_type VARCHAR(100),
        special_instructions TEXT,
        pickup_lat NUMERIC(9, 6) NOT NULL,
        pickup_lng NUMERIC(9, 6) NOT NULL,
        pickup_address VARCHAR(255),
        dropoff_lat NUMERIC(9, 6) NOT NULL,
        dropoff_lng NUMERIC(9, 6) NOT NULL,
        dropoff_address VARCHAR(255),
        distance_km NUMERIC(5, 2),
        transport_mode VARCHAR(20) NOT NULL,
        gross_amount NUMERIC(10, 2) NOT NULL,
        platform_fee NUMERIC(10, 2) NOT NULL,
        runner_payout NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created errands table.');

    // 6. transactions
    await client.query(`
      CREATE TABLE transactions (
        errand_id UUID PRIMARY KEY REFERENCES errands(id) ON DELETE CASCADE,
        pesapal_reference VARCHAR(100) UNIQUE NOT NULL,
        payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
        escrow_held_at TIMESTAMP WITH TIME ZONE,
        released_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created transactions table.');

    // 7. ratings
    await client.query(`
      CREATE TABLE ratings (
        id SERIAL PRIMARY KEY,
        errand_id UUID NOT NULL REFERENCES errands(id) ON DELETE CASCADE,
        rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ratee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_errand_rating UNIQUE (errand_id, rater_id, ratee_id)
      )
    `);
    console.log('Created ratings table.');

    // 8. disputes
    await client.query(`
      CREATE TABLE disputes (
        errand_id UUID PRIMARY KEY REFERENCES errands(id) ON DELETE CASCADE,
        raised_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reason TEXT NOT NULL,
        evidence_urls TEXT[] NOT NULL DEFAULT '{}',
        status VARCHAR(20) NOT NULL DEFAULT 'open',
        resolution TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP WITH TIME ZONE
      )
    `);
    console.log('Created disputes table.');

    // 9. notifications
    await client.query(`
      CREATE TABLE notifications (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(150) NOT NULL,
        body TEXT NOT NULL,
        type VARCHAR(50),
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created notifications table.');

    // 10. support_tickets
    await client.query(`
      CREATE TABLE support_tickets (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subject VARCHAR(150) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'open',
        admin_reply TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created support_tickets table.');

    // 11. help_articles
    await client.query(`
      CREATE TABLE help_articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        target_role VARCHAR(20) NOT NULL DEFAULT 'all',
        is_published BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created help_articles table.');

    await client.query('COMMIT');
    console.log('Schema migration completed successfully.');
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
  }
};

migrate();
