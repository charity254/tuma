DROP TABLE IF EXISTS pricing_rules CASCADE;

CREATE TABLE pricing_rules (
  id SERIAL PRIMARY KEY,
  transport_mode VARCHAR(20) NOT NULL,
  distance_min_km NUMERIC(5, 2) NOT NULL,
  distance_max_km NUMERIC(5, 2) NOT NULL,
  base_price NUMERIC(10, 2) NOT NULL,
  CONSTRAINT unique_mode_distance UNIQUE (transport_mode, distance_min_km, distance_max_km)
);
