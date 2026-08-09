import { useState } from 'react';
import { Heart, Users, MessageCircle, Zap, RotateCcw } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ZODIAC_SIGNS, type ZodiacSign } from './ZodiacSelector';

const signGlyphs: Record<string, string> = {
  Aries: '♈\uFE0E', Taurus: '♉\uFE0E', Gemini: '♊\uFE0E', Cancer: '♋\uFE0E',
  Leo: '♌\uFE0E', Virgo: '♍\uFE0E', Libra: '♎\uFE0E', Scorpio: '♏\uFE0E',
  Sagittarius: '♐\uFE0E', Capricorn: '♑\uFE0E', Aquarius: '♒\uFE0E', Pisces: '♓\uFE0E',
};

const signElements: Record<string, string> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
};

const signModalities: Record<string, string> = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable',
};

// Compatibility scores by element pair (0-100)
const elementCompat: Record<string, Record<string, number>> = {
  Fire:  { Fire: 82, Earth: 38, Air: 78, Water: 45 },
  Earth: { Fire: 38, Earth: 80, Air: 42, Water: 76 },
  Air:   { Fire: 78, Earth: 42, Air: 80, Water: 48 },
  Water: { Fire: 45, Earth: 76, Air: 48, Water: 82 },
};

const frictionTraits: Record<string, string> = {
  'Fire-Fire': 'Passion ignites fast — but watch for burnout and ego clashes. Channel the blaze into shared adventure.',
  'Fire-Earth': 'Different rhythms — Fire wants speed, Earth wants stability. Patience is the bridge.',
  'Fire-Air': 'Effortless mental spark — ideas fly, enthusiasm is contagious. Just ground the vision sometimes.',
  'Fire-Water': "Steam and depth — emotional intensity can overwhelm or transform. Honor each other's nature.",
  'Earth-Earth': 'Deeply rooted — shared values of stability and loyalty. Risk: stagnation. Add spontaneity.',
  'Earth-Air': 'Practical versus conceptual — Earth builds, Air dreams. Both are needed for a complete life.',
  'Earth-Water': 'Nurturing and fertile — Earth holds, Water feeds. A deeply supportive bond.',
  'Air-Air': 'Mental harmony — endless conversation and ideas. Risk: avoiding emotional depth.',
  'Air-Water': 'Thought meets feeling — Air clarifies, Water deepens. Bridge logic and intuition.',
  'Water-Water': 'Emotional ocean — deep empathy and psychic attunement. Risk: emotional flooding.',
};

const commStyles: Record<string, { style: string; tip: string }> = {
  'Fire-Fire': { style: 'Direct, passionate, fast-paced', tip: 'Pause before reacting — let the other finish speaking.' },
  'Fire-Earth': { style: 'Blunt vs. measured — pace mismatch', tip: 'Fire: slow down. Earth: speak up sooner.' },
  'Fire-Air': { style: 'Energetic, idea-driven, enthusiastic', tip: 'Make sure feelings get airtime, not just ideas.' },
  'Fire-Water': { style: 'Heart-first vs. feeling-first — intensity differs', tip: 'Fire: soften your volume. Water: share your inner world.' },
  'Earth-Earth': { style: 'Practical, steady, few words needed', tip: 'Make space for emotional check-ins.' },
  'Earth-Air': { style: 'Concrete vs. abstract — different wavelengths', tip: 'Earth: entertain the idea. Air: land the plan.' },
  'Earth-Water': { style: 'Quiet, nurturing, body-language rich', tip: 'Use words to confirm what you sense.' },
  'Air-Air': { style: 'Verbal, witty, concept-sharing', tip: 'Drop below the intellect into feeling.' },
  'Air-Water': { style: 'Logical vs. intuitive — translation needed', tip: 'Air: validate feelings first. Water: name what you sense.' },
  'Water-Water': { style: 'Emotional, non-verbal, deeply attuned', tip: 'Use words to create boundaries, not just merge.' },
};

function getPairKey(a: string, b: string): string {
  const ea = signElements[a];
  const eb = signElements[b];
  return [ea, eb].sort().join('-');
}

function computeCompatibility(a: ZodiacSign, b: ZodiacSign) {
  const ea = signElements[a];
  const eb = signElements[b];
  const baseScore = elementCompat[ea]?.[eb] ?? 50;

  // Modality bonus
  const ma = signModalities[a];
  const mb = signModalities[b];
  let modBonus = 0;
  if (ma === mb) modBonus = 5;
  if (ma !== mb && (ma === 'Cardinal' && mb === 'Fixed' || ma === 'Fixed' && mb === 'Cardinal')) modBonus = -3;

  const score = Math.max(20, Math.min(98, baseScore + modBonus));
  const pairKey = getPairKey(a, b);
  const friction = frictionTraits[pairKey] ?? 'A unique dynamic — explore it with curiosity.';
  const comm = commStyles[pairKey] ?? { style: 'Unique rhythm', tip: 'Listen deeply and stay curious.' };

  return { score, friction, comm, elements: `${ea} × ${eb}`, modalities: `${ma} × ${mb}` };
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-700';
  if (score >= 65) return 'text-gold-600';
  if (score >= 50) return 'text-gold-500';
  return 'text-red-700';
}

function barColor(score: number): string {
  if (score >= 80) return 'bg-green-600';
  if (score >= 65) return 'bg-gold-500';
  if (score >= 50) return 'bg-gold-400';
  return 'bg-red-500';
}

