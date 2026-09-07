import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type SubscriptionStatus = 'none' | 'monthly';

export interface Profile {
  id: string;
  email: string;
  has_used_free_reading: boolean;
  subscription_status: SubscriptionStatus;
  weekly_unlocked_until: string | null;
  created_at: string;
  updated_at: string;
}
