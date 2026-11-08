import { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, MapPin, ArrowRight, X, Loader2, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createCheckoutSession } from '@/lib/stripe';

export interface ProductReview {
  text: string;
  author: string;
  sign: string;
}

export interface ProductItem {
  id: string;
  priceId: string;
  name: string;
  tagline: string;
  mysteryTeaser?: string;
  description?: string;
  price: string;
  numericValue: number;
  mode: 'payment' | 'subscription';
  badge: string;
  icon?: React.ElementType;
  accentColor: string;
  reviews?: ProductReview[];
}

interface CosmicIntakeModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export function CosmicIntakeModal({ product, onClose }: CosmicIntakeModalProps) {
  const { user, signInWithGoogle } = useAuth();

  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [birthLocation, setBirthLocation] = useState('');
  const [focusArea, setFocusArea] = useState('General Life Path');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Review Carousel State inside Modal
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const reviews = product?.reviews || [
    {
      text: 'Uncanny accuracy regarding my current transition period.',
      author: 'Priya D.',
      sign: 'Libra',
    },
    {
      text: 'Extremely thorough breakdown. Showed me exactly when planetary pressure lifts.',
      author: 'Marcus K.',
      sign: 'Scorpio',
    },
  ];

  // Auto-rotate reviews every 5 seconds
  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  if (!product) return null;

  const activeReview = reviews[currentReviewIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const intakeData = {
      email: user?.email || '',
      fullName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Seeker',
      birthDate,
      birthTime: unknownTime ? '12:00 (Approx)' : birthTime,
      birthLocation,
      focusArea,
      productId: product.id,
    };
    sessionStorage.setItem('pending_cosmic_intake', JSON.stringify(intakeData));

    if (!user) {
      try {
        sessionStorage.setItem('pending_catalog_checkout', product.priceId);
        sessionStorage.setItem('pending_catalog_mode', product.mode);
        sessionStorage.setItem('pending_catalog_value', product.numericValue.toString());

        await signInWithGoogle();
        return;
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Google authentication failed');
        return;
      }
    }

    setIsLoading(true);
    try {
      const url = await createCheckoutSession(product.priceId, product.mode);
      window.location.href = url;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to reach payment gateway.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#0c1021] via-[#080b16] to-[#04060b] p-6 sm:p-8 shadow-[0_0_80px_rgba(196,163,116,0.15)] overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: product.accentColor }}
        />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Title */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-400/10 border border-champagne-400/20 text-[10px] font-mono tracking-widest text-champagne-300 uppercase mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Step 1: Cosmic Intake & Profile Setup</span>
          </div>
          <h2 className="text-2xl font-serif text-white tracking-wide">{product.name}</h2>
          <p className="text-sm text-slate-400 mt-1">Provide your birth details to initialize your reading profile.</p>
        </div>

        {/* Integrated User Rating & Review Carousel Banner inside Modal */}
        <div className="mb-6 rounded-2xl border border-white/[0.08] bg-black/40 p-3.5 backdrop-blur-sm relative">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-white">4.9/5.0</span>
              <span className="text-[10px] font-mono text-slate-400">
                • {activeReview.author} ({activeReview.sign})
              </span>
            </div>

            {reviews.length > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)}
                  className="p-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)}
                  className="p-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <p className="font-mono text-xs text-champagne-200/90 italic">
            &quot;{activeReview.text}&quot;
          </p>
        </div>

        {/* Intake Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">Birth Date</label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-champagne-400/60" />
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-champagne-400/50"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">Birth Time</label>
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={unknownTime}
                  onChange={(e) => setUnknownTime(e.target.checked)}
                  className="rounded border-white/20 bg-slate-900 text-champagne-500 focus:ring-0"
                />
                <span>Time Unknown</span>
              </label>
            </div>
            <div className="relative">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-champagne-400/60" />
              <input
                type="time"
                disabled={unknownTime}
                required={!unknownTime}
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-champagne-400/50 disabled:opacity-40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">Birth Location (City, Country)</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-champagne-400/60" />
              <input
                type="text"
                required
                placeholder="e.g. Paris, France"
                value={birthLocation}
                onChange={(e) => setBirthLocation(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-champagne-400/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">Primary Focus Area</label>
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-champagne-400/50"
            >
              <option value="General Life Path">General Life Path & Destiny</option>
              <option value="Career & Wealth">Career, Purpose & Wealth</option>
              <option value="Love & Relationships">Love, Synastry & Relationships</option>
              <option value="Current Transits">Current Energetic Transits</option>
            </select>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">{errorMsg}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-champagne-400 via-champagne-300 to-amber-200 text-slate-950 font-semibold text-sm shadow-lg shadow-champagne-500/20 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{user ? `Proceed to Secure Checkout (${product.price})` : 'Continue with Google'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
