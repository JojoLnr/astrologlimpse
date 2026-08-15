/*
# Create profiles and subscriptions tables for auth + membership

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, user email)
  - `is_paid_member` (boolean, default false — controls whether detailed content is unblurred)
  - `stripe_customer_id` (text, nullable — Stripe customer reference)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

- `subscriptions`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `stripe_subscription_id` (text, nullable)
  - `stripe_price_id` (text, nullable)
  - `status` (text: active, canceled, past_due, etc.)
  - `current_period_end` (timestamp, nullable)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

2. Security
- Enable RLS on both tables.
- profiles: users can read/update their own row. INSERT is handled by trigger on auth.users signup.
- subscriptions: users can read their own subscriptions. All writes go through SECURITY DEFINER functions (set by Stripe webhook).
- A trigger automatically creates a profile row when a new auth.user signs up.

3. Notes
- The `is_paid_member` column is the server-side gate for content access. It is NOT client-writable.
- Stripe webhook will update this column via a SECURITY DEFINER function.
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  is_paid_member boolean NOT NULL DEFAULT false,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

-- Users can update their own profile (but NOT is_paid_member or stripe_customer_id — column privileges handle that)
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Revoke client ability to update privileged columns
REVOKE UPDATE ON profiles FROM authenticated;
GRANT UPDATE (email) ON profiles TO authenticated;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id text,
  stripe_price_id text,
  status text NOT NULL DEFAULT 'incomplete',
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscriptions
DROP POLICY IF EXISTS "subscriptions_select_own" ON subscriptions;
CREATE POLICY "subscriptions_select_own" ON subscriptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- SECURITY DEFINER function to update membership status (called by Stripe webhook)
CREATE OR REPLACE FUNCTION update_membership_status(
  p_user_id uuid,
  p_is_paid_member boolean,
  p_stripe_customer_id text DEFAULT NULL,
  p_stripe_subscription_id text DEFAULT NULL,
  p_status text DEFAULT NULL,
  p_current_period_end timestamptz DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Update profile
  UPDATE profiles
  SET is_paid_member = p_is_paid_member,
      stripe_customer_id = COALESCE(p_stripe_customer_id, stripe_customer_id),
      updated_at = now()
  WHERE id = p_user_id;

  -- Upsert subscription record
  IF p_stripe_subscription_id IS NOT NULL THEN
    INSERT INTO subscriptions (user_id, stripe_subscription_id, status, current_period_end, updated_at)
    VALUES (p_user_id, p_stripe_subscription_id, COALESCE(p_status, 'active'), p_current_period_end, now())
    ON CONFLICT (stripe_subscription_id) DO UPDATE
    SET status = COALESCE(p_status, subscriptions.status),
        current_period_end = COALESCE(p_current_period_end, subscriptions.current_period_end),
        updated_at = now();
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION update_membership_status FROM anon;
GRANT EXECUTE ON FUNCTION update_membership_status TO authenticated;

-- Trigger to auto-create a profile when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add unique constraint on stripe_subscription_id for upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_stripe_subscription_id_key'
  ) THEN
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_stripe_subscription_id_key UNIQUE (stripe_subscription_id);
  END IF;
END $$;
