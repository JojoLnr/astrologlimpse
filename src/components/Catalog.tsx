import { useState } from 'react';
import { Sparkles, Compass, BookOpen, Crown, Rocket, ArrowLeft, ShieldCheck, ArrowRight, Eye, Orbit, Image as ImageIcon, Check, Star } from 'lucide-react';
import { StarryBackground } from '@/components/StarryBackground';
import { CosmicIntakeModal, ProductItem } from '@/components/CosmicIntakeModal';

interface CatalogProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

export interface CatalogProductItem extends ProductItem {
  features: string[];
  review: {
    text: string;
    author: string;
    sign: string;
  };
}

const PRODUCTS: CatalogProductItem[] = [
  {
    id: 'transit',
    priceId: 'price_transit_placeholder',
    name: 'The Today Transit Flash',
    tagline: 'Instant single-transit planetary scan',
    description: 'Pinpoints active transits crossing your natal house cusps right now for immediate timing clarity.',
    mysteryTeaser: '“Moon conjunct Midheaven at 14° Taurus. Favorable window detected for decisive career communication...”',
    price: '$1.00',
    numericValue: 1.0,
    mode: 'payment',
    badge: 'MICRO-SCAN',
    icon: Compass,
    accentColor: '#38bdf8',
    features: ['Single-page real-time transit scan', 'Live planetary degree positions', 'Actionable daily timing window'],
    review: {
      text: 'The transit breakdown showed me exactly when the pressure lifted. Incredible clarity.',
      author: 'Sarah M.',
      sign: 'Capricorn',
    },
  },
  {
    id: 'full_package',
    priceId: 'price_full_package_placeholder',
    name: 'The 10-Point Life Crossroads Blueprint',
    tagline: 'Comprehensive natal breakdown for love & career',
    description: 'Deep-dive reading examining your core psychological roadmap across House 7 and House 10.',
    mysteryTeaser: '“House 7 Activation: Saturn pressure clearing. Expect structural partnership shifts over the next 30 days...”',
    price: '$5.00',
    numericValue: 5.0,
    mode: 'payment',
    badge: 'CORE BLUEPRINT',
    icon: BookOpen,
    accentColor: '#48bb78',
    features: ['Complete 10-point cosmic blueprint', 'Sun, Moon & Rising Sign analysis', 'House 7 & 10 detailed alerts'],
    review: {
      text: 'The only app that gave me specific structural dates instead of vague personality text.',
      author: 'Priya D.',
      sign: 'Libra',
    },
  },
  {
    id: 'premium_membership',
    priceId: 'price_premium_sub_placeholder',
    name: 'The Premium Cosmic Access Pass',
    tagline: 'Continuous weekly ephemeris calculations & live unblurs',
    description: 'Weekly transit alerts mapped directly to your chart with unlimited dashboard unblurs.',
    mysteryTeaser: '“RECURRING SYNC: Live weekly planetary transit feeds mapped directly to your unique natal house coordinates.”',
    price: '$9.99',
    numericValue: 9.99,
    mode: 'subscription',
    badge: 'FLAGSHIP PASS',
    icon: Crown,
    accentColor: '#c4a374',
    features: ['Up to 2 full readings every week', 'Unlimited web dashboard unblurs', 'Real-time ephemeris metrics'],
    review: {
      text: 'Having weekly updates mapped to my exact chart transformed how I plan business launches.',
      author: 'Marcus K.',
      sign: 'Scorpio',
    },
  },
  {
    id: 'vip_orbit',
    priceId: 'price_vip_orbit_placeholder',
    name: 'The VIP Orbit Pass',
    tagline: 'Priority queue skip & direct astrological Q&A access',
    description: 'Priority queue allocation, full Premium features, and direct monthly Q&A submissions.',
    mysteryTeaser: '“VIP DIRECT CHANNEL: Direct coordinate auditing with priority computational allocation and monthly concierge review.”',
    price: '$99.99',
    numericValue: 99.99,
    mode: 'subscription',
    badge: 'CONCIERGE TIER',
    icon: Rocket,
    accentColor: '#a855f7',
    features: ['Priority queue skip on all readings', 'Monthly direct Q&A submission', 'Dedicated cosmic concierge support'],
    review: {
      text: 'The concierge responses are remarkably thorough. It feels like having a personal astrologer on retainer.',
      author: 'Elena R.',
      sign: 'Leo',
    },
  },
  {
    id: 'cosmic_horizon',
    priceId: 'price_cosmic_horizon_placeholder',
    name: 'Executive Custom Birth Sky Art',
    tagline: 'High-res digital masterpiece of your exact birth night sky',
    description: 'Print-ready high-DPI vector rendering of the exact sky canopy at your minute of birth.',
    mysteryTeaser: '“SWISS EPHEMERIS ARTIFACT: 300 DPI vector sky mapping with gold-foil border geometry layout for your exact birth minute.”',
    price: '$249.99',
    numericValue: 249.99,
    mode: 'payment',
    badge: 'LUXURY ARTIFACT',
    icon: Sparkles,
    accentColor: '#f59e0b',
    features: ['High-res digital birth sky art', 'Executive breakdown certificate', 'Swiss Ephemeris precision calculation'],
    review: {
      text: 'Museum-quality digital file hanging in my study. The astronomical precision is breathtaking.',
      author: 'Jonathan W.',
      sign: 'Taurus',
    },
  },
];

