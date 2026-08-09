import { useState } from 'react';
import { Flame, Mountain, Wind, Droplets, RotateCcw, Sparkles } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ZODIAC_SIGNS, type ZodiacSign } from './ZodiacSelector';
import { ContentBlurGate } from './ContentBlurGate';

const signGlyphs: Record<string, string> = {
  Aries: '♈\uFE0E', Taurus: '♉\uFE0E', Gemini: '♊\uFE0E', Cancer: '♋\uFE0E',
  Leo: '♌\uFE0E', Virgo: '♍\uFE0E', Libra: '♎\uFE0E', Scorpio: '♏\uFE0E',
  Sagittarius: '♐\uFE0E', Capricorn: '♑\uFE0E', Aquarius: 'Aquarius\uFE0E' in {} ? '' : '♒\uFE0E', Pisces: '♓\uFE0E',
};

// Simplified map for glyph lookups
const fixedSignGlyphs: Record<string, string> = {
  Aries: '♈\uFE0E', Taurus: '♉\uFE0E', Gemini: '♊\uFE0E', Cancer: '♋\uFE0E',
  Leo: '♌\uFE0E', Virgo: '♍\uFE0E', Libra: '♎\uFE0E', Scorpio: '♏\uFE0E',
  Sagittarius: '♐\uFE0E', Capricorn: '♑\uFE0E', Aquarius: '♒\uFE0E', Pisces: '♓\uFE0E',
};

const signElements: Record<string, 'Fire' | 'Earth' | 'Air' | 'Water'> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
};

const signModalities: Record<string, 'Cardinal' | 'Fixed' | 'Mutable'> = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable',
};

const elementConfig: Record<string, { icon: typeof Flame; color: string; traits: string; shadow: string }> = {
  Fire: {
    icon: Flame, color: 'text-gold-400',
    traits: 'Passionate, spontaneous, courageous, inspirational',
    shadow: 'Can burn out, become aggressive, or act before thinking',
  },
  Earth: {
    icon: Mountain, color: 'text-moon-300',
    traits: 'Practical, patient, reliable, sensual',
    shadow: 'Can become rigid, materialistic, or stuck in routine',
  },
  Air: {
    icon: Wind, color: 'text-cream-200',
    traits: 'Intellectual, communicative, social, objective',
    shadow: 'Can be detached, over-analytical, or scattered',
  },
  Water: {
    icon: Droplets, color: 'text-gold-300',
    traits: 'Emotional, intuitive, empathetic, nurturing',
    shadow: 'Can be moody, overwhelmed, or boundary-less',
  },
};

const modalityConfig: Record<string, { description: string; strength: string; challenge: string }> = {
  Cardinal: {
    description: 'The initiators — they begin seasons and start things.',
    strength: 'Natural leaders who catalyze action and get things moving.',
    challenge: 'Can start more than they finish; may struggle with follow-through.',
  },
  Fixed: {
    description: 'The stabilizers — they sustain what was started and hold the center.',
    strength: 'Deeply persistent, loyal, and capable of sustained focus.',
    challenge: 'Can resist change, become stubborn, or hold on too long.',
  },
  Mutable: {
    description: 'The adapters — they transition and translate between seasons.',
    strength: 'Flexible, versatile, and able to see multiple perspectives.',
    challenge: "Can be scattered, indecisive, or lose themselves in others' agendas.",
  },
};

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
        number="14"
        eyebrow="Elemental & Modality Breakdown"
        title="The architecture of your psyche"
        subtitle="Every sign carries an element (Fire, Earth, Air, Water) and a modality (Cardinal, Fixed, Mutable). Together they form the psychological skeleton of your chart."
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