import React from 'react';
import { Check, Sparkles, Star, Loader as Loader2 } from 'lucide-react';
import { STRIPE_PRODUCTS } from '@/stripe-config';
import { useCheckout } from '@/hooks/useCheckout';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/lib/supabase';

export default function MembershipPage() {
  const { startCheckout, loading, error } = useCheckout();
  const { isActive, loading: subLoading } = useSubscription();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const product = STRIPE_PRODUCTS[0];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-20 px-4">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Cosmic Membership
        </div>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
          Unlock the Full Universe
        </h1>
        <p className="text-white/50 text-lg leading-relaxed">
          One membership. Every cosmic insight, ritual, and reading — personalized for your journey.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="relative rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-950/40 to-[#0d0d18] p-8 shadow-2xl shadow-violet-900/20">
          {/* Glow */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500/10 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium text-white">{product.name}</h2>
              <p className="text-white/40 text-sm mt-0.5">Billed monthly</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-light text-white">{product.currencySymbol}{product.price}</span>
              <span className="text-white/40 text-sm">/mo</span>
            </div>
          </div>

          <p className="text-white/60 text-sm leading-relaxed mb-6 border-t border-white/5 pt-6">
            {product.description}
          </p>

          <ul className="space-y-3 mb-8">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-white/70">
                <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-violet-400" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
          )}

          {isActive ? (
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <Star className="w-4 h-4 fill-emerald-400" />
              Active Membership
            </div>
          ) : (
            <button
              onClick={() => startCheckout(product)}
              disabled={loading || subLoading || !user}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-900/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting to checkout…
                </>
              ) : !user ? (
                'Sign in to Subscribe'
              ) : (
                `Subscribe for ${product.currencySymbol}${product.price}/mo`
              )}
            </button>
          )}

          {!user && (
            <p className="text-white/30 text-xs text-center mt-3">
              Create a free account to get started
            </p>
          )}
        </div>

        <p className="text-center text-white/25 text-xs mt-6">
          Secured by Stripe · Cancel anytime · No hidden fees
        </p>
      </div>
    </div>
  );
}