import { Moon } from 'lucide-react';
import type { LunarPhase } from '@/lib/types';
import { SectionHeading, OrnamentDivider } from './SectionHeading';

function formatPeak(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
    timeZone: 'UTC', timeZoneName: 'short',
  });
}

export default function LunarBlueprint({ phase }: { phase: LunarPhase | null }) {
  if (!phase) return null;

  return (
    <section id="lunar" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number="02"
        eyebrow="Lunar Phase & Ritual Blueprint"
        title="The current moon, decoded"
        subtitle="Exact peak times, the collective sign it activates, and a step-by-step ritual to work with its energy."
      />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        {/* Left: overview */}
        <div>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/25">
              <Moon className="h-7 w-7 text-gold-300" strokeWidth={1.2} />
            </span>
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.25em] text-gold-400">Current Phase</p>
              <h3 className="font-display text-2xl font-semibold prose-title">
                {phase.phase_type} in {phase.zodiac_sign}
              </h3>
            </div>
          </div>
          <p className="mt-4 font-serif text-base italic text-gold-200/60">
            Peak · {formatPeak(phase.peak_time)}
          </p>
          <p className="mt-4 font-display text-sm font-medium uppercase tracking-[0.15em] text-gold-300">
            {phase.theme}
          </p>
          <p className="mt-3 font-serif text-lg leading-relaxed prose-body">{phase.overview}</p>
        </div>

        {/* Right: ritual steps */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-gold-400">Ritual Steps</h4>
          <hr className="gold-rule mt-3" />
          <ol className="mt-6 space-y-5">
            {phase.ritual_steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gold-400/25 font-display text-sm font-semibold text-gold-300">
                  {i + 1}
                </span>
                <p className="pt-1 font-serif text-base leading-relaxed prose-body">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="mt-14"><OrnamentDivider /></div>
    </section>
  );
}
