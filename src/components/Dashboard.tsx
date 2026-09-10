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
} from 'lucide-react';

interface DashboardProps {
  onNavigateHome: () => void;
}

const PENDING_REQUEST_KEY = 'astrologlimpse_pending_request';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function Dashboard({ onNavigateHome }: DashboardProps) {
  const { user, profile, loading, refreshProfile, signInWithGoogle, signInWithMagicLink } = useAuth();
  
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [personalFocus, setPersonalFocus] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [signDropdownOpen, setSignDropdownOpen] = useState(false);
  const [genError, setGenError] = useState('');
  
  // Auth state when user clicks request without being logged in
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [email, setEmail] = useState('');
  const [authStatus, setAuthStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // Helper function to commit the request to Supabase
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

  // Check for checkout success state AND auto-process pending reading request after login
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      refreshProfile();
      window.history.replaceState({}, '', '/dashboard');
    }

    // Auto-fulfill saved request if coming back from OAuth redirect
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

  // Permissions & Entitlements
  const isMonthly = profile?.subscription_status === 'monthly';
  const hasWeeklyUnlock =
    profile?.weekly_unlocked_until && new Date(profile.weekly_unlocked_until) > new Date();
  const hasFreeReadingLeft = !profile || !profile.has_used_free_reading;
  const canGenerate = !user || hasFreeReadingLeft || isMonthly || hasWeeklyUnlock;

  const getAllowanceText = () => {
    if (!user) return '1 Free Initial Reading Available';
    if (hasFreeReadingLeft) return '1 Free Initial Reading Available';
    if (isMonthly) return 'Unlimited Weekly Readings Active';
    if (hasWeeklyUnlock) return '1 Reading Available This Week';
    return '0 Readings Left This Week';
  };

  const handleRequestClick = async () => {
    if (!selectedSign) {
      setGenError('Please select your zodiac sign first.');
      return;
    }
    setGenError('');

    // If user is not logged in, prompt Auth options
    if (!user) {
      // Save choices to localStorage in case they use Google OAuth redirect
      localStorage.setItem(PENDING_REQUEST_KEY, JSON.stringify({
        sign: selectedSign,
        focus: personalFocus,
      }));
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
    // Save state before redirecting
    localStorage.setItem(PENDING_REQUEST_KEY, JSON.stringify({
      sign: selectedSign,
      focus: personalFocus,
    }));
    const { error } = await signInWithGoogle();
    if (error) {
      setAuthStatus('error');
      setGenError(error);
    }
  };

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setAuthStatus('sending');
    localStorage.setItem(PENDING_REQUEST_KEY, JSON.stringify({
      sign: selectedSign,
      focus: personalFocus,
    }));
    const { error } = await signInWithMagicLink(email);
    if (error) {
      setAuthStatus('error');
      setGenError(error);
    } else {
      setAuthStatus('sent');
    }
  };

  return (
    <div className="relative min-h-screen">
      <StarryBackground />

      {/* Header */}
      <header className="relative z-10 pt-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={onNavigateHome} className="flex items-center gap-2">
            <Telescope className="w-5 h-5 text-amber-300" />
            <span className="text-lg font-serif text-white">Astrologlimpse</span>
          </button>
          {user ? (
            <span className="text-sm text-slate-400">{profile?.email || user.email}</span>
          ) : (
            <button
              onClick={() => setShowAuthGate(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-300" />
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {/* Welcome */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-sm text-slate-300 tracking-wide">Your Reading Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-light text-white mb-3">
            Welcome to your reading hub
          </h1>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-300/10 border border-amber-300/20 text-amber-200 mt-1 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>{getAllowanceText()}</span>
          </div>

          <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base">
            {hasFreeReadingLeft
              ? 'Your free 10-point cosmic reading is ready. Select your sign and request your reading.'
              : canGenerate
                ? 'Select your sign and set your intentions for this week’s reading request.'
                : 'You have used your available readings for this week. Subscribe to request more readings.'}
          </p>
        </div>

        {/* Confirmation State or Form Card */}
        {requestSubmitted ? (
          <div className="rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-300/10 to-white/[0.02] backdrop-blur-xl p-8 mb-12 text-center animate-[fadeInUp_0.4s_ease-out]">
            <div className="w-16 h-16 rounded-2xl bg-amber-300/20 border border-amber-300/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-amber-300" />
            </div>
            <h3 className="text-2xl font-serif text-white mb-2">Reading Request Received!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
              Your request for <strong className="text-amber-200">{selectedSign}</strong> has been logged. We are preparing your reading and will deliver it directly to <strong className="text-white">{profile?.email || user?.email}</strong>.
            </p>
            <button
              onClick={() => {
                setRequestSubmitted(false);
                setPersonalFocus('');
              }}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-all"
            >
              Request Another Reading
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl p-6 sm:p-8 mb-12">
            {/* Sign selector */}
            <div className="mb-6">
              <label className="block text-sm text-slate-400 mb-2">Select your zodiac sign</label>
              <div className="relative">
                <button
                  onClick={() => setSignDropdownOpen(!signDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                  <span className="flex items-center gap-3">
                    {selectedSign ? (
                      <>
                        <span className="text-2xl" style={{ color: zodiacSigns.find((s) => s.name === selectedSign)?.color }}>
                          {zodiacSigns.find((s) => s.name === selectedSign)?.glyph}
                        </span>
                        <span>{selectedSign}</span>
                      </>
                    ) : (
                      <span className="text-slate-500">Choose your sign...</span>
                    )}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${signDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {signDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#111936] border border-white/10 shadow-xl z-20 max-h-64 overflow-y-auto">
                    {zodiacSigns.map((sign) => (
                      <button
                        key={sign.name}
                        onClick={() => {
                          setSelectedSign(sign.name);
                          setSignDropdownOpen(false);
                          setGenError('');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        <span className="text-xl" style={{ color: sign.color }}>{sign.glyph}</span>
                        <span className="text-sm text-white">{sign.name}</span>
                        <span className="text-xs text-slate-500 ml-auto">{sign.dates}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Personal Focus / Intention message box */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
                <HeartHandshake className="w-4 h-4 text-amber-300" />
                <span>Personal Focus & Preoccupations <span className="text-slate-500 text-xs">(Optional)</span></span>
              </label>
              <textarea
                value={personalFocus}
                onChange={(e) => setPersonalFocus(e.target.value)}
                rows={3}
                placeholder="Share what is currently on your mind: career choices, relationship questions, fears, or hopes for this period..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-300/40 focus:bg-white/10 transition-all resize-none"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Sharing your thoughts helps attune the reading to your personal path.
              </p>
            </div>

            {/* If Auth Gate triggered for unauthenticated user */}
            {showAuthGate && !user ? (
              <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-[fadeIn_0.3s_ease-out]">
                <p className="text-center text-sm text-amber-200 font-medium">
                  Sign in to deliver your {selectedSign || ''} reading:
                </p>

                {authStatus === 'sent' ? (
                  <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-green-500/10 border border-green-400/20">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-green-300 text-sm font-medium">Magic link sent!</p>
                      <p className="text-slate-400 text-xs">Check your inbox to finalize your request.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={authStatus === 'sending'}
                      className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all disabled:opacity-50"
                    >
                      <GoogleIcon />
                      Continue with Google
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
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-300/40 focus:bg-white/10 transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={authStatus === 'sending'}
                        className="px-4 py-2.5 rounded-xl bg-amber-400 text-[#0a0e27] text-sm font-semibold hover:bg-amber-300 transition-all disabled:opacity-50 whitespace-nowrap"
                      >
                        {authStatus === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            ) : (
              /* Standard Submit Button */
              <button
                onClick={handleRequestClick}
                disabled={submitting || !selectedSign}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#0a0e27] font-semibold hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {hasFreeReadingLeft
                      ? 'Request My Free Cosmic Reading'
                      : 'Request My Cosmic Reading'}
                  </>
                )}
              </button>
            )}

            {genError && (
              <p className="mt-3 text-red-400 text-xs text-center">{genError}</p>
            )}

            {user && !canGenerate && (
              <p className="mt-3 text-center text-xs text-slate-500">
                You have used your free reading. A subscription or weekly unlock is required for additional reading requests.
              </p>
            )}
          </div>
        )}

        {/* Zodiac Explorer */}
        <div className="mb-12 border-t border-white/10 pt-10">
          <ZodiacExplorer />
        </div>

        {/* Account settings with paywall modal trigger (Only when logged in) */}
        {user && <AccountSettings onOpenPaywall={() => setShowPaywall(true)} />}
      </main>

      {/* Paywall */}
      <PaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
