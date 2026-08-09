/*
# Add sign-specific readings table

New table: `sign_readings`
Each row holds a personalised weekly reading for one zodiac sign.
Columns: id, sign (text), mental_sparks (text), social_balance (text),
         career_focus (text), love_focus (text), wellness_focus (text),
         mantra (text), crystal (text), key_dates (text), created_at.

No auth (single-tenant). Policies grant anon + authenticated full CRUD.
*/

CREATE TABLE IF NOT EXISTS sign_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sign text NOT NULL UNIQUE,
  mental_sparks text NOT NULL,
  social_balance text NOT NULL,
  career_focus text NOT NULL,
  love_focus text NOT NULL,
  wellness_focus text NOT NULL,
  mantra text NOT NULL,
  crystal text NOT NULL,
  key_dates text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sign_readings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_sign_readings" ON sign_readings;
CREATE POLICY "public_read_sign_readings" ON sign_readings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_sign_readings" ON sign_readings;
CREATE POLICY "public_insert_sign_readings" ON sign_readings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_sign_readings" ON sign_readings;
CREATE POLICY "public_update_sign_readings" ON sign_readings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_sign_readings" ON sign_readings;
CREATE POLICY "public_delete_sign_readings" ON sign_readings FOR DELETE TO anon, authenticated USING (true);
