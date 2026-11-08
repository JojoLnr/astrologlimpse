import { useState } from 'react';
import { Sparkles, Zap, BookOpen, Crown, Rocket, Compass, ArrowLeft, ShieldCheck, ArrowRight, Eye, Orbit, Image as ImageIcon } from 'lucide-react';
import { StarryBackground } from '@/components/StarryBackground';
import { CosmicIntakeModal, ProductItem } from '@/components/CosmicIntakeModal';

interface CatalogProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
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
    badge: 'MICRO-SCAN',
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
    badge: 'CORE BLUEPRINT',
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
    badge: 'FLAGSHIP PASS',
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
    badge: 'CONCIERGE TIER',
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
    <div className="relative min-h-screen text-slate-100 selection:bg-champagne-400/20 bg-[#04060b] overflow-hidden">
      {/* Background ambient cosmic glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-950/30 via-champagne-400/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />
      <StarryBackground />

      <CosmicIntakeModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-40">
        
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

        {/* Observatory Header */}
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

        {/* UNEVEN STAGGERED CELESTIAL FEED WITH IMAGE PLACEHOLDERS */}
        <div className="space-y-12">
          {PRODUCTS.map((item, index) => {
            const Icon = item.icon;
            // Uneven layout: alternating widths and offsets to break standard card symmetry
            const isWide = index % 3 === 0;
            const alignClass = index % 2 === 0 ? 'sm:mr-12' : 'sm:ml-12 sm:translate-y-6';

            return (
              <div
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className={`group relative rounded-3xl border border-white/[0.08] bg-slate-900/40 hover:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 cursor-pointer group-hover:border-champagne-400/40 group-hover:shadow-[0_0_40px_rgba(196,163,116,0.1)] shadow-xl ${alignClass} ${
                  isWide ? 'sm:max-w-[90%]' : 'sm:max-w-[85%]'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Side Image Placeholder */}
                  <div className="md:col-span-4 h-36 sm:h-40 rounded-2xl border border-white/[0.1] bg-black/60 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group-hover:border-champagne-400/30 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-champagne-400/10 border border-champagne-400/20 flex items-center justify-center mb-2">
                      <ImageIcon className="w-5 h-5 text-champagne-300" />
                    </div>
                    <p className="text-[10px] font-mono text-champagne-300 uppercase tracking-wider">Specimen View #{index + 1}</p>
                    <span className="text-[9px] font-mono text-slate-500 mt-0.5">Placeholder Mockup</span>
                  </div>

                  {/* Node Content */}
                  <div className="md:col-span-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
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

                      <div className="bg-black/40 border border-white/[0.05] rounded-xl p-3 mb-4 group-hover:border-champagne-400/20 transition-colors">
                        <p className="font-mono text-xs text-champagne-200/90 italic">
                          {item.mysteryTeaser}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs font-mono">
                      <span className="text-slate-500 group-hover:text-champagne-300 transition-colors flex items-center gap-1.5">
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

        {/* Footer with Infinite Observatory Fade */}
        <footer className="relative max-w-xl mx-auto text-center pt-24 pb-12 mt-16 border-t border-white/[0.06] flex flex-col items-center justify-center gap-3 text-xs font-mono text-slate-400">
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#04060b] to-transparent pointer-events-none" />
          <div className="relative z-10 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-champagne-400/60" />
            <span>256-Bit Encrypted Secure Processing & Swiss Ephemeris Calculations</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
