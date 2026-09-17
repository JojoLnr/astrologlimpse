import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { zodiacSigns } from '@/lib/zodiac';
import { AccountSettings } from '@/components/AccountSettings';
import { PaywallModal } from '@/components/PaywallModal';
import { StarryBackground } from '@/components/StarryBackground';
import { ZodiacExplorer } from '@/components/ZodiacExplorer';
import {
  Sparkles,
  Loader2,
  ChevronDown,
  Telescope,
  Mail,
  Check,
  Compass,
  HeartHandshake,
  CheckCircle2,
  LogIn,
  ShieldCheck,
  Zap,
  Star,
  Lock,
  HelpCircle,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface DashboardProps {
  onNavigateHome: () => void;
}

const PENDING_REQUEST_KEY = 'astrologlimpse_pending_request';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function Dashboard({ onNavigateHome }: DashboardProps) {
  const { user, profile, loading, refreshProfile, signInWithGoogle, signInWithMagicLink } = useAuth();
  
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [personalFocus, setPersonalFocus] = useState<string>('');
  const [showOptionalFocus, setShowOptionalFocus] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [signDropdownOpen, setSignDropdownOpen] = useState(false);
  const [genError, setGenError] = useState('');
  
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [email, setEmail] = useState('');
  const [authStatus, setAuthStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const submitReadingToSupabase = async (sign: string, focus: string, currentUserId: string, currentUserEmail: string) => {
    setSubmitting(true);
    try {
      const { error: requestError } = await supabase
        .from('reading_requests')
        .insert({
          user_id: currentUserId,
          email: currentUserEmail,
          zodiac_sign: sign,
          personal_focus: focus || null,
          status: 'pending',
        });

      if (requestError) throw requestError;

      if (!profile?.has_used_free_reading) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ has_used_free_reading: true })
          .eq('id', currentUserId);

        if (profileError) throw profileError;
        await refreshProfile();
      }

      setRequestSubmitted(true);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      refreshProfile();
      window.history.replaceState({}, '', '/dashboard');
    }

    if (user && profile) {
      const pendingRaw = localStorage.getItem(PENDING_REQUEST_KEY);
      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw);
          localStorage.removeItem(PENDING_REQUEST_KEY);
          setSelectedSign(pending.sign);
          setPersonalFocus(pending.focus || '');
          submitReadingToSupabase(pending.sign, pending.focus, user.id, profile.email || user.email || '');
        } catch (e) {
          console.error('Failed to parse pending reading request', e);
        }
      }
    }
  }, [user, profile, refreshProfile]);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <StarryBackground />
        <Loader2 className="w-8 h-8 animate-spin text-amber-300" />
      </div>
    );
  }

  const isMonthly = profile?.subscription_status === 'monthly';
  const hasWeeklyUnlock = profile?.weekly_unlocked_until && new Date(profile.weekly_unlocked_until) > new Date();
  const hasFreeReadingLeft = !profile || !profile.has_used_free_reading;
  const canGenerate = !user || hasFreeReadingLeft || isMonthly || hasWeeklyUnlock;

  const handleRequestClick = async () => {
    if (!selectedSign) {
      setGenError('Please select your zodiac sign first.');
      return;
    }
    setGenError('');

    if (!user) {
      localStorage.setItem(PENDING_REQUEST_KEY, JSON.stringify({ sign: selectedSign, focus: personalFocus }));
      setShowAuthGate(true);
      return;
    }

    if (!canGenerate) {
      setShowPaywall(true);
      return;
    }

    await submitReadingToSupabase(selectedSign, personalFocus, user.id, profile?.email || user.email || '');
  };

  const handleGoogleSignIn = async () => {
    setAuthStatus('sending');
    localStorage.setItem(PENDING_REQUEST_KEY, JSON.stringify({ sign: selectedSign, focus: personalFocus }));
    const { error } = await signInWithGoogle();
    if (error) { setAuthStatus('error'); setGenError(error); }
  };

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setAuthStatus('sending');
    localStorage.setItem(PENDING_REQUEST_KEY, JSON.stringify({ sign: selectedSign, focus: personalFocus }));
    const { error } = await signInWithMagicLink(email);
    if (error) { setAuthStatus('error'); setGenError(error); } else { setAuthStatus('sent'); }
  };

  const faqs = [
    {
      q: "Is this free reading really 100% free?",
      a: "Yes! Your initial 10-point cosmic reading is completely free with no credit card required. You only pay if you choose to unlock ongoing weekly transit reports."
    },
    {
      q: "Do I need my exact birth time?",
      a: "While having your exact birth time allows us to calculate your rising sign and exact house placements, your zodiac sign alone is enough to generate an accurate baseline transit reading."
    },
    {
      q: "How does Astrologlimpse differ from generic horoscopes?",
      a: "Generic horoscopes only look at your Sun sign. Astrologlimpse maps live planetary movements across your complete chart, tracking deep placements like Chiron, Lilith, and active transits."
    },
    {
      q: "When will I receive my reading?",
      a: "Your report is processed immediately after signing in and delivered to your inbox within seconds."
    }
  ];

  return (
    <div className="relative min-h-screen text-slate-200">
      <StarryBackground />

      {/* Header */}
      <header className="relative z-10 pt-6 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={onNavigateHome} className="flex items-center gap-2">
            <Telescope className="w-5 h-5 text-amber-300" />
            <span className="text-lg font-serif text-white tracking-wide">Astrologlimpse</span>
          </button>
          {user ? (
            <span className="text-sm text-slate-400">{profile?.email || user.email}</span>
          ) : (
            <button
              onClick={() => setShowAuthGate(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-300" />
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20">
        
        {/* HERO SECTION */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-300/10 border border-amber-300/20 backdrop-blur-sm mb-4">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-xs sm:text-sm text-amber-200 font-medium">Free 10-Point Astrological Blueprint Available</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-serif text-white mb-4 leading-tight">
            Stop Reading Generic Horoscopes. <br className="hidden sm:inline" />
            <span className="text-amber-300 italic">Uncover Your Live Transits.</span>
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg mb-6 leading-relaxed">
            Get an in-depth, personal reading analyzing active planetary movements, key house transits, and deep asteroid placements affecting your life right now.
          </p>

          {/* Social Proof Stats Banner */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 py-2 px-4 rounded-2xl bg-white/[0.02] border border-white/5 w-fit mx-auto mb-8">
            <span className="flex items-center gap-1.5">
              <span className="flex text-amber-300">★★★★★</span>
              <strong className="text-white">4.9/5</strong> rating
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span className="flex items-center gap-1.5 text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-amber-300" />
              Over <strong>14,200+</strong> readings generated
            </span>
          </div>
        </div>

        {/* PRIMARY FORM CARD */}
        {requestSubmitted ? (
          <div className="rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-300/10 to-white/[0.02] backdrop-blur-xl p-8 mb-16 text-center animate-[fadeInUp_0.4s_ease-out]">
            <div className="w-16 h-16 rounded-2xl bg-amber-300/20 border border-amber-300/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-amber-300" />
            </div>
            <h3 className="text-2xl font-serif text-white mb-2">Reading Request Received!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
              Your request for <strong className="text-amber-200">{selectedSign}</strong> has been logged. We are preparing your reading and delivering it directly to <strong className="text-white">{profile?.email || user?.email}</strong>.
            </p>
            <button
              onClick={() => { setRequestSubmitted(false); setPersonalFocus(''); }}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-all"
            >
              Request Another Reading
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto rounded-3xl border border-amber-300/20 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-6 sm:p-10 shadow-2xl mb-16">
            
            {/* Step 1: Sign selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-200 mb-2">1. Select your zodiac sign</label>
              <div className="relative">
                <button
                  onClick={() => setSignDropdownOpen(!signDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white hover:bg-white/10 transition-all text-base"
                >
                  <span className="flex items-center gap-3">
                    {selectedSign ? (
                      <>
                        <span className="text-2xl" style={{ color: zodiacSigns.find((s) => s.name === selectedSign)?.color }}>
                          {zodiacSigns.find((s) => s.name === selectedSign)?.glyph}
                        </span>
                        <span className="font-medium">{selectedSign}</span>
                      </>
                    ) : (
                      <span className="text-slate-400">Choose your sign...</span>
                    )}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${signDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {signDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#111936] border border-white/15 shadow-2xl z-20 max-h-64 overflow-y-auto">
                    {zodiacSigns.map((sign) => (
                      <button
                        key={sign.name}
                        onClick={() => { setSelectedSign(sign.name); setSignDropdownOpen(false); setGenError(''); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors"
                      >
                        <span className="text-xl" style={{ color: sign.color }}>{sign.glyph}</span>
                        <span className="text-sm font-medium text-white">{sign.name}</span>
                        <span className="text-xs text-slate-400 ml-auto">{sign.dates}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Collapsible Focus Box */}
            <div className="mb-8">
              {!showOptionalFocus ? (
                <button
                  type="button"
                  onClick={() => setShowOptionalFocus(true)}
                  className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition-colors"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>+ Add a personal focus or question (Optional)</span>
                </button>
              ) : (
                <div className="animate-[fadeIn_0.3s_ease-out]">
                  <label className="flex items-center justify-between text-sm text-slate-300 mb-1.5">
                    <span>2. Personal Focus or Preoccupations</span>
                    <button type="button" onClick={() => { setShowOptionalFocus(false); setPersonalFocus(''); }} className="text-xs text-slate-500 hover:text-slate-300">
                      Remove
                    </button>
                  </label>
                  <textarea
                    value={personalFocus}
                    onChange={(e) => setPersonalFocus(e.target.value)}
                    rows={2}
                    placeholder="e.g., Career decisions, relationship choices, or upcoming life changes..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-300/40 focus:bg-white/10 transition-all resize-none"
                  />
                </div>
              )}
            </div>

            {/* Auth Gate or Main CTA */}
            {showAuthGate && !user ? (
              <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-[fadeIn_0.3s_ease-out]">
                <p className="text-center text-sm text-amber-200 font-medium">
                  Where should we send your free {selectedSign || ''} reading?
                </p>

                {authStatus === 'sent' ? (
                  <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-green-500/10 border border-green-400/20">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-green-300 text-sm font-medium">Magic link sent!</p>
                      <p className="text-slate-400 text-xs">Check your email to view your reading instantly.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={authStatus === 'sending'}
                      className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all disabled:opacity-50"
                    >
                      <GoogleIcon />
                      Continue with Google (Instant)
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-xs text-slate-500">or use email</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <form onSubmit={handleMagicLinkSignIn} className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          disabled={authStatus === 'sending'}
                          className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-300/40 focus:bg-white/10 transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={authStatus === 'sending'}
                        className="px-5 py-3 rounded-xl bg-amber-400 text-[#0a0e27] text-sm font-semibold hover:bg-amber-300 transition-all disabled:opacity-50 whitespace-nowrap"
                      >
                        {authStatus === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Deliver Reading'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={handleRequestClick}
                disabled={submitting || !selectedSign}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#0a0e27] font-bold text-base hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Your Reading...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {hasFreeReadingLeft ? 'Unlock My Free 10-Point Cosmic Reading' : 'Request My Cosmic Reading'}
                  </>
                )}
              </button>
            )}

            {genError && <p className="mt-3 text-red-400 text-xs text-center">{genError}</p>}
          </div>
        )}

        {/* SAMPLE READING PREVIEW (CURIOSITY ENGINE) */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2">What Your Reading Reveals</h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">Here is a sample preview of the deep breakdown generated for every reader.</p>
          </div>

          <div className="max-w-3xl mx-auto rounded-3xl bg-[#0e1530] border border-white/10 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-slate-400 font-mono">Sample Output: Scorpio Transit Analysis</span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Unlocked Sample Item */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold mb-2">
                  <Zap className="w-4 h-4" />
                  <span>1. Active Mars Transit (10th House of Career)</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Mars entering your 10th house creates an unprecedented 14-day energy window. You will experience heightened drive around leadership roles, but caution is advised with authority figures on Thursday...
                </p>
              </div>

              {/* Teaser/Locked Sample Item */}
              <div className="relative p-4 rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="filter blur-[4px] select-none opacity-40">
                  <div className="text-amber-300 text-sm font-semibold mb-2">2. Chiron & Unresolved Natal Wounds</div>
                  <p className="text-slate-300 text-sm">Your Chiron placement in the 7th house triggers an opportunity for emotional reconciliation during this lunar phase. Pay close attention to...</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-medium">
                    <Lock className="w-3.5 h-3.5" /> Unlock in your free personalized reading
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS (3-STEP PROCESS) */}
        <div className="mb-20 border-t border-white/10 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2">How Astrologlimpse Works</h2>
            <p className="text-slate-400 text-sm">3 simple steps to clarity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-300/10 text-amber-300 font-serif font-bold text-lg flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="text-white font-medium mb-2">Select Your Sign</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Pick your zodiac sign and optionally enter any career or relationship questions on your mind.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-300/10 text-amber-300 font-serif font-bold text-lg flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="text-white font-medium mb-2">Live Transit Calculations</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Our engine cross-references active planetary coordinates against your sign's houses and key asteroids.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-300/10 text-amber-300 font-serif font-bold text-lg flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="text-white font-medium mb-2">Receive Your Report</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Instantly review your 10-point custom cosmic report in your dashboard or inbox.</p>
            </div>
          </div>
        </div>

        {/* FAQ ACCORDION SECTION */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-sm">Everything you need to know before getting started.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-white text-sm hover:bg-white/5 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="p-4 pt-0 text-slate-400 text-xs leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ZODIAC EXPLORER */}
        <div className="mb-12 border-t border-white/10 pt-10">
          <ZodiacExplorer />
        </div>

        {user && <AccountSettings onOpenPaywall={() => setShowPaywall(true)} />}
      </main>

      <PaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
