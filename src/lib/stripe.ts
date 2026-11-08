import { supabase } from './supabase';

export async function createCheckoutSession(
  priceIdOrUrl: string,
  _mode: 'payment' | 'subscription'
): Promise<string> {
  const { data: session } = await supabase.auth.getSession();
  const user = session.session?.user;
  if (!user) throw new Error('Not authenticated');

  // Direct Stripe Payment Link return (must remain unmodified)
  if (priceIdOrUrl.startsWith('http')) {
    return priceIdOrUrl;
  }

  // Direct payment link fallback
  return `https://buy.stripe.com/${priceIdOrUrl}`;
}

export async function createPortalSession(): Promise<string> {
  const { data: session } = await supabase.auth.getSession();
  const accessToken = session.session?.access_token;
  if (!accessToken) throw new Error('Not authenticated');

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-portal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      return_url: `${window.location.origin}/dashboard`,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Portal failed' }));
    throw new Error(error.error || 'Portal failed');
  }

  const data = await response.json();
  if (!data.url) throw new Error('No portal URL returned');
  return data.url as string;
}
