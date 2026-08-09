/*
# Astrology Content Tables

1. Purpose
   Single-tenant, no-auth astrology website. All content is public/shared.
   The frontend reads as the anon role, so every policy lists `anon, authenticated`
   and uses `USING (true)` / `WITH CHECK (true)` because the data is intentionally public.

2. New Tables
   - `planetary_transits`: upcoming planetary movements (retrogrades, ingresses) and major aspects.
     Columns: id, planet, event_type, aspect_type, sign, date, description, advice, intensity (1-5), created_at.
   - `lunar_phases`: current New/Full Moon guide with ritual steps.
     Columns: id, phase_type, zodiac_sign, peak_time, theme, overview, ritual_steps (jsonb), created_at.
   - `tarot_cards`: collective tarot/oracle spread cards.
     Columns: id, position_label, card_name, card_meaning, interpretation, upright (bool), created_at.
   - `elemental_energy`: weekly elemental focus rows (one per element).
     Columns: id, element, focus, advice, balance_tip, created_at.
   - `shadow_prompts`: reflection/journaling questions.
     Columns: id, prompt, context, created_at.
   - `crystal_botanical`: crystal, herb, and color magic pairings.
     Columns: id, category, name, purpose, usage, zodiac_sign, created_at.
   - `void_moon_windows`: Void-of-Course moon schedule windows.
     Columns: id, start_time, end_time, warning, created_at.
   - `mantra_affirmations`: daily affirmations keyed to planetary friction.
     Columns: id, mantra, targets_transit, created_at.

3. Security
   - RLS enabled on every table.
   - Public read + write for anon, authenticated (single-tenant shared content).
*/

CREATE TABLE IF NOT EXISTS planetary_transits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planet text NOT NULL,
  event_type text NOT NULL,
  aspect_type text,
  sign text,
  date date NOT NULL,
  description text NOT NULL,
  advice text NOT NULL,
  intensity smallint NOT NULL DEFAULT 3 CHECK (intensity BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lunar_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_type text NOT NULL,
  zodiac_sign text NOT NULL,
  peak_time timestamptz NOT NULL,
  theme text NOT NULL,
  overview text NOT NULL,
  ritual_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tarot_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position_label text NOT NULL,
  card_name text NOT NULL,
  card_meaning text NOT NULL,
  interpretation text NOT NULL,
  upright boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS elemental_energy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  element text NOT NULL,
  focus text NOT NULL,
  advice text NOT NULL,
  balance_tip text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shadow_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt text NOT NULL,
  context text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crystal_botanical (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  purpose text NOT NULL,
  usage text NOT NULL,
  zodiac_sign text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS void_moon_windows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  warning text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mantra_affirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mantra text NOT NULL,
  targets_transit text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE planetary_transits ENABLE ROW LEVEL SECURITY;
ALTER TABLE lunar_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarot_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE elemental_energy ENABLE ROW LEVEL SECURITY;
ALTER TABLE shadow_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crystal_botanical ENABLE ROW LEVEL SECURITY;
ALTER TABLE void_moon_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantra_affirmations ENABLE ROW LEVEL SECURITY;

-- planetary_transits policies
DROP POLICY IF EXISTS "public_read_transits" ON planetary_transits;
CREATE POLICY "public_read_transits" ON planetary_transits FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_transits" ON planetary_transits;
CREATE POLICY "public_insert_transits" ON planetary_transits FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_transits" ON planetary_transits;
CREATE POLICY "public_update_transits" ON planetary_transits FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_transits" ON planetary_transits;
CREATE POLICY "public_delete_transits" ON planetary_transits FOR DELETE TO anon, authenticated USING (true);

-- lunar_phases policies
DROP POLICY IF EXISTS "public_read_lunar" ON lunar_phases;
CREATE POLICY "public_read_lunar" ON lunar_phases FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_lunar" ON lunar_phases;
CREATE POLICY "public_insert_lunar" ON lunar_phases FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_lunar" ON lunar_phases;
CREATE POLICY "public_update_lunar" ON lunar_phases FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_lunar" ON lunar_phases;
CREATE POLICY "public_delete_lunar" ON lunar_phases FOR DELETE TO anon, authenticated USING (true);

-- tarot_cards policies
DROP POLICY IF EXISTS "public_read_tarot" ON tarot_cards;
CREATE POLICY "public_read_tarot" ON tarot_cards FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_tarot" ON tarot_cards;
CREATE POLICY "public_insert_tarot" ON tarot_cards FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_tarot" ON tarot_cards;
CREATE POLICY "public_update_tarot" ON tarot_cards FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_tarot" ON tarot_cards;
CREATE POLICY "public_delete_tarot" ON tarot_cards FOR DELETE TO anon, authenticated USING (true);

-- elemental_energy policies
DROP POLICY IF EXISTS "public_read_elemental" ON elemental_energy;
CREATE POLICY "public_read_elemental" ON elemental_energy FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_elemental" ON elemental_energy;
CREATE POLICY "public_insert_elemental" ON elemental_energy FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_elemental" ON elemental_energy;
CREATE POLICY "public_update_elemental" ON elemental_energy FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_elemental" ON elemental_energy;
CREATE POLICY "public_delete_elemental" ON elemental_energy FOR DELETE TO anon, authenticated USING (true);

-- shadow_prompts policies
DROP POLICY IF EXISTS "public_read_shadow" ON shadow_prompts;
CREATE POLICY "public_read_shadow" ON shadow_prompts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_shadow" ON shadow_prompts;
CREATE POLICY "public_insert_shadow" ON shadow_prompts FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_shadow" ON shadow_prompts;
CREATE POLICY "public_update_shadow" ON shadow_prompts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_shadow" ON shadow_prompts;
CREATE POLICY "public_delete_shadow" ON shadow_prompts FOR DELETE TO anon, authenticated USING (true);

-- crystal_botanical policies
DROP POLICY IF EXISTS "public_read_crystal" ON crystal_botanical;
CREATE POLICY "public_read_crystal" ON crystal_botanical FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_crystal" ON crystal_botanical;
CREATE POLICY "public_insert_crystal" ON crystal_botanical FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_crystal" ON crystal_botanical;
CREATE POLICY "public_update_crystal" ON crystal_botanical FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_crystal" ON crystal_botanical;
CREATE POLICY "public_delete_crystal" ON crystal_botanical FOR DELETE TO anon, authenticated USING (true);

-- void_moon_windows policies
DROP POLICY IF EXISTS "public_read_void" ON void_moon_windows;
CREATE POLICY "public_read_void" ON void_moon_windows FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_void" ON void_moon_windows;
CREATE POLICY "public_insert_void" ON void_moon_windows FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_void" ON void_moon_windows;
CREATE POLICY "public_update_void" ON void_moon_windows FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_void" ON void_moon_windows;
CREATE POLICY "public_delete_void" ON void_moon_windows FOR DELETE TO anon, authenticated USING (true);

-- mantra_affirmations policies
DROP POLICY IF EXISTS "public_read_mantra" ON mantra_affirmations;
CREATE POLICY "public_read_mantra" ON mantra_affirmations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_mantra" ON mantra_affirmations;
CREATE POLICY "public_insert_mantra" ON mantra_affirmations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_mantra" ON mantra_affirmations;
CREATE POLICY "public_update_mantra" ON mantra_affirmations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_mantra" ON mantra_affirmations;
CREATE POLICY "public_delete_mantra" ON mantra_affirmations FOR DELETE TO anon, authenticated USING (true);
