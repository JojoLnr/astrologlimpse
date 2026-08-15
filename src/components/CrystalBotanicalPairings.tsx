import { Gem, Leaf, Palette } from 'lucide-react';
import type { CrystalBotanical } from '@/lib/types';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';
import headingData from '@/data/sections/crystals.json';

const iconMap: Record<string, typeof Gem> = { Crystal: Gem, Herb: Leaf, Color: Palette };
const categoryConfig: Record<string, { icon: typeof Gem; text: string }> = Object.fromEntries(
  Object.entries(headingData.categoryConfig).map(([k, v]) => [k, { icon: iconMap[k], text: (v as { color: string }).color }])
);

export default function CrystalBotanicalPairings({
  items,
  isBlurred = false,
}: {
  items: CrystalBotanical[];
  isBlurred?: boolean;
}) {
  return (
    <section id="crystals" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number={headingData.heading.number}
        eyebrow={headingData.heading.eyebrow}
        title={headingData.heading.title}
        subtitle={headingData.heading.subtitle}
      />
      <ContentBlurGate isBlurred={isBlurred}>
        <div className="mt-10 divide-y divide-gold-400/10">
          {items.map((item) => {
            const cfg = categoryConfig[item.category] ?? categoryConfig.Crystal;
            const Icon = cfg.icon;
            return (
              <article key={item.id} className="grid gap-3 py-5 md:grid-cols-[180px_1fr] md:gap-8">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${cfg.text}`} strokeWidth={1.4} />
                  <div>
                    <p className="font-display text-[10px] uppercase tracking-wider text-gold-400/60">{item.category}</p>
                    <h3 className="font-display text-lg font-semibold prose-title">{item.name}</h3>
                    {item.zodiac_sign && (
                      <span className="font-serif text-xs italic prose-muted">{item.zodiac_sign}</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-serif text-base italic text-gold-200/65">{item.purpose}</p>
                  <p className="mt-1 font-serif text-base leading-relaxed prose-body">{item.usage}</p>
                </div>
              </article>
            );
          })}
        </div>
      </ContentBlurGate>
      <div className="mt-14"><OrnamentDivider /></div>
    </section>
  );
}