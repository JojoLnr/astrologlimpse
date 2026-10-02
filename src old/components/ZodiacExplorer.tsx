import { useState } from 'react';
import { zodiacSigns, type ZodiacSign } from '@/lib/zodiac';
import { Sparkles } from 'lucide-react';

export function ZodiacExplorer() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);

  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-sm text-slate-300 tracking-wide">Explore the Zodiac</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-white mb-3">
          Twelve Signs, Infinite Wisdom
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Click any sign to reveal its element, ruling planet, strengths, and deep cosmic significance.
        </p>
      </div>

      {/* Zodiac wheel selector */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 mb-8">
        {zodiacSigns.map((sign) => {
          const isActive = selectedSign?.name === sign.name;
          return (
            <button
              key={sign.name}
              onClick={() => setSelectedSign(sign)}
              className={`group relative aspect-square rounded-2xl border transition-all duration-500 ease-out flex flex-col items-center justify-center gap-1 ${
                isActive
                  ? 'border-amber-300/60 bg-white/10 scale-105 shadow-[0_0_30px_rgba(251,191,36,0.15)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07] hover:scale-105'
              }`}
              style={isActive ? { boxShadow: `0 0 30px ${sign.color}33` } : undefined}
            >
              <span
                className={`text-2xl sm:text-3xl transition-colors duration-300 ${isActive ? '' : 'text-slate-300 group-hover:text-white'}`}
                style={isActive ? { color: sign.color } : undefined}
              >
                {sign.glyph}
              </span>
              <span className={`text-[10px] sm:text-xs font-medium tracking-wide transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                {sign.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sign details panel */}
      {selectedSign && (
        <div
          key={selectedSign.name}
          className="animate-[fadeInUp_0.5s_ease-out] rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl p-6 sm:p-8 overflow-hidden relative"
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20"
            style={{ background: selectedSign.color }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border border-white/10"
                style={{ background: `${selectedSign.color}22`, color: selectedSign.color }}
              >
                {selectedSign.glyph}
              </div>
              <div>
                <h3 className="text-2xl font-serif text-white">{selectedSign.name}</h3>
                <p className="text-sm text-slate-400">{selectedSign.dates}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Element</p>
                <p className="text-lg text-white font-medium">{selectedSign.element}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Ruling Planet</p>
                <p className="text-lg text-white font-medium">{selectedSign.planet}</p>
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4 mb-6">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Strengths</p>
              <div className="flex flex-wrap gap-2">
                {selectedSign.strengths.map((strength) => (
                  <span
                    key={strength}
                    className="px-3 py-1 rounded-full text-sm border border-white/10 bg-white/5 text-slate-200"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Deep Significance</p>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                {selectedSign.significance}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
