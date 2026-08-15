import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ZODIAC_SIGNS, type ZodiacSign } from './ZodiacSelector';
import { ContentBlurGate } from './ContentBlurGate';
import headingData from '@/data/sections/sabian.json';

const signGlyphs = headingData.signGlyphs;

const sabianSymbols = headingData.sabianSymbols;

export default function SabianSymbolsOracle({ isBlurred = false }: { isBlurred?: boolean }) {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const symbols = selectedSign ? sabianSymbols[selectedSign] : [];

  const reveal = (i: number) => {
    setRevealed((prev) => { const n = new Set(prev); n.add(i); return n; });
  };

  const revealAll = () => setRevealed(new Set(symbols.map((_, i) => i)));

  const reset = () => {
    setSelectedSign(null);
    setRevealed(new Set());
  };

  return (
    <section id="sabian" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number={headingData.heading.number}
        eyebrow={headingData.heading.eyebrow}
        title={headingData.heading.title}
        subtitle={headingData.heading.subtitle}
      />

      <ContentBlurGate isBlurred={isBlurred}>
        {!selectedSign ? (
          <div className="mt-10">
            <p className="font-display text-[10px] uppercase tracking-[0.2em] prose-muted">
              Select a Zodiac Sign
            </p>
            <div className="mt-4 grid grid-cols-6 gap-1.5 sm:gap-2 md:max-w-2xl">
              {ZODIAC_SIGNS.map((sign) => (
                <button
                  key={sign}
                  onClick={() => { setSelectedSign(sign); setRevealed(new Set()); }}
                  className="group flex flex-col items-center gap-1 rounded-lg py-3 transition-all hover:bg-navy-700/40"
                >
                  <span
                    className="font-display text-xl prose-title"
                    style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                  >
                    {signGlyphs[sign]}
                  </span>
                  <span className="font-display text-[8px] uppercase tracking-wider prose-muted">
                    {sign}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="font-display text-3xl prose-title"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  {signGlyphs[selectedSign]}
                </span>
                <div>
                  <p className="font-display text-[10px] uppercase tracking-[0.2em] prose-muted">Sabian Symbols</p>
                  <h3 className="font-display text-2xl font-semibold prose-title">{selectedSign}</h3>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={revealAll}
                  className="inline-flex items-center gap-1.5 font-display text-[10px] uppercase tracking-wider text-gold-400/80 hover:text-gold-300"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Reveal All
                </button>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 font-display text-[10px] uppercase tracking-wider prose-muted hover:text-gold-300"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  New Sign
                </button>
              </div>
            </div>
            <hr className="gold-rule mt-4" />

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {symbols.map((s, i) => {
                const isRevealed = revealed.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => reveal(i)}
                    className="group relative min-h-[280px] rounded-lg border border-gold-400/20 bg-navy-800 p-6 text-left transition-colors hover:border-gold-400/40"
                  >
                    {!isRevealed ? (
                      <div className="flex h-full min-h-[230px] flex-col items-center justify-center gap-3">
                        <span className="font-ornament text-4xl text-gold-400/20 transition-transform duration-300 group-hover:scale-110">✦</span>
                        <p className="font-display text-[10px] uppercase tracking-[0.2em] prose-muted">
                          {s.degree}° — Tap to Reveal
                        </p>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col">
                        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-gold-400">
                          {s.degree}° {selectedSign}
                        </p>
                        <p className="mt-3 font-serif text-lg italic font-medium leading-snug prose-title">
                          "{s.symbol}"
                        </p>
                        <p className="mt-auto pt-4 font-serif text-sm leading-relaxed prose-body">
                          {s.interpretation}
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </ContentBlurGate>

      <div className="mt-14"><OrnamentDivider /></div>
    </section>
  );
}