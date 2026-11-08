import { useState } from 'react';
import { Sparkles, Calendar, Clock, MapPin, User, Mail, ArrowRight, X, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createCheckoutSession } from '@/lib/stripe';

interface ProductItem {
  id: string;
  priceId: string;
  name: string;
  tagline: string;
  price: string;
  numericValue: number;
  mode: 'payment' | 'subscription';
  accentColor: string;
}

interface CosmicIntakeModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export function CosmicIntakeModal({ product, onClose }: CosmicIntakeModalProps) {
  const { user, signInWithGoogle } = useAuth();
  
  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [birthLocation, setBirthLocation] = useState('');
  const [focusArea, setFocusArea] = useState('General Life Path');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Save intake details in session storage so post-purchase handlers can tie it to the user
    const intakeData = {
      email,
      fullName,
      birthDate,
      birthTime: unknownTime ? '12:00 (Approx)' : birthTime,
      birthLocation,
      focusArea,
      productId: product.id,
    };
    sessionStorage.setItem('pending_cosmic_intake', JSON.stringify(intakeData));

    // If not authenticated via Google, trigger auth while retaining data
    if (!user) {
      try {
        sessionStorage.setItem('pending_catalog_checkout', product.priceId);
        sessionStorage.setItem('pending_catalog_mode', product.mode);
        sessionStorage.setItem('pending_catalog_value', product.numericValue.toString());
        await signInWithGoogle();
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Google authentication failed');
      }
      return;
    }

    setIsLoading(true);
    try {
      const url = await createCheckoutSession(product.priceId, product.mode);
      window.location.href = url;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to launch checkout');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#0c1021] via-[#080b16] to-[#04060b] p-6 sm:p-8 shadow-[0_0_80px_rgba(196,163,116,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: product.accentColor }}
        />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-400/10 border border-champagne-400/20 text-[10px] font-mono tracking-widest text-champagne-300 uppercase mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Step 1: Secure Transmission & Intake</span>
          </div>

          <h3 className="text-2xl font-serif text-champagne-50">
            Calibrating: <span className="text-champagne-200">{product.name}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Provide your email and birth parameters to initialize chart calculation before unlocking access.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-300 font-mono text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address for Delivery
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seeker@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-champagne-400/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Eleanor Vance"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-champagne-400/50"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-slate-100 focus:outline-none focus:border-champagne-400/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300">
                  Exact Time of Birth
                </label>
                <label className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={unknownTime}
                    onChange={(e) => setUnknownTime(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-champagne-400 focus:ring-0"
                  />
                  <span>Unknown</span>
                </label>
              </div>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="time"
                  disabled={unknownTime}
                  required={!unknownTime}
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-slate-100 focus:outline-none focus:border-champagne-400/50 disabled:opacity-30"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Birth Location (City, Country)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={birthLocation}
                onChange={(e) => setBirthLocation(e.target.value)}
                placeholder="Chicago, IL, USA"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-champagne-400/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Primary Focus Area
            </label>
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.1] text-xs text-slate-200 focus:outline-none focus:border-champagne-400/50"
            >
              <option value="General Life Path">General Life Path & Destiny</option>
              <option value="Love & Relationships">Love, House 7 & Soulmate Timing</option>
              <option value="Career & Wealth">Career, House 10 & Financial Shift</option>
              <option value="Karmic Chiron Healing">Karmic Chiron & Wounding</option>
            </select>
          </div>

          <div className="pt-4 border-t border-white/[0.08]">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-champagne-200 via-champagne-300 to-amber-300 text-midnight-950 font-mono text-xs tracking-[0.2em] uppercase font-bold hover:brightness-110 transition-all shadow-[0_4px_30px_rgba(196,163,116,0.3)] disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Calculate Coordinates & Proceed</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-400 mt-3">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-champagne-400" /> Secure 256-Bit Stripe
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-champagne-400" /> No Price Shown Upfront
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