export function Catalog({ onNavigateHome, onNavigateDashboard }: CatalogProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-champagne-400/20 bg-[#04060b] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-950/30 via-champagne-400/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />
      <StarryBackground />

      <CosmicIntakeModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-48">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-16 border-b border-white/[0.08] pb-6">
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

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-champagne-400/[0.06] border border-champagne-400/25 backdrop-blur-md mb-6 shadow-[0_0_25px_rgba(196,163,116,0.1)]">
            <Orbit className="w-3.5 h-3.5 text-champagne-300 animate-spin" style={{ animationDuration: '12s' }} />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-champagne-200">Observatory Feed // Live Codex</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-light text-champagne-50 mb-6 tracking-tight leading-[1.1]">
            Select Your <br />
            <span className="bg-gradient-to-r from-champagne-200 via-champagne-300 to-amber-200 bg-clip-text text-transparent italic font-normal">
              Celestial Coordinate
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-light tracking-wide font-mono">
            // Click any transmission node below to calibrate parameters and unlock tailored insights.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="space-y-12">
          {PRODUCTS.map((item) => {
            const Icon = item.icon || Compass;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className="group relative rounded-3xl border border-white/[0.08] bg-slate-900/50 hover:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 cursor-pointer group-hover:border-champagne-400/50 group-hover:shadow-[0_0_50px_rgba(196,163,116,0.15)] shadow-xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Product Image Placeholder */}
                  <div className="md:col-span-4 h-56 sm:h-64 rounded-2xl border border-white/[0.1] bg-black/70 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group-hover:border-champagne-400/40 transition-colors">
                    <div 
                      className="absolute inset-0 opacity-20 blur-2xl pointer-events-none"
                      style={{ background: item.accentColor }}
                    />
                    <div className="w-12 h-12 rounded-xl bg-champagne-400/10 border border-champagne-400/20 flex items-center justify-center mb-3">
                      <ImageIcon className="w-6 h-6 text-champagne-300" />
                    </div>
                    <p className="text-xs font-mono text-champagne-300 uppercase tracking-wider">
                      {item.name} Image
                    </p>
                    <span className="text-[10px] font-mono text-slate-500 mt-1">
                      [ Image Placeholder ]
                    </span>
                  </div>

                  {/* Right Product Node Details */}
                  <div className="md:col-span-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-champagne-200">
                          {item.badge}
                        </span>
                        <div 
                          className="w-8 h-8 rounded-xl border flex items-center justify-center shadow-inner"
                          style={{ borderColor: `${item.accentColor}40`, background: `${item.accentColor}15` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: item.accentColor }} />
                        </div>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-serif font-light text-champagne-50 group-hover:text-champagne-200 transition-colors leading-snug mb-1">
                        {item.name}
                      </h2>
                      <p className="text-xs text-slate-400 font-light mb-3">
                        {item.tagline}
                      </p>

                      {/* Features */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {item.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-champagne-400 flex-shrink-0" />
                            <span className="font-light">{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Review Quote */}
                      <div className="bg-black/40 border border-white/[0.05] rounded-xl p-3 mb-4 group-hover:border-champagne-400/25 transition-colors">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-champagne-400 text-champagne-400" />
                          ))}
                          <span className="text-[10px] font-mono text-slate-400 ml-1.5">{item.review.author} ({item.review.sign})</span>
                        </div>
                        <p className="font-mono text-xs text-champagne-200/90 italic">
                          &quot;{item.review.text}&quot;
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs font-mono">
                      <span className="text-slate-400 group-hover:text-champagne-300 transition-colors flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> Initialize Calibration
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:bg-champagne-400/10 group-hover:border-champagne-400/30 transition-all">
                        <ArrowRight className="w-3.5 h-3.5 text-champagne-300 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="relative max-w-xl mx-auto text-center pt-28 pb-16 mt-20 border-t border-white/[0.06] flex flex-col items-center justify-center gap-3 text-xs font-mono text-slate-400">
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#04060b] via-[#04060b]/80 to-transparent pointer-events-none" />
          <div className="relative z-10 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-champagne-400/60" />
            <span>256-Bit Encrypted Secure Processing & Swiss Ephemeris Calculations</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
