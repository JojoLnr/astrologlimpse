/*
  # Astrologlimpse: Profiles table + subscription tracking

  1. New Tables
    - `profiles`: Tracks per-user state for the astrology app
      - `id` (uuid, PK, references auth.users)
      - `email` (text, user email)
      - `has_used_free_reading` (boolean, default false)
      - `subscription_status` (enum: none, monthly)
      - `weekly_unlocked_until` (timestamptz, tracks one-time weekly unlock expiry)
      - `created_at`, `updated_at`

  2. Security
    - Enables RLS on `profiles`
    - 4 owner-scoped policies (SELECT/INSERT/UPDATE/DELETE) using auth.uid()
    - Trigger to auto-create a profile row when a new auth user signs up

  3. Important Notes
    - The profile is auto-created via trigger on auth.users insert
    - subscription_status defaults to 'none' and is updated by the webhook
    - weekly_unlocked_until is set when a one-time payment succeeds
*/

CREATE TYPE astro_subscription_status AS ENUM ('none', 'monthly');

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL DEFAULT '',
  has_used_free_reading boolean NOT NULL DEFAULT false,
  subscription_status astro_subscription_status NOT NULL DEFAULT 'none',
  weekly_unlocked_until timestamptz DEFAULT null,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- Auto-create a profile when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant execute on the trigger function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;