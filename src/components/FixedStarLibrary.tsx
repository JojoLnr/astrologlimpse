import { useState } from 'react';
import { Star, Astroid, Search } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';
import headingData from '@/data/sections/fixed-stars.json';

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

const bodies: FixedBody[] = headingData.bodies as FixedBody[];

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
        number={headingData.heading.number}
        onParchment
        eyebrow={headingData.heading.eyebrow}
        title={headingData.heading.title}
        subtitle={headingData.heading.subtitle}
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