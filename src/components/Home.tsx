import { StarryBackground } from '@/components/StarryBackground';
import { ZodiacExplorer } from '@/components/ZodiacExplorer';
import { AuthCTA } from '@/components/AuthCTA';
import { Sparkles, Telescope, Compass } from 'lucide-react';

interface HomeProps {
  onNavigateDashboard?: () => void;
}

export function Home({ onNavigateDashboard }: HomeProps) {
  return (
    <div className="relative min-h-screen">
      <StarryBackground />

      {/* Top nav */}
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-6 pt-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Telescope className="w-5 h-5 text-amber-300" />
          <span className="text-lg font-serif text-white">Astrologlimpse</span>
        </div>
        <button
          onClick={onNavigateDashboard}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 hover:text-white transition-all"
        >
          <Compass className="w-4 h-4 text-amber-300" />
          Dashboard
        </button>
      </nav>

      {/* Hero */}
      <header className="relative z-10 pt-12 sm:pt-20 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-sm text-slate-300 tracking-wide">Astrologlimpse</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-light text-white mb-4 leading-tight">
          Glimpse Your
          <span className="block bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 bg-clip-text text-transparent">
            Cosmic Blueprint
          </span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-base sm:text-lg mb-8">
          Explore the wisdom of the zodiac. Discover the deep significance of your sign,
          then unlock your full 10-point cosmic reading.
        </p>
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
          <Sparkles className="w-4 h-4 text-amber-300/50" />
          <span>Free biweekly horoscope with every sign-up</span>
        </div>
      </header>

      {/* Zodiac Explorer */}
      <ZodiacExplorer />

      {/* Spacer for floating CTA */}
      <div className="h-64" />

      {/* Floating Auth CTA */}
      <AuthCTA />
    </div>
  );
}
