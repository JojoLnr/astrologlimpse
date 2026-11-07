import { useState } from 'react';
import { 
  Sparkles, Zap, BookOpen, Crown, Rocket, Compass, 
  ArrowLeft, Check, ShieldCheck, Loader2, Star, Cpu, Shield, Eye
} from 'lucide-react';
import { StarryBackground } from '@/components/StarryBackground';
import { createCheckoutSession } from '@/lib/stripe';
import { useAuth } from '@/context/AuthContext';

interface CatalogProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

interface ProductItem {
  id: string;
  priceId: string;
  name: string;
  tagline: string;
  price: string;
  numericValue: number;
  mode: 'payment' | 'subscription';
  isHero?: boolean;
  isAnchor?: boolean;
  isTest?: boolean;
  badge?: string;
  features: string[];
  icon: React.ElementType;
  accentColor: string;
  previewSnippet: string;
  riskCopy: string;
}

const PRODUCTS: Record<string, ProductItem> = {
  test: {
    id: 'test',
    priceId: 'price_test_placeholder',
    name: 'Test Entry',
    tagline: 'Internal sandbox verification flow',
    price: '$1.00',
    numericValue: 1.0,
    mode: 'payment',
    isTest: true,
    badge: 'DEV ONLY',
    features: ['Instant $1 checkout test', 'Validates Stripe redirection', 'Fires conversion tag verification'],
    icon: Zap,
    accentColor: '#94a3b8',
    previewSnippet: 'SYSTEM_TEST_MODE_ACTIVE // 001',
    riskCopy: 'Sandbox mode test transaction.',
  },
  transit: {
    id: 'transit',
    priceId: 'price_transit_placeholder',
    name: 'The Today Transit Flash',
    tagline: 'Instant single-transit scan for immediate planetary clarity',
    price: '$1.00',
    numericValue: 1.0,
    mode: 'payment',
    badge: 'Micro-Scan',
    features: ['Single-page real-time transit scan', 'Live planetary degree positions', 'Actionable daily timing window'],
    icon: Compass,
    accentColor: '#38bdf8',
    previewSnippet: 'Moon conjunct Midheaven at 14° Taurus. Favorable for public communication between 2:00 PM and 4:30 PM.',
    riskCopy: 'Instant digital access delivered on screen within seconds.',
  },
  full_package: {
    id: 'full_package',
    priceId: 'price_full_package_placeholder',
    name: 'The 10-Point Life Crossroads Blueprint',
    tagline: 'Comprehensive natal breakdown covering love, career & karmic nodes',
    price: '$5.00',
    numericValue: 5.0,
    mode: 'payment',
    badge: 'Core Reading',
    features: ['Complete 10-point cosmic blueprint', 'Sun, Moon & Rising Sign analysis', 'House 7 & 10 detailed alerts', 'Delivered to dashboard & email'],
    icon: BookOpen,
    accentColor: '#48bb78',
    previewSnippet: 'House 7 Activation: Saturn pressure clearing. Expect structural partnership shifts over the next 30 days.',
    riskCopy: 'Instant access sent to your dashboard and email.',
  },
  premium_membership: {
    id: 'premium_membership',
    priceId: 'price_premium_sub_placeholder',
    name: 'The Premium Cosmic Access Pass',
    tagline: 'Continuous weekly ephemeris calculations & live dashboard unblurs',
    price: '$9.99',
    numericValue: 9.99,
    mode: 'subscription',
    isHero: true,
    badge: 'MOST POPULAR ACCESS',
    features: ['Up to 2 full readings every week', 'Unlimited web dashboard unblurs', 'Real-time ephemeris degree metrics', 'Cancel anytime with 1-click'],
    icon: Crown,
    accentColor: '#c4a374',
    previewSnippet: 'RECURRING SYNC: Live weekly planetary transit feeds mapped directly to your unique natal house coordinates.',
    riskCopy: 'Cancel anytime in 1 click from your account settings. No commitment.',
  },
  vip_orbit: {
    id: 'vip_orbit',
    priceId: 'price_vip_orbit_placeholder',
    name: 'The VIP Orbit Pass',
    tagline: 'Priority queue skip & direct astrological Q&A access',
    price: '$99.99',
    numericValue: 99.99,
    mode: 'subscription',
    badge: 'Concierge Tier',
    features: ['Priority queue skip on all readings', 'Everything in Premium Membership', 'Monthly direct Q&A submission (3 questions)', 'Dedicated cosmic concierge support'],
    icon: Rocket,
    accentColor: '#a855f7',
    previewSnippet: 'VIP DIRECT CHANNEL: Direct coordinate auditing with priority computational allocation.',
    riskCopy: 'Priority queue entry with dedicated concierge support.',
  },
  cosmic_horizon: {
    id: 'cosmic_horizon',
    priceId: 'price_cosmic_horizon_placeholder',
    name: 'Executive Custom Birth Sky Art',
    tagline: 'High-res digital masterpiece depicting your exact birth night sky coordinates',
    price: '$249.99',
    numericValue: 249.99,
    mode: 'payment',
    isAnchor: true,
    badge: 'LUXURY ARTIFACT',
    features: [
      'High-res digital birth sky art (exact coordinates & time)',
      'Executive-grade breakdown certificate',
      'Swiss Ephemeris precision calculation engine',
      'Print-ready high-DPI digital painting output',
    ],
    icon: Sparkles,
    accentColor: '#f59e0b',
    previewSnippet: 'SWISS EPHEMERIS ARTIFACT: 300 DPI vector sky mapping with gold-foil border geometry layout.',
    riskCopy: 'Securely processed and printed to exact Swiss Ephemeris metrics.',
  },
};

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Chicago, IL',
    text: 'I finally understood why my career felt stalled. The transit breakdown showed me exactly when Mars leaves my 10th house. Game changer.',
    sign: 'Capricorn',
  },
  {
    name: 'Marcus K.',
    location: 'Brooklyn, NY',
    text: 'The Chiron reading nailed a pattern I have been circling for 15 years. Seeing the exact degree and transit window gave me something to actually work with.',
    sign: 'Scorpio',
  },
  {
    name: 'Priya D.',
    location: 'Austin, TX',
    text: 'I have tried three other astrology apps. This is the only one that gave me specific dates instead of vague personality descriptions. Eerily accurate.',
    sign: 'Libra',
  },
];

