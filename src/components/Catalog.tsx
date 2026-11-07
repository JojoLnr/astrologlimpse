import { useState } from 'react';
import { 
  Sparkles, Zap, BookOpen, Crown, Rocket, Compass, 
  ArrowLeft, Check, ShieldCheck, Loader2 
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
}

// ----------------------------------------------------------------------
// STRIPE PRICE IDs — Replace these strings with your real Stripe Price IDs
// ----------------------------------------------------------------------
const PRODUCTS: ProductItem[] = [
  {
    id: 'test',
    priceId: 'price_test_placeholder', // <-- Replace with your $1 Test Price ID
    name: 'Test Entry',
    tagline: 'Internal validation flow',
    price: '$1.00',
    numericValue: 1.0,
    mode: 'payment',
    isTest: true,
    badge: 'DEV TEST ONLY',
    features: ['Instant $1 checkout test', 'Validates Stripe redirection', 'Fires conversion tag verification'],
    icon: Zap,
    accentColor: '#94a3b8',
  },
  {
    id: 'transit',
    priceId: 'price_transit_placeholder', // <-- Replace with your $1 Transit Insight Price ID
    name: 'Transit Insight',
    tagline: 'Daily planetary flash scan',
    price: '$1.00',
    numericValue: 1.0,
    mode: 'payment',
    badge: 'Daily Flash',
    features: ['Single-page real-time transit scan', 'Live planetary degree positions', 'Actionable daily timing window'],
    icon: Compass,
    accentColor: '#38bdf8',
  },
  {
    id: 'full_package',
    priceId: 'price_full_package_placeholder', // <-- Replace with your $5 Full Package Price ID
    name: 'Full Package Reading',
    tagline: 'Complete 10-point natal reading',
    price: '$5.00',
    numericValue: 5.0,
    mode: 'payment',
    features: ['Complete 10-point cosmic blueprint', 'Sun, Moon & Rising Sign analysis', 'House 7 & 10 detailed alerts', 'Sent directly to email & dashboard'],
    icon: BookOpen,
    accentColor: '#48bb78',
  },
  {
    id: 'premium_membership',
    priceId: 'price_premium_sub_placeholder', // <-- Replace with your $9.99 Subscription Price ID
    name: 'Premium Membership',
    tagline: 'Continuous weekly cosmic access',
    price: '$9.99',
    numericValue: 9.99,
    mode: 'subscription',
    isPopular: true,
    badge: 'MOST POPULAR',
    features: ['Up to 2 full readings every week', 'Unlimited web dashboard unblurs', 'Real-time ephemeris metrics updates', 'Cancel anytime with 1-click'],
    icon: Crown,
    accentColor: '#c4a374',
  },
  {
    id: 'vip_orbit',
    priceId: 'price_vip_orbit_placeholder', // <-- Replace with your $99.99 VIP Price ID
    name: 'VIP Orbit Pass',
    tagline: 'Priority access & direct Q&A',
    price: '$99.99',
    numericValue: 99.99,
    mode: 'subscription',
    badge: 'VIP Concierge',
    features: ['Priority queue skip on all readings', 'Everything in Premium Membership', 'Monthly direct Q&A submission (3 questions)', 'Dedicated cosmic concierge support'],
    icon: Rocket,
    accentColor: '#a855f7',
  },
  {
    id: 'cosmic_horizon',
    priceId: 'price_cosmic_horizon_placeholder', // <-- Replace with your $249.99 Art Price ID
    name: 'Cosmic Horizon Sky Art',
    tagline: 'Luxury custom birth night sky canvas',
    price: '$249.99',
    numericValue: 249.99,
    mode: 'payment',
    isAnchor: true,
    badge: 'ULTIMATE ANCHOR',
    features: [
      'High-res digital birth sky art (exact coordinates)',
      'Executive-grade breakdown certificate',
      'Swiss Ephemeris precision data output',
      'Print-ready high-dpi visual painting',
    ],
    icon: Sparkles,
    accentColor: '#f59e0b',
  },
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

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-400/[0.08] border border-champagne-400/20 backdrop-blur-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-pulse" />
            <span className="text-xs text-champagne-200 tracking-[0.15em] uppercase">Astrologlimpse Catalog</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-light text-champagne-50 mb-4 tracking-tight leading-tight">
            Choose Your Level of{' '}
            <span className="bg-gradient-to-r from-champagne-200 via-champagne-300 to-champagne-200 bg-clip-text text-transparent">
              Cosmic Alignment
            </span>
          </h1>

          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base font-light">
            Select an instant flash reading, recurring web membership, or executive custom birth night sky artwork.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-md mx-auto mb-10 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-center text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {PRODUCTS.map((item) => {
            const Icon = item.icon;
            const isLoading = loadingId === item.id;

            return (
              <div
                key={item.id}
                className={`relative rounded-2xl flex flex-col justify-between backdrop-blur-xl p-6 transition-all duration-300 ${
                  item.isPopular
                    ? 'border-2 border-champagne-400/60 bg-gradient-to-br from-slate-900/95 via-midnight-900/95 to-slate-950/95 shadow-[0_0_50px_rgba(196,163,116,0.15)] scale-[1.02]'
                    : item.isAnchor
                    ? 'border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-midnight-900/90 to-slate-950/95 shadow-[0_0_40px_rgba(245,158,11,0.1)]'
                    : item.isTest
                    ? 'border border-dashed border-slate-600/60 bg-slate-900/60 opacity-80'
                    : 'border border-white/[0.1] bg-gradient-to-br from-slate-900/80 to-midnight-950/90 hover:border-champagne-400/30'
                }`}
              >
                {item.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-champagne-400/20 border border-champagne-400/40 text-champagne-200">
                    {item.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl border flex items-center justify-center"
                      style={{
                        borderColor: `${item.accentColor}30`,
                        background: `${item.accentColor}10`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.accentColor }} />
                    </div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      {item.mode === 'subscription' ? 'Recurring' : 'One-Time'}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif text-champagne-50 mb-1">{item.name}</h3>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">{item.tagline}</p>

                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-6 flex items-baseline justify-between">
                    <span className="text-3xl font-light text-champagne-100 font-mono">{item.price}</span>
                    <span className="text-xs text-slate-400">
                      {item.mode === 'subscription' ? '/ month' : 'single checkout'}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-champagne-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleBuy(item)}
                  disabled={loadingId !== null}
                  className={`w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2 ${
                    item.isPopular
                      ? 'bg-gradient-to-r from-champagne-300 to-champagne-400 text-midnight-950 hover:from-champagne-200 hover:to-champagne-300 shadow-lg'
                      : item.isAnchor
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30'
                      : 'bg-white/[0.05] border border-white/[0.1] text-champagne-100 hover:bg-white/[0.1]'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    `Acquire for ${item.price}`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <footer className="max-w-xl mx-auto text-center pt-8 border-t border-white/[0.06] flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-champagne-400/60" />
          <span>256-Bit Encrypted Stripe Checkout & Instant Delivery</span>
        </footer>
      </main>
    </div>
  );
}
