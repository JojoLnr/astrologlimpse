import { useState } from 'react';
import { Flame, Mountain, Wind, Droplets, RotateCcw, Sparkles } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ZODIAC_SIGNS, type ZodiacSign } from './ZodiacSelector';
import { ContentBlurGate } from './ContentBlurGate';
import headingData from '@/data/sections/elemental-modality.json';

const signGlyphs = headingData.signGlyphs;
const fixedSignGlyphs = headingData.signGlyphs;
const signElements = headingData.signElements as Record<string, 'Fire' | 'Earth' | 'Air' | 'Water'>;
const signModalities = headingData.signModalities as Record<string, 'Cardinal' | 'Fixed' | 'Mutable'>;

const elementIconMap: Record<string, { icon: typeof Flame; color: string }> = {
  Fire: { icon: Flame, color: 'text-gold-400' },
  Earth: { icon: Mountain, color: 'text-moon-300' },
  Air: { icon: Wind, color: 'text-cream-200' },
  Water: { icon: Droplets, color: 'text-gold-300' },
};

const elementConfig: Record<string, { icon: typeof Flame; color: string; traits: string; shadow: string }> = Object.fromEntries(
  Object.entries(headingData.elementConfig).map(([key, val]) => [
    key,
    {
      ...val,
      icon: elementIconMap[key].icon,
      color: elementIconMap[key].color,
    },
  ]) as [string, { icon: typeof Flame; color: string; traits: string; shadow: string }][]
);

const modalityConfig = headingData.modalityConfig;

export default function ElementalModalityBreakdown({ isBlurred = false }: { isBlurred?: boolean }) {
  const [selected, setSelected] = useState<ZodiacSign | null>(null);

  const element = selected ? signElements[selected] : null;
  const modality = selected ? signModalities[selected] : null;

  const chartBalance = selected
    ? {
        Fire: ['Aries', 'Leo', 'Sagittarius'].includes(selected) ? 34 : 22,
        Earth: ['Taurus', 'Virgo', 'Capricorn'].includes(selected) ? 34 : 22,
        Air: ['Gemini', 'Libra', 'Aquarius'].includes(selected) ? 34 : 22,
        Water: ['Cancer', 'Scorpio', 'Pisces'].includes(selected) ? 34 : 22,
      }
    : null;

  const reset = () => setSelected(null);

  return (
    <section id="elemental-modality" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number={headingData.heading.number}
        eyebrow={headingData.heading.eyebrow}
        title={headingData.heading.title}
        subtitle={headingData.heading.subtitle}
      />

      <ContentBlurGate isBlurred={isBlurred}>
        {!selected ? (
          <div className="mt-10">
            <p className="font-display text-[10px] uppercase tracking-[0.2em] prose-muted">
              Select Your Sun Sign
            </p>
            <div className="mt-4 grid grid-cols-6 gap-1.5 sm:gap-2 md:max-w-2xl">
              {ZODIAC_SIGNS.map((sign) => (
                <button
                  key={sign}
                  onClick={() => setSelected(sign)}
                  className="group flex flex-col items-center gap-1 rounded-lg py-3 transition-all hover:bg-navy-700/40"
                >
                  <span
                    className="font-display text-xl prose-title"
                    style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                  >
                    {fixedSignGlyphs[sign]}
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
            {/* Sign header */}
            <div className="flex items-center gap-4">
              <span
                className="font-display text-4xl prose-title"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                {fixedSignGlyphs[selected]}
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold prose-title">{selected}</h3>
                <p className="font-display text-[10px] uppercase tracking-[0.2em] prose-muted">
                  {element} · {modality}
                </p>
              </div>
              <button
                onClick={reset}
                className="ml-auto inline-flex items-center gap-1.5 font-display text-[10px] uppercase tracking-wider prose-muted hover:text-gold-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                New Sign
              </button>
            </div>
            <hr className="gold-rule mt-4" />

            {/* Element breakdown */}
            {element && chartBalance && (
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Element */}
                <div className="rounded-lg border border-gold-400/20 bg-navy-800/30 p-6">
                  <div className="flex items-center gap-2.5">
                    {(() => {
                      const Icon = elementConfig[element].icon;
                      return <Icon className={`h-5 w-5 ${elementConfig[element].color}`} strokeWidth={1.4} />;
                    })()}
                    <h3 className="font-display text-sm font-semibold uppercase tracking-[0.15em] prose-title">
                      Element · {element}
                    </h3>
                  </div>
                  <p className="mt-3 font-serif text-base leading-relaxed prose-body">
                    {elementConfig[element].traits}
                  </p>
                  <p className="mt-2 font-serif text-sm italic prose-muted">
                    <span className="font-display not-italic text-[10px] uppercase tracking-wider text-gold-400">Shadow · </span>
                    {elementConfig[element].shadow}
                  </p>

                  {/* Balance bars */}
                  <div className="mt-5 space-y-2">
                    <p className="font-display text-[9px] uppercase tracking-wider prose-muted">Element Balance</p>
                    {(['Fire', 'Earth', 'Air', 'Water'] as const).map((el) => {
                      const Icon = elementConfig[el].icon;
                      return (
                        <div key={el} className="flex items-center gap-2">
                          <Icon className={`h-3.5 w-3.5 ${elementConfig[el].color}`} strokeWidth={1.5} />
                          <span className="font-display text-[10px] uppercase w-12 prose-muted">{el}</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-700/40">
                            <div
                              className={`h-full rounded-full ${el === element ? 'bg-gold-400' : 'bg-gold-400/30'} transition-all duration-700`}
                              style={{ width: `${chartBalance[el]}%` }}
                            />
                          </div>
                          <span className="font-display text-[10px] font-bold w-8 text-right prose-title">
                            {chartBalance[el]}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Modality */}
                {modality && (
                  <div className="rounded-lg border border-gold-400/20 bg-navy-800/30 p-6">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="h-5 w-5 text-gold-400" strokeWidth={1.4} />
                      <h3 className="font-display text-sm font-semibold uppercase tracking-[0.15em] prose-title">
                        Modality · {modality}
                      </h3>
                    </div>
                    <p className="mt-3 font-serif text-base leading-relaxed prose-body">
                      {modalityConfig[modality].description}
                    </p>
                    <p className="mt-3 font-serif text-sm italic prose-muted">
                      <span className="font-display not-italic text-[10px] uppercase tracking-wider text-gold-400">Strength · </span>
                      {modalityConfig[modality].strength}
                    </p>
                    <p className="mt-2 font-serif text-sm italic prose-muted">
                      <span className="font-display not-italic text-[10px] uppercase tracking-wider text-gold-400">Challenge · </span>
                      {modalityConfig[modality].challenge}
                    </p>

                    {/* Modality distribution */}
                    <div className="mt-5 space-y-2">
                      <p className="font-display text-[9px] uppercase tracking-wider prose-muted">Modality Distribution</p>
                      {(['Cardinal', 'Fixed', 'Mutable'] as const).map((mod) => (
                        <div key={mod} className="flex items-center gap-2">
                          <span className="font-display text-[10px] uppercase w-14 prose-muted">{mod}</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-700/40">
                            <div
                              className={`h-full rounded-full ${mod === modality ? 'bg-gold-400' : 'bg-gold-400/20'} transition-all duration-700`}
                              style={{ width: mod === modality ? '50%' : '25%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </ContentBlurGate>

      <div className="mt-14"><OrnamentDivider /></div>
    </section>
  );
}