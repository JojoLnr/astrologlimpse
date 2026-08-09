import { useState } from 'react';
import { Star, Astroid, Search } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';

interface FixedBody {
  name: string;
  type: 'Fixed Star' | 'Asteroid' | 'Dwarf Planet';
  glyph: string;
  degree: string;
  sign: string;
  archetype: string;
  meaning: string;
  keyword: string;
}

const bodies: FixedBody[] = [
  {
    name: 'Algol',
    type: 'Fixed Star',
    glyph: '★\uFE0E',
    degree: '26° Taurus',
    sign: 'Taurus',
    archetype: 'The Gorgon — Medusa',
    meaning: 'The most intense fixed star. Represents primal power, unbridled rage transformed into wisdom, and the confrontation with our deepest shadow. Not evil — but demanding of integration.',
    keyword: 'Primal Power',
  },
  {
    name: 'Sirius',
    type: 'Fixed Star',
    glyph: '★\uFE0E',
    degree: '14° Cancer',
    sign: 'Cancer',
    archetype: 'The Shining One — Isis',
    meaning: 'The brightest star in the sky. Associated with spiritual illumination, divine connection, and the path of the initiate. Brings honor, fame, and the responsibility that accompanies them.',
    keyword: 'Spiritual Illumination',
  },
  {
    name: 'Pleiades',
    type: 'Fixed Star',
    glyph: '★\uFE0E',
    degree: '0° Gemini',
    sign: 'Gemini',
    archetype: 'The Seven Sisters',
    meaning: 'A cluster of seven stars. Associated with vision, intuition, and the collective feminine. Brings artistic ability and deep sensitivity — but also the risk of overwhelm.',
    keyword: 'Vision & Intuition',
  },
  {
    name: 'Regulus',
    type: 'Fixed Star',
    glyph: '★\uFE0E',
    degree: '0° Virgo',
    sign: 'Virgo',
    archetype: 'The Heart of the Lion',
    meaning: 'One of the four royal stars. Associated with leadership, honor, and nobility of spirit. Its move into Virgo signals a shift from martial power to service-based leadership.',
    keyword: 'Noble Leadership',
  },
  {
    name: 'Antares',
    type: 'Fixed Star',
    glyph: '★\uFE0E',
    degree: '10° Sagittarius',
    sign: 'Sagittarius',
    archetype: 'The Rival of Mars',
    meaning: 'A red giant at the heart of the Scorpion. Associated with courage, ambition, and the risk of self-destruction through excess. Demands that power be tempered with wisdom.',
    keyword: 'Courage & Risk',
  },
  {
    name: 'Spica',
    type: 'Fixed Star',
    glyph: '★\uFE0E',
    degree: '24° Libra',
    sign: 'Libra',
    archetype: 'The Wheat Sheaf — Ceres',
    meaning: 'A brilliant blue star associated with harvest, abundance, and the rewards of sustained effort. Brings talent, prosperity, and the gift of making the sacred tangible.',
    keyword: 'Abundance & Talent',
  },
  {
    name: 'Chiron',
    type: 'Asteroid',
    glyph: '⚷\uFE0E',
    degree: '18° Aries',
    sign: 'Aries',
    archetype: 'The Wounded Healer',
    meaning: 'The bridge between Saturn and Uranus — the wound that becomes the gift. In Aries, the wound is around identity and self-assertion. Healing comes through helping others find their own courage.',
    keyword: 'The Wound That Heals',
  },
  {
    name: 'Vesta',
    type: 'Asteroid',
    glyph: '⚶\uFE0E',
    degree: '22° Leo',
    sign: 'Leo',
    archetype: 'The Keeper of the Flame',
    meaning: "Goddess of the sacred hearth. Represents devotion, focus, and the sacred fire within. In Leo, the flame is creative — the commitment to one's art as a spiritual practice.",
    keyword: 'Sacred Devotion',
  },
  {
    name: 'Ceres',
    type: 'Asteroid',
    glyph: '⚳\uFE0E',
    degree: '5° Virgo',
    sign: 'Virgo',
    archetype: 'The Great Mother',
    meaning: 'Goddess of agriculture and the mother-daughter bond. Represents nurturing, grief cycles, and our relationship with sustenance — physical and emotional.',
    keyword: 'Nurturing & Grief',
  },
  {
    name: 'Pallas Athena',
    type: 'Asteroid',
    glyph: '⚴\uFE0E',
    degree: '12° Aquarius',
    sign: 'Aquarius',
    archetype: 'The Strategist',
    meaning: "Born from Zeus's forehead — goddess of wisdom, craft, and strategic warfare. Represents pattern recognition, creative intelligence, and the fight for justice.",
    keyword: 'Strategic Wisdom',
  },
  {
    name: 'Juno',
    type: 'Asteroid',
    glyph: '⚵\uFE0E',
    degree: '8° Libra',
    sign: 'Libra',
    archetype: 'The Sacred Union',
    meaning: 'Queen of the gods — protector of marriage and commitment. Represents the longing for soul-level partnership, and the work of making power dynamics conscious within relationship.',
    keyword: 'Sacred Partnership',
  },
  {
    name: 'Pluto',
    type: 'Dwarf Planet',
    glyph: '♇\uFE0E',
    degree: '1° Aquarius',
    sign: 'Aquarius',
    archetype: 'The Underworld King',
    meaning: 'Lord of death and rebirth. In Aquarius, Pluto dismantles old power structures and seeds collective transformation. A 20-year transit of revolutionary change.',
    keyword: 'Death & Rebirth',
  },
];

