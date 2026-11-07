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
  description: string;
  price: string;
  numericValue: number;
  mode: 'payment' | 'subscription';
  badge: string;
  features: string[];
  icon: React.ElementType;
  accentColor: string;
  review: {
    text: string;
    author: string;
    sign: string;
  };
  riskCopy: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'test',
    priceId: 'price_test_placeholder',
    name: 'Test Sandbox Entry',
    tagline: 'Internal validation & conversion tag testing flow',
    description: 'Designed exclusively for technical verification. Executes a $1.00 test charge in Stripe sandbox mode to confirm webhook triggers and Google Ads conversion tag dispatching.',
    price: '$1.00',
    numericValue: 1.0,
    mode: 'payment',
    badge: 'DEV ONLY',
    features: ['Instant $1 checkout test', 'Validates Stripe redirection', 'Fires conversion tag verification'],
    icon: Zap,
    accentColor: '#94a3b8',
    review: {
      text: 'Runs clean test transactions instantly without hitting live merchant accounts.',
      author: 'System Admin',
      sign: 'Dev Mode',
    },
    riskCopy: 'Sandbox mode test transaction.',
  },
  {
    id: 'transit',
    priceId: 'price_transit_placeholder',
    name: 'The Today Transit Flash',
    tagline: 'Instant single-transit scan for immediate planetary clarity',
    description: 'When you need a quick, highly specific answer to what today holds. This scan pinpoints active transits crossing your natal house cusps right now, giving you precise timing windows for daily action.',
    price: '$1.00',
    numericValue: 1.0,
    mode: 'payment',
    badge: 'Micro-Scan',
    features: ['Single-page real-time transit scan', 'Live planetary degree positions', 'Actionable daily timing window'],
    icon: Compass,
    accentColor: '#38bdf8',
    review: {
      text: 'The transit breakdown showed me exactly when the pressure lifted. Incredible clarity for a single dollar.',
      author: 'Sarah M.',
      sign: 'Capricorn',
    },
    riskCopy: 'Instant digital access delivered on screen within seconds.',
  },
  {
    id: 'full_package',
    priceId: 'price_full_package_placeholder',
    name: 'The 10-Point Life Crossroads Blueprint',
    tagline: 'Comprehensive natal breakdown covering love, career & karmic nodes',
    description: 'A deep-dive reading examining your core psychological and structural roadmap. Analyzes 10 crucial chart points including House 7 (relationships) and House 10 (career trajectory) using Swiss Ephemeris math.',
    price: '$5.00',
    numericValue: 5.0,
    mode: 'payment',
    badge: 'Core Reading',
    features: ['Complete 10-point cosmic blueprint', 'Sun, Moon & Rising Sign analysis', 'House 7 & 10 detailed alerts', 'Delivered to dashboard & email'],
    icon: BookOpen,
    accentColor: '#48bb78',
    review: {
      text: 'I have tried three other astrology apps. This is the only one that gave me specific dates instead of vague personality descriptions.',
      author: 'Priya D.',
      sign: 'Libra',
    },
    riskCopy: 'Instant access sent to your dashboard and email.',
  },
  {
    id: 'premium_membership',
    priceId: 'price_premium_sub_placeholder',
    name: 'The Premium Cosmic Access Pass',
    tagline: 'Continuous weekly ephemeris calculations & live dashboard unblurs',
    description: 'Our flagship subscription. Never miss a planetary shift again. Unlocks unlimited web dashboard access, weekly transit alerts mapped directly to your chart, and up to 2 full readings every week.',
    price: '$9.99',
    numericValue: 9.99,
    mode: 'subscription',
    badge: 'MOST POPULAR',
    features: ['Up to 2 full readings every week', 'Unlimited web dashboard unblurs', 'Real-time ephemeris degree metrics', 'Cancel anytime with 1-click'],
    icon: Crown,
    accentColor: '#c4a374',
    review: {
      text: 'Having weekly updates mapped to my exact chart transformed how I plan my business launches.',
      author: 'Marcus K.',
      sign: 'Scorpio',
    },
    riskCopy: 'Cancel anytime in 1 click from your account settings. No commitment.',
  },
  {
    id: 'vip_orbit',
    priceId: 'price_vip_orbit_placeholder',
    name: 'The VIP Orbit Pass',
    tagline: 'Priority queue skip & direct astrological Q&A access',
    description: 'For seekers who demand white-glove attention. Bypasses standard queue limits, unlocks all Premium features, and grants direct monthly Q&A submissions answered via computational coordinate audits.',
    price: '$99.99',
    numericValue: 99.99,
    mode: 'subscription',
    badge: 'Concierge Tier',
    features: ['Priority queue skip on all readings', 'Everything in Premium Membership', 'Monthly direct Q&A submission (3 questions)', 'Dedicated cosmic concierge support'],
    icon: Rocket,
    accentColor: '#a855f7',
    review: {
      text: 'The concierge responses are remarkably thorough. It feels like having a personal astrologer on retainer.',
      author: 'Elena R.',
      sign: 'Leo',
    },
    riskCopy: 'Priority queue entry with dedicated concierge support.',
  },
  {
    id: 'cosmic_horizon',
    priceId: 'price_cosmic_horizon_placeholder',
    name: 'Executive Custom Birth Sky Art',
    tagline: 'High-res digital masterpiece depicting your exact birth night sky coordinates',
    description: 'An heirloom-grade physical canvas paired with a digital vector file. Renders the exact celestial canopy above your birthplace down to the minute, accompanied by an executive Swiss Ephemeris breakdown certificate.',
    price: '$249.99',
    numericValue: 249.99,
    mode: 'payment',
    badge: 'LUXURY ARTIFACT',
    features: [
      'High-res digital birth sky art (exact coordinates & time)',
      'Executive-grade breakdown certificate',
      'Swiss Ephemeris precision calculation engine',
      'Print-ready high-DPI digital painting output',
    ],
    icon: Sparkles,
    accentColor: '#f59e0b',
    review: {
      text: 'Absolute museum-quality piece hanging in my study. The astronomical precision is breathtaking.',
      author: 'Jonathan W.',
      sign: 'Taurus',
    },
    riskCopy: 'Securely processed and printed to exact Swiss Ephemeris metrics.',
  },
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#04060b] to-[#04060b] pointer-events-none" />
      <StarryBackground />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-28">
        
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
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-champagne-400/[0.06] border border-champagne-400/25 backdrop-blur-md mb-6 shadow-[0_0_25px_rgba(196,163,116,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-champagne-200">The Observatory Codex</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-light text-champagne-50 mb-6 tracking-tight leading-[1.15]">
            Complete Catalog & <br />
            <span className="bg-gradient-to-r from-champagne-200 via-champagne-300 to-amber-200 bg-clip-text text-transparent italic font-normal">
              Service Dossiers
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-light tracking-wide max-w-xl mx-auto leading-relaxed">
            Every product is custom calculated using precise Swiss Ephemeris planetary coordinates. Explore each offering below.
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
        {/* EQUAL-SPACE FULL-WIDTH EDITORIAL DOSSIER ROWS                    */}
        {/* ================================================================ */}
        <div className="space-y-12">
          {PRODUCTS.map((item, index) => {
            const Icon = item.icon;
            const isLoading = loadingId === item.id;
            const isAnchor = item.id === 'cosmic_horizon';
            const isHero = item.id === 'premium_membership';

            return (
              <div
                key={item.id}
                className={`relative rounded-[2.5rem] border backdrop-blur-2xl p-8 sm:p-12 transition-all duration-300 shadow-2xl overflow-hidden ${
                  isAnchor
                    ? 'border-2 border-amber-500/50 bg-gradient-to-br from-amber-950/30 via-[#0a0d18]/95 to-slate-950/95 shadow-[0_0_80px_rgba(245,158,11,0.12)]'
                    : isHero
                    ? 'border-2 border-champagne-400/50 bg-gradient-to-br from-[#0c1224] via-[#070a14] to-[#04060b] shadow-[0_0_90px_rgba(196,163,116,0.15)]'
                    : item.id === 'test'
                    ? 'border border-dashed border-slate-700 bg-slate-900/40 opacity-80'
                    : 'border-white/[0.12] bg-gradient-to-br from-slate-900/90 via-[#080c18]/90 to-midnight-950/95'
                }`}
              >
                {/* Background glow flare */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-champagne-400/[0.03] rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
                  
                  {/* LEFT COLUMN: Image Placeholder & Visual Specimen */}
                  <div className="lg:col-span-5 h-72 sm:h-80 rounded-2xl border border-white/[0.1] bg-black/70 p-6 flex flex-col justify-between relative shadow-inner">
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-champagne-400 animate-pulse" />
                        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Visual Specimen #{index + 1}</span>
                      </div>
                      <Icon className="w-4 h-4 text-champagne-400" />
                    </div>

                    <div className="my-auto text-center py-6">
                      <div 
                        className="w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-3 shadow-md"
                        style={{ borderColor: `${item.accentColor}40`, background: `${item.accentColor}15` }}
                      >
                        <Icon className="w-7 h-7" style={{ color: item.accentColor }} />
                      </div>
                      <p className="font-serif text-lg text-champagne-100 mb-1">{item.name}</p>
                      <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Interactive Artifact Placeholder</p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-3 border-t border-white/[0.06]">
                      <span>ID: {item.id.toUpperCase()}</span>
                      <span className="text-champagne-300">SWISS EPHEMERIS READY</span>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Description, Features, Review & Checkout */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      {/* Badge & Title */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-champagne-200">
                          {item.badge}
                        </span>
                        <span className="text-3xl sm:text-4xl font-serif text-champagne-100 font-light">
                          {item.price} <span className="text-xs font-mono text-slate-400">{item.mode === 'subscription' ? '/mo' : ''}</span>
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-serif font-light text-champagne-50 mb-2">{item.name}</h2>
                      <p className="text-xs font-mono text-champagne-300/90 tracking-wider mb-4">{item.tagline}</p>
                      
                      {/* What it does / How it helps */}
                      <p className="text-sm text-slate-300 font-light leading-relaxed mb-6">
                        {item.description}
                      </p>

                      {/* Feature Checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                        {item.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                            <Check className="w-4 h-4 text-champagne-400 flex-shrink-0 mt-0.5" />
                            <span className="font-light">{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Embedded Review */}
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mb-8">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-champagne-400 text-champagne-400" />
                          ))}
                          <span className="text-[10px] font-mono text-slate-400 ml-2">Verified Field Report</span>
                        </div>
                        <p className="text-xs text-slate-300 italic mb-2">&quot;{item.review.text}&quot;</p>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-champagne-200">{item.review.author}</span>
                          <span className="px-2 py-0.5 rounded bg-champagne-400/10 text-champagne-300">{item.review.sign}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button & Risk Reversal */}
                    <div>
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={loadingId !== null}
                        className={`w-full py-4 rounded-xl font-mono text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-lg disabled:opacity-40 flex items-center justify-center gap-2.5 mb-2.5 ${
                          isAnchor
                            ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/40 border border-amber-500/60 text-amber-100 hover:bg-amber-500/40 shadow-[0_4px_30px_rgba(245,158,11,0.25)]'
                            : isHero
                            ? 'bg-gradient-to-r from-champagne-200 via-champagne-300 to-amber-300 text-midnight-950 hover:brightness-110 shadow-[0_4px_30px_rgba(196,163,116,0.4)]'
                            : 'bg-white/[0.06] border border-white/[0.15] text-champagne-100 hover:bg-white/[0.1] hover:border-champagne-400/40'
                        }`}
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Acquire ${item.name} (${item.price}${item.mode === 'subscription' ? '/mo' : ''})`}
                      </button>
                      <p className="text-[11px] font-mono text-slate-400 text-center">{item.riskCopy}</p>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="max-w-xl mx-auto text-center pt-16 border-t border-white/[0.06] flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <ShieldCheck className="w-4 h-4 text-champagne-400/60" />
          <span>256-Bit Encrypted Stripe Processing & Swiss Ephemeris Calculations</span>
        </footer>
      </main>
    </div>
  );
}
