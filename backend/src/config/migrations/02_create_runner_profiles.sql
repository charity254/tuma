DROP TABLE IF EXISTS runner_profiles CASCADE;

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
);
