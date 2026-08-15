import { useEffect, useState } from 'react';
import { CircleCheck as CheckCircle, Sparkles, ArrowRight, Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { STRIPE_PRODUCTS } from '@/stripe-config';

export default function SuccessPage() {
  const [verifying, setVerifying] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;

    async function checkSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setVerifying(false); return; }

      const { data } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (data?.status === 'active') {
        setConfirmed(true);
        setVerifying(false);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkSubscription, 1500);
      } else {
        setVerifying(false);
      }
    }

    checkSubscription();
  }, []);

  const product = STRIPE_PRODUCTS[0];

  return (
    <div className="relative min-h-screen bg-navy-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {verifying ? (
          <div className="flex flex-col items-center gap-4 text-cream-200/50">
            <Loader2 className="w-10 h-10 animate-spin text-gold-400" />
            <p className="font-display text-sm uppercase tracking-widest">Confirming your subscription…</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gold-400/20 bg-navy-900/60 p-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-gold-300" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs mb-5">
              <Sparkles className="w-3 h-3" />
              {confirmed ? 'Membership Activated' : 'Payment Received'}
            </div>

            <h1 className="font-display text-3xl font-medium text-cream-50 mb-3">
              Welcome to the Cosmos
            </h1>
            <p className="text-cream-200/50 text-sm leading-relaxed mb-2">
              Your <span className="text-gold-300">{product.name}</span> is now active.
            </p>
            <p className="text-cream-200/30 text-xs mb-8">
              Full access to all readings, rituals, and cosmic insights awaits you.
            </p>

            <a
              href="/"
              className="w-full py-3 rounded-xl bg-gold-400/20 border border-gold-400/40 hover:bg-gold-400/30 text-gold-200 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              Explore Your Reading
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
