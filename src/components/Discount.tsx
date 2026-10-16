import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { StarryBackground } from '@/components/StarryBackground';
import { 
  Sparkles, Loader2, ArrowLeft, CheckCircle2, 
  Zap, Calendar, ShieldCheck, HelpCircle, Check,
  Sun, Moon, ArrowUpRight, TrendingUp, Heart, Lock, Compass, Eye
} from 'lucide-react';

interface DiscountProps {
  onNavigateHome: () => void;
}

const readingPoints = [
  { icon: Sun, title: 'Natal Sun Sign Analysis', subtitle: 'Core Identity', color: '#e9c46a' },
  { icon: Moon, title: 'Natal Moon Sign', subtitle: 'Emotional Architecture', color: '#778da9' },
  { icon: ArrowUpRight, title: 'Rising Sign (Ascendant)', subtitle: 'How You Present', color: '#8ab17d' },
  { icon: Zap, title: 'Primary Active Transit', subtitle: 'Major Live Influence', color: '#e94560' },
  { icon: TrendingUp, title: 'House 10: Career Check', subtitle: 'Career & Public Self', color: '#43aa8b' },
  { icon: Heart, title: 'House 7: Relationships', subtitle: 'Partnership Check', color: '#bc6c8b' },
  { icon: Moon, title: 'Current Lunar Phase Impact', subtitle: 'Emotional Timing', color: '#48cae4' },
  { icon: Heart, title: 'Chiron Placement', subtitle: 'Core Wound & Healing', color: '#f4a261' },
  { icon: Lock, title: 'Black Moon Lilith', subtitle: 'Hidden Desires', color: '#9d4edd' },
  { icon: Calendar, title: 'Weekly Forecast Snapshot', subtitle: '7-Day Action Window', color: '#c4a374' },
];

