import { Sparkles, Globe, Calendar, Zap } from 'lucide-react';
import type { CosmicEvent } from '@/lib/types';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import Reveal from './Reveal';
import { ContentBlurGate } from './ContentBlurGate';
import headingData from '@/data/sections/cosmic-events.json';

const typeIcons: Record<string, typeof Sparkles> = {
  Eclipse: Sparkles,
  Retrograde: Zap,
  Equinox: Calendar,
  Conjunction: Sparkles,
  'Meteor Shower': Sparkles,
  Ingress: Globe,
};

const intensityConfig: Record<number, { label: string; color: string; dots: number }> = {
  1: { label: 'Subtle', color: 'text-moon-300', dots: 1 },
  2: { label: 'Notable', color: 'text-moon-300', dots: 2 },
  3: { label: 'Moderate', color: 'text-gold-300', dots: 3 },
  4: { label: 'Intense', color: 'text-gold-400', dots: 4 },
  5: { label: 'Peak', color: 'text-gold-500', dots: 5 },
};

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T12:00:00');
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function CosmicEvents({
  events,
  isBlurred = false,
}: {
  events: CosmicEvent[];
  isBlurred?: boolean;
}) {
  if (!events || events.length === 0) return null;

  return (
    <section id="cosmic-events" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number={headingData.heading.number}
        eyebrow={headingData.heading.eyebrow}
        title={headingData.heading.title}
        subtitle={headingData.heading.subtitle}
      />
      <ContentBlurGate isBlurred={isBlurred}>
        <div className="mt-10 space-y-4">
          {events.map((event, i) => {
            const Icon = typeIcons[event.event_type] ?? Sparkles;
            const intensity = intensityConfig[event.intensity] ?? intensityConfig[3];
            const days = daysUntil(event.event_date);
            return (
              <Reveal key={event.id} animation="fade-up" delay={i * 80}>
                <article className="rounded-lg border border-gold-500/20 bg-navy-800/30 p-6 transition-colors hover:border-gold-500/40">
                  <div className="grid gap-4 md:grid-cols-[1fr_220px] md:gap-8">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/25">
                          <Icon className="h-5 w-5 text-gold-300" strokeWidth={1.4} />
                        </span>
                        <div>
                          <h3 className="font-display text-lg font-semibold prose-title">
                            {event.title}
                          </h3>
                          <p className="font-display text-[10px] uppercase tracking-wider text-gold-400">
                            {event.event_type}{event.sign ? ` · ${event.sign}` : ''}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 font-serif text-base leading-relaxed prose-body">
                        {event.description}
                      </p>
                      <p className="mt-3 font-serif text-sm italic leading-relaxed prose-muted">
                        <span className="font-display not-italic text-[10px] uppercase tracking-wider text-gold-400">Guidance · </span>
                        {event.guidance}
                      </p>
                      {event.visibility && (
                        <p className="mt-2 font-serif text-sm italic prose-muted">
                          <span className="font-display not-italic text-[10px] uppercase tracking-wider text-gold-400">Visible · </span>
                          {event.visibility}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-3 md:items-end md:border-l md:border-gold-400/15 md:pl-6">
                      <div className="text-right md:text-right">
                        <p className="font-display text-sm font-semibold prose-title">
                          {formatDate(event.event_date)}
                        </p>
                        <p className="font-serif text-sm italic prose-muted">
                          {days > 0 ? `in ${days} day${days !== 1 ? 's' : ''}` : days === 0 ? 'today' : `${Math.abs(days)} days ago`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, idx) => (
                          <span
                            key={idx}
                            className={`h-1.5 w-1.5 rounded-full ${idx < intensity.dots ? 'bg-gold-400' : 'bg-gold-400/15'}`}
                          />
                        ))}
                      </div>
                      <span className={`font-display text-[10px] font-semibold uppercase tracking-wider ${intensity.color}`}>
                        {intensity.label}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </ContentBlurGate>
      <div className="mt-14"><OrnamentDivider /></div>
    </section>
  );
}