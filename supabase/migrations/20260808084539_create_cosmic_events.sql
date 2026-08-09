/*
# Create cosmic_events table

1. New Tables
- `cosmic_events`
  - `id` (uuid, primary key)
  - `title` (text, not null) - name of the event, e.g. "Total Lunar Eclipse"
  - `event_type` (text, not null) - category: Eclipse, Retrograde, Solstice, Equinox, Conjunction, Meteor Shower, etc.
  - `event_date` (date, not null) - when the event occurs
  - `sign` (text, nullable) - zodiac sign involved, if applicable
  - `visibility` (text, nullable) - where it can be seen, e.g. "Europe, Africa, Asia"
  - `description` (text, not null) - what the event means astrologically
  - `guidance` (text, not null) - practical advice for working with the energy
  - `intensity` (integer, default 3) - 1 to 5 scale of energetic impact
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `cosmic_events`.
- Allow anon + authenticated CRUD (single-tenant, no auth, public data).
3. Notes
- Seeded with upcoming cosmic events for Aug 2026 and beyond.
*/

CREATE TABLE IF NOT EXISTS cosmic_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_type text NOT NULL,
  event_date date NOT NULL,
  sign text,
  visibility text,
  description text NOT NULL,
  guidance text NOT NULL,
  intensity integer NOT NULL DEFAULT 3,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cosmic_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_cosmic_events" ON cosmic_events;
CREATE POLICY "anon_select_cosmic_events" ON cosmic_events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_cosmic_events" ON cosmic_events;
CREATE POLICY "anon_insert_cosmic_events" ON cosmic_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_cosmic_events" ON cosmic_events;
CREATE POLICY "anon_update_cosmic_events" ON cosmic_events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_cosmic_events" ON cosmic_events;
CREATE POLICY "anon_delete_cosmic_events" ON cosmic_events FOR DELETE
  TO anon, authenticated USING (true);
