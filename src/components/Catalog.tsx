import { useState } from 'react';
import { Sparkles, Zap, BookOpen, Crown, Rocket, Compass, ArrowLeft, ShieldCheck, ArrowRight, Eye, Orbit } from 'lucide-react';
import { StarryBackground } from '@/components/StarryBackground';
import { CosmicIntakeModal, ProductItem } from '@/components/CosmicIntakeModal';

interface CatalogProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'transit',
    priceId: import.meta.env.VITE_STRIPE_PRICE_TRANSIT || 'price_transit_placeholder',
    name: 'Transit Insight',
    tagline: 'Instant single-transit planetary scan',
    mysteryTeaser: '“Moon conjunct Midheaven at 14° Taurus. Favorable window detected for decisive career communication...”',
    price: '$1.00',
    numericValue: 1.0,
    mode: 'payment',
    badge: 'MICRO-SCAN',
    icon: Compass,
    accentColor: '#38bdf8',
  },
  {
    id: 'full_package',
    priceId: import.meta.env.VITE_STRIPE_PRICE_BLUEPRINT || 'price_full_package_placeholder',
    name: 'Full Package Reading',
    tagline: 'Comprehensive natal breakdown for love & career',
    mysteryTeaser: '“House 7 Activation: Saturn pressure clearing. Expect structural partnership shifts over the next 30 days...”',
    price: '$5.00',
    numericValue: 5.0,
    mode: 'payment',
    badge: 'CORE BLUEPRINT',
    icon: BookOpen,
    accentColor: '#48bb78',
  },
  {
    id: 'premium_membership',
    priceId: import.meta.env.VITE_STRIPE_PRICE_PREMIUM || 'price_premium_sub_placeholder',
    name: 'Astrologlimpse Premium Membership',
    tagline: 'Continuous weekly ephemeris calculations & live unblurs',
    mysteryTeaser: '“RECURRING SYNC: Live weekly planetary transit feeds mapped directly to your unique natal house coordinates.”',
    price: '$9.99',
    numericValue: 9.99,
    mode: 'subscription',
    badge: 'FLAGSHIP PASS',
    icon: Crown,
    accentColor: '#c4a374',
  },
  {
    id: 'vip_orbit',
    priceId: import.meta.env.VITE_STRIPE_PRICE_VIP || 'price_vip_orbit_placeholder',
    name: 'VIP Orbit Pass',
    tagline: 'Priority queue skip & direct astrological Q&A access',
    mysteryTeaser: '“VIP DIRECT CHANNEL: Direct coordinate auditing with priority computational allocation and monthly concierge review.”',
    price: '$99.99',
    numericValue: 99.99,
    mode: 'subscription',
    badge: 'CONCIERGE TIER',
    icon: Rocket,
    accentColor: '#a855f7',
  },
  {
    id: 'cosmic_horizon',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ART || 'price_cosmic_horizon_placeholder',
    name: 'Cosmic Horizon Custom Birth Sky Art',
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
    priceId: import.meta.env.VITE_STRIPE_PRICE_TEST || 'price_test_placeholder',
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
    <div className="relative min-h-screen text-slate-100 selection:bg-champagne-400/20 bg-[#04060b] overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-b from-indigo-950/30 via-champagne-400/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />
      <StarryBackground />

      <CosmicIntakeModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-28">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-10 sm:mb-16 border-b border-white/[0.08] pb-4 sm:pb-6">
          <button
            onClick={onNavigateHome}
            className="group inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono tracking-[0.15em] sm:tracking-[0.2em] text-champagne-300 uppercase hover:text-champagne-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            [ Return to Observatory ]
          </button>
          <button
            onClick={onNavigateDashboard}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-300 hover:bg-white/[0.06] hover:border-champagne-400/30 transition-all shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-champagne-300" />
            <span className="hidden sm:inline">My</span> Dashboard
          </button>
        </div>

        {/* Observatory Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20 px-2">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-champagne-400/[0.06] border border-champagne-400/25 backdrop-blur-md mb-5 shadow-[0_0_25px_rgba(196,163,116,0.1)]">
            <Orbit className="w-3.5 h-3.5 text-champagne-300 animate-spin" style={{ animationDuration: '12s' }} />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-champagne-200">Observatory Feed // Live Codex</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-serif font-light text-champagne-50 mb-4 sm:mb-6 tracking-tight leading-[1.15]">
            Select Your <br />
            <span className="bg-gradient-to-r from-champagne-200 via-champagne-300 to-amber-200 bg-clip-text text-transparent italic font-normal">
              Celestial Coordinate
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-light tracking-wide font-mono leading-relaxed">
            // Click any transmission node below to calibrate parameters and unlock tailored insights.
          </p>
        </div>

        {/* RESPONSIVE CELESTIAL RADAR FEED LAYOUT */}
        <div className="relative space-y-6 sm:space-y-10 pl-6 sm:pl-0 before:absolute before:inset-y-0 before:left-2.5 sm:before:left-1/2 sm:before:-translate-x-1/2 before:w-px before:bg-gradient-to-b before:from-transparent before:via-champagne-400/25 before:to-transparent">
          {PRODUCTS.map((item, index) => {
            const Icon = item.icon || Compass;
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 cursor-pointer ${
                  isEven ? 'sm:flex-row-reverse' : ''
                }`}
              >
                {/* Orbital Node Point */}
                <div className="absolute -left-[23px] sm:left-1/2 sm:-translate-x-1/2 top-6 sm:top-1/2 sm:-translate-y-1/2 w-4 h-4 rounded-full bg-[#04060b] border-2 border-champagne-400/60 group-hover:border-champagne-300 group-hover:scale-125 transition-all z-20 flex items-center justify-center shadow-[0_0_15px_rgba(196,163,116,0.4)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-pulse" />
                </div>

                {/* Card Container */}
                <div className="w-full sm:w-[calc(50%-2rem)] relative rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-slate-900/50 hover:bg-slate-900/85 backdrop-blur-xl p-5 sm:p-7 transition-all duration-300 group-hover:border-champagne-400/40 group-hover:shadow-[0_0_35px_rgba(196,163,116,0.12)] shadow-xl">
                  
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-champagne-300/80 uppercase">
                      Sector 0{index + 1} // Ephemeris
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-champagne-200">
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5 mb-4">
                    <div 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform"
                      style={{ borderColor: `${item.accentColor}40`, background: `${item.accentColor}15` }}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: item.accentColor }} />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-2xl font-serif font-light text-champagne-50 group-hover:text-champagne-200 transition-colors leading-snug">
                        {item.name}
                      </h2>
                      <p className="text-[11px] sm:text-xs text-slate-400 font-light mt-0.5 leading-relaxed">
                        {item.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Mysterious Ephemeris Preview Snippet */}
                  <div className="bg-black/50 border border-white/[0.05] rounded-xl p-3 sm:p-3.5 mb-4 group-hover:border-champagne-400/20 transition-colors">
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">// LIVE_FEED_SNIPPET</p>
                    <p className="font-mono text-[11px] sm:text-xs text-champagne-200/90 italic leading-relaxed">
                      {item.mysteryTeaser}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-[11px] sm:text-xs font-mono">
                    <span className="text-slate-400 group-hover:text-champagne-300 transition-colors flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Initialize Calibration
                    </span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:bg-champagne-400/10 group-hover:border-champagne-400/30 transition-all">
                      <ArrowRight className="w-3.5 h-3.5 text-champagne-300 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="max-w-xl mx-auto text-center pt-16 sm:pt-20 border-t border-white/[0.06] flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <ShieldCheck className="w-4 h-4 text-champagne-400/60" />
          <span>256-Bit Encrypted Secure Processing & Swiss Ephemeris Calculations</span>
        </footer>
      </main>
    </div>
  );
}
