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
    tagline: 'Priority priority queue skip & direct astrological Q&A access',
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
    <div className="relative min-h-screen text-slate-100 selection:bg-champagne-400/20 bg-[#060814]">
      <StarryBackground />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-28">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-12 border-b border-white/[0.06] pb-6">
          <button
            onClick={onNavigateHome}
            className="group inline-flex items-center gap-2 text-xs font-mono tracking-widest text-champagne-300 uppercase hover:text-champagne-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            [ Return to Observatory ]
          </button>
          <button
            onClick={onNavigateDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-300 hover:bg-white/[0.06] hover:border-champagne-400/30 transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-champagne-300" />
            My Dashboard
          </button>
        </div>

        {/* Editorial Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-champagne-400/[0.06] border border-champagne-400/20 backdrop-blur-md mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-champagne-200">Catalog Artifacts & Access Tiers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-light text-champagne-50 mb-4 tracking-tight leading-[1.1]">
            Calibrate Your <br />
            <span className="bg-gradient-to-r from-champagne-200 via-champagne-300 to-amber-200 bg-clip-text text-transparent italic font-normal">
              Celestial Coordinates
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-light tracking-wide max-w-xl mx-auto">
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
          <div className="max-w-md mx-auto mb-10 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-center text-xs text-red-300 font-mono">
            {errorMsg}
          </div>
        )}

        {/* ================================================================ */}
        {/* HERO SECTION: THE $9.99/mo SUBSCRIPTION (THE MAIN ATTRACTION)     */}
        {/* ================================================================ */}
        {(() => {
          const item = PRODUCTS.premium_membership;
          const isLoading = loadingId === item.id;
          return (
            <div className="relative rounded-3xl border border-champagne-400/40 bg-gradient-to-br from-[#0c1021] via-[#080b16] to-[#04060b] p-8 sm:p-12 mb-12 shadow-[0_0_80px_rgba(196,163,116,0.12)] overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-champagne-400/[0.03] rounded-full blur-3xl pointer-events-none" />
              
              <div className="absolute top-6 right-8 px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase bg-champagne-400/15 border border-champagne-400/30 text-champagne-200">
                {item.badge}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                
                {/* Immersive Terminal Preview Box */}
                <div className="lg:col-span-5 rounded-2xl border border-white/[0.1] bg-black/60 p-6 flex flex-col justify-between relative shadow-inner">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Live Dashboard Feed</span>
                    </div>
                    <Eye className="w-4 h-4 text-champagne-400" />
                  </div>

                  <div className="font-mono text-xs text-champagne-200/90 leading-relaxed bg-champagne-400/[0.03] p-4 rounded-xl border border-champagne-400/10 mb-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">// TRANSMISSION_SNIPPET</p>
                    {item.previewSnippet}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2">
                    <span>REF: SUB_ACTIVE_NODE</span>
                    <span className="text-champagne-300">UNLIMITED UNBLURS</span>
                  </div>
                </div>

                {/* Details & Action */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <Crown className="w-5 h-5 text-champagne-300" />
                      <h2 className="text-2xl sm:text-3xl font-serif font-light text-champagne-50">{item.name}</h2>
                    </div>
                    <p className="text-sm text-slate-300 font-light mb-6 leading-relaxed">{item.tagline}</p>

                    <div className="flex items-baseline gap-3 mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-4xl sm:text-5xl font-serif text-champagne-100 font-light">{item.price}</span>
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">/ monthly recurring sync</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {item.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
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
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-champagne-200 via-champagne-300 to-amber-300 text-midnight-950 font-mono text-xs tracking-widest uppercase font-bold hover:brightness-110 transition-all shadow-[0_4px_25px_rgba(196,163,116,0.3)] disabled:opacity-40 flex items-center justify-center gap-2 mb-3"
                    >
                      {loadingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : `Acquire Membership (${item.price}/mo)`}
                    </button>
                    <p className="text-[11px] font-mono text-slate-500">{item.riskCopy}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ================================================================ */}
        {/* ASYMMETRICAL GRID: $1 TRANSIT, $5 BLUEPRINT, $99.99 VIP PASS     */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[PRODUCTS.transit, PRODUCTS.full_package, PRODUCTS.vip_orbit].map((item) => {
            const Icon = item.icon;
            const isLoading = loadingId === item.id;

            return (
              <div
                key={item.id}
                className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/60 to-midnight-950/80 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-champagne-400/30 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl border flex items-center justify-center"
                      style={{ borderColor: `${item.accentColor}30`, background: `${item.accentColor}10` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.accentColor }} />
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.06]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif text-champagne-50 mb-2">{item.name}</h3>
                  <p className="text-xs text-slate-400 font-light mb-6 leading-relaxed">{item.tagline}</p>

                  <div className="bg-black/40 border border-white/[0.05] rounded-xl p-3.5 mb-6">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">// SAMPLE_OUTPUT</p>
                    <p className="font-mono text-[11px] text-slate-300 italic">"{item.previewSnippet}"</p>
                  </div>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-serif text-champagne-100">{item.price}</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{item.mode === 'subscription' ? '/ month' : 'one-time'}</span>
                  </div>

                  <ul className="space-y-2.5 mb-8">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 font-light">
                        <Check className="w-3.5 h-3.5 text-champagne-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={loadingId !== null}
                    className="w-full py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-champagne-100 font-mono text-xs tracking-wider uppercase font-semibold hover:bg-white/[0.08] hover:border-champagne-400/30 transition-all disabled:opacity-40 flex items-center justify-center gap-2 mb-2"
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : `Acquire for ${item.price}`}
                  </button>
                  <p className="text-[10px] font-mono text-slate-500 text-center">{item.riskCopy}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================ */}
        {/* ANCHOR SECTION: $249.99 LUXURY CUSTOM BIRTH SKY ART             */}
        {/* ================================================================ */}
        {(() => {
          const item = PRODUCTS.cosmic_horizon;
          const isLoading = loadingId === item.id;
          return (
            <div className="relative rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/25 via-midnight-900/90 to-slate-950/95 p-8 sm:p-10 mb-12 shadow-[0_0_60px_rgba(245,158,11,0.08)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-7 flex flex-col justify-between order-2 lg:order-1">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-amber-500/15 border border-amber-500/30 text-amber-200 mb-4">
                      {item.badge}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-serif font-light text-champagne-50 mb-3">{item.name}</h3>
                    <p className="text-sm text-slate-300 font-light mb-6 leading-relaxed">{item.tagline}</p>

                    <div className="flex items-baseline gap-3 mb-6 p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
                      <span className="text-4xl font-serif text-amber-200 font-light">{item.price}</span>
                      <span className="text-xs font-mono text-amber-300/80 uppercase tracking-widest">/ physical canvas + digital vector output</span>
                    </div>

                    <div className="space-y-3 mb-8">
                      {item.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-light">
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
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500/30 to-amber-600/40 border border-amber-500/50 text-amber-100 font-mono text-xs tracking-widest uppercase font-bold hover:bg-amber-500/40 transition-all shadow-lg disabled:opacity-40 flex items-center justify-center gap-2 mb-2"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Order Custom Sky Art (${item.price})`}
                    </button>
                    <p className="text-[11px] font-mono text-slate-400">{item.riskCopy}</p>
                  </div>
                </div>

                {/* Architectural Art Specimen Box */}
                <div className="lg:col-span-5 h-80 rounded-2xl border border-amber-500/30 bg-black/60 p-6 flex flex-col justify-between order-1 lg:order-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 relative z-10">
                    <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase">Artifact Blueprint #001</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>

                  <div className="my-auto text-center relative z-10">
                    <p className="font-serif text-lg text-champagne-100 mb-1 italic">"Exact Night Sky Mapping"</p>
                    <p className="text-xs font-mono text-amber-200/70 tracking-wider">Coordinates: 37.7749° N, 122.4194° W</p>
                    <p className="text-[10px] font-mono text-slate-500 mt-2">Swiss Ephemeris Vector Calculation</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-3 border-t border-amber-500/20 relative z-10">
                    <span>SPEC: 300 DPI CANVAS</span>
                    <span className="text-amber-300">CUSTOM GENERATED</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

        {/* ================================================================ */}
        {/* FEATURE COMPARISON MATRIX TABLE                                  */}
        {/* ================================================================ */}
        <div className="mb-16 rounded-3xl border border-white/[0.1] bg-slate-900/40 backdrop-blur-xl p-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl font-serif text-champagne-50 mb-2">Technical Engine Comparison</h3>
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
              <tbody className="divide-y divide-white/[0.05] text-slate-300 font-light">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-mono text-champagne-100 font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-slate-400">{row.generic}</td>
                    <td className="py-4 px-6 text-champagne-200 bg-champagne-400/[0.02] font-medium">{row.ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SOCIAL PROOF TESTIMONIALS                                        */}
        {/* ================================================================ */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-serif text-champagne-50 mb-2">Verified Field Reports</h3>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Observations from members navigating active transits</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-champagne-400 text-champagne-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 font-light leading-relaxed italic mb-6">"{t.text}"</p>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs font-mono">
                  <div>
                    <span className="font-semibold text-champagne-100 block">{t.name}</span>
                    <span className="text-[10px] text-slate-500">{t.location}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-champagne-400/10 border border-champagne-400/20 text-champagne-300 text-[10px]">
                    {t.sign}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================ */}
        {/* DEV SANDBOX BAR                                                  */}
        {/* ================================================================ */}
        {(() => {
          const item = PRODUCTS.test;
          const isLoading = loadingId === item.id;
          return (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-mono text-slate-300 font-semibold">{item.name} ({item.price})</p>
                  <p className="text-[11px] font-mono text-slate-500">{item.tagline}</p>
                </div>
              </div>
              <button
                onClick={() => handleBuy(item)}
                disabled={loadingId !== null}
                className="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-600 font-mono text-xs text-slate-300 hover:bg-slate-700 transition-colors"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Run $1 Sandbox Checkout'}
              </button>
            </div>
          );
        })()}

        {/* Footer */}
        <footer className="max-w-xl mx-auto text-center pt-8 border-t border-white/[0.06] flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
          <ShieldCheck className="w-4 h-4 text-champagne-400/60" />
          <span>256-Bit Encrypted Stripe Processing & Swiss Ephemeris Calculations</span>
        </footer>
      </main>
    </div>
  );
}
```[cite: 5, 7]
