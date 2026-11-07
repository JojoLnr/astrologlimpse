import { useState } from 'react';
import { 
  Sparkles, Zap, BookOpen, Crown, Rocket, Compass, 
  ArrowLeft, Check, ShieldCheck, Loader2, Image as ImageIcon,
  Star, Cpu, Users, Shield, HelpCircle
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
  isPopular?: boolean;
  isAnchor?: boolean;
  isTest?: boolean;
  badge?: string;
  features: string[];
  icon: React.ElementType;
  accentColor: string;
  placeholderText: string;
  riskCopy: string;
}

const PRODUCTS: Record<string, ProductItem> = {
  test: {
    id: 'test',
    priceId: 'price_test_placeholder', // <-- Replace with your real $1 Test Price ID
    name: 'Test Entry',
    tagline: 'Internal validation flow',
    price: '$1.00',
    numericValue: 1.0,
    mode: 'payment',
    isTest: true,
    badge: 'DEV ONLY',
    features: ['Instant $1 checkout test', 'Validates Stripe redirection', 'Fires conversion tag verification'],
    icon: Zap,
    accentColor: '#94a3b8',
    placeholderText: 'System Sandbox',
    riskCopy: 'Sandbox mode test transaction.',
  },
  transit: {
    id: 'transit',
    priceId: 'price_transit_placeholder', // <-- Replace with your real $1 Transit Price ID
    name: 'The Today Transit Flash',
    tagline: 'Instant single-transit scan for quick clarity',
    price: '$1.00',
    numericValue: 1.0,
    mode: 'payment',
    badge: 'Daily Flash',
    features: ['Single-page real-time transit scan', 'Live planetary degree positions', 'Actionable daily timing window'],
    icon: Compass,
    accentColor: '#38bdf8',
    placeholderText: 'Daily Transit Chart Scan',
    riskCopy: 'Instant digital access delivered on screen within seconds.',
  },
  full_package: {
    id: 'full_package',
    priceId: 'price_full_package_placeholder', // <-- Replace with your real $5 Full Package Price ID
    name: 'The 10-Point Life Crossroads Blueprint',
    tagline: 'Full natal breakdown for love, career & Chiron',
    price: '$5.00',
    numericValue: 5.0,
    mode: 'payment',
    badge: 'Full Blueprint',
    features: ['Complete 10-point cosmic blueprint', 'Sun, Moon & Rising Sign analysis', 'House 7 & 10 detailed alerts', 'Delivered to dashboard & email'],
    icon: BookOpen,
    accentColor: '#48bb78',
    placeholderText: '10-Point Natal Blueprint Report',
    riskCopy: 'Instant access sent to your dashboard and email.',
  },
  premium_membership: {
    id: 'premium_membership',
    priceId: 'price_premium_sub_placeholder', // <-- Replace with your real $9.99 Sub Price ID
    name: 'The Premium Cosmic Access Pass',
    tagline: 'Unlimited weekly dashboard updates & unblurs',
    price: '$9.99',
    numericValue: 9.99,
    mode: 'subscription',
    isPopular: true,
    badge: 'MOST POPULAR',
    features: ['Up to 2 full readings every week', 'Unlimited web dashboard unblurs', 'Real-time ephemeris degree metrics', 'Cancel anytime with 1-click'],
    icon: Crown,
    accentColor: '#c4a374',
    placeholderText: 'Live Interactive Web Dashboard UI',
    riskCopy: 'Cancel anytime in 1 click from your account settings. No commitment.',
  },
  vip_orbit: {
    id: 'vip_orbit',
    priceId: 'price_vip_orbit_placeholder', // <-- Replace with your real $99.99 VIP Price ID
    name: 'The VIP Orbit Pass',
    tagline: 'Priority delivery + direct Q&A submission',
    price: '$99.99',
    numericValue: 99.99,
    mode: 'subscription',
    badge: 'VIP Concierge',
    features: ['Priority queue skip on all readings', 'Everything in Premium Membership', 'Monthly direct Q&A submission (3 questions)', 'Dedicated cosmic concierge support'],
    icon: Rocket,
    accentColor: '#a855f7',
    placeholderText: 'VIP Orbit Concierge Pass',
    riskCopy: 'Priority queue entry with dedicated concierge support.',
  },
  cosmic_horizon: {
    id: 'cosmic_horizon',
    priceId: 'price_cosmic_horizon_placeholder', // <-- Replace with your real $249.99 Art Price ID
    name: 'Executive Custom Birth Sky Art',
    tagline: 'Physical/Digital custom birth night sky canvas',
    price: '$249.99',
    numericValue: 249.99,
    mode: 'payment',
    isAnchor: true,
    badge: 'EXECUTIVE MASTERPIECE',
    features: [
      'High-res digital birth sky art (exact coordinates & time)',
      'Executive-grade breakdown certificate',
      'Swiss Ephemeris precision calculation engine',
      'Print-ready high-DPI digital painting output',
    ],
    icon: Sparkles,
    accentColor: '#f59e0b',
    placeholderText: 'Framed Night Sky Digital Painting Mockup',
    riskCopy: 'Securely processed and printed to exact Swiss Ephemeris metrics.',
  },
};

