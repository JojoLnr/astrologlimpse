import { ArrowRightLeft, Orbit, Square, Triangle, Circle } from 'lucide-react';
import type { PlanetaryTransit } from '@/lib/types';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import ContentBlurGate from './ContentBlurGate';

const intensityLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'Gentle', color: 'text-moon-300' },
  2: { label: 'Flowing', color: 'text-moon-300' },
  3: { label: 'Moderate', color: 'text-gold-300' },
  4: { label: 'Intense', color: 'text-gold-400' },
  5: { label: 'Peak Friction', color: 'text-gold-500' },
};

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
  isBlurred = false 
}: { 
  transits: PlanetaryTransit[]; 
  isBlurred?: boolean 
}) {
  return (
    <section id="transits" className="mx-auto max-w-7xl px-6 py-16">
      {/* Title & Subtitle remain completely unblurred */}
      <SectionHeading
        number="01"
        onParchment
        eyebrow="Planetary Transit & Aspect Tracker"
        title="What the planets are doing right now"
        subtitle="Upcoming movements and major aspects, with practical guidance for navigating each one."
      />

      {/* Only the repeating transit items are gated/blurred */}
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