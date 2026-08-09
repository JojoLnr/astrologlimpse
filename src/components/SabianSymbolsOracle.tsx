import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ZODIAC_SIGNS, type ZodiacSign } from './ZodiacSelector';

const signGlyphs: Record<string, string> = {
  Aries: '♈\uFE0E', Taurus: '♉\uFE0E', Gemini: '♊\uFE0E', Cancer: '♋\uFE0E',
  Leo: '♌\uFE0E', Virgo: '♍\uFE0E', Libra: '♎\uFE0E', Scorpio: '♏\uFE0E',
  Sagittarius: '♐\uFE0E', Capricorn: '♑\uFE0E', Aquarius: '♒\uFE0E', Pisces: '♓\uFE0E',
};

// Sabian Symbols — one per degree (simplified: 1 per sign at 3 degree points)
const sabianSymbols: Record<string, { degree: number; symbol: string; interpretation: string }[]> = {
  Aries: [
    { degree: 1, symbol: 'A woman rises out of the water, a seal is embracing her.', interpretation: 'The emergence of new consciousness from the depths of the collective unconscious. A moment of pure becoming.' },
    { degree: 15, symbol: 'An Indian weaving a blanket in the sunlight.', interpretation: "The patient, devoted crafting of one's life as art. Each thread is a choice, each pattern a story." },
    { degree: 30, symbol: 'A duck pond and its brood.', interpretation: 'The quiet contentment of simple, natural belonging. Trust the rhythm of ordinary life.' },
  ],
  Taurus: [
    { degree: 1, symbol: 'A clear mountain stream flows through a rocky gorge.', interpretation: 'The pure, uncontaminated flow of life force through natural channels. Let the energy find its own path.' },
    { degree: 15, symbol: 'A man with a rakish silk hat muffled against the cold.', interpretation: 'The coexistence of elegance and necessity. Beauty persists even in harsh conditions.' },
    { degree: 30, symbol: 'A peacock parading in an ancient garden.', interpretation: 'The glorification of individuality within a tradition. Show your colors — the garden was made for this.' },
  ],
  Gemini: [
    { degree: 1, symbol: 'A glass-bottomed boat reveals undersea wonders.', interpretation: 'The capacity to see into hidden depths while staying afloat. Conscious observation of the unconscious.' },
    { degree: 15, symbol: 'Two Dutch children talking together, exchanging what they know.', interpretation: 'The joy of shared learning. Knowledge multiplies when it is given freely.' },
    { degree: 30, symbol: 'Bathing beauties before a swimming contest.', interpretation: 'The playful celebration of form and vitality. Competition as ritual, not war.' },
  ],
  Cancer: [
    { degree: 1, symbol: 'On a ship, sailors lower an old flag and raise a new one.', interpretation: 'A conscious change of allegiance. The self chooses a new loyalty — and acts on it.' },
    { degree: 15, symbol: 'A group of rabbits dressed in clothes and on parade.', interpretation: 'The playful domestication of wild instincts. Civilization as a costume over nature.' },
    { degree: 30, symbol: 'A daughter of the American Revolution.', interpretation: "The pride of lineage and the weight of inherited values. Honor the past; don't be imprisoned by it." },
  ],
  Leo: [
    { degree: 1, symbol: 'A blood-red sunset, the light of the coming night.', interpretation: 'The passing of a cycle and the anticipation of what is to come. Every ending carries a new beginning.' },
    { degree: 15, symbol: 'A street pageant moving along a street filled with cheering people.', interpretation: 'The communal celebration of individual expression. The crowd needs the performer, and vice versa.' },
    { degree: 30, symbol: 'An unsealed letter.', interpretation: 'The message that has not yet been read. Potential communication — the future is still open.' },
  ],
  Virgo: [
    { degree: 1, symbol: "A man's head is revealed, a well-shaped head, with a look of self-confidence.", interpretation: 'The self-aware, self-possessed individual. Confidence born from knowing oneself.' },
    { degree: 15, symbol: 'A fine lace handkerchief, a heirloom.', interpretation: 'The beauty of inherited refinement. Small, delicate things carry the weight of generations.' },
    { degree: 30, symbol: 'Having an urgent task to complete, a man does not look back to anything.', interpretation: 'Total commitment to the present task. The past is released; the future is served through now.' },
  ],
  Libra: [
    { degree: 1, symbol: 'A butterfly made perfect by a dart through it.', interpretation: 'The beauty that comes through sacrifice. The pin that preserves also stills — choose what you fix.' },
    { degree: 15, symbol: 'Two men are placed under arrest for breaking the rules.', interpretation: 'The consequences of violating the social contract. Justice restores balance — but at a cost.' },
    { degree: 30, symbol: "Three mounds of knowledge on a philosopher's head.", interpretation: 'The threefold nature of wisdom — intellectual, emotional, and instinctual. All three are needed.' },
  ],
  Scorpio: [
    { degree: 1, symbol: 'A sightseeing bus is threading its way through a crowded city.', interpretation: 'The observer moving through intensity. You can witness without being consumed.' },
    { degree: 15, symbol: 'In a treasure room, a child is examining a miniature of a mummy.', interpretation: 'The fascination with death and what it preserves. The child studies what the adult fears.' },
    { degree: 30, symbol: 'The Halloween jester is merry-making for all.', interpretation: 'The sacred fool — the one who mocks death and therefore transcends it. Laughter is a portal.' },
  ],
  Sagittarius: [
    { degree: 1, symbol: 'Retired army veterans gather to rekindle old memories.', interpretation: 'The community of shared experience. Old battles become stories — stories become bonds.' },
    { degree: 15, symbol: 'The groundhog looking for its shadow on Groundhog Day.', interpretation: 'The search for signs and the willingness to predict. We look to nature for permission to hope.' },
    { degree: 30, symbol: 'The Pope, holding the staff of office, blesses the faithful.', interpretation: 'The bestowal of spiritual authority. The highest Sagittarian act: to bless what has been earned.' },
  ],
  Capricorn: [
    { degree: 1, symbol: 'An Indian chief claims power from the assembled tribe.', interpretation: 'The conscious assumption of authority. Power is given by the group, not taken.' },
    { degree: 15, symbol: "In a hospital, the children's ward is filled with toys.", interpretation: 'The healing power of play. Even in the most serious places, joy is medicine.' },
    { degree: 30, symbol: 'A secret meeting of men in a council of state.', interpretation: 'The hidden machinery of power. What is decided in private shapes the public world.' },
  ],
  Aquarius: [
    { degree: 1, symbol: 'An old adobe mission in California, in a valley surrounded by mountains.', interpretation: 'The enduring spirit within tradition. The old structure holds the new vision.' },
    { degree: 15, symbol: 'Two lovebirds sitting on a fence.', interpretation: 'The delicate balance of freedom and belonging. Love that respects the boundary.' },
    { degree: 30, symbol: 'Deeply rooted in the past of a venerable tree, a man is able to express his spirit in a piece of wood.', interpretation: 'The transformation of raw material into spirit-made-visible. The craftsperson as channel.' },
  ],
  Pisces: [
    { degree: 1, symbol: 'A vast public market, throngs of men, women, and children.', interpretation: 'The ocean of humanity — the collective as a living body. You are a wave, not separate from the sea.' },
    { degree: 15, symbol: 'An officer in dull dress drilling his men.', interpretation: 'The discipline required to serve the collective. Order prepares the soul for transcendence.' },
    { degree: 30, symbol: 'A giant rock jutting from the ocean, a great archway, the portal of the Seth.', interpretation: 'The great transition — the portal between worlds. The end of the cycle is the gateway to the new.' },
  ],
};

export default function SabianSymbolsOracle() {
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
        number="12"
        eyebrow="Sabian Symbols Oracle"
        title="The poetry of exact degrees"
        subtitle="Every zodiac degree carries a symbolic image — a vignette that translates celestial position into evocative, esoteric meaning. Choose a sign and reveal its oracles."
      />

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

      <div className="mt-14"><OrnamentDivider /></div>
    </section>
  );
}
