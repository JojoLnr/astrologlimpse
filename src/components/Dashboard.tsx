import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { zodiacSigns } from '@/lib/zodiac';
import { ZodiacSymbol } from '@/components/ZodiacArt';
import { ReadingDisplay } from '@/components/ReadingDisplay';
import { AccountSettings } from '@/components/AccountSettings';
import { PaywallModal } from '@/components/PaywallModal';
import { StarryBackground } from '@/components/StarryBackground';
import { BlurredDashboard } from '@/components/BlurredDashboard';
import { NatalWheel } from '@/components/NatalWheel';
import { ZodiacExplorer } from '@/components/ZodiacExplorer';
import {
  Sparkles, Loader2, ChevronDown, Check, Compass, HeartHandshake,
  CheckCircle2, Sun, Moon, ArrowUpRight, Zap, TrendingUp, Heart,
  Lock, Calendar, Globe, ArrowUp,
} from 'lucide-react';

interface DashboardProps {
  onNavigateHome: () => void;
}

const readingPoints = [
  { icon: Sun, title: 'Natal Sun Sign Analysis', subtitle: 'Core Identity', color: '#e9c46a' },
  { icon: Moon, title: 'Natal Moon Sign', subtitle: 'Emotional Architecture', color: '#778da9' },
  { icon: ArrowUpRight, title: 'Rising Sign (Ascendant)', subtitle: 'How You Present', color: '#8ab17d' },
  { icon: Zap, title: 'Primary Active Transit', subtitle: 'Major Live Influence', color: '#e94560' },
  { icon: TrendingUp, title: 'House 10: Career Check', subtitle: 'Career & Public Self', color: '#43aa8b' },
  { icon: Heart, title: 'House 7: Relationships', subtitle: 'Partnership Check', color: '#bc6c8b' },
  { icon: Moon, title: 'Current Lunar Phase Impact', subtitle: 'Emotional Timing', color: '#48cae4' },
  { icon: Heart, title: 'Chiron Placement', subtitle: 'Core Wound & Healing', color: '#f4a261' },
  { icon: Lock, title: 'Black Moon Lilith', subtitle: 'Hidden Desires', color: '#9d4edd' },
  { icon: Calendar, title: 'Weekly Forecast Snapshot', subtitle: '7-Day Action Window', color: '#c4a374' },
];

