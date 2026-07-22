const { pool } = require('./db');
const bcrypt = require('bcryptjs');
const { ROLES, MODES, AUTH_PROVIDERS, TRANSPORT_MODES, ERROR_MESSAGES } = require('../constants');

const seed = async () => {
  const client = await pool.connect();
  try {
    console.log('Starting data seeding...');
    await client.query('BEGIN');

    // 1. Seed Zones
    const zones = [
      { name: 'CBD', slug: 'cbd' },
      { name: 'Westlands', slug: 'westlands' },
      { name: 'Kasarani', slug: 'kasarani' },
      { name: 'Embakasi', slug: 'embakasi' },
      { name: 'Langata', slug: 'langata' },
      { name: 'Kibera', slug: 'kibera' },
      { name: 'Thika Road', slug: 'thika-road' },
      { name: 'Karen', slug: 'karen' },
      { name: 'Eastleigh', slug: 'eastleigh' },
      { name: 'South B/C', slug: 'south-bc' },
    ];

    for (const zone of zones) {
      await client.query(
        'INSERT INTO zones (name, slug) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [zone.name, zone.slug]
      );
    }
    console.log('Seeded coverage zones.');

    // 2. Seed Pricing Rules
    // Transport Mode | Same Zone (0-2km) | Cross Zone (2-5km) | Long Distance (5-10km)
    // On Foot        | Ksh 100           | Ksh 150            | Not available
    // Bicycle        | Ksh 150           | Ksh 200            | Ksh 280
    // Motorbike      | Ksh 200           | Ksh 280            | Ksh 400
    const pricingRules = [
      // Foot
      { transport_mode: TRANSPORT_MODES.FOOT, distance_min_km: 0.00, distance_max_km: 2.00, base_price: 100.00 },
      { transport_mode: TRANSPORT_MODES.FOOT, distance_min_km: 2.00, distance_max_km: 5.00, base_price: 150.00 },
      // Bicycle
      { transport_mode: TRANSPORT_MODES.BICYCLE, distance_min_km: 0.00, distance_max_km: 2.00, base_price: 150.00 },
      { transport_mode: TRANSPORT_MODES.BICYCLE, distance_min_km: 2.00, distance_max_km: 5.00, base_price: 200.00 },
      { transport_mode: TRANSPORT_MODES.BICYCLE, distance_min_km: 5.00, distance_max_km: 10.00, base_price: 280.00 },
      // Motorbike
      { transport_mode: TRANSPORT_MODES.MOTORBIKE, distance_min_km: 0.00, distance_max_km: 2.00, base_price: 200.00 },
      { transport_mode: TRANSPORT_MODES.MOTORBIKE, distance_min_km: 2.00, distance_max_km: 5.00, base_price: 280.00 },
      { transport_mode: TRANSPORT_MODES.MOTORBIKE, distance_min_km: 5.00, distance_max_km: 10.00, base_price: 400.00 },
    ];

    for (const rule of pricingRules) {
      await client.query(
        `INSERT INTO pricing_rules (transport_mode, distance_min_km, distance_max_km, base_price) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT ON CONSTRAINT unique_mode_distance DO UPDATE SET base_price = EXCLUDED.base_price`,
        [rule.transport_mode, rule.distance_min_km, rule.distance_max_km, rule.base_price]
      );
    }
    console.log('Seeded pricing rules.');

    // 3. Seed Default Admin User
    const adminEmail = 'admin@tuma.com';
    const adminPassword = 'Admin@Tuma2026';
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    await client.query(
      `INSERT INTO users (name, email, password_hash, role, active_mode, auth_provider, is_verified) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, is_verified = EXCLUDED.is_verified`,
      ['Tuma Admin', adminEmail, passwordHash, ROLES.ADMIN, MODES.POSTER, AUTH_PROVIDERS.EMAIL, true]
    );
    console.log(`Seeded default admin user (${adminEmail}).`);

    await client.query('COMMIT');
    console.log('Data seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(ERROR_MESSAGES.DATABASE_SEED_FAILED, error);
    process.exit(1);
  } finally {
    client.release();
  }
};

seed();
