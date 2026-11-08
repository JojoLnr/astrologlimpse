import { useState, useEffect } from 'react';
import { Sparkles, Compass, BookOpen, Crown, Rocket, ArrowLeft, ShieldCheck, ArrowRight, Eye, Orbit, Image as ImageIcon, Check, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { StarryBackground } from '@/components/StarryBackground';
import { CosmicIntakeModal, ProductItem } from '@/components/CosmicIntakeModal';

interface CatalogProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

export interface ProductReview {
  text: string;
  author: string;
  sign: string;
}

export interface CatalogProductItem extends ProductItem {
  features: string[];
  reviews: ProductReview[];
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
    reviews: [
      { text: 'The transit breakdown showed me exactly when the pressure lifted. Incredible clarity.', author: 'Sarah M.', sign: 'Capricorn' },
      { text: 'Spot on timing for my team meeting today. Pinpointed the exact hour.', author: 'David L.', sign: 'Gemini' },
      { text: 'Fast, precise, and cost next to nothing. Essential daily scan.', author: 'Chloe T.', sign: 'Virgo' },
    ],
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
    reviews: [
      { text: 'The only app that gave me specific structural dates instead of vague personality text.', author: 'Priya D.', sign: 'Libra' },
      { text: 'Uncanny accuracy regarding my current relationship transition period.', author: 'Marcus V.', sign: 'Scorpio' },
      { text: 'Extremely thorough breakdown of my career nodes. Worth far more.', author: 'Elena K.', sign: 'Aries' },
    ],
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
    reviews: [
      { text: 'Having weekly updates mapped to my exact chart transformed how I plan business launches.', author: 'Marcus K.', sign: 'Scorpio' },
      { text: 'The weekly unblur feed is my favorite Monday morning ritual.', author: 'Jessica W.', sign: 'Pisces' },
      { text: 'Cancelled two other horoscope apps. This is the only one backed by real math.', author: 'Julian B.', sign: 'Aquarius' },
    ],
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
    reviews: [
      { text: 'The concierge responses are remarkably thorough. It feels like having a personal astrologer on retainer.', author: 'Elena R.', sign: 'Leo' },
      { text: 'Direct Q&A response answered my natal Saturn return questions in incredible detail.', author: 'Tom H.', sign: 'Cancer' },
    ],
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
    reviews: [
      { text: 'Museum-quality digital file hanging in my study. The astronomical precision is breathtaking.', author: 'Jonathan W.', sign: 'Taurus' },
      { text: 'Printed it on acrylic canvas for my anniversary. Spectacular detail.', author: 'Sophia R.', sign: 'Sagittarius' },
    ],
  },
];

// Product Card Component with Built-in Interactive Review Carousel
function ProductCard({ 
  item, 
  isFlipped, 
  onSelectProduct 
}: { 
  item: CatalogProductItem; 
  isFlipped: boolean; 
  onSelectProduct: (product: CatalogProductItem) => void;
}) {
  const Icon = item.icon || Compass;
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Auto-rotate reviews every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % item.reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [item.reviews.length]);

  const handleNextReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentReviewIndex((prev) => (prev + 1) % item.reviews.length);
  };

  const handlePrevReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentReviewIndex((prev) => (prev - 1 + item.reviews.length) % item.reviews.length);
  };

  const activeReview = item.reviews[currentReviewIndex];

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
      {/* Detached Image Container with Fade Effect */}
      <div
        className={`w-full md:w-5/12 h-64 sm:h-80 relative flex flex-col items-center justify-center p-6 text-center overflow-hidden transition-all duration-300 ${
          isFlipped ? 'md:order-2' : 'md:order-1'
        }`}
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-20 blur-3xl pointer-events-none"
          style={{ background: item.accentColor }}
        />

        <div className="relative z-10 w-full h-full rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl flex flex-col items-center justify-center p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
          <div className="w-14 h-14 rounded-2xl bg-champagne-400/10 border border-champagne-400/20 flex items-center justify-center mb-3 shadow-inner">
            <ImageIcon className="w-7 h-7 text-champagne-300" />
          </div>
          <p className="text-xs font-mono text-champagne-300 uppercase tracking-widest">
            {item.name} Image
          </p>
          <span className="text-[10px] font-mono text-slate-500 mt-1">
            [ External Specimen Frame ]
          </span>
        </div>
      </div>

      {/* Main Product Card */}
      <div
        onClick={() => onSelectProduct(item)}
        className={`w-full md:w-7/12 group relative rounded-3xl border border-white/[0.08] bg-slate-900/50 hover:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 cursor-pointer group-hover:border-champagne-400/50 group-hover:shadow-[0_0_50px_rgba(196,163,116,0.15)] shadow-xl ${
          isFlipped ? 'md:order-1' : 'md:order-2'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
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
        <p className="text-xs text-slate-400 font-light mb-4">
          {item.tagline}
        </p>

        {/* Features list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {item.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
              <Check className="w-3.5 h-3.5 text-champagne-400 flex-shrink-0" />
              <span className="font-light">{feat}</span>
            </div>
          ))}
        </div>

        {/* Interactive Reviews Carousel Container */}
        <div className="bg-black/40 border border-white/[0.05] rounded-xl p-3.5 mb-4 group-hover:border-champagne-400/25 transition-colors relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-champagne-400 text-champagne-400" />
              ))}
              <span className="text-[10px] font-mono text-slate-400 ml-1.5">
                {activeReview.author} ({activeReview.sign})
              </span>
            </div>

            {/* Carousel Controls */}
            {item.reviews.length > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevReview}
                  className="p-1 rounded-md bg-white/[0.05] hover:bg-white/[0.12] text-slate-400 hover:text-champagne-200 transition-colors"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={handleNextReview}
                  className="p-1 rounded-md bg-white/[0.05] hover:bg-white/[0.12] text-slate-400 hover:text-champagne-200 transition-colors"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <p className="font-mono text-xs text-champagne-200/90 italic transition-all duration-300">
            &quot;{activeReview.text}&quot;
          </p>

          {/* Dots Indicator */}
          {item.reviews.length > 1 && (
            <div className="flex justify-center gap-1 mt-2.5">
              {item.reviews.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentReviewIndex ? 'bg-champagne-300 w-3' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA Footer */}
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
  );
}

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

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-48">
        
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

        {/* Product Cards Grid with Carousel */}
        <div className="space-y-24">
          {PRODUCTS.map((item, index) => (
            <ProductCard
              key={item.id}
              item={item}
              isFlipped={index % 2 !== 0}
              onSelectProduct={setSelectedProduct}
            />
          ))}
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