export function Discount({ onNavigateHome }: DiscountProps) {
  const { user, loading, signInWithGoogle } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const pendingCheckout = sessionStorage.getItem('pending_discount_checkout');
    if (user && pendingCheckout) {
      sessionStorage.removeItem('pending_discount_checkout');
      handleCheckout(pendingCheckout as 'single' | 'subscription');
    }
  }, [user]);

  const handleCheckout = async (priceType: 'single' | 'subscription') => {
    setErrorMsg('');

    if (!user) {
      try {
        sessionStorage.setItem('pending_discount_checkout', priceType);
        const { error } = await signInWithGoogle();
        if (error) throw new Error(error);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Redirect failed.');
      }
      return;
    }

    setCheckoutLoading(priceType);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          priceType: priceType,
          isDiscountRoute: true
        }),
      });

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.message || 'Failed to initiate secure checkout.');
      }

      const stripe = await loadStripe(
        import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
        import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
        ''
      );
      
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
        
        <button 
          onClick={onNavigateHome}
          className="group inline-flex items-center gap-2 mb-8 text-sm text-champagne-300 hover:text-champagne-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Return Home
        </button>

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
            Access your comprehensive blueprint map at special promotional tier entries. Select your option below to complete your checkout process securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          
          {/* Card Option 1: Single Reading */}
          <div className="relative group rounded-2xl border-2 border-white/[0.15] bg-gradient-to-br from-slate-900/90 to-midnight-950/90 backdrop-blur-xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-champagne-400/50 hover:shadow-[0_0_40px_rgba(251,191,36,0.05)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Single Entry</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Save 66% Now</span>
              </div>
              
              <h3 className="text-xl font-serif text-champagne-50 mb-2">10-Point Cosmic Blueprint</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Full comprehensive reading derived from your deep natal charts and current house alignments.
              </p>
              
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-6">
                <div className="text-xs text-slate-400 mb-2 flex justify-between items-center">
                  <span>Regular Price:</span>
                  <span className="line-through text-red-400 font-mono font-medium">$15.00</span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-light text-champagne-100 font-mono">$5</span>
                    <span className="text-xs text-slate-400">Promotional</span>
                  </div>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
                    Save 66%
                  </span>
                </div>
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
              disabled={checkoutLoading !== null}
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
          <div className="relative group rounded-2xl border-2 border-champagne-400/40 bg-gradient-to-br from-slate-900/90 to-midnight-950/90 backdrop-blur-xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-champagne-400/70 hover:shadow-[0_0_45px_rgba(196,163,116,0.08)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-champagne-300 uppercase tracking-wider">Unlimited Access</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Save 66% Now</span>
              </div>
              
              <h3 className="text-xl font-serif text-champagne-50 mb-2">Unlimited Access Membership</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Ongoing systemic updates mapping planetary trajectories, Chiron shifts, and recurring chart resets.
              </p>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-6">
                <div className="text-xs text-slate-400 mb-2 flex justify-between items-center">
                  <span>Regular Subscription:</span>
                  <span className="line-through text-red-400 font-mono font-medium">$30.00/mo</span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-light text-champagne-100 font-mono">$10</span>
                    <span className="text-xs text-slate-400">/mo</span>
                  </div>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
                    Save 66%
                  </span>
                </div>
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
              disabled={checkoutLoading !== null}
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

        {errorMsg && (
          <div className="max-w-md mx-auto mb-12 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-center">
            <p className="text-xs text-red-400 font-medium">{errorMsg}</p>
          </div>
        )}

        {/* ===== ITEM 1: THE 10 POINTS FIRST ===== */}
        <section className="mb-20 border-t border-white/[0.06] pt-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-400/[0.08] border border-champagne-400/20 backdrop-blur-sm mb-4">
              <Check className="w-4 h-4 text-champagne-300" />
              <span className="text-xs text-champagne-200 tracking-[0.15em] uppercase">Blueprint Value Details</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-champagne-50 mb-2 tracking-tight">
              10 Specific Cosmic Blueprint Points Included
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-xs sm:text-sm font-serif font-light italic">
              Every point below is calculated from your exact natal data fields, mapping actionable windows directly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto">
            {readingPoints.map((point, i) => (
              <div
                key={i}
                className="group flex items-start gap-4 rounded-xl border border-white/[0.1] bg-white/[0.04] p-4 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
              >
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border relative overflow-hidden"
                  style={{
                    borderColor: `${point.color}30`,
                    background: `linear-gradient(135deg, ${point.color}18, ${point.color}06)`,
                  }}
                >
                  <point.icon className="w-5 h-5 relative z-10" style={{ color: point.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-sm font-medium text-champagne-50">{point.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{point.subtitle}</p>
                </div>
                <Check className="w-4 h-4 text-champagne-400/60 flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </section>

        {/* ===== ITEM 2: THE DIAGRAM (8-PLANET MODEL, SLOWED SPIN, NO RINGS, INTEGRATED INSIGHTS) ===== */}
        <section className="mb-20 rounded-2xl border-2 border-white/[0.12] bg-gradient-to-br from-slate-900/90 to-midnight-950/90 backdrop-blur-xl p-8 text-center max-w-3xl mx-auto overflow-hidden shadow-2xl">
          <div className="mb-8">
            <h3 className="text-lg font-serif text-champagne-50 mb-1">Systemic Solar System Simulation</h3>
            <p className="text-xs text-slate-400">8-Planet full astronomical coordinate trajectory mapping</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center rounded-full border border-white/[0.04] bg-slate-950/80 shadow-2xl">
              <div className="absolute w-12 h-12 bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)] animate-pulse z-10">
                <Sun className="w-6 h-6 text-slate-950 animate-spin [animation-duration:60s]" />
              </div>
              
              <div className="absolute w-16 h-16 border border-white/[0.02] rounded-full" />
              <div className="absolute w-16 h-16 animate-[spin_12s_linear_infinite]">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
              </div>

              <div className="absolute w-24 h-24 border border-white/[0.02] rounded-full" />
              <div className="absolute w-24 h-24 animate-[spin_20s_linear_infinite_reverse]">
                <div className="w-2 h-2 bg-amber-200 rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
              </div>

              <div className="absolute w-32 h-32 border border-white/[0.03] rounded-full" />
              <div className="absolute w-32 h-32 animate-[spin_30s_linear_infinite]">
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
              </div>

              <div className="absolute w-40 h-40 border border-white/[0.03] rounded-full" />
              <div className="absolute w-40 h-40 animate-[spin_42s_linear_infinite_reverse]">
                <div className="w-2 h-2 bg-red-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
              </div>

              <div className="absolute w-48 h-48 border border-white/[0.02] rounded-full" />
              <div className="absolute w-48 h-48 animate-[spin_60s_linear_infinite]">
                <div className="w-3.5 h-3.5 bg-amber-600 rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
              </div>

              <div className="absolute w-56 h-56 border border-white/[0.02] rounded-full" />
              <div className="absolute w-56 h-56 animate-[spin_80s_linear_infinite_reverse]">
                <div className="w-3 h-3 bg-yellow-600 rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
              </div>

              <div className="absolute w-64 h-64 border border-white/[0.02] rounded-full" />
              <div className="absolute w-64 h-64 animate-[spin_110s_linear_infinite]">
                <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
              </div>

              <div className="absolute w-72 h-72 border border-white/[0.02] rounded-full" />
              <div className="absolute w-72 h-72 animate-[spin_150s_linear_infinite_reverse]">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
              </div>
            </div>

            <div className="text-left bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4 h-full flex flex-col justify-center">
              <div className="flex items-center gap-2 text-champagne-300 font-serif text-sm font-medium">
                <Eye className="w-4 h-4" />
                <span>Cosmic Tracking Insights</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                By calculating the exact structural locations and geometric degrees of all 8 primary celestial bodies relative to your birth window, we uncover hidden behavioral matrices.
              </p>
              <div className="text-[11px] text-slate-400 space-y-2 border-t border-white/[0.06] pt-3">
                <p>• <strong className="text-champagne-100">Inner Alignment:</strong> Governs temporary emotional tides, mood architectures, and micro-expressions.</p>
                <p>• <strong className="text-champagne-100">Outer Alignment:</strong> Projects long-term career horizons, public destiny paths, and relational crossroads.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ITEM 3: THE CHART WITH INTERPRETATION VALUE ADDS ===== */}
        <section className="max-w-3xl mx-auto mb-16 rounded-2xl border-2 border-white/[0.12] bg-gradient-to-br from-slate-900/90 to-midnight-950/90 backdrop-blur-xl p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-champagne-400/10 border border-champagne-400/20 flex items-center justify-center">
                <Compass className="w-4 h-4 text-champagne-300" />
              </div>
              <div>
                <h3 className="text-sm font-serif text-champagne-50 font-medium">Ephemeris Live Metric Feed</h3>
                <p className="text-[11px] text-slate-400">Current active systemic weight balances</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-champagne-200">
                Calculations: 3,600s intervals
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              {[
                { label: 'Natal Sun Alignment Density', value: '88%', width: 'w-[88%]', color: 'from-amber-400 to-orange-500' },
                { label: 'Lunar Aspect Synthesis Vector', value: '74%', width: 'w-[74%]', color: 'from-blue-400 to-indigo-500' },
                { label: 'House 10 Midheaven Velocity', value: '92%', width: 'w-[92%]', color: 'from-emerald-400 to-teal-500' },
                { label: 'Chiron Vulnerability Delta', value: '41%', width: 'w-[41%]', color: 'from-pink-400 to-rose-500' }
              ].map((chartRow, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-light">{chartRow.label}</span>
                    <span className="font-mono text-champagne-300 font-medium">{chartRow.value}</span>
                  </div>
                  <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06]">
                    <div className={`h-full bg-gradient-to-r ${chartRow.color} ${chartRow.width} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 text-xs text-slate-400 leading-relaxed font-light">
              <span className="text-champagne-200 font-medium font-serif block mb-1">Interpretation Blueprint Guide:</span>
              These real-time metrics indicate the current planetary pressure matrix applied to your unique baseline chart. Sudden high-velocity thresholds reveal open windows of action where cosmic resistance is lowest—ideal for timing corporate initiatives, unlocking deep self-healing states, or initiating critical interpersonal dialogues.
            </div>
          </div>
        </section>

        <footer className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/[0.06] text-center sm:text-left">
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