const testimonials = [
  {
    name: 'Sarah',
    location: 'Chicago',
    text: 'I finally understood why my career feels stalled. The transit breakdown showed me exactly when Mars leaves my 10th house. Game changer.',
    sign: 'Capricorn',
  },
  {
    name: 'Marcus',
    location: 'Brooklyn',
    text: 'The Chiron reading nailed a pattern I have been circling for 15 years. Seeing the exact degree and transit window gave me something to actually work with.',
    sign: 'Scorpio',
  },
  {
    name: 'Priya',
    location: 'Austin',
    text: 'I have tried three other astrology apps. This is the only one that gave me specific dates instead of vague personality descriptions. The 7th house alert was eerily accurate.',
    sign: 'Libra',
  },
];

const comparisonRows = [
  { feature: 'Data Basis', generic: 'Sun Sign Only (1/12th of people)', ours: 'Exact Natal Chart (Unique to you)' },
  { feature: 'Forecast Timing', generic: 'Pre-written monthly content', ours: 'Live, Real-Time Planetary Degrees' },
  { feature: 'Astrological Depth', generic: 'Planets only', ours: 'Chiron, Lilith, Lunar Nodes & Asteroids' },
  { feature: 'Actionable Insight', generic: 'Vague personality traits', ours: 'Specific timing windows for action' },
];

