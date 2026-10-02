import { useEffect, useState } from 'react';
import { StarryBackground } from '@/components/StarryBackground';
import { ZodiacExplorer } from '@/components/ZodiacExplorer';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles, Compass, Star, X, Check, Zap,
  Shield, Users, Cpu, ArrowRight, PenLine, Telescope, ScrollText,
} from 'lucide-react';

interface HomeProps {
  onNavigateDashboard?: () => void;
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

const howItWorks = [
  {
    icon: PenLine,
    step: '01',
    title: 'Share What Is On Your Mind',
    description: 'Tell us what you need guidance about — a career crossroads, a relationship question, or a deeper challenge you are navigating.',
  },
  {
    icon: Telescope,
    step: '02',
    title: 'We Calculate Your Natal Chart',
    description: 'Powered by the Swiss Ephemeris, we compute exact planetary degrees, house positions, and live transits unique to your sign.',
  },
  {
    icon: ScrollText,
    step: '03',
    title: 'Receive Your 10-Point Reading',
    description: 'Get specific dates, timing windows, and actionable insights — not vague personality descriptions. Delivered straight to your inbox.',
  },
];

const testimonials = [
  {
    name: 'Sarah',
    location: 'Chicago',
    text: 'I finally understood why my career feels stalled. The transit breakdown showed me exactly when Mars leaves my 10th house. Game changer.',
    sign: 'Capricorn',
  },
  {
    name: 'Marcus',
    location: 'Brooklyn',
    text: 'The Chiron reading nailed a pattern I have been circling for 15 years. Seeing the exact degree and transit window gave me something to actually work with.',
    sign: 'Scorpio',
  },
  {
    name: 'Priya',
    location: 'Austin',
    text: 'I have tried three other astrology apps. This is the only one that gave me specific dates instead of vague personality descriptions. The 7th house alert was eerily accurate.',
    sign: 'Libra',
  },
];

const comparisonRows = [
  { feature: 'Data Basis', generic: 'Sun Sign Only (1/12th of people)', ours: 'Exact Natal Chart (Unique to you)' },
  { feature: 'Forecast Timing', generic: 'Pre-written monthly content', ours: 'Live, Real-Time Planetary Degrees' },
  { feature: 'Astrological Depth', generic: 'Planets only', ours: 'Chiron, Lilith, Lunar Nodes & Asteroids' },
  { feature: 'Actionable Insight', generic: 'Vague personality traits', ours: 'Specific timing windows for action' },
];

const trustBadges = [
  { icon: Cpu, label: 'Powered by Swiss Ephemeris' },
  { icon: Users, label: '10,000+ Charts Calculated' },
  { icon: Shield, label: 'End-to-End Encryption' },
];

export function Home({ onNavigateDashboard }: HomeProps) {
  const { signInWithGoogle } = useAuth();
  const [authStatus, setAuthStatus] = useState<'idle' | 'sending'>('idle');
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowStickyCta(window.scrollY > 360);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoogle = async () => {
    setAuthStatus('sending');
    await signInWithGoogle();
  };

  return (
    <div className="relative min-h-screen">
      <StarryBackground />

      {/* Top nav */}
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-6 pt-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-champagne-400/10 border border-champagne-400/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-champagne-300" />
          </div>
          <span className="text-base font-serif text-champagne-50 tracking-wide">Astrologlimpse</span>
        </div>
        <button
          onClick={onNavigateDashboard}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-slate-300 text-sm hover:bg-white/[0.07] hover:text-champagne-100 hover:border-champagne-400/25 transition-all duration-300"
        >
          <Compass className="w-4 h-4 text-champagne-400" />
          Dashboard
        </button>
      </nav>

      {/* ===== HERO ===== */}
      <header className="relative z-10 pt-16 sm:pt-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-400/[0.08] border border-champagne-400/20 backdrop-blur-sm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-[glow_3s_ease-in-out_infinite]" />
            <span className="text-xs text-champagne-200 tracking-[0.15em] uppercase">Astrologlimpse</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-champagne-50 mb-5 leading-[1.12] tracking-tight">
            Not a Generic Horoscope.
            <span className="block mt-2 bg-gradient-to-r from-champagne-200 via-champagne-300 to-champagne-200 bg-clip-text text-transparent">
              A Real-Time Cosmic Reading.
            </span>
          </h1>

          <p className="text-slate-300 max-w-xl mx-auto text-base sm:text-lg mb-8 leading-relaxed font-light">
            Share what you need guidance about. We calculate your exact natal chart
            and deliver 10 specific, actionable insights with real dates and planetary degrees.
          </p>

          {/* CTA buttons */}
          <div className="max-w-md mx-auto">
            <button
              onClick={onNavigateDashboard}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-champagne-300 to-champagne-400 text-midnight-950 text-sm font-semibold hover:from-champagne-200 hover:to-champagne-300 transition-all duration-300 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              Start My Free Cosmic Reading
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-xs text-slate-500">or</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            <button
              onClick={handleGoogle}
              disabled={authStatus === 'sending'}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-champagne-50 text-sm font-semibold hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 disabled:opacity-50"
            >
              {authStatus === 'sending' ? (
                <span className="animate-pulse">Redirecting...</span>
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <badge.icon className="w-3.5 h-3.5 text-champagne-400/50" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ===== HOW IT WORKS — 3 STEP FLOW (unique to home page) ===== */}
      <section className="relative z-10 pt-24 sm:pt-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-400/[0.08] border border-champagne-400/20 backdrop-blur-sm mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-[glow_3s_ease-in-out_infinite]" />
              <span className="text-xs text-champagne-200 tracking-[0.15em] uppercase">How It Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-champagne-50 mb-3 tracking-tight">
              Three Steps to Your Reading
            </h2>
            <p className="text-slate-300 max-w-lg mx-auto text-sm sm:text-base font-serif font-light italic">
              From question to cosmic insight in minutes.
            </p>
          </div>

          {/* Steps with connecting line */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-champagne-400/15 to-transparent" />

            {howItWorks.map((step, i) => (
              <div key={i} className="relative">
                <div className="rounded-2xl border border-white/[0.1] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 text-center hover:border-champagne-400/20 transition-all duration-300">
                  {/* Icon circle */}
                  <div className="relative mx-auto mb-5 w-16 h-16 rounded-full bg-champagne-400/[0.08] border border-champagne-400/20 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-champagne-300" />
                    <span className="absolute -top-2 -right-2 text-[10px] font-mono text-champagne-400/60">{step.step}</span>
                  </div>
                  <h3 className="text-base font-serif text-champagne-50 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">{step.description}</p>
                </div>
                {/* Arrow between steps on mobile */}
                {i < howItWorks.length - 1 && (
                  <div className="flex justify-center my-3 md:hidden">
                    <ArrowRight className="w-5 h-5 text-champagne-400/30 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button
              onClick={onNavigateDashboard}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-champagne-300 to-champagne-400 text-midnight-950 text-sm font-semibold hover:from-champagne-200 hover:to-champagne-300 transition-all duration-300 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="relative z-10 pt-24 sm:pt-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-400/[0.08] border border-champagne-400/20 backdrop-blur-sm mb-4">
              <Star className="w-4 h-4 text-champagne-300" />
              <span className="text-xs text-champagne-200 tracking-[0.15em] uppercase">Social Proof</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-champagne-50 mb-3 tracking-tight">
              Real People. Specific Outcomes.
            </h2>
          </div>

          {/* Trust badges bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-champagne-400/20 bg-gradient-to-br from-champagne-400/[0.06] to-transparent"
              >
                <badge.icon className="w-4 h-4 text-champagne-400/70" />
                <span className="text-xs text-champagne-200/80 font-medium">{badge.label}</span>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 hover:border-white/[0.12] transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-champagne-300/70" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed mb-4">
                  {t.text}
                </p>
                <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                  <div className="w-8 h-8 rounded-full bg-champagne-400/10 border border-champagne-400/20 flex items-center justify-center">
                    <span className="text-xs font-serif text-champagne-300">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm text-champagne-50 font-medium">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.location} · {t.sign}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPARISON TABLE ===== */}
      <section className="relative z-10 pt-24 sm:pt-32 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-400/[0.08] border border-champagne-400/20 backdrop-blur-sm mb-4">
              <Zap className="w-4 h-4 text-champagne-300" />
              <span className="text-xs text-champagne-200 tracking-[0.15em] uppercase">Why We Are Different</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-champagne-50 mb-3 tracking-tight">
              The Ruthless Comparison
            </h2>
          </div>

          <div className="rounded-2xl border border-white/[0.1] bg-gradient-to-br from-midnight-800/70 to-midnight-900/70 backdrop-blur-xl overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-[1.2fr_1fr_1fr] sm:grid-cols-[1.5fr_1fr_1fr] border-b border-white/[0.08]">
              <div className="p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Feature</p>
              </div>
              <div className="p-4 sm:p-5 border-l border-white/[0.08]">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Generic Apps</p>
              </div>
              <div className="p-4 sm:p-5 border-l border-white/[0.08] bg-champagne-400/[0.06]">
                <p className="text-xs uppercase tracking-[0.15em] text-champagne-300">Astrologlimpse</p>
              </div>
            </div>

            {/* Data rows */}
            {comparisonRows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1.2fr_1fr_1fr] sm:grid-cols-[1.5fr_1fr_1fr] ${i < comparisonRows.length - 1 ? 'border-b border-white/[0.06]' : ''}`}
              >
                <div className="p-4 sm:p-5">
                  <p className="text-sm text-champagne-50 font-medium">{row.feature}</p>
                </div>
                <div className="p-4 sm:p-5 border-l border-white/[0.06] flex items-start gap-2">
                  <X className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{row.generic}</p>
                </div>
                <div className="p-4 sm:p-5 border-l border-white/[0.06] bg-champagne-400/[0.03] flex items-start gap-2">
                  <Check className="w-4 h-4 text-champagne-300 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-champagne-100 leading-relaxed">{row.ours}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA below table */}
          <div className="text-center mt-10">
            <button
              onClick={onNavigateDashboard}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-champagne-300 to-champagne-400 text-midnight-950 text-sm font-semibold hover:from-champagne-200 hover:to-champagne-300 transition-all duration-300 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              Start My Free Cosmic Reading
            </button>
            <p className="mt-4 text-xs text-slate-400">
              No credit card required. Free biweekly horoscope with every sign-up.
            </p>
          </div>
        </div>
      </section>

      {/* ===== ZODIAC EXPLORER ===== */}
      <section className="relative z-10 px-4 pb-32">
        <ZodiacExplorer />
      </section>
      {showStickyCta && (
        <button
          onClick={onNavigateDashboard}
          className="fixed inset-x-4 bottom-5 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border-2 border-champagne-200/70 bg-gradient-to-r from-champagne-200 via-champagne-300 to-champagne-400 text-midnight-950 font-semibold text-sm shadow-[0_12px_40px_rgba(196,163,116,0.35)] hover:from-champagne-100 hover:to-champagne-300 transition-all duration-300 animate-[fadeInUp_0.3s_ease-out]"
        >
          <Sparkles className="w-4 h-4" />
          Generate My Cosmic Reading
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