export default function CompatibilityMatrix() {
  const [signA, setSignA] = useState<ZodiacSign | null>(null);
  const [signB, setSignB] = useState<ZodiacSign | null>(null);
  const [result, setResult] = useState<ReturnType<typeof computeCompatibility> | null>(null);

  const compute = () => {
    if (!signA || !signB) return;
    setResult(computeCompatibility(signA, signB));
  };

  const reset = () => {
    setSignA(null);
    setSignB(null);
    setResult(null);
  };

  return (
    <section id="compatibility" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number="10"
        eyebrow="Compatibility Matrix · Synastry"
        title="How two charts dance together"
        subtitle="Select two zodiac signs to evaluate relationship dynamics, communication styles, and friction points across a percentage scale."
      />

      {!result ? (
        <div className="mt-10 max-w-2xl">
          <div className="grid gap-6 sm:grid-cols-2">
            {(['A', 'B'] as const).map((label) => {
              const value = label === 'A' ? signA : signB;
              const setter = label === 'A' ? setSignA : setSignB;
              return (
                <div key={label}>
                  <p className="font-display text-[10px] font-semibold uppercase tracking-[0.15em] prose-muted">
                    Person {label}
                  </p>
                  <div className="mt-3 grid grid-cols-6 gap-1.5">
                    {ZODIAC_SIGNS.map((sign) => (
                      <button
                        key={sign}
                        onClick={() => setter(sign)}
                        className={`flex flex-col items-center rounded-md py-2 transition-all ${
                          value === sign
                            ? 'bg-gold-400/20 ring-1 ring-gold-400/50'
                            : 'hover:bg-navy-700/40'
                        }`}
                      >
                        <span
                          className="font-display text-lg prose-title"
                          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                        >
                          {signGlyphs[sign]}
                        </span>
                        <span className="font-display text-[7px] uppercase tracking-wide prose-muted">
                          {sign.slice(0, 3)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={compute}
            disabled={!signA || !signB}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-navy-900 px-6 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300 transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Heart className="h-4 w-4" />
            Compare Charts
          </button>
        </div>
      ) : (
        <div className="mt-10">
          {/* Score ring */}
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
            <div className="flex flex-col items-center">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-4 border-gold-400/20">
                <div className="text-center">
                  <p className={`font-display text-5xl font-bold ${scoreColor(result.score)}`}>
                    {result.score}
                  </p>
                  <p className="font-display text-[10px] uppercase tracking-[0.2em] prose-muted">Compat</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 font-display text-sm">
                <span className="text-2xl prose-title">{signGlyphs[signA!]}</span>
                <span className="prose-muted">{signA}</span>
                <span className="text-gold-400">×</span>
                <span className="prose-muted">{signB}</span>
                <span className="text-2xl prose-title">{signGlyphs[signB!]}</span>
              </div>
            </div>

            <div className="flex-1 space-y-5">
              {/* Elements & modalities */}
              <div className="flex gap-4">
                <div className="rounded-md border border-gold-400/20 px-4 py-3">
                  <p className="font-display text-[9px] uppercase tracking-wider prose-muted">Elements</p>
                  <p className="font-display text-sm font-semibold prose-title">{result.elements}</p>
                </div>
                <div className="rounded-md border border-gold-400/20 px-4 py-3">
                  <p className="font-display text-[9px] uppercase tracking-wider prose-muted">Modalities</p>
                  <p className="font-display text-sm font-semibold prose-title">{result.modalities}</p>
                </div>
              </div>

              {/* Breakdown bars */}
              <div className="space-y-3">
                {[
                  { icon: Heart, label: 'Emotional Resonance', score: Math.min(99, result.score + 3) },
                  { icon: MessageCircle, label: 'Communication Flow', score: Math.max(25, result.score - 5) },
                  { icon: Zap, label: 'Friction & Growth', score: Math.max(30, 100 - result.score + 20) },
                  { icon: Users, label: 'Shared Vision', score: Math.min(97, result.score + 1) },
                ].map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label}>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-display text-[10px] uppercase tracking-wider prose-muted">
                          <Icon className="h-3.5 w-3.5 text-gold-400" strokeWidth={1.5} />
                          {row.label}
                        </span>
                        <span className={`font-display text-sm font-bold ${scoreColor(row.score)}`}>
                          {row.score}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-navy-700/40">
                        <div
                          className={`h-full rounded-full ${barColor(row.score)} transition-all duration-700`}
                          style={{ width: `${row.score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Friction & communication */}
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-lg border border-gold-400/20 bg-navy-800/30 p-6">
              <div className="flex items-center gap-2.5">
                <Zap className="h-4 w-4 text-gold-400" strokeWidth={1.5} />
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.15em] prose-title">
                  Friction & Dynamic
                </h3>
              </div>
              <p className="mt-3 font-serif text-base leading-relaxed prose-body">{result.friction}</p>
            </div>
            <div className="rounded-lg border border-gold-400/20 bg-navy-800/30 p-6">
              <div className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-gold-400" strokeWidth={1.5} />
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.15em] prose-title">
                  Communication Style
                </h3>
              </div>
              <p className="mt-3 font-serif text-base leading-relaxed prose-body">
                <span className="font-display not-italic text-[10px] uppercase tracking-wider text-gold-400">Style · </span>
                {result.comm.style}
              </p>
              <p className="mt-2 font-serif text-base italic leading-relaxed prose-muted">
                <span className="font-display not-italic text-[10px] uppercase tracking-wider text-gold-400">Tip · </span>
                {result.comm.tip}
              </p>
            </div>
          </div>

          <button
            onClick={reset}
            className="mt-8 inline-flex items-center gap-2 font-display text-[10px] font-medium uppercase tracking-wider text-gold-400/80 transition-colors hover:text-gold-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Compare Another Pair
          </button>
        </div>
      )}

      <div className="mt-14"><OrnamentDivider /></div>
    </section>
  );
}
