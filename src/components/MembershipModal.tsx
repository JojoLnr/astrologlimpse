import { useState } from 'react';
import { X, Sparkles, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { STRIPE_PRODUCTS } from '@/stripe-config';

export default function MembershipModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setError(null);
    if (!user) {
      setError('Please sign in first.');
      return;
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Please sign in first.');
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ priceId: STRIPE_PRODUCTS[0].priceId, mode: STRIPE_PRODUCTS[0].mode }),
        }
      );

      if (!res.ok) {
        setError('Unable to start checkout. Please try again.');
        setLoading(false);
        return;
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        setError('Unable to start checkout.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-gold-400/25 bg-navy-900 p-8 shadow-2xl shadow-gold-400/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-cream-200/40 transition-colors hover:text-gold-300"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <span className="font-ornament text-3xl text-gold-400">✦</span>
          <h2 className="mt-3 font-display text-3xl font-semibold uppercase tracking-wide text-cream-50">
            Unlock the Full Cosmos
          </h2>
          <p className="mt-3 font-serif text-lg italic text-cream-200/60">
            Become a member to reveal every detailed reading, transit guidance,
            ritual step, and shadow prompt.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-gold-400/20 bg-navy-800/40 p-6">
          <div className="flex items-baseline justify-center gap-2">
            <span className="font-display text-5xl font-semibold text-gold-300">${STRIPE_PRODUCTS[0].price}</span>
            <span className="font-serif text-lg italic text-cream-200/50">/ month</span>
          </div>
          <ul className="mt-6 space-y-3">
            {STRIPE_PRODUCTS[0].features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check className="h-4 w-4 flex-shrink-0 text-gold-300" strokeWidth={2} />
                <span className="font-serif text-base text-cream-100/85">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2.5 font-serif text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading || !user}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gold-400 px-6 py-3.5 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/20 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {user ? 'Subscribe Now' : 'Sign In First'}
        </button>

        {!user && (
          <p className="mt-3 text-center font-serif text-sm italic text-cream-200/40">
            You'll need to create an account before subscribing.
          </p>
        )}

        <p className="mt-4 text-center font-serif text-xs italic text-cream-200/30">
          Cancel anytime. Secure payment via Stripe.
        </p>
      </div>
    </div>
  );
}
