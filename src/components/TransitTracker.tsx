import { ArrowRightLeft, Orbit, Square, Triangle, Circle } from 'lucide-react';
import type { PlanetaryTransit } from '@/lib/types';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';
import headingData from '@/data/sections/transits.json';

const intensityLabels: Record<string, { label: string; color: string }> = Object.fromEntries(
  Object.entries(headingData.intensityLabels).map(([k, v]) => [Number(k), v as { label: string; color: string }])
);

function eventIcon(eventType: string, aspectType: string | null) {
  if (eventType === 'Retrograde') return <ArrowRightLeft className="h-4 w-4" />;
  if (eventType === 'Ingress') return <Orbit className="h-4 w-4" />;
  if (aspectType === 'Square') return <Square className="h-4 w-4" />;
  if (aspectType === 'Trine') return <Triangle className="h-4 w-4" />;
  if (aspectType === 'Conjunction') return <Circle className="h-4 w-4" />;
  return <Orbit className="h-4 w-4" />;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function TransitTracker({
  transits,
  isBlurred = false,
}: {
  transits: PlanetaryTransit[];
  isBlurred?: boolean;
}) {
  return (
    <section id="transits" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number={headingData.heading.number}
        onParchment
        eyebrow={headingData.heading.eyebrow}
        title={headingData.heading.title}
        subtitle={headingData.heading.subtitle}
      />
      <ContentBlurGate isBlurred={isBlurred}>
        <div className="mt-10 divide-y divide-gold-400/10">
          {transits.map((t) => {
            const intensity = intensityLabels[t.intensity] ?? intensityLabels[3];
            return (
              <article key={t.id} className="grid gap-4 py-6 md:grid-cols-[200px_1fr] md:gap-8">
                {/* Left: date + planet */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-gold-400/70">{eventIcon(t.event_type, t.aspect_type)}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold prose-title">
                      {t.planet} {t.aspect_type ?? t.event_type}
                    </h3>
                    <p className="font-serif text-sm italic prose-muted">
                      {t.sign ? `${t.sign} · ` : ''}{formatDate(t.date)}
                    </p>
                    <span className={`mt-2 inline-block font-display text-[10px] font-semibold uppercase tracking-wider ${intensity.color}`}>
                      {intensity.label}
                    </span>
                  </div>
                </div>
                {/* Right: description + advice */}
                <div>
                  <p className="font-serif text-lg leading-relaxed prose-body">{t.description}</p>
                  <p className="mt-3 font-serif text-base italic leading-relaxed prose-muted">
                    <span className="font-display not-italic text-[10px] uppercase tracking-wider text-gold-500">Guidance · </span>
                    {t.advice}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </ContentBlurGate>
      <div className="mt-14"><OrnamentDivider onParchment /></div>
    </section>
  );
}