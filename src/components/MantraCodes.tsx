import type { MantraAffirmation } from '@/lib/types';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';

export default function MantraCodes({
  mantras,
  isBlurred = false,
}: {
  mantras: MantraAffirmation[];
  isBlurred?: boolean;
}) {
  return (
    <section id="mantras" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number="08"
        eyebrow="Mantra & Affirmation Codes"
        title="Words to counter the friction"
        subtitle="Tailored affirmations designed to soften challenging transits · Saturn pressure, Mars intensity, Mercury loops."
      />
      <ContentBlurGate isBlurred={isBlurred}>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {mantras.map((m) => (
            <div key={m.id} className="py-2">
              <p className="font-serif text-2xl italic font-medium leading-snug prose-title">
                "{m.mantra}"
              </p>
              <p className="mt-3 font-display text-[10px] uppercase tracking-[0.25em] text-gold-400">
                For {m.targets_transit}
              </p>
            </div>
          ))}
        </div>
      </ContentBlurGate>
      <div className="mt-14"><OrnamentDivider /></div>
    </section>
  );
}