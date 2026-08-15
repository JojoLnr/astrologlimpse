import { useState } from 'react';
import { Sun, Moon, Sunrise, Sparkles, RotateCcw } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';
import { ZODIAC_SIGNS, type ZodiacSign } from './ZodiacSelector';
import headingData from '@/data/sections/birth-chart.json';

const signGlyphs = headingData.signGlyphs;
const signDates = headingData.signDates;
const signElements = headingData.signElements;
const signRulers = headingData.signRulers;
const signTraits = headingData.signTraits;

function sunSignFromDate(dateStr: string): ZodiacSign {
  const d = new Date(dateStr + 'T12:00:00');
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const cutoffs: [number, number, ZodiacSign][] = [
    [3, 21, 'Aries'], [4, 20, 'Taurus'], [5, 21, 'Gemini'], [6, 21, 'Cancer'],
    [7, 23, 'Leo'], [8, 23, 'Virgo'], [9, 23, 'Libra'], [10, 23, 'Scorpio'],
    [11, 22, 'Sagittarius'], [12, 22, 'Capricorn'], [1, 20, 'Aquarius'], [2, 19, 'Pisces'],
  ];
  for (const [cm, cd, sign] of cutoffs) {
    if ((m === cm && day >= cd) || (m === cm + 1 || (cm === 12 && m === 1))) {
      if (m === cm && day >= cd) return sign;
    }
  }
  // Simplified: check by month/day ranges
  if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return 'Aries';
  if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return 'Taurus';
  if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return 'Gemini';
  if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return 'Cancer';
  if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return 'Leo';
  if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return 'Virgo';
  if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return 'Libra';
  if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return 'Scorpio';
  if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return 'Sagittarius';
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return 'Capricorn';
  if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
}

function approximateRising(sunSign: ZodiacSign, hour: number): ZodiacSign {
  const signOrder = ZODIAC_SIGNS;
  const sunIdx = signOrder.indexOf(sunSign);
  // Rising sign advances ~1 sign per 2 hours from sunrise (~6am)
  const offset = Math.round((hour - 6) / 2);
  const risingIdx = ((sunIdx + offset) % 12 + 12) % 12;
  return signOrder[risingIdx];
}

function approximateMoon(sunSign: ZodiacSign, day: number): ZodiacSign {
  const signOrder = ZODIAC_SIGNS;
  const sunIdx = signOrder.indexOf(sunSign);
  // Moon moves ~13°/day, roughly 1 sign every 2.3 days
  const offset = Math.round(day / 2.3);
  const moonIdx = ((sunIdx + offset) % 12 + 12) % 12;
  return signOrder[moonIdx];
}

const transitAspects = headingData.transitAspects;

interface Placement {
  label: string;
  icon: typeof Sun;
  sign: ZodiacSign;
  glyph: string;
  element: string;
  ruler: string;
  trait: string;
}

export default function BirthChartCalculator({ isBlurred = false }: { isBlurred?: boolean }) {
  const [birthDate, setBirthDate] = useState('');
  const [birthHour, setBirthHour] = useState('12');
  const [computed, setComputed] = useState<{
    sun: Placement;
    moon: Placement;
    rising: Placement;
    transits: { aspect: string; reading: string }[];
  } | null>(null);

  const compute = () => {
    if (!birthDate) return;
    const sun = sunSignFromDate(birthDate);
    const day = new Date(birthDate + 'T12:00:00').getDate();
    const hour = parseInt(birthHour) || 12;
    const moon = approximateMoon(sun, day);
    const rising = approximateRising(sun, hour);

    const make = (label: string, icon: typeof Sun, sign: ZodiacSign): Placement => ({
      label, icon, sign,
      glyph: signGlyphs[sign],
      element: signElements[sign],
      ruler: signRulers[sign],
      trait: signTraits[sign],
    });

    setComputed({
      sun: make('Sun Sign', Sun, sun),
      moon: make('Moon Sign', Moon, moon),
      rising: make('Rising Sign', Sunrise, rising),
      transits: transitAspects[sun] ?? [],
    });
  };

  const reset = () => {
    setBirthDate('');
    setBirthHour('12');
    setComputed(null);
  };

  return (
    <section id="birth-chart" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number={headingData.heading.number}
        onParchment
        eyebrow={headingData.heading.eyebrow}
        title={headingData.heading.title}
        subtitle={headingData.heading.subtitle}
      />

      <ContentBlurGate isBlurred={isBlurred}>
        {!computed ? (
          <div className="mt-10 max-w-xl rounded-lg border border-gold-500/30 bg-cream-50/50 p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="font-display text-[10px] font-semibold uppercase tracking-[0.15em] text-navy-800">
                  Birth Date
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="mt-2 w-full rounded-md border border-gold-500/30 bg-white px-3 py-2.5 font-serif text-base text-navy-900 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30"
                />
              </div>
              <div>
                <label className="font-display text-[10px] font-semibold uppercase tracking-[0.15em] text-navy-800">
                  Birth Hour (approx.)
                </label>
                <select
                  value={birthHour}
                  onChange={(e) => setBirthHour(e.target.value)}
                  className="mt-2 w-full rounded-md border border-gold-500/30 bg-white px-3 py-2.5 font-serif text-base text-navy-900 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30"
                >
                  {Array.from({ length: 24 }, (_, h) => (
                    <option key={h} value={String(h)}>
                      {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={compute}
              disabled={!birthDate}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-navy-900 px-6 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300 transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles className="h-4 w-4" />
              Calculate My Chart
            </button>
            {!birthDate && (
              <p className="mt-3 font-serif text-sm italic prose-muted">
                Enter your birth date to begin.
              </p>
            )}
          </div>
        ) : (
          <div className="mt-10">
            {/* Three core placements */}
            <div className="grid gap-6 md:grid-cols-3">
              {[computed.sun, computed.moon, computed.rising].map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.label} className="rounded-lg border border-gold-500/25 bg-cream-50/40 p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/30">
                        <Icon className="h-5 w-5 text-gold-600" strokeWidth={1.4} />
                      </span>
                      <div>
                        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-gold-600">
                          {p.label}
                        </p>
                        <h3 className="font-display text-xl font-semibold text-navy-900">
                          {p.sign} <span className="text-gold-600">{p.glyph}</span>
                        </h3>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="font-display text-[10px] uppercase tracking-wider text-gold-600">
                        Element · {p.element} &nbsp;|&nbsp; Ruler · {p.ruler}
                      </p>
                      <p className="font-serif text-base leading-relaxed prose-body">{p.trait}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live transits against natal chart */}
            <div className="mt-10">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-gold-600" strokeWidth={1.5} />
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-navy-800">
                  Live Transits to Your Natal Chart
                </h3>
              </div>
              <hr className="gold-rule mt-3" />
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {computed.transits.map((t, i) => (
                  <div key={i} className="rounded-md border border-gold-500/15 bg-cream-50/30 p-4">
                    <p className="font-display text-[11px] font-semibold uppercase tracking-wide text-gold-600">
                      {t.aspect}
                    </p>
                    <p className="mt-2 font-serif text-base leading-relaxed prose-body">
                      {t.reading}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={reset}
              className="mt-8 inline-flex items-center gap-2 font-display text-[10px] font-medium uppercase tracking-wider text-gold-600/80 transition-colors hover:text-gold-500"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Recalculate
            </button>
          </div>
        )}
      </ContentBlurGate>

      <div className="mt-14"><OrnamentDivider onParchment /></div>
    </section>
  );
}