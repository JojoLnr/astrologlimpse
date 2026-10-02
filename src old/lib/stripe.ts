import { supabase } from './supabase';

export async function createCheckoutSession(planType: 'weekly' | 'monthly'): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('You must be signed in to complete purchase.');
  }

  // Call your Supabase Edge Function or backend API endpoint
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { planType },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    console.error('Stripe checkout function error:', error);
    throw new Error(error.message || 'Unable to connect to payment gateway.');
  }

  if (data?.url) {
    window.location.href = data.url;
  } else {
    throw new Error('No checkout URL was returned by payment service.');
  }
}

export async function createPortalSession(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('You must be signed in to manage billing.');
  }

  const { data, error } = await supabase.functions.invoke('create-portal-session', {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    console.error('Stripe portal function error:', error);
    throw new Error(error.message || 'Unable to access billing portal.');
  }

  if (data?.url) {
    return data.url;
  }
  throw new Error('No portal URL was returned by billing service.');
}