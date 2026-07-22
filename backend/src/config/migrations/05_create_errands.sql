DROP TABLE IF EXISTS errands CASCADE;

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
);