export function Dashboard({ onNavigateHome }: DashboardProps) {
  const { user, profile, loading, refreshProfile, signInWithGoogle } = useAuth();
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [personalFocus, setPersonalFocus] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [showReading, setShowReading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [signDropdownOpen, setSignDropdownOpen] = useState(false);
  const [genError, setGenError] = useState('');
  const [authRedirecting, setAuthRedirecting] = useState(false);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      refreshProfile();
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [refreshProfile]);

  useEffect(() => {
    const onScroll = () => {
      if (!formRef.current) return;
      const formBottom = formRef.current.getBoundingClientRect().bottom;
      setShowFloatingBtn(formBottom < 0 && !showReading && !requestSubmitted);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [showReading, requestSubmitted]);

  const isMonthly = profile?.subscription_status === 'monthly';
  const hasWeeklyUnlock =
    profile?.weekly_unlocked_until && new Date(profile.weekly_unlocked_until) > new Date();
  const hasFreeReadingLeft = !profile?.has_used_free_reading;
  const canGenerate = !user ? true : hasFreeReadingLeft || isMonthly || hasWeeklyUnlock;

  const getAllowanceText = () => {
    if (!user) return '1 Free Initial Reading Available';
    if (hasFreeReadingLeft) return '1 Free Initial Reading Available';
    if (isMonthly) return 'Unlimited Weekly Readings Active';
    if (hasWeeklyUnlock) return '1 Reading Available This Week';
    return '0 Readings Left This Week';
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const executeReadingSubmission = async (sign: string, focus: string) => {
    if (!user) return;
    if (!canGenerate) {
      setShowPaywall(true);
      return;
    }

    setSubmitting(true);
    try {
      const userEmail = profile?.email || user.email || '';

      const { error: requestError } = await supabase
        .from('reading_requests')
        .insert({
          user_id: user.id,
          email: userEmail,
          zodiac_sign: sign,
          personal_focus: focus.trim(),
          status: 'pending',
        });

      if (requestError) throw requestError;

      if (hasFreeReadingLeft) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ has_used_free_reading: true })
          .eq('id', user.id);

        if (profileError) throw profileError;
        await refreshProfile();
      }

      setRequestSubmitted(true);
      setShowReading(true);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestReading = async () => {
    if (!selectedSign) {
      setGenError('Please select your zodiac sign first.');
      return;
    }
    if (!personalFocus.trim()) {
      setGenError('Please share what you need guidance about to continue.');
      return;
    }
    setGenError('');

    if (!user) {
      setAuthRedirecting(true);
      sessionStorage.setItem('pending_reading_sign', selectedSign);
      sessionStorage.setItem('pending_reading_focus', personalFocus.trim());
      const { error } = await signInWithGoogle();
      if (error) {
        setAuthRedirecting(false);
        setGenError(error);
      }
      return;
    }

    await executeReadingSubmission(selectedSign, personalFocus);
  };

  // Automatically process pending reading request once user returns and authenticates via Google
  useEffect(() => {
    if (user && profile) {
      const pendingSign = sessionStorage.getItem('pending_reading_sign');
      const pendingFocus = sessionStorage.getItem('pending_reading_focus');
      if (pendingSign && pendingFocus) {
        setSelectedSign(pendingSign);
        setPersonalFocus(pendingFocus);
        sessionStorage.removeItem('pending_reading_sign');
        sessionStorage.removeItem('pending_reading_focus');
        executeReadingSubmission(pendingSign, pendingFocus);
      }
    }
  }, [user, profile]);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <StarryBackground />
        <Loader2 className="w-8 h-8 animate-spin text-champagne-300" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <StarryBackground />

      {/* Header */}
      <header className="relative z-10 pt-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={onNavigateHome} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-champagne-400/10 border border-champagne-400/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-champagne-300" />
            </div>
            <span className="text-base font-serif text-champagne-50 tracking-wide">Astrologlimpse</span>
          </button>
          {user && profile ? (
            <span className="text-sm text-slate-400">{profile.email}</span>
          ) : (
            <span className="text-xs text-slate-400 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1]">
              Not signed in
            </span>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {/* ===== HERO ===== */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-400/[0.08] border border-champagne-400/20 backdrop-blur-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-[glow_3s_ease-in-out_infinite]" />
            <span className="text-xs text-champagne-200 tracking-[0.15em] uppercase">Your Cosmic Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-champagne-50 mb-3 leading-tight tracking-tight">
            Your 10-Point Cosmic Blueprint is Ready.
            <span className="block mt-1 bg-gradient-to-r from-champagne-200 via-champagne-300 to-champagne-200 bg-clip-text text-transparent">
              Reveal the Planetary Forces Shaping Your Week.
            </span>
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-champagne-400/[0.08] border border-champagne-400/20 text-champagne-200 mt-2 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>{getAllowanceText()}</span>
          </div>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base font-light">
            {user
              ? hasFreeReadingLeft
                ? 'Your free 10-point cosmic reading is ready. Select your sign, share what is on your mind, and request your reading.'
                : 'Select your sign, share what you need guidance about, and request your reading.'
              : 'Select your zodiac sign, tell us what you need guidance about, and request your free cosmic reading. You will sign in with Google to claim it.'}
          </p>
        </div>

        {/* ===== READING REQUEST FORM ===== */}
        {!showReading && !requestSubmitted && (
          <div ref={formRef} className="max-w-2xl mx-auto mb-16 scroll-mt-8">
            <div className="rounded-2xl border border-champagne-400/20 bg-gradient-to-br from-champagne-400/[0.06] to-white/[0.02] backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_60px_rgba(196,163,116,0.05)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-champagne-400/15 border border-champagne-400/25 flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4 text-champagne-300" />
                </div>
                <div>
                  <h2 className="text-lg font-serif text-champagne-50">Request Your Reading</h2>
                  <p className="text-xs text-slate-400">Two quick steps to unlock your cosmic blueprint</p>
                </div>
              </div>

              {/* Step 1: Sign selector */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm text-champagne-100 mb-2 font-medium">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-champagne-400/15 text-xs font-mono text-champagne-300">1</span>
                  Select Your Zodiac Sign
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-400/10 border border-red-400/20 text-red-300/90 font-normal normal-case tracking-normal">Required</span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setSignDropdownOpen(!signDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-champagne-50 hover:bg-white/[0.08] hover:border-champagne-400/30 transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      {selectedSign ? (
                        (() => {
                          const sign = zodiacSigns.find((s) => s.name === selectedSign);
                          return sign ? (
                            <>
                              <ZodiacSymbol sign={sign} className="w-6 h-6" />
                              <span className="font-medium">{selectedSign}</span>
                            </>
                          ) : null;
                        })()
                      ) : (
                        <span className="text-slate-400">Choose your sign...</span>
                      )}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${signDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {signDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-midnight-700 border border-white/[0.12] shadow-xl z-30 max-h-64 overflow-y-auto">
                      {zodiacSigns.map((sign) => (
                        <button
                          key={sign.name}
                          onClick={() => {
                            setSelectedSign(sign.name);
                            setSignDropdownOpen(false);
                            setGenError('');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.06] transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                        >
                          <ZodiacSymbol sign={sign} className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm text-champagne-50">{sign.name}</span>
                          <span className="text-xs text-slate-500 ml-auto">{sign.dates}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Guidance prompt */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm text-champagne-100 mb-2 font-medium">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-champagne-400/15 text-xs font-mono text-champagne-300">2</span>
                  What Do You Need Guidance About?
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-400/10 border border-red-400/20 text-red-300/90 font-normal normal-case tracking-normal">Required</span>
                </label>
                <textarea
                  value={personalFocus}
                  onChange={(e) => setPersonalFocus(e.target.value)}
                  rows={4}
                  placeholder="Share what is currently on your mind: a career decision, a relationship question, a crossroads you are facing, fears or hopes for this period..."
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-champagne-50 text-sm placeholder-slate-400 focus:outline-none focus:border-champagne-400/40 focus:bg-white/[0.08] transition-all duration-300 resize-none"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Your prompt helps attune the reading to your personal path. This is required to continue.
                </p>
              </div>

              {/* Submit button */}
              <button
                onClick={handleRequestReading}
                disabled={submitting || authRedirecting || !selectedSign || !personalFocus.trim()}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-champagne-300 to-champagne-400 text-midnight-950 font-semibold text-sm hover:from-champagne-200 hover:to-champagne-300 transition-all duration-300 disabled:opacity-40 shadow-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting Request...
                  </>
                ) : authRedirecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecting to Google...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {user ? 'Request My Cosmic Reading' : 'Request My Free Cosmic Reading'}
                  </>
                )}
              </button>

              {!user && (
                <p className="mt-3 text-center text-xs text-slate-400">
                  You will sign in with Google to claim your reading. No password needed.
                </p>
              )}

              {genError && (
                <p className="mt-3 text-red-400 text-xs text-center">{genError}</p>
              )}

              {user && !canGenerate && (
                <p className="mt-3 text-center text-xs text-slate-400">
                  Your free reading has been used. A subscription or weekly unlock is required for additional readings.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ===== CONFIRMATION STATE ===== */}
        {requestSubmitted && showReading && selectedSign && (
          <div className="max-w-2xl mx-auto mb-14">
            <div className="rounded-2xl border border-champagne-400/25 bg-gradient-to-br from-champagne-400/[0.08] to-white/[0.02] backdrop-blur-xl p-8 text-center animate-[fadeInUp_0.4s_ease-out] mb-6">
              <div className="w-16 h-16 rounded-2xl bg-champagne-400/15 border border-champagne-400/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-champagne-300" />
              </div>
              <h3 className="text-2xl font-serif text-champagne-50 mb-2">Reading Request Received!</h3>
              <p className="text-slate-200 text-sm max-w-md mx-auto mb-2">
                Your request for <strong className="text-champagne-200">{selectedSign}</strong> has been logged. We are preparing your reading and will deliver it directly to <strong className="text-champagne-50">{profile?.email || user?.email}</strong>.
              </p>
              {personalFocus && (
                <p className="text-slate-400 text-xs max-w-md mx-auto mt-3 italic font-serif">
                  Your focus: "{personalFocus}"
                </p>
              )}
              <button
                onClick={() => {
                  setRequestSubmitted(false);
                  setShowReading(false);
                  setPersonalFocus('');
                }}
                className="mt-5 px-5 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-slate-200 text-sm hover:bg-white/[0.08] hover:text-champagne-100 transition-all duration-300"
              >
                Request Another Reading
              </button>
            </div>

            <ReadingDisplay signName={selectedSign} />
          </div>
        )}

        {/* ===== PROOF OF VALUE: Blurred Dashboard Preview ===== */}
        <section className="mb-14">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-400/[0.08] border border-champagne-400/20 backdrop-blur-sm mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-[glow_3s_ease-in-out_infinite]" />
              <span className="text-xs text-champagne-200 tracking-[0.15em] uppercase">Proof of Value</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-champagne-50 mb-2 tracking-tight">
              This Is What Your Dashboard Looks Like
            </h2>
            <p className="text-slate-300 max-w-lg mx-auto text-sm font-serif font-light italic">
              Headers are readable so you can see the depth. The specific insights are unlocked once you claim your reading.
            </p>
          </div>
          <BlurredDashboard />
        </section>

        {/* ===== LIVE NATAL WHEEL ===== */}
        <section className="mb-14">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-400/[0.08] border border-champagne-400/20 backdrop-blur-sm mb-4">
              <Globe className="w-4 h-4 text-champagne-300" />
              <span className="text-xs text-champagne-200 tracking-[0.15em] uppercase">Live Natal Wheel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-champagne-50 mb-2 tracking-tight">
              Watch the 12 Houses Light Up in Real Time
            </h2>
            <p className="text-slate-300 max-w-lg mx-auto text-sm font-serif font-light italic">
              Hover over any house to see exactly what Astrologlimpse is analyzing right now.
              We calculate exact planetary degrees every hour.
            </p>
          </div>
          <div className="flex justify-center">
            <NatalWheel />
          </div>
        </section>

        {/* ===== 10-POINT CHECKLIST ===== */}
        <section className="mb-14">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-400/[0.08] border border-champagne-400/20 backdrop-blur-sm mb-4">
              <Check className="w-4 h-4 text-champagne-300" />
              <span className="text-xs text-champagne-200 tracking-[0.15em] uppercase">What You Get Today</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-champagne-50 mb-2 tracking-tight">
              10 Specific Points of Value
            </h2>
            <p className="text-slate-300 max-w-lg mx-auto text-sm font-serif font-light italic">
              Every point below is calculated from your exact natal chart, not a generic sun sign.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto">
            {readingPoints.map((point, i) => (
              <div
                key={i}
                className="group flex items-start gap-4 rounded-xl border border-white/[0.1] bg-white/[0.04] p-4 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
              >
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border relative overflow-hidden"
                  style={{
                    borderColor: `${point.color}30`,
                    background: `linear-gradient(135deg, ${point.color}18, ${point.color}06)`,
                  }}
                >
                  <point.icon className="w-5 h-5 relative z-10" style={{ color: point.color }} />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at center, ${point.color}20, transparent)` }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-sm font-medium text-champagne-50">{point.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{point.subtitle}</p>
                </div>
                <Check className="w-4 h-4 text-champagne-400/60 flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </section>

        {/* ===== ZODIAC EXPLORER ===== */}
        <section className="mb-14 border-t border-white/[0.08] pt-10">
          <ZodiacExplorer />
        </section>

        {/* ===== ACCOUNT SETTINGS ===== */}
        {user && profile && (
          <AccountSettings />
        )}
      </main>

      {/* ===== FLOATING CTA ===== */}
      {showFloatingBtn && !showReading && !requestSubmitted && (
        <button
          onClick={scrollToForm}
          className="fixed inset-x-4 bottom-5 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border-2 border-champagne-200/70 bg-gradient-to-r from-champagne-200 via-champagne-300 to-champagne-400 text-midnight-950 font-semibold text-sm shadow-[0_12px_40px_rgba(196,163,116,0.35)] hover:from-champagne-100 hover:to-champagne-300 transition-all duration-300 animate-[fadeInUp_0.3s_ease-out]"
        >
          <Sparkles className="w-4 h-4" />
          Generate My Cosmic Reading
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Paywall */}
      <PaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}