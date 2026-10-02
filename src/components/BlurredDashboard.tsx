import { Sparkles, Lock, AlertCircle, TrendingUp, Moon, Heart, Zap } from 'lucide-react';

export function BlurredDashboard() {
  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-midnight-800/80 to-midnight-900/80 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/30" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Sparkles className="w-3 h-3 text-champagne-400/50" />
          <span className="font-serif text-champagne-200/60">Your Cosmic Dashboard</span>
        </div>
        <div className="w-12" />
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* Readable header: Natal Sun/Moon/Rising */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Natal Sun', value: 'Leo 14°32\'', color: '#e9c46a' },
            { label: 'Natal Moon', value: 'Pisces 22°07\'', color: '#778da9' },
            { label: 'Rising Sign', value: 'Virgo 03°51\'', color: '#8ab17d' },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] text-slate-500 mb-1">{item.label}</p>
              <p className="text-sm font-serif" style={{ color: item.color }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Readable header: Critical 7th House Transit Alert */}
        <div className="rounded-lg border border-amber-400/20 bg-amber-400/[0.04] p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-amber-400/70" />
            <p className="text-xs font-medium text-amber-200/80 tracking-wide uppercase">Critical 7th House Transit Alert</p>
          </div>
          {/* Blurred content */}
          <div className="relative mt-2">
            <p className="text-sm text-slate-300 blur-[6px] select-none">
              Saturn enters your 7th house of partnerships on March 14, 2026, marking a 2.5-year cycle of deep commitment and structural relationship changes. Mars conjuncts your Descendant degree at 18° Virgo on...
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-midnight-900/80 border border-champagne-400/20 backdrop-blur-sm">
                <Lock className="w-3 h-3 text-champagne-300" />
                <span className="text-xs text-champagne-200/80">Sign up to reveal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Readable header: Current Chiron Phase */}
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-rose-400/60" />
            <p className="text-xs font-medium text-rose-200/70 tracking-wide uppercase">Current Chiron Phase</p>
          </div>
          <div className="relative mt-2">
            <p className="text-sm text-slate-300 blur-[6px] select-none">
              Chiron at 23° Aries is trining your natal Sun, activating a once-in-50-years healing window around core identity wounds. This transit peaks between April 2-18, 2026, when you can finally release the inherited pattern of...
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-midnight-900/80 border border-champagne-400/20 backdrop-blur-sm">
                <Lock className="w-3 h-3 text-champagne-300" />
                <span className="text-xs text-champagne-200/80">Sign up to reveal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Readable header: Career / 10th House */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-400/60" />
              <p className="text-xs font-medium text-emerald-200/70 tracking-wide uppercase">10th House Career</p>
            </div>
            <div className="relative mt-2">
              <p className="text-sm text-slate-300 blur-[6px] select-none leading-relaxed">
                Mars leaves your 10th house on Feb 28, ending a 6-month career pressure cycle. Jupiter enters on May 20, opening a 12-month window for...
              </p>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-midnight-900/80 border border-champagne-400/20 backdrop-blur-sm">
                  <Lock className="w-3 h-3 text-champagne-300" />
                  <span className="text-[10px] text-champagne-200/80">Reveal</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-1">
              <Moon className="w-4 h-4 text-blue-400/60" />
              <p className="text-xs font-medium text-blue-200/70 tracking-wide uppercase">Lunar Phase Impact</p>
            </div>
            <div className="relative mt-2">
              <p className="text-sm text-slate-300 blur-[6px] select-none leading-relaxed">
                Waning Gibbous at 68% illumination. Moon in Scorpio opposes your natal Venus, creating an emotional intensity window from 3-7 PM today. Best time for...
              </p>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-midnight-900/80 border border-champagne-400/20 backdrop-blur-sm">
                  <Lock className="w-3 h-3 text-champagne-300" />
                  <span className="text-[10px] text-champagne-200/80">Reveal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Zap className="w-3 h-3 text-champagne-400/40" />
            <span>Updated every hour with live planetary degrees</span>
          </div>
          <div className="text-xs text-slate-600 font-mono">
            14.32° / 22.07° / 03.51°
          </div>
        </div>
      </div>
    </div>
  );
}