const typeConfig: Record<string, { icon: typeof Star; color: string }> = {
  'Fixed Star': { icon: Star, color: 'text-gold-300' },
  'Asteroid': { icon: Astroid, color: 'text-moon-300' },
  'Dwarf Planet': { icon: Astroid, color: 'text-gold-400' },
};

export default function FixedStarLibrary({ isBlurred = false }: { isBlurred?: boolean }) {
  const [filter, setFilter] = useState<'All' | 'Fixed Star' | 'Asteroid' | 'Dwarf Planet'>('All');
  const [search, setSearch] = useState('');

  const filtered = bodies.filter((b) => {
    if (filter !== 'All' && b.type !== filter) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !b.keyword.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <section id="fixed-stars" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number="11"
        onParchment
        eyebrow="Fixed Star & Asteroid Library"
        title="The deeper sky"
        subtitle="Beyond the ten planets lies a vast archetypal sky — fixed stars, asteroids, and dwarf planets that reveal the soul's hidden architecture."
      />

      <ContentBlurGate isBlurred={isBlurred}>
        {/* Controls */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1.5">
            {(['All', 'Fixed Star', 'Asteroid', 'Dwarf Planet'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`rounded-full px-4 py-1.5 font-display text-[10px] font-medium uppercase tracking-wider transition-colors ${
                  filter === t
                    ? 'bg-navy-900 text-gold-300'
                    : 'border border-gold-500/30 prose-muted hover:bg-cream-200/40'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-600/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bodies or keywords..."
              className="w-full rounded-md border border-gold-500/30 bg-white/60 py-2 pl-9 pr-3 font-serif text-sm text-navy-900 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => {
            const cfg = typeConfig[b.type];
            const Icon = cfg.icon;
            return (
              <article
                key={b.name}
                className="rounded-lg border border-gold-500/20 bg-cream-50/40 p-6 transition-colors hover:border-gold-500/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/25">
                      <Icon className={`h-5 w-5 ${cfg.color}`} strokeWidth={1.4} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-navy-900">
                        {b.name} <span className="text-gold-600 text-base">{b.glyph}</span>
                      </h3>
                      <p className="font-display text-[9px] uppercase tracking-wider text-gold-600">
                        {b.type} · {b.degree}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-4 font-display text-[11px] font-semibold uppercase tracking-wide text-navy-800">
                  {b.archetype}
                </p>
                <p className="mt-2 font-serif text-base leading-relaxed prose-body">{b.meaning}</p>
                <p className="mt-3 font-serif text-sm italic text-gold-600">
                  {b.keyword}
                </p>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center font-serif text-lg italic prose-muted">
            No bodies found matching your search.
          </p>
        )}
      </ContentBlurGate>

      <div className="mt-14"><OrnamentDivider onParchment /></div>
    </section>
  );
}