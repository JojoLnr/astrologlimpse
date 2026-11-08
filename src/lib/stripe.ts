import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

export async function createCheckoutSession(
  priceId: string,
  mode: 'payment' | 'subscription'
): Promise<string> {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to initialize. Check VITE_STRIPE_PUBLISHABLE_KEY.');

  const { data: session } = await supabase.auth.getSession();
  const user = session.session?.user;
  if (!user) throw new Error('Not authenticated');

  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: mode,
    customerEmail: user.email,
    successUrl: `${window.location.origin}/discountpurchased?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/catalog`,
  });

  if (error) {
    throw new Error(error.message || 'Checkout failed');
  }

  return '';
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
