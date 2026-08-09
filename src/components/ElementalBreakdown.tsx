import { Flame, Mountain, Wind, Droplets } from 'lucide-react';
import type { ElementalEnergy } from '@/lib/types';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';

const elementConfig: Record<string, { icon: typeof Flame; text: string }> = {
  Fire:  { icon: Flame,    text: 'text-gold-400' },
  Earth: { icon: Mountain,  text: 'text-moon-300' },
  Air:   { icon: Wind,      text: 'text-cream-200' },
  Water: { icon: Droplets,   text: 'text-gold-300' },
};

export default function ElementalBreakdown({
  elements,
  isBlurred = false,
}: {
  elements: ElementalEnergy[];
  isBlurred?: boolean;
}) {
  return (
    <section id="elements" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number="04"
        eyebrow="Elemental Energy Breakdown"
        title="Balancing Fire, Earth, Air & Water"
        subtitle="Weekly guidance for each element based on the current distribution of planets in signs."
      />
      <ContentBlurGate isBlurred={isBlurred}>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {elements.map((el) => {
            const cfg = elementConfig[el.element] ?? elementConfig.Fire;
            const Icon = cfg.icon;
            return (
              <div key={el.id}>
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-5 w-5 ${cfg.text}`} strokeWidth={1.4} />
                  <h3 className="font-display text-lg font-semibold prose-title">{el.element}</h3>
                </div>
                <p className="mt-1 font-serif text-sm italic prose-muted">{el.focus}</p>
                <p className="mt-3 font-serif text-base leading-relaxed prose-body">{el.advice}</p>
                <p className="mt-4 font-serif text-sm italic leading-relaxed prose-muted">
                  <span className={`font-display not-italic text-[10px] uppercase tracking-wider ${cfg.text}`}>Balance · </span>
                  {el.balance_tip}
                </p>
              </div>
            );
          })}
        </div>
      </ContentBlurGate>
      <div className="mt-14"><OrnamentDivider /></div>
    </section>
  );
}