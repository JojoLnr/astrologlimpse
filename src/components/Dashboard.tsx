import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { zodiacSigns } from '@/lib/zodiac';
import { ReadingDisplay } from '@/components/ReadingDisplay';
import { AccountSettings } from '@/components/AccountSettings';
import { PaywallModal } from '@/components/PaywallModal';
import { StarryBackground } from '@/components/StarryBackground';
import { Sparkles, Loader2, ChevronDown, Telescope, Mail, Check } from 'lucide-react';

interface DashboardProps {
  onNavigateHome: () => void;
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function SignUpPrompt({ onBack }: { onBack: () => void }) {
  const { signInWithMagicLink, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    setErrorMsg('');
    const { error } = await signInWithMagicLink(email);
    if (error) {
      setStatus('error');
      setErrorMsg(error);
    } else {
      setStatus('sent');
    }
  };

  const handleGoogle = async () => {
    setStatus('sending');
    const { error } = await signInWithGoogle();
    if (error) {
      setStatus('error');
      setErrorMsg(error);
    }
  };

  return (
    <div className="relative min-h-screen">
      <StarryBackground />

      {/* Header */}
      <header className="relative z-10 pt-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2">
            <Telescope className="w-5 h-5 text-amber-300" />
            <span className="text-lg font-serif text-white">Astrologlimpse</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-sm text-slate-300 tracking-wide">Your Cosmic Dashboard</span>
          </div>
          <h1 className="text-3xl font-serif font-light text-white mb-4">
            Sign up to unlock your reading
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Your free complete 10-point cosmic package will be available right after you sign up or log in.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl p-6 sm:p-8">
          {status === 'sent' ? (
            <div className="flex items-center gap-3 py-4 px-4 rounded-xl bg-green-500/10 border border-green-400/20">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-green-300 text-sm font-medium">Check your inbox</p>
                <p className="text-slate-400 text-xs">We sent a magic link to {email}. Click it to enter your dashboard.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <form onSubmit={handleMagicLink} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={status === 'sending'}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-300/40 focus:bg-white/10 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#0a0e27] text-sm font-semibold hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                >
                  {status === 'sending' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Continue'
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-slate-500">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button
                onClick={handleGoogle}
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              {status === 'error' && (
                <p className="text-red-400 text-xs text-center">{errorMsg}</p>
              )}

              <p className="text-center text-xs text-slate-500">
                No password needed. We'll send a secure link to your email.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onBack}
          className="mt-6 mx-auto block text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          Back to home
        </button>
      </main>
    </div>
  );
}

export function Dashboard({ onNavigateHome }: DashboardProps) {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [showReading, setShowReading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [signDropdownOpen, setSignDropdownOpen] = useState(false);
  const [genError, setGenError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      refreshProfile();
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [refreshProfile]);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <StarryBackground />
        <Loader2 className="w-8 h-8 animate-spin text-amber-300" />
      </div>
    );
  }

  if (!user || !profile) {
    return <SignUpPrompt onBack={onNavigateHome} />;
  }

  const isMonthly = profile.subscription_status === 'monthly';
  const hasWeeklyUnlock =
    profile.weekly_unlocked_until && new Date(profile.weekly_unlocked_until) > new Date();
  const canGenerate = !profile.has_used_free_reading || isMonthly || hasWeeklyUnlock;

  const handleGenerate = async () => {
    if (!selectedSign) {
      setGenError('Please select your zodiac sign first.');
      return;
    }
    setGenError('');

    if (!canGenerate) {
      setShowPaywall(true);
      return;
    }

    setGenerating(true);

    if (!profile.has_used_free_reading) {
      const { error } = await supabase
        .from('profiles')
        .update({ has_used_free_reading: true })
        .eq('id', user.id);

      if (error) {
        setGenError('Something went wrong. Please try again.');
        setGenerating(false);
        return;
      }
      await refreshProfile();
    }

    setTimeout(() => {
      setGenerating(false);
      setShowReading(true);
    }, 1500);
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
          <span className="text-sm text-slate-400">{profile.email}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {/* Welcome */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-sm text-slate-300 tracking-wide">Your Cosmic Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-light text-white mb-3">
            Welcome to your reading hub
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base">
            {profile.has_used_free_reading
              ? 'Continue your cosmic journey. Select your sign and generate a new reading.'
              : 'Your free complete 10-point cosmic reading is ready. Select your sign below to begin.'}
          </p>
        </div>

        {/* Generate card */}
        {!showReading && (
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl p-6 sm:p-8 mb-8">
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

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !selectedSign}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#0a0e27] font-semibold hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Channeling your reading...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {profile.has_used_free_reading
                    ? canGenerate
                      ? 'Generate My Reading'
                      : 'Generate & Send My Free Complete Package'
                    : 'Generate & Send My Free Complete Package'}
                </>
              )}
            </button>

            {genError && (
              <p className="mt-3 text-red-400 text-xs text-center">{genError}</p>
            )}

            {!canGenerate && (
              <p className="mt-3 text-center text-xs text-slate-500">
                Your free reading has been used. A subscription or weekly unlock is required to generate more readings.
              </p>
            )}
          </div>
        )}

        {/* Reading display */}
        {showReading && selectedSign && (
          <div className="mb-8">
            <ReadingDisplay signName={selectedSign} />
            <button
              onClick={() => setShowReading(false)}
              className="mt-6 mx-auto block px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-all"
            >
              Generate Another Reading
            </button>
          </div>
        )}

        {/* Account settings */}
        <AccountSettings />
      </main>

      {/* Paywall */}
      <PaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
