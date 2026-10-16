import { useEffect } from 'react';
import { StarryBackground } from '@/components/StarryBackground';
import { Analytics } from '@vercel/analytics/react';
import { Sparkles, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface DiscountPurchasedProps {
  onNavigateDashboard: () => void;
}

export function DiscountPurchased({ onNavigateDashboard }: DiscountPurchasedProps) {
  const { profile, loading, refreshProfile } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // 1. Force state synchronization to update subscription flags immediately on land
    refreshProfile();

    // 2. OFFICIAL GOOGLE TAG PURCHASE CONVERSION ON LANDING
    const params = new URLSearchParams(window.location.search);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const planType = params.get('plan'); // Captured from secure Stripe redirect
      
      console.log('Firing Google purchase conversion tracking event...');
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-718364257/nmRzCKfQ8J4dEOG8xdYC',
        'value': planType === 'subscription' ? 10.0 : 5.0,
        'currency': 'USD',
        'transaction_id': params.get('session_id') || `order_${Date.now()}` // Dynamic reference verification
      });
    }
  }, [refreshProfile]);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <StarryBackground />
        <Loader2 className="w-8 h-8 animate-spin text-champagne-300" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-slate-100 flex items-center justify-center p-4">
      <StarryBackground />
      
      <div className="relative z-10 max-w-md w-full rounded-2xl border-2 border-white/[0.12] bg-gradient-to-br from-slate-900/90 to-midnight-950/90 backdrop-blur-xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-light text-champagne-50 mb-3 tracking-tight">
          Cosmic Blueprint Unlocked!
        </h1>
        
        <p className="text-sm text-slate-300 mb-2 leading-relaxed">
          Your secure transaction has been logged successfully. The planetary transits have adjusted to reflect your newly cleared chart permissions.
        </p>

        {profile?.email && (
          <p className="text-xs text-slate-400 mb-8">
            Receipt and generation logs bound securely to: <br />
            <span className="text-champagne-300 font-mono">{profile.email}</span>
          </p>
        )}

        <button
          onClick={onNavigateDashboard}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-champagne-300 to-champagne-400 text-midnight-950 font-semibold text-sm hover:from-champagne-200 hover:to-champagne-300 transition-all duration-300 shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          Enter Cosmic Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <Analytics />
    </div>
  );
}
