DROP TABLE IF EXISTS ratings CASCADE;

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  errand_id UUID NOT NULL REFERENCES errands(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ratee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_errand_rating UNIQUE (errand_id, rater_id, ratee_id)
);
