import { useState } from 'react';
import { X, Loader2, Crown, Zap } from 'lucide-react';
import { createCheckoutSession } from '@/lib/stripe';

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
}

const ONE_TIME_PRICE_ID = 'price_one_time_weekly';
const MONTHLY_PRICE_ID = 'price_monthly_premium';

export function PaywallModal({ open, onClose }: PaywallModalProps) {
  const [loading, setLoading] = useState<'one' | 'monthly' | null>(null);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleCheckout = async (priceId: string, mode: 'payment' | 'subscription', which: 'one' | 'monthly') => {
    setLoading(which);
    setError('');
    try {
      const url = await createCheckoutSession(priceId, mode);
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-champagne-400/15 bg-gradient-to-br from-midnight-700 to-midnight-900 shadow-2xl overflow-hidden animate-[fadeInUp_0.3s_ease-out]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-champagne-300/30 to-transparent" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 bg-champagne-500/[0.04] blur-[60px] rounded-full" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-500 hover:text-champagne-100 hover:bg-white/[0.06] transition-all duration-300 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative p-6 sm:p-8">
          <h2 className="text-2xl font-serif text-champagne-50 mb-2">Unlock Your Reading</h2>
          <p className="text-slate-400 text-sm mb-6">
            Your free reading has been used. Choose a plan to continue your cosmic journey.
          </p>

          <div className="space-y-3">
            {/* One-time */}
            <button
              onClick={() => handleCheckout(ONE_TIME_PRICE_ID, 'payment', 'one')}
              disabled={loading !== null}
              className="w-full text-left rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 hover:border-champagne-400/25 hover:bg-white/[0.04] transition-all duration-300 disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-champagne-400/[0.08] border border-champagne-400/15 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-champagne-300" />
                  </div>
                  <div>
                    <p className="text-champagne-50 font-medium text-sm">Weekly Unlock</p>
                    <p className="text-slate-500 text-xs">One-time payment</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-serif text-champagne-50">$5</p>
                  <p className="text-xs text-slate-500">per week</p>
                </div>
              </div>
              {loading === 'one' && (
                <div className="mt-2 flex items-center gap-2 text-champagne-300 text-xs">
                  <Loader2 className="w-3 h-3 animate-spin" /> Redirecting to checkout...
                </div>
              )}
            </button>

            {/* Monthly */}
            <button
              onClick={() => handleCheckout(MONTHLY_PRICE_ID, 'subscription', 'monthly')}
              disabled={loading !== null}
              className="w-full text-left rounded-xl border border-champagne-400/25 bg-gradient-to-br from-champagne-400/[0.06] to-transparent p-4 hover:border-champagne-400/40 transition-all duration-300 disabled:opacity-50 relative overflow-hidden"
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-champagne-400/15 border border-champagne-400/25 text-[10px] text-champagne-200 font-medium tracking-[0.1em] uppercase">
                Best Value
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-champagne-400/[0.1] border border-champagne-400/20 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-champagne-300" />
                  </div>
                  <div>
                    <p className="text-champagne-50 font-medium text-sm">Premium Subscription</p>
                    <p className="text-slate-500 text-xs">Unlocks all weekly readings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-serif text-champagne-50">$10</p>
                  <p className="text-xs text-slate-500">per month</p>
                </div>
              </div>
              {loading === 'monthly' && (
                <div className="mt-2 flex items-center gap-2 text-champagne-300 text-xs">
                  <Loader2 className="w-3 h-3 animate-spin" /> Redirecting to checkout...
                </div>
              )}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-red-400/80 text-xs text-center">{error}</p>
          )}

          <p className="mt-4 text-center text-xs text-slate-600">
            Secure payment via Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
