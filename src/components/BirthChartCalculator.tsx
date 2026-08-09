import { useState } from 'react';
import { Sun, Moon, Sunrise, Sparkles, RotateCcw } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';
import { ZODIAC_SIGNS, type ZodiacSign } from './ZodiacSelector';

const signGlyphs: Record<string, string> = {
  Aries: '♈\uFE0E', Taurus: '♉\uFE0E', Gemini: '♊\uFE0E', Cancer: '♋\uFE0E',
  Leo: '♌\uFE0E', Virgo: '♍\uFE0E', Libra: '♎\uFE0E', Scorpio: '♏\uFE0E',
  Sagittarius: '♐\uFE0E', Capricorn: '♑\uFE0E', Aquarius: '♒\uFE0E', Pisces: '♓\uFE0E',
};

const signDates: Record<string, string> = {
  Aries: 'Mar 21 – Apr 19', Taurus: 'Apr 20 – May 20', Gemini: 'May 21 – Jun 20', Cancer: 'Jun 21 – Jul 22',
  Leo: 'Jul 23 – Aug 22', Virgo: 'Aug 23 – Sep 22', Libra: 'Sep 23 – Oct 22', Scorpio: 'Oct 23 – Nov 21',
  Sagittarius: 'Nov 22 – Dec 21', Capricorn: 'Dec 22 – Jan 19', Aquarius: 'Jan 20 – Feb 18', Pisces: 'Feb 19 – Mar 20',
};

const signElements: Record<string, string> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
};

const signRulers: Record<string, string> = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars/Pluto',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn/Uranus', Pisces: 'Jupiter/Neptune',
};

const signTraits: Record<string, string> = {
  Aries: 'Bold, pioneering, and driven by impulse. You initiate before others have finished thinking.',
  Taurus: 'Steady, sensual, and rooted. You build slowly and refuse to be rushed.',
  Gemini: 'Quick, curious, and multilingual. You translate between worlds.',
  Cancer: 'Tender, protective, and lunar. You feel the tide before it arrives.',
  Leo: 'Radiant, generous, and dramatic. You lead with the heart exposed.',
  Virgo: 'Precise, devoted, and refining. You find the sacred in the detail.',
  Libra: 'Graceful, diplomatic, and relational. You weigh every angle before choosing.',
  Scorpio: 'Intense, magnetic, and transformative. You descend to rise.',
  Sagittarius: 'Expansive, honest, and seeking. You chase the horizon.',
  Capricorn: 'Disciplined, ambitious, and enduring. You build mountains from patience.',
  Aquarius: 'Visionary, detached, and electric. You see the future first.',
  Pisces: 'Mystical, porous, and compassionate. You dissolve boundaries.',
};

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
  const offset = Math.round((hour - 6) / 2);
  const risingIdx = ((sunIdx + offset) % 12 + 12) % 12;
  return signOrder[risingIdx];
}

function approximateMoon(sunSign: ZodiacSign, day: number): ZodiacSign {
  const signOrder = ZODIAC_SIGNS;
  const sunIdx = signOrder.indexOf(sunSign);
  const offset = Math.round(day / 2.3);
  const moonIdx = ((sunIdx + offset) % 12 + 12) % 12;
  return signOrder[moonIdx];
}

