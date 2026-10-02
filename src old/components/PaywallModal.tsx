import { useState } from 'react';
import { X, Crown, Zap, Loader2 } from 'lucide-react';
import { createCheckoutSession } from '@/lib/stripe';

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
}

export function PaywallModal({ open, onClose }: PaywallModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<'weekly' | 'monthly' | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!open) return null;

  const handleSelectPlan = async (planType: 'weekly' | 'monthly') => {
    setLoadingPlan(planType);
    setErrorMsg('');
    try {
      await createCheckoutSession(planType);
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to connect to checkout service.');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0f142e] p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif text-white mb-2">Unlock Your Reading</h2>
          <p className="text-sm text-slate-400">
            Your free reading has been used. Choose a plan to continue your cosmic journey.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {/* Weekly Option */}
          <button
            onClick={() => handleSelectPlan('weekly')}
            disabled={loadingPlan !== null}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-amber-300/40 transition-all text-left disabled:opacity-50 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center">
                {loadingPlan === 'weekly' ? (
                  <Loader2 className="w-5 h-5 text-amber-300 animate-spin" />
                ) : (
                  <Zap className="w-5 h-5 text-amber-300" />
                )}
              </div>
              <div>
                <p className="text-sm text-white font-medium">Weekly Unlock</p>
                <p className="text-xs text-slate-400">One-time payment</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-serif font-bold text-white">$5</span>
              <p className="text-[10px] text-slate-400">one-time</p>
            </div>
          </button>

          {/* Monthly Option */}
          <button
            onClick={() => handleSelectPlan('monthly')}
            disabled={loadingPlan !== null}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-amber-300/30 bg-amber-300/[0.04] hover:bg-amber-300/[0.08] hover:border-amber-300/60 transition-all text-left disabled:opacity-50 relative group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center">
                {loadingPlan === 'monthly' ? (
                  <Loader2 className="w-5 h-5 text-amber-300 animate-spin" />
                ) : (
                  <Crown className="w-5 h-5 text-amber-300" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white font-medium">Premium Subscription</p>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-300 text-[#0a0e27]">
                    BEST VALUE
                  </span>
                </div>
                <p className="text-xs text-slate-400">Unlocks readings twice a week every month</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-serif font-bold text-white">$10</span>
              <p className="text-[10px] text-slate-400">per month</p>
            </div>
          </button>
        </div>

        {errorMsg && (
          <p className="mb-4 text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
            {errorMsg}
          </p>
        )}

        <p className="text-center text-xs text-slate-500">
          Secure payment via Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}