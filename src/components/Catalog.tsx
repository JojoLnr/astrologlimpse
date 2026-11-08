import { useState } from 'react';
import { Sparkles, Zap, BookOpen, Crown, Rocket, Compass, ArrowLeft, ShieldCheck, ArrowRight, Eye } from 'lucide-react';
import { StarryBackground } from '@/components/StarryBackground';
import { CosmicIntakeModal } from '@/components/CosmicIntakeModal';

interface CatalogProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

export interface ProductItem {
  id: string;
  priceId: string;
  name: string;
  tagline: string;
  mysteryTeaser: string;
  price: string;
  numericValue: number;
  mode: 'payment' | 'subscription';
  badge: string;
  icon: React.ElementType;
  accentColor: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'transit',
    priceId: 'price_transit_placeholder',
    name: 'The Today Transit Flash',
    tagline: 'Instant single-transit planetary scan',
    mysteryTeaser: '“Moon conjunct Midheaven at 14° Taurus. Favorable window detected for decisive career communication...”',
    price: '$1.00',
    numericValue: 1.0,
    mode: 'payment',
    badge: 'Micro-Scan',
    icon: Compass,
    accentColor: '#38bdf8',
  },
  {
    id: 'full_package',
    priceId: 'price_full_package_placeholder',
    name: 'The 10-Point Life Crossroads Blueprint',
    tagline: 'Comprehensive natal breakdown for love & career',
    mysteryTeaser: '“House 7 Activation: Saturn pressure clearing. Expect structural partnership shifts over the next 30 days...”',
    price: '$5.00',
    numericValue: 5.0,
    mode: 'payment',
    badge: 'Core Reading',
    icon: BookOpen,
    accentColor: '#48bb78',
  },
  {
    id: 'premium_membership',
    priceId: 'price_premium_sub_placeholder',
    name: 'The Premium Cosmic Access Pass',
    tagline: 'Continuous weekly ephemeris calculations & live unblurs',
    mysteryTeaser: '“RECURRING SYNC: Live weekly planetary transit feeds mapped directly to your unique natal house coordinates.”',
    price: '$9.99',
    numericValue: 9.99,
    mode: 'subscription',
    badge: 'MOST POPULAR',
    icon: Crown,
    accentColor: '#c4a374',
  },
  {
    id: 'vip_orbit',
    priceId: 'price_vip_orbit_placeholder',
    name: 'The VIP Orbit Pass',
    tagline: 'Priority queue skip & direct astrological Q&A access',
    mysteryTeaser: '“VIP DIRECT CHANNEL: Direct coordinate auditing with priority computational allocation and monthly concierge review.”',
    price: '$99.99',
    numericValue: 99.99,
    mode: 'subscription',
    badge: 'Concierge Tier',
    icon: Rocket,
    accentColor: '#a855f7',
  },
  {
    id: 'cosmic_horizon',
    priceId: 'price_cosmic_horizon_placeholder',
    name: 'Executive Custom Birth Sky Art',
    tagline: 'High-res digital masterpiece of your exact birth night sky',
    mysteryTeaser: '“SWISS EPHEMERIS ARTIFACT: 300 DPI vector sky mapping with gold-foil border geometry layout for your exact birth minute.”',
    price: '$249.99',
    numericValue: 249.99,
    mode: 'payment',
    badge: 'LUXURY ARTIFACT',
    icon: Sparkles,
    accentColor: '#f59e0b',
  },
  {
    id: 'test',
    priceId: 'price_test_placeholder',
    name: 'Test Sandbox Entry',
    tagline: 'Internal validation & conversion tag testing flow',
    mysteryTeaser: '“SYSTEM_TEST_MODE_ACTIVE // 001 - Validating Google Ads dynamic conversion tracking pipeline.”',
    price: '$1.00',
    numericValue: 1.0,
    mode: 'payment',
    badge: 'DEV ONLY',
    icon: Zap,
    accentColor: '#94a3b8',
  },
];

export function Catalog({ onNavigateHome, onNavigateDashboard }: CatalogProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-champagne-400/20 bg-[#04060b]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#04060b] to-[#04060b] pointer-events-none" />
      <StarryBackground />

      <CosmicIntakeModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-28">
        
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

        {/* Minimal Title Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-champagne-400/[0.06] border border-champagne-400/25 backdrop-blur-md mb-6 shadow-[0_0_25px_rgba(196,163,116,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-champagne-200">The Observatory Codex</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-light text-champagne-50 mb-4 tracking-tight leading-[1.15]">
            Select Your <br />
            <span className="bg-gradient-to-r from-champagne-200 via-champagne-300 to-amber-200 bg-clip-text text-transparent italic font-normal">
              Transmission
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-light tracking-wide">
            Select a service below to preview its transmission snippet and calibrate your birth coordinates.
          </p>
        </div>

        {/* ULTRA-MINIMAL CURIOSITY CARDS */}
        <div className="space-y-6">
          {PRODUCTS.map((item) => {
            const Icon = item.icon;
            const isAnchor = item.id === 'cosmic_horizon';
            const isHero = item.id === 'premium_membership';

            return (
              <div
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className={`group relative rounded-2xl border backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 cursor-pointer shadow-xl overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
                  isAnchor
                    ? 'border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-[#0a0d18]/90 to-slate-950/90 hover:border-amber-500/70'
                    : isHero
                    ? 'border-champagne-400/40 bg-gradient-to-br from-[#0c1224] via-[#070a14] to-[#04060b] hover:border-champagne-400/70'
                    : item.id === 'test'
                    ? 'border border-dashed border-slate-700 bg-slate-900/40 opacity-70 hover:opacity-100'
                    : 'border-white/[0.08] bg-slate-900/60 hover:border-champagne-400/40 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div 
                    className="w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform"
                    style={{ borderColor: `${item.accentColor}40`, background: `${item.accentColor}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.accentColor }} />
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-champagne-200">
                        {item.badge}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-light text-champagne-50 group-hover:text-champagne-200 transition-colors">
                      {item.name}
                    </h2>
                    <p className="font-mono text-xs text-slate-400 italic mt-1 line-clamp-1">
                      {item.mysteryTeaser}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                  <span className="text-xs font-mono tracking-widest text-champagne-300 uppercase opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                    Calibrate
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center group-hover:bg-champagne-400/10 group-hover:border-champagne-400/30 transition-all">
                    <ArrowRight className="w-4 h-4 text-champagne-300 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="max-w-xl mx-auto text-center pt-16 border-t border-white/[0.06] flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <ShieldCheck className="w-4 h-4 text-champagne-400/60" />
          <span>256-Bit Encrypted Secure Processing & Swiss Ephemeris Calculations</span>
        </footer>
      </main>
    </div>
  );
}