const transitAspects: Record<string, { aspect: string; reading: string }[]> = {
  Aries: [
    { aspect: 'Sun in Leo trine Aries', reading: 'Creative fire flows effortlessly — a window of bold self-expression.' },
    { aspect: 'Mars in Libra opposing', reading: 'Tension between your drive and partnership needs — channel into collaborative action.' },
    { aspect: 'Jupiter in Leo sextile', reading: 'Expansion through creative risk-taking this week.' },
    { aspect: 'Saturn in Pisces quincunx', reading: 'A subtle pressure to integrate spiritual lessons into your daily routine.' },
    { aspect: 'Venus in Cancer square', reading: 'Emotional friction between independence and domestic harmony.' },
    { aspect: 'Mercury in Virgo trine', reading: 'Mental clarity supports practical planning — organize the details.' },
    { aspect: 'Uranus in Gemini sextile', reading: 'Unexpected insights arrive through conversation and curiosity.' },
    { aspect: 'Neptune in Aries conjunct', reading: 'A dreamy dissolution of old identity — let the mist clear before deciding.' },
  ],
  Taurus: [
    { aspect: 'Venus in Cancer sextile', reading: 'Gentle emotional harmony — a good week for nurturing connections.' },
    { aspect: 'Saturn in Pisces sextile', reading: 'Discipline meets imagination — build something lasting from a vision.' },
    { aspect: 'Mars in Libra quincunx', reading: 'Adjust your pace — rushing disrupts your natural rhythm.' },
    { aspect: 'Jupiter in Leo square', reading: 'Creative pressure to grow — say yes to the spotlight, even if it feels uncomfortable.' },
    { aspect: 'Uranus in Gemini square', reading: 'Unexpected financial or value shifts — stay flexible.' },
    { aspect: 'Mercury in Virgo trine', reading: 'Earth-sign clarity — perfect for detailed planning and health routines.' },
    { aspect: 'Neptune in Aries quincunx', reading: 'A spiritual restlessness — ground through body-based practices.' },
    { aspect: 'Sun in Leo square', reading: 'Dramatic energy demands your attention — find your own stage.' },
  ],
  Gemini: [
    { aspect: 'Mercury in Virgo square', reading: 'Mental tension between big ideas and nitpicky details — slow down.' },
    { aspect: 'Uranus in Gemini conjunct', reading: 'A lightning-bolt awakening — your mind is rewiring itself.' },
    { aspect: 'Jupiter in Leo sextile', reading: 'Communication opens doors — speak your vision loudly.' },
    { aspect: 'Mars in Libra trine', reading: 'Air-sign harmony — your words carry grace and momentum.' },
    { aspect: 'Venus in Cancer square', reading: 'Emotional conversations may feel heavy — listen before responding.' },
    { aspect: 'Saturn in Pisces square', reading: 'Structure meets confusion — anchor your ideas in a concrete plan.' },
    { aspect: 'Neptune in Aries sextile', reading: 'Inspiration flows through writing and learning.' },
    { aspect: 'Sun in Leo quincunx', reading: 'Adjust your creative output to match the audience.' },
  ],
  Cancer: [
    { aspect: 'Venus in Cancer conjunct', reading: 'Love and self-worth align — receive the affection coming your way.' },
    { aspect: 'Saturn in Pisces trine', reading: 'Emotional maturity deepens — old fears soften into wisdom.' },
    { aspect: 'Mars in Libra square', reading: 'Home versus partnership tension — create space for both.' },
    { aspect: 'Jupiter in Leo square', reading: 'Growth demands visibility — step out of your shell.' },
    { aspect: 'Mercury in Virgo trine', reading: 'Practical emotional intelligence — express feelings with precision.' },
    { aspect: 'Sun in Leo quincunx', reading: 'Shift from nurturing to self-expression — both matter.' },
    { aspect: 'Uranus in Gemini sextile', reading: 'Intuitive flashes arrive through quiet reflection.' },
    { aspect: 'Neptune in Aries quincunx', reading: 'Emotional boundaries blur — protect your energy.' },
  ],
  Leo: [
    { aspect: 'Sun in Leo conjunct', reading: 'Solar return season — your power is at its peak. Set intentions boldly.' },
    { aspect: 'Jupiter in Leo conjunct', reading: 'Major expansion — abundance, creativity, and visibility multiply.' },
    { aspect: 'Mars in Libra quincunx', reading: "Diplomatic friction — your directness meets others' need for tact." },
    { aspect: 'Venus in Cancer quincunx', reading: 'Adjust between public and private love — both need tending.' },
    { aspect: 'Saturn in Pisces quincunx', reading: 'Spiritual responsibility calls — integrate the unseen.' },
    { aspect: 'Mercury in Virgo sextile', reading: 'Refine your message — precision amplifies your roar.' },
    { aspect: 'Uranus in Gemini sextile', reading: 'Innovative ideas arrive through your network.' },
    { aspect: 'Neptune in Aries sextile', reading: 'Creative vision sharpens — trust the muse.' },
  ],
  Virgo: [
    { aspect: 'Mercury in Virgo conjunct', reading: 'Mental mastery at its peak — analyze, organize, and refine.' },
    { aspect: 'Venus in Cancer trine', reading: 'Emotional flow supports your routines — weave love into the daily.' },
    { aspect: 'Mars in Libra sextile', reading: 'Graceful action — partnerships move forward with ease.' },
    { aspect: 'Jupiter in Leo quincunx', reading: 'Adjust between detailed work and big-picture confidence.' },
    { aspect: 'Saturn in Pisces opposing', reading: 'Tension between precision and surrender — find the middle path.' },
    { aspect: 'Sun in Leo quincunx', reading: 'Shift from behind-the-scenes to center stage.' },
    { aspect: 'Uranus in Gemini square', reading: 'Unexpected career shifts — stay adaptable.' },
    { aspect: 'Neptune in Aries quincunx', reading: 'Practical versus mystical — honor both.' },
  ],
  Libra: [
    { aspect: 'Mars in Libra conjunct', reading: 'Action meets beauty — assert yourself with grace.' },
    { aspect: 'Venus in Cancer square', reading: 'Tension between harmony and emotional depth — lean into honesty.' },
    { aspect: 'Mercury in Virgo sextile', reading: 'Refined communication — your words carry healing precision.' },
    { aspect: 'Jupiter in Leo sextile', reading: 'Social expansion — your network opens new doors.' },
    { aspect: 'Saturn in Pisces quincunx', reading: "Structure your dreams — don't let them stay abstract." },
    { aspect: 'Sun in Leo quincunx', reading: "Balance your light with others' — collaboration fuels growth." },
    { aspect: 'Uranus in Gemini trine', reading: 'Air-sign brilliance — ideas flow effortlessly.' },
    { aspect: 'Neptune in Aries square', reading: 'Identity versus illusion — clarify your boundaries.' },
  ],
  Scorpio: [
    { aspect: 'Mars in Libra quincunx', reading: 'Power dynamics surface — transform tension into deeper intimacy.' },
    { aspect: 'Venus in Cancer trine', reading: 'Deep emotional waters flow — vulnerability becomes strength.' },
    { aspect: 'Saturn in Pisces trine', reading: 'Spiritual discipline — old patterns release with grace.' },
    { aspect: 'Jupiter in Leo square', reading: 'Intensity meets visibility — let yourself be seen.' },
    { aspect: 'Mercury in Virgo quincunx', reading: 'Mental analysis meets emotional depth — integrate both.' },
    { aspect: 'Sun in Leo square', reading: 'Power struggles between ego and soul — choose truth.' },
    { aspect: 'Uranus in Gemini opposing', reading: 'Transformation through unexpected conversations.' },
    { aspect: 'Neptune in Aries sextile', reading: 'Mystical energy fuels your reinvention.' },
  ],
  Sagittarius: [
    { aspect: 'Jupiter in Leo trine', reading: 'Fire-sign expansion — luck, travel, and learning align.' },
    { aspect: 'Mars in Libra sextile', reading: 'Diplomatic momentum — your enthusiasm meets graceful action.' },
    { aspect: 'Venus in Cancer quincunx', reading: 'Adjust between adventure and emotional security.' },
    { aspect: 'Saturn in Pisces square', reading: 'Structure your vision — discipline turns dreams into reality.' },
    { aspect: 'Mercury in Virgo quincunx', reading: 'Big ideas meet detailed execution — bridge the gap.' },
    { aspect: 'Sun in Leo trine', reading: 'Creative fire flows — express boldly.' },
    { aspect: 'Uranus in Gemini opposing', reading: 'Ideological shifts — old beliefs reorganize.' },
    { aspect: 'Neptune in Aries sextile', reading: 'Spiritual pioneering — trust the unknown path.' },
  ],
  Capricorn: [
    { aspect: 'Saturn in Pisces sextile', reading: 'Discipline meets compassion — build something that serves others.' },
    { aspect: 'Mars in Libra square', reading: 'Tension between ambition and partnership — negotiate carefully.' },
    { aspect: 'Venus in Cancer opposing', reading: 'Work-life balance tested — honor both career and heart.' },
    { aspect: 'Jupiter in Leo quincunx', reading: 'Growth through creative risk — step beyond the safe plan.' },
    { aspect: 'Mercury in Virgo trine', reading: 'Earth-sign mastery — practical plans succeed.' },
    { aspect: 'Sun in Leo quincunx', reading: 'Adjust between steady progress and bold self-expression.' },
    { aspect: 'Uranus in Gemini sextile', reading: 'Innovative routines — upgrade your daily systems.' },
    { aspect: 'Neptune in Aries sextile', reading: 'Spiritual discipline — structure your inner life.' },
  ],
  Aquarius: [
    { aspect: 'Uranus in Gemini trine', reading: 'Air-sign revolution — breakthroughs arrive through ideas and networks.' },
    { aspect: 'Mars in Libra sextile', reading: 'Social action — your ideals meet graceful execution.' },
    { aspect: 'Venus in Cancer quincunx', reading: 'Adjust between collective vision and personal intimacy.' },
    { aspect: 'Jupiter in Leo opposing', reading: 'Tension between individuality and group dynamics — find your role.' },
    { aspect: 'Saturn in Pisces sextile', reading: 'Structure your vision — discipline grounds your ideals.' },
    { aspect: 'Mercury in Virgo quincunx', reading: 'Bridge abstract thinking with practical detail.' },
    { aspect: 'Sun in Leo opposing', reading: 'Ego versus collective — honor both your light and the group.' },
    { aspect: 'Neptune in Aries square', reading: 'Identity dissolution — let the old self dissolve.' },
  ],
  Pisces: [
    { aspect: 'Saturn in Pisces conjunct', reading: 'A defining transit — structure your dreams, face your fears, mature spiritually.' },
    { aspect: 'Venus in Cancer sextile', reading: 'Emotional sweetness — compassion flows naturally.' },
    { aspect: 'Mars in Libra quincunx', reading: 'Action meets dreaminess — ground your ideals in movement.' },
    { aspect: 'Jupiter in Leo quincunx', reading: 'Growth through creative service — share your gifts.' },
    { aspect: 'Mercury in Virgo opposing', reading: 'Dream logic meets practical analysis — honor both.' },
    { aspect: 'Sun in Leo quincunx', reading: 'Adjust between mystical and expressive modes.' },
    { aspect: 'Uranus in Gemini square', reading: 'Mental restlessness — ground through breath and routine.' },
    { aspect: 'Neptune in Aries sextile', reading: 'Spiritual rebirth — a new cycle of compassion begins.' },
  ],
};

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
        number="09"
        onParchment
        eyebrow="Birth Chart Calculator & Transits"
        title="Your natal chart, decoded"
        subtitle="Enter your birth date and approximate time to reveal your core placements — Sun, Moon, and Rising — plus how this week's live transits aspect your chart."
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