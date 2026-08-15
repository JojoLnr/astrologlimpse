import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Subscription {
  id: string;
  status: string;
  stripe_price_id: string | null;
  current_period_end: string | null;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchSubscription() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          if (mounted) { setSubscription(null); setLoading(false); }
          return;
        }

        const { data } = await supabase
          .from('subscriptions')
          .select('id, status, stripe_price_id, current_period_end')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (mounted) {
          setSubscription(data ?? null);
          setLoading(false);
        }
      } catch {
        if (mounted) { setSubscription(null); setLoading(false); }
      }
    }

    fetchSubscription();

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(() => {
      fetchSubscription();
    });

    return () => {
      mounted = false;
      authSub?.unsubscribe();
    };
  }, []);

  const isActive = subscription?.status === 'active';

  return { subscription, loading, isActive };
}