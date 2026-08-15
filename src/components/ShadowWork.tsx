import type { ShadowPrompt } from '@/lib/types';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';
import headingData from '@/data/sections/shadow.json';

export default function ShadowWork({
  prompts,
  isBlurred = false,
}: {
  prompts: ShadowPrompt[];
  isBlurred?: boolean;
}) {
  return (
    <section id="shadow" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number={headingData.heading.number}
        onParchment
        eyebrow={headingData.heading.eyebrow}
        title={headingData.heading.title}
        subtitle={headingData.heading.subtitle}
      />
      <ContentBlurGate isBlurred={isBlurred}>
        <div className="mt-10 divide-y divide-gold-400/10">
          {prompts.map((p, i) => (
            <div key={p.id} className="grid gap-3 py-6 md:grid-cols-[40px_1fr] md:gap-6">
              <span className="font-display text-lg font-semibold text-gold-500/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-serif text-xl italic font-medium leading-snug prose-title">
                  {p.prompt}
                </p>
                <p className="mt-2 font-display text-[10px] uppercase tracking-[0.2em] text-gold-500/70">
                  Context · {p.context}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ContentBlurGate>
      <div className="mt-14"><OrnamentDivider onParchment /></div>
    </section>
  );
}