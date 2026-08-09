import { AlertTriangle } from 'lucide-react';
import type { VoidMoonWindow } from '@/lib/types';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';

function formatWindow(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const opts: Intl.DateTimeFormatOptions = {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'UTC',
  };
  return `${start.toLocaleString('en-US', opts)} → ${end.toLocaleString('en-US', opts)} UTC`;
}

export default function VoidMoonTimers({
  windows,
  isBlurred = false,
}: {
  windows: VoidMoonWindow[];
  isBlurred?: boolean;
}) {
  return (
    <section id="void-moon" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number="07"
        onParchment
        eyebrow="Void-of-Course Moon Timers"
        title="When to pause, not push"
        subtitle="Precise windows when the Moon makes no major aspects. Avoid launching, signing, or initiating · rest and reflect instead."
      />
      <ContentBlurGate isBlurred={isBlurred}>
        <div className="mt-10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-gold-500" strokeWidth={1.5} />
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-500">
              Void-of-Course Windows
            </p>
          </div>
          <hr className="gold-rule mt-3" />
          <ul className="mt-2 divide-y divide-gold-400/10">
            {windows.map((w) => (
              <li
                key={w.id}
                className="grid gap-2 py-4 transition-colors hover:bg-cream-200/30 md:grid-cols-[320px_1fr] md:gap-6"
              >
                <span className="font-serif text-base prose-title">
                  {formatWindow(w.start_time, w.end_time)}
                </span>
                <p className="font-serif text-sm italic prose-muted">{w.warning}</p>
              </li>
            ))}
          </ul>
        </div>
      </ContentBlurGate>
      <div className="mt-14"><OrnamentDivider onParchment /></div>
    </section>
  );
}