import type { ShadowPrompt } from '@/lib/types';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';

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
        number="05"
        onParchment
        eyebrow="Shadow Work & Journaling"
        title="Questions the cosmos is asking you"
        subtitle="Reflection prompts drawn from the current astrological weather. Sit with one · or all five."
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