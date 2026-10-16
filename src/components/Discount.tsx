import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { StarryBackground } from '@/components/StarryBackground';
import { 
  Sparkles, Loader2, ArrowLeft, CheckCircle2, 
  Zap, Calendar, ShieldCheck, HelpCircle, AlertCircle
} from 'lucide-react';

interface DiscountProps {
  onNavigateHome: () => void;
}

export function Discount({ onNavigateHome }: DiscountProps) {
  const { user, profile, loading, signInWithGoogle } = useAuth();
  const [authStatus, setAuthStatus] = useState<'idle' | 'sending'>('idle');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthStatus('sending');
    setErrorMsg('');
    const { error } = await signInWithGoogle();
    if (error) {
      setAuthStatus('idle');
      setErrorMsg(error);
    }
  };

  const handleCheckout = async (priceType: 'single' | 'subscription') => {
    if (!user) {
      setErrorMsg('Please continue with Google first to lock in your special rate.');
      return;
    }

    setCheckoutLoading(priceType);
    setErrorMsg('');

    try {
      // API call to your backend to create a Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          priceType: priceType, // 'single' ($5) or 'subscription' ($10)
          isDiscountRoute: true
        }),
      });

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.message || 'Failed to initiate secure checkout.');
      }

      // Redirect to Stripe Checkout using your publishable key
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
      if (stripe && session.id) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      } else {
        throw new Error('Stripe configuration missing.');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'A connection error occurred. Please try again.');
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <StarryBackground />
        <Loader2 className="w-8 h-8 animate-spin text-champagne-300" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-champagne-400/20">
      <StarryBackground />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-24">
        
        {/* Navigation Action */}
        <button 
          onClick={onNavigateHome}
          className="group inline-flex items-center gap-2 mb-8 text-sm text-champagne-300 hover:text-champagne-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Return Home
        </button>

        {/* Hero Value Statement */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-400/[0.08] border border-champagne-400/20 backdrop-blur-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-pulse" />
            <span className="text-xs text-champagne-200 tracking-[0.15em] uppercase">Limited Alignment Offer</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-champagne-50 mb-4 tracking-tight leading-tight">
            Claim Your Exclusive <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-champagne-200 via-champagne-300 to-champagne-200 bg-clip-text text-transparent">
              Cosmic Discount Rates
            </span>
          </h1>
          
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base font-light">
            The planetary weights indicate a clear window for self-discovery. Access your complete blueprint map at special promotional tier entries.
          </p>
        </div>

        {/* Step Guard Header */}
        {!user && (
          <div className="max-w-md mx-auto mb-10 rounded-xl border border-amber-500/30 bg-amber-500/[0.04] backdrop-blur-sm p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-200 text-sm font-medium mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>Registration Required First</span>
            </div>
            <p className="text-xs text-slate-300">
              Please initialize your account via Google below to anchor these price allocations to your profile prior to proceeding securely to Stripe.
            </p>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          
          {/* Card Option 1: Single Reading */}
          <div className="relative group rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-md p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Single Entry</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.06] border border-white/[0.1] text-slate-300">One-Time Pass</span>
              </div>
              
              <h3 className="text-xl font-serif text-champagne-50 mb-2">10-Point Cosmic Blueprint</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Full comprehensive reading derived from your deep natal charts and current house alignments.
              </p>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-light text-champagne-100 font-mono">$5</span>
                <span className="text-sm text-slate-500 line-through font-mono">$15</span>
                <span className="text-xs text-emerald-400 font-medium ml-1">Save 66%</span>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Complete Sun & Moon Architecture',
                  'Rising Sign & Astrological Ephemeris',
                  'Primary Active Transit Snapshot',
                  'Actionable dates & clear timing windows'
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-champagne-400/70 flex-shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('single')}
              disabled={checkoutLoading !== null || authStatus === 'sending'}
              className="w-full py-3 rounded-xl border border-champagne-400/30 bg-champagne-400/[0.04] text-champagne-200 text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-champagne-400/10 hover:border-champagne-400/60 disabled:opacity-40"
            >
              {checkoutLoading === 'single' ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                'Secure This Reading Rate'
              )}
            </button>
          </div>

          {/* Card Option 2: Subscription Tier */}
          <div className="relative group rounded-2xl border border-champagne-400/30 bg-gradient-to-b from-champagne-400/[0.06] to-white/[0.01] backdrop-blur-md p-6 flex flex-col justify-between transition-all duration-300 hover:border-champagne-400/40 hover:shadow-[0_0_40px_rgba(196,163,116,0.05)]">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-gradient-to-r from-champagne-300 to-champagne-400 text-midnight-950 shadow-md">
              Best Cosmic Value
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-champagne-300 uppercase tracking-wider">Unlimited Access</span>
                <span className="flex items-center gap-1 text-[10px] font-medium text-champagne-200">
                  <Zap className="w-3 h-3 text-champagne-300" /> Recurring Access
                </span>
              </div>
              
              <h3 className="text-xl font-serif text-champagne-50 mb-2">Unlimited Access Membership</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Ongoing systemic updates mapping planetary trajectories, Chiron shifts, and recurring chart resets.
              </p>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-light text-champagne-100 font-mono">$10</span>
                <span className="text-xs text-slate-400 font-mono">/month</span>
                <span className="text-sm text-slate-500 line-through font-mono ml-1">$30</span>
                <span className="text-xs text-emerald-400 font-medium ml-1">Save 66%</span>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Everything included in the single tier',
                  'Unlimited weekly forecast tracking',
                  'Continuous real-time degree calculations',
                  'Priority delivery flags for all updates'
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-champagne-300 flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-300">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('subscription')}
              disabled={checkoutLoading !== null || authStatus === 'sending'}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-champagne-300 to-champagne-400 text-midnight-950 text-sm font-semibold tracking-wide transition-all duration-300 hover:from-champagne-200 hover:to-champagne-300 shadow-md disabled:opacity-40"
            >
              {checkoutLoading === 'subscription' ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto text-midnight-950" />
              ) : (
                'Secure Membership Rate'
              )}
            </button>
          </div>
        </div>

        {/* Registration Flow Action Button */}
        {!user ? (
          <div className="max-w-md mx-auto text-center border-t border-white/[0.06] pt-8">
            <h4 className="text-sm font-serif text-champagne-200 mb-3">Step 1: Authenticate with Google</h4>
            <button
              onClick={handleGoogleSignIn}
              disabled={authStatus === 'sending'}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-champagne-50 text-sm font-semibold hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 disabled:opacity-50"
            >
              {authStatus === 'sending' ? (
                <Loader2 className="w-4 h-4 animate-spin text-champagne-300" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
            <p className="mt-3 text-[11px] text-slate-500">
              No long passwords required. An entry configuration locks to your dynamic OAuth stream immediately.
            </p>
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center border-t border-white/[0.06] pt-6">
            <p className="text-xs text-slate-400">
              Logged in safely as <span className="text-champagne-300 font-mono">{user.email}</span>. Select a tier card above to progress directly to your automated Stripe payment dashboard.
            </p>
          </div>
        )}

        {/* Global Error Messaging */}
        {errorMsg && (
          <div className="max-w-md mx-auto mt-4 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-center">
            <p className="text-xs text-red-400 font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Assurance Grid Footer */}
        <footer className="mt-16 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/[0.06] text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start">
            <ShieldCheck className="w-5 h-5 text-champagne-400/60 mb-2" />
            <h5 className="text-xs font-semibold text-champagne-50 mb-1">Encrypted Checkout</h5>
            <p className="text-[11px] text-slate-400 leading-normal">
              Stripe compliance ensures absolute isolation of processing layers.
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <Calendar className="w-5 h-5 text-champagne-400/60 mb-2" />
            <h5 className="text-xs font-semibold text-champagne-50 mb-1">Flexible Adjustments</h5>
            <p className="text-[11px] text-slate-400 leading-normal">
              Cancel recurring subscription paths easily anytime direct via your custom user panel.
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <HelpCircle className="w-5 h-5 text-champagne-400/60 mb-2" />
            <h5 className="text-xs font-semibold text-champagne-50 mb-1">Support Linkage</h5>
            <p className="text-[11px] text-slate-400 leading-normal">
              Direct connection metrics monitoring available at support@astrologlimpse.com.
            </p>
          </div>
        </footer>

      </main>
    </div>
  );
}
