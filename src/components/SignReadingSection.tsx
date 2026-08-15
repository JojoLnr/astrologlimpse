import { Sparkles, Heart, Briefcase, Brain, Dumbbell, Gem, Calendar } from 'lucide-react';
import type { SignReading } from '@/lib/types';
import type { ZodiacSign } from './ZodiacSelector';
import { ContentBlurGate } from './ContentBlurGate';
import content from '@/data/sections/sign-reading.json';

const signGlyphs = content.signGlyphs;

const blockIcons: Record<string, typeof Brain> = {
  mental_sparks: Brain,
  social_balance: Sparkles,
  career_focus: Briefcase,
  love_focus: Heart,
  wellness_focus: Dumbbell,
};

export default function SignReadingSection({
  sign,
  reading,
  isBlurred = false,
}: {
  sign: ZodiacSign;
  reading: SignReading | null;
  isBlurred?: boolean;
}) {
  if (!reading) return null;

  const blocks = content.blocks.map((b) => ({
    icon: blockIcons[b.field] ?? Sparkles,
    label: b.label,
    text: (reading as unknown as Record<string, string>)[b.field],
  }));

  return (
    <section className="section-parchment relative overflow-hidden">
      {/* Subtle starfield on cream */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 20% 30%, #0b1333, transparent), radial-gradient(1px 1px at 60% 70%, #0b1333, transparent), radial-gradient(1px 1px at 85% 20%, #0b1333, transparent), radial-gradient(1px 1px at 35% 85%, #0b1333, transparent)',
          backgroundSize: '200px 200px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Header row */}
        <div className="text-center">
          <span className="font-ornament text-3xl text-gold-500">{signGlyphs[sign]}</span>
          <p className="mt-2 font-display text-[11px] font-medium uppercase tracking-[0.3em] text-gold-600">
            {content.eyebrow}
          </p>
          <h2 className="mt-1 font-display text-4xl font-semibold uppercase tracking-wide text-navy-900 md:text-5xl">
            {content.titleTemplate.replace('{sign}', sign)}
          </h2>
          <hr className="gold-rule mx-auto mt-6 max-w-md" />
        </div>

        <ContentBlurGate isBlurred={isBlurred}>
          {/* Two-column: main reading + sidebar */}
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_280px]">
            {/* Main column · open text blocks separated by rules */}
            <div>
              {blocks.map((block, i) => {
                const Icon = block.icon;
                return (
                  <div key={block.label} className={i > 0 ? 'mt-8' : ''}>
                    {i > 0 && <hr className="gold-rule mb-8" />}
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-gold-500" strokeWidth={1.5} />
                      <h3 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-navy-800">
                        {block.label}
                      </h3>
                    </div>
                    <p className="mt-3 font-serif text-lg leading-relaxed text-navy-800/85">
                      {block.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Mantra */}
              <div>
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-gold-500" strokeWidth={1.5} />
                  <h3 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-navy-800">
                    {content.sidebar.mantra}
                  </h3>
                </div>
                <p className="mt-3 font-serif text-xl italic leading-snug text-navy-900">
                  "{reading.mantra}"
                </p>
              </div>
              <hr className="gold-rule" />

              {/* Crystal */}
              <div>
                <div className="flex items-center gap-2.5">
                  <Gem className="h-4 w-4 text-gold-500" strokeWidth={1.5} />
                  <h3 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-navy-800">
                    {content.sidebar.crystal}
                  </h3>
                </div>
                <p className="mt-3 font-serif text-lg text-navy-800/85">{reading.crystal}</p>
              </div>
              <hr className="gold-rule" />

              {/* Key Dates */}
              <div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-gold-500" strokeWidth={1.5} />
                  <h3 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-navy-800">
                    {content.sidebar.keyDates}
                  </h3>
                </div>
                <p className="mt-3 font-serif text-base leading-relaxed text-navy-800/80">
                  {reading.key_dates}
                </p>
              </div>
            </aside>
          </div>
        </ContentBlurGate>
      </div>
    </section>
  );
}