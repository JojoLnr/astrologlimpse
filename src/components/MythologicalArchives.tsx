import { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';
import headingData from '@/data/sections/mythology.json';

interface MythEntry {
  planet: string;
  glyph: string;
  greekName: string;
  romanName: string;
  domain: string;
  myth: string;
  archetype: string;
  psychology: string;
  lesson: string;
}

const entries: MythEntry[] = headingData.entries as MythEntry[];

export default function MythologicalArchives({ isBlurred = false }: { isBlurred?: boolean }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="mythology" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number={headingData.heading.number}
        onParchment
        eyebrow={headingData.heading.eyebrow}
        title={headingData.heading.title}
        subtitle={headingData.heading.subtitle}
      />

      <ContentBlurGate isBlurred={isBlurred}>
        <div className="mt-10 space-y-3">
          {entries.map((entry, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={entry.planet}
                className="overflow-hidden rounded-lg border border-gold-500/20 bg-cream-50/30"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-cream-200/30"
                >
                  <span
                    className="font-display text-2xl text-gold-600"
                    style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                  >
                    {entry.glyph}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-navy-900">
                      {entry.planet}
                      <span className="ml-2 font-serif text-sm italic font-normal prose-muted">
                        {entry.greekName} → {entry.romanName}
                      </span>
                    </h3>
                    <p className="font-display text-[10px] uppercase tracking-wider text-gold-600">
                      {entry.domain}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gold-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-gold-500/15 px-6 py-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <p className="font-display text-[10px] uppercase tracking-wider text-gold-600">The Myth</p>
                        <p className="mt-2 font-serif text-base leading-relaxed prose-body">{entry.myth}</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="font-display text-[10px] uppercase tracking-wider text-gold-600">The Archetype</p>
                          <p className="mt-2 font-serif text-base italic leading-relaxed prose-body">{entry.archetype}</p>
                        </div>
                        <div>
                          <p className="font-display text-[10px] uppercase tracking-wider text-gold-600">Psychology</p>
                          <p className="mt-2 font-serif text-base leading-relaxed prose-body">{entry.psychology}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 rounded-md border border-gold-500/20 bg-white/40 px-4 py-3">
                      <p className="font-serif text-lg italic leading-snug text-navy-900">
                        <BookOpen className="mr-2 inline h-4 w-4 text-gold-600" strokeWidth={1.5} />
                        {entry.lesson}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ContentBlurGate>

      <div className="mt-14"><OrnamentDivider onParchment /></div>
    </section>
  );
}