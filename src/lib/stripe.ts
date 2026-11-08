import { supabase } from './supabase';

export async function createCheckoutSession(
  priceId: string,
  mode: 'payment' | 'subscription'
): Promise<string> {
  const { data: session } = await supabase.auth.getSession();
  const user = session.session?.user;
  if (!user) throw new Error('Not authenticated');

  // Fallback to direct checkout URL or local proxy route
  const checkoutUrl = `https://checkout.stripe.com/pay/${priceId}?prefilled_email=${encodeURIComponent(user.email || '')}`;
  
  // Return target URL for direct redirection
  return checkoutUrl;
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