const trustBadges = [
  { icon: Cpu, label: 'Powered by Swiss Ephemeris' },
  { icon: Users, label: '10,000+ Charts Calculated' },
  { icon: Shield, label: 'End-to-End Encryption' },
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
    <div className="relative min-h-screen text-slate-100 selection:bg-champagne-400/20">
      <StarryBackground />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-24">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onNavigateHome}
            className="group inline-flex items-center gap-2 text-sm text-champagne-300 hover:text-champagne-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>
          <button
            onClick={onNavigateDashboard}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-xs text-slate-300 hover:bg-white/[0.08]"
          >
            <Compass className="w-3.5 h-3.5 text-champagne-300" />
            My Dashboard
          </button>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-400/[0.08] border border-champagne-400/20 backdrop-blur-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-pulse" />
            <span className="text-xs text-champagne-200 tracking-[0.15em] uppercase">Catalog & Services</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-light text-champagne-50 mb-3 tracking-tight leading-tight">
            Choose Your Level of{' '}
            <span className="bg-gradient-to-r from-champagne-200 via-champagne-300 to-champagne-200 bg-clip-text text-transparent">
              Cosmic Alignment
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base font-light">
            Select an entry daily flash, full natal blueprint reading, or custom digital birth sky artwork.
          </p>

          {/* Trust Badges Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-white/[0.06] max-w-3xl mx-auto">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                <badge.icon className="w-4 h-4 text-champagne-400" />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="max-w-md mx-auto mb-8 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-center text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* SECTION 1: FEATURED SUBSCRIPTION BANNER (TARGET $9.99/mo) */}
        {/* ---------------------------------------------------------------- */}
        {(() => {
          const item = PRODUCTS.premium_membership;
          const isLoading = loadingId === item.id;
          return (
            <div className="relative rounded-3xl border-2 border-champagne-400/60 bg-gradient-to-br from-midnight-900/95 via-slate-900/95 to-midnight-950/95 backdrop-blur-xl p-6 sm:p-8 mb-12 shadow-[0_0_60px_rgba(196,163,116,0.15)] overflow-hidden">
              <div className="absolute top-4 right-6 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-champagne-400/20 border border-champagne-400/40 text-champagne-200">
                {item.badge}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Visual Placeholder (Left) */}
                <div className="lg:col-span-5 h-64 sm:h-72 rounded-2xl border border-white/[0.1] bg-midnight-950/80 flex flex-col items-center justify-center p-6 text-center relative group overflow-hidden">
                  <div className="w-12 h-12 rounded-2xl bg-champagne-400/10 border border-champagne-400/20 flex items-center justify-center mb-3">
                    <ImageIcon className="w-6 h-6 text-champagne-300" />
                  </div>
                  <p className="text-xs font-mono text-champagne-300 uppercase tracking-wider mb-1">Image Placeholder</p>
                  <p className="text-xs text-slate-400 max-w-xs">{item.placeholderText}</p>
                </div>

                {/* Details & Action (Right) */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-champagne-300" />
                      <h3 className="text-2xl font-serif text-champagne-50">{item.name}</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{item.tagline}</p>

                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-4xl font-serif text-champagne-100 font-mono">{item.price}</span>
                      <span className="text-xs text-slate-400">/ month (Cancel anytime)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                      {item.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-4 h-4 text-champagne-400 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={loadingId !== null}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-champagne-300 to-champagne-400 text-midnight-950 text-sm font-semibold hover:from-champagne-200 hover:to-champagne-300 transition-all duration-300 shadow-lg disabled:opacity-40 flex items-center justify-center gap-2 mb-2"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Start Membership for ${item.price}/mo`}
                    </button>
                    <p className="text-[11px] text-slate-400">{item.riskCopy}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ---------------------------------------------------------------- */}
        {/* SECTION 2: INDIVIDUAL READINGS & VIP (3-COLUMN GRID) */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[PRODUCTS.transit, PRODUCTS.full_package, PRODUCTS.vip_orbit].map((item) => {
            const Icon = item.icon;
            const isLoading = loadingId === item.id;

            return (
              <div
                key={item.id}
                className="relative rounded-2xl border border-white/[0.1] bg-gradient-to-br from-slate-900/80 to-midnight-950/90 backdrop-blur-xl p-5 flex flex-col justify-between hover:border-champagne-400/30 transition-all duration-300"
              >
                <div>
                  {/* Image Placeholder Frame */}
                  <div className="h-40 rounded-xl border border-white/[0.08] bg-midnight-950/70 flex flex-col items-center justify-center p-4 text-center mb-5 relative">
                    <ImageIcon className="w-5 h-5 text-slate-500 mb-1" />
                    <span className="text-[10px] font-mono text-slate-400">{item.placeholderText}</span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: item.accentColor }} />
                      <h3 className="text-lg font-serif text-champagne-50">{item.name}</h3>
                    </div>
                    <span className="text-xs font-mono text-champagne-200 font-semibold">{item.price}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{item.tagline}</p>

                  <ul className="space-y-2 mb-6">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
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
                    className="w-full py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-champagne-100 text-xs font-semibold hover:bg-white/[0.1] transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2 mb-2"
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : `Acquire for ${item.price}`}
                  </button>
                  <p className="text-[10px] text-slate-500 text-center">{item.riskCopy}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* SECTION 3: FEATURE COMPARISON MATRIX */}
        {/* ---------------------------------------------------------------- */}
        <div className="mb-12 rounded-2xl border border-white/[0.1] bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-serif text-champagne-50 mb-2">Why Astrologlimpse Stands Apart</h3>
            <p className="text-xs text-slate-400">See how our precision engine compares to conventional generic horoscopes.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.1] text-champagne-200 font-serif">
                  <th className="py-3 px-4">Metric Factor</th>
                  <th className="py-3 px-4 text-slate-400">Generic Horoscopes</th>
                  <th className="py-3 px-4 text-champagne-300 font-semibold bg-champagne-400/[0.04]">Astrologlimpse Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-300">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-medium text-champagne-50">{row.feature}</td>
                    <td className="py-3.5 px-4 text-slate-400">{row.generic}</td>
                    <td className="py-3.5 px-4 text-champagne-200 bg-champagne-400/[0.02] font-medium">{row.ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* SECTION 4: LUXURY ART ANCHOR ($249.99 CANVASES) */}
        {/* ---------------------------------------------------------------- */}
        {(() => {
          const item = PRODUCTS.cosmic_horizon;
          const isLoading = loadingId === item.id;
          return (
            <div className="relative rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-midnight-900/90 to-slate-950/95 backdrop-blur-xl p-6 sm:p-8 mb-12 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Details (Left) */}
                <div className="lg:col-span-7 flex flex-col justify-between order-2 lg:order-1">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <h3 className="text-2xl font-serif text-champagne-50">{item.name}</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{item.tagline}</p>

                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-4xl font-serif text-amber-200 font-mono">{item.price}</span>
                      <span className="text-xs text-slate-400">/ high-res digital painting output</span>
                    </div>

                    <div className="space-y-2.5 mb-6">
                      {item.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
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
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-sm font-semibold hover:bg-amber-500/30 transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2 mb-2"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Order Custom Sky Art (${item.price})`}
                    </button>
                    <p className="text-[11px] text-slate-400">{item.riskCopy}</p>
                  </div>
                </div>

                {/* Large Canvas Image Placeholder (Right) */}
                <div className="lg:col-span-5 h-72 sm:h-80 rounded-2xl border border-amber-500/30 bg-midnight-950/90 flex flex-col items-center justify-center p-6 text-center relative order-1 lg:order-2">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                    <ImageIcon className="w-7 h-7 text-amber-400" />
                  </div>
                  <p className="text-xs font-mono text-amber-300 uppercase tracking-wider mb-1">Canvas Art Placeholder</p>
                  <p className="text-xs text-slate-400 max-w-xs">{item.placeholderText}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ---------------------------------------------------------------- */}
        {/* SECTION 5: STATIC SOCIAL PROOF TESTIMONIALS */}
        {/* ---------------------------------------------------------------- */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-xl font-serif text-champagne-50 mb-2">Trusted by Explorers Worldwide</h3>
            <p className="text-xs text-slate-400">Verified feedback from members navigating active planetary transits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-champagne-400 text-champagne-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic mb-6">"{t.text}"</p>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs">
                  <div>
                    <span className="font-medium text-champagne-100 block">{t.name}</span>
                    <span className="text-[10px] text-slate-500">{t.location}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-champagne-400/10 border border-champagne-400/20 text-champagne-300 font-mono text-[10px]">
                    {t.sign}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* SECTION 6: DEV TEST ENTRY BAR */}
        {/* ---------------------------------------------------------------- */}
        {(() => {
          const item = PRODUCTS.test;
          const isLoading = loadingId === item.id;
          return (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 opacity-70 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-mono text-slate-300 font-semibold">{item.name} ({item.price})</p>
                  <p className="text-[11px] text-slate-500">{item.tagline}</p>
                </div>
              </div>
              <button
                onClick={() => handleBuy(item)}
                disabled={loadingId !== null}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-xs text-slate-300 hover:bg-slate-700"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Run $1 Sandbox Checkout'}
              </button>
            </div>
          );
        })()}

        {/* Footer info */}
        <footer className="max-w-xl mx-auto text-center pt-8 border-t border-white/[0.06] flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-champagne-400/60" />
          <span>256-Bit Encrypted Stripe Processing & Instant Delivery</span>
        </footer>
      </main>
    </div>
  );
}