const comparisonRows = [
  { feature: 'Data Calculation', generic: 'Sun Sign Only (1/12th of world)', ours: 'Exact Natal Chart (Unique to your time/coords)' },
  { feature: 'Forecast Timing', generic: 'Pre-written monthly horoscope columns', ours: 'Live, Real-Time Swiss Ephemeris Degrees' },
  { feature: 'Astrological Depth', generic: 'Basic 12 signs and planets', ours: 'Chiron, Black Moon Lilith, Nodes & Asteroids' },
  { feature: 'Actionable Output', generic: 'Vague personality affirmations', ours: 'Specific calendar timing windows for action' },
];

const trustBadges = [
  { icon: Cpu, label: 'Swiss Ephemeris Calculation Engine' },
  { icon: Shield, label: '256-Bit Encrypted Stripe Security' },
];

export function Catalog({ onNavigateHome, onNavigateDashboard }: CatalogProps) {
  const { user, signInWithGoogle } = useAuth();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleBuy = async (product: ProductItem) => {
    setErrorMsg('');

    if (!user) {
      try {
        sessionStorage.setItem('pending_catalog_checkout', product.priceId);
        sessionStorage.setItem('pending_catalog_mode', product.mode);
        sessionStorage.setItem('pending_catalog_value', product.numericValue.toString());
        await signInWithGoogle();
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Google sign-in failed');
      }
      return;
    }

    setLoadingId(product.id);
    try {
      const url = await createCheckoutSession(product.priceId, product.mode);
      window.location.href = url;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to launch checkout');
      setLoadingId(null);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-champagne-400/20 bg-[#04060b]">
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#04060b] to-[#04060b] pointer-events-none" />
      <StarryBackground />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-28">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-12 border-b border-white/[0.08] pb-6">
          <button
            onClick={onNavigateHome}
            className="group inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-champagne-300 uppercase hover:text-champagne-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            [ Return to Observatory ]
          </button>
          <button
            onClick={onNavigateDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-300 hover:bg-white/[0.06] hover:border-champagne-400/30 transition-all shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-champagne-300" />
            My Dashboard
          </button>
        </div>

        {/* Editorial Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-champagne-400/[0.06] border border-champagne-400/20 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(196,163,116,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-champagne-200">Catalog Artifacts & Access Tiers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-light text-champagne-50 mb-6 tracking-tight leading-[1.15]">
            Calibrate Your <br />
            <span className="bg-gradient-to-r from-champagne-200 via-champagne-300 to-amber-200 bg-clip-text text-transparent italic font-normal">
              Celestial Coordinates
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-light tracking-wide max-w-xl mx-auto leading-relaxed">
            Bypass generic astrology. Choose a single tactical flash reading, secure ongoing weekly synchronization, or commission a custom birth sky masterpiece.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-8 pt-6 border-t border-white/[0.06]">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <badge.icon className="w-3.5 h-3.5 text-champagne-400" />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="max-w-md mx-auto mb-10 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-center text-xs text-red-300 font-mono">
            {errorMsg}
          </div>
        )}

        {/* ================================================================ */}
        {/* HERO SECTION: THE $9.99/mo SUBSCRIPTION (EDITORIAL BANNER)       */}
        {/* ================================================================ */}
        {(() => {
          const item = PRODUCTS.premium_membership;
          const isLoading = loadingId === item.id;
          return (
            <div className="relative rounded-[2rem] border border-champagne-400/50 bg-gradient-to-br from-[#0c1224] via-[#070a14] to-[#04060b] p-8 sm:p-12 mb-12 shadow-[0_0_90px_rgba(196,163,116,0.15)] overflow-hidden">
              {/* Glowing nebula effect inside card */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-champagne-400/[0.07] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/[0.05] rounded-full blur-3xl pointer-events-none" />
              
              <div className="absolute top-6 right-8 px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase bg-champagne-400/20 border border-champagne-400/40 text-champagne-100 shadow-md">
                {item.badge}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
                
                {/* Editorial Transmission Preview Box */}
                <div className="lg:col-span-5 rounded-2xl border border-champagne-400/20 bg-black/70 p-6 flex flex-col justify-between relative shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                      <span className="text-[11px] font-mono tracking-widest text-champagne-200 uppercase">Live Dashboard Feed</span>
                    </div>
                    <Eye className="w-4 h-4 text-champagne-400" />
                  </div>

                  <div className="font-mono text-xs text-champagne-100/90 leading-relaxed bg-champagne-400/[0.04] p-5 rounded-xl border border-champagne-400/15 mb-5 shadow-inner">
                    <p className="text-[10px] font-mono text-champagne-400 uppercase tracking-widest mb-2">// TRANSMISSION_SNIPPET</p>
                    {item.previewSnippet}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-3 border-t border-white/[0.06]">
                    <span className="text-slate-400">REF: SUB_ACTIVE_NODE</span>
                    <span className="text-champagne-300 font-semibold">UNLIMITED UNBLURS</span>
                  </div>
                </div>

                {/* Details & Action */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-champagne-400/10 border border-champagne-400/30 flex items-center justify-center">
                        <Crown className="w-5 h-5 text-champagne-300" />
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-serif font-light text-champagne-50">{item.name}</h2>
                    </div>
                    <p className="text-sm sm:text-base text-slate-300 font-light mb-6 leading-relaxed">{item.tagline}</p>

                    <div className="flex items-baseline gap-3 mb-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
                      <span className="text-4xl sm:text-6xl font-serif text-champagne-100 font-light tracking-tight">{item.price}</span>
                      <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">/ monthly recurring sync</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {item.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                          <Check className="w-4 h-4 text-champagne-400 flex-shrink-0 mt-0.5" />
                          <span className="font-light">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={loadingId !== null}
                      className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-champagne-200 via-champagne-300 to-amber-300 text-midnight-950 font-mono text-xs tracking-[0.2em] uppercase font-bold hover:brightness-110 transition-all shadow-[0_4px_30px_rgba(196,163,116,0.4)] disabled:opacity-40 flex items-center justify-center gap-2.5 mb-3"
                    >
                      {loadingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : `Acquire Membership (${item.price}/mo)`}
                    </button>
                    <p className="text-[11px] font-mono text-slate-400">{item.riskCopy}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ================================================================ */}
        {/* EDITORIAL 3-COLUMN CARDS: TRANSIT, BLUEPRINT, VIP PASS           */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[PRODUCTS.transit, PRODUCTS.full_package, PRODUCTS.vip_orbit].map((item) => {
            const Icon = item.icon;
            const isLoading = loadingId === item.id;

            return (
              <div
                key={item.id}
                className="relative rounded-3xl border border-white/[0.1] bg-gradient-to-br from-slate-900/80 via-[#0a0f1d]/90 to-midnight-950/90 backdrop-blur-2xl p-7 flex flex-col justify-between hover:border-champagne-400/40 transition-all duration-300 group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg"
                      style={{ borderColor: `${item.accentColor}40`, background: `${item.accentColor}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: item.accentColor }} />
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase bg-white/[0.05] px-3 py-1 rounded-lg border border-white/[0.08]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif text-champagne-50 mb-2 leading-snug">{item.name}</h3>
                  <p className="text-xs text-slate-300 font-light mb-6 leading-relaxed">{item.tagline}</p>

                  <div className="bg-black/50 border border-white/[0.06] rounded-xl p-4 mb-6 shadow-inner">
                    <p className="text-[10px] font-mono text-champagne-300/80 uppercase tracking-widest mb-1.5">// SAMPLE_OUTPUT</p>
                    <p className="font-mono text-[11px] text-slate-300 italic leading-relaxed">"{item.previewSnippet}"</p>
                  </div>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-serif text-champagne-100 font-light">{item.price}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{item.mode === 'subscription' ? '/ month' : 'one-time'}</span>
                  </div>

                  <ul className="space-y-3 mb-8 border-t border-white/[0.06] pt-6">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 font-light">
                        <Check className="w-4 h-4 text-champagne-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={loadingId !== null}
                    className="w-full py-4 rounded-xl bg-white/[0.05] border border-white/[0.12] text-champagne-100 font-mono text-xs tracking-[0.15em] uppercase font-semibold hover:bg-white/[0.1] hover:border-champagne-400/40 transition-all disabled:opacity-40 flex items-center justify-center gap-2 mb-3 shadow-md"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Acquire for ${item.price}`}
                  </button>
                  <p className="text-[10px] font-mono text-slate-400 text-center">{item.riskCopy}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================ */}
        {/* LUXURY ANCHOR SECTION: $249.99 CUSTOM BIRTH SKY ART              */}
        {/* ================================================================ */}
        {(() => {
          const item = PRODUCTS.cosmic_horizon;
          const isLoading = loadingId === item.id;
          return (
            <div className="relative rounded-[2rem] border-2 border-amber-500/50 bg-gradient-to-br from-amber-950/30 via-[#0a0d18]/95 to-slate-950/95 p-8 sm:p-12 mb-16 shadow-[0_0_80px_rgba(245,158,11,0.12)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                <div className="lg:col-span-7 flex flex-col justify-between order-2 lg:order-1">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase bg-amber-500/20 border border-amber-500/40 text-amber-200 mb-5 shadow-sm">
                      {item.badge}
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-serif font-light text-champagne-50 mb-3">{item.name}</h3>
                    <p className="text-sm sm:text-base text-slate-300 font-light mb-6 leading-relaxed">{item.tagline}</p>

                    <div className="flex items-baseline gap-3 mb-6 p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                      <span className="text-4xl sm:text-5xl font-serif text-amber-200 font-light">{item.price}</span>
                      <span className="text-xs font-mono text-amber-300 uppercase tracking-widest">/ physical canvas + digital vector output</span>
                    </div>

                    <div className="space-y-3 mb-8">
                      {item.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 font-light">
                          <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={loadingId !== null}
                      className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-amber-500/30 to-amber-600/40 border border-amber-500/60 text-amber-100 font-mono text-xs tracking-[0.2em] uppercase font-bold hover:bg-amber-500/40 transition-all shadow-[0_4px_30px_rgba(245,158,11,0.25)] disabled:opacity-40 flex items-center justify-center gap-2 mb-3"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Order Custom Sky Art (${item.price})`}
                    </button>
                    <p className="text-[11px] font-mono text-slate-400">{item.riskCopy}</p>
                  </div>
                </div>

                <div className="lg:col-span-5 h-88 rounded-2xl border border-amber-500/40 bg-black/70 p-7 flex flex-col justify-between order-1 lg:order-2 relative overflow-hidden shadow-2xl backdrop-blur-md">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="flex items-center justify-between pb-4 border-b border-amber-500/30 relative z-10">
                    <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase">Artifact Blueprint #001</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>

                  <div className="my-auto text-center relative z-10 py-8">
                    <div className="w-16 h-16 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                      <Sparkles className="w-8 h-8 text-amber-300" />
                    </div>
                    <p className="font-serif text-xl text-champagne-100 mb-1.5 italic">&quot;Exact Night Sky Mapping&quot;</p>
                    <p className="text-xs font-mono text-amber-200/80 tracking-wider">Coordinates: 37.7749° N, 122.4194° W</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-2">Swiss Ephemeris Vector Calculation</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-4 border-t border-amber-500/30 relative z-10">
                    <span>SPEC: 300 DPI CANVAS</span>
                    <span className="text-amber-300 font-semibold">CUSTOM GENERATED</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

        {/* ================================================================ */}
        {/* TECHNICAL COMPARISON MATRIX                                      */}
        {/* ================================================================ */}
        <div className="mb-16 rounded-[2rem] border border-white/[0.1] bg-slate-900/40 backdrop-blur-xl p-8 sm:p-10 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-serif text-champagne-50 mb-2">Technical Engine Comparison</h3>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Why precision computation replaces generalized horoscopes</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.1] text-champagne-200 font-mono tracking-wider">
                  <th className="py-4 px-6 uppercase">Parameter</th>
                  <th className="py-4 px-6 text-slate-400 uppercase">Generic Astrology Apps</th>
                  <th className="py-4 px-6 text-champagne-300 font-semibold bg-champagne-400/[0.04] uppercase">Astrologlimpse Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-200 font-light">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-mono text-champagne-100 font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-slate-400">{row.generic}</td>
                    <td className="py-4 px-6 text-champagne-200 bg-champagne-400/[0.03] font-medium">{row.ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================================ */}
        {/* VERIFIED FIELD REPORTS (TESTIMONIALS)                            */}
        {/* ================================================================ */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-serif text-champagne-50 mb-2">Verified Field Reports</h3>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Observations from members navigating active transits</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md p-7 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-champagne-400 text-champagne-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-200 font-light leading-relaxed italic mb-6">&quot;{t.text}&quot;</p>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs font-mono">
                  <div>
                    <span className="font-semibold text-champagne-100 block">{t.name}</span>
                    <span className="text-[10px] text-slate-400">{t.location}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-champagne-400/10 border border-champagne-400/20 text-champagne-300 text-[10px]">
                    {t.sign}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DEV SANDBOX BAR */}
        {(() => {
          const item = PRODUCTS.test;
          const isLoading = loadingId === item.id;
          return (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 shadow-sm">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-mono text-slate-300 font-semibold">{item.name} ({item.price})</p>
                  <p className="text-[11px] font-mono text-slate-400">{item.tagline}</p>
                </div>
              </div>
              <button
                onClick={() => handleBuy(item)}
                disabled={loadingId !== null}
                className="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-600 font-mono text-xs text-slate-300 hover:bg-slate-700 transition-colors shadow-sm"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Run $1 Sandbox Checkout'}
              </button>
            </div>
          );
        })()}

        {/* Footer */}
        <footer className="max-w-xl mx-auto text-center pt-8 border-t border-white/[0.06] flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <ShieldCheck className="w-4 h-4 text-champagne-400/60" />
          <span>256-Bit Encrypted Stripe Processing & Swiss Ephemeris Calculations</span>
        </footer>
      </main>
    </div>
  );
}
