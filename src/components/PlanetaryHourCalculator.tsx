import { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Mars, MessageSquare, Sparkles, Heart, Mountain } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';

const planetOrder = [
  { name: 'Sun', icon: Sun, color: 'text-gold-300', glyph: '☉\uFE0E', domain: 'Vitality, leadership, visibility' },
  { name: 'Venus', icon: Heart, color: 'text-moon-300', glyph: '♀\uFE0E', domain: 'Love, beauty, harmony, art' },
  { name: 'Mercury', icon: MessageSquare, color: 'text-gold-200', glyph: '☿\uFE0E', domain: 'Communication, trade, learning' },
  { name: 'Moon', icon: Moon, color: 'text-cream-100', glyph: '☽\uFE0E', domain: 'Intuition, emotion, home, family' },
  { name: 'Saturn', icon: Mountain, color: 'text-gold-500', glyph: '♄\uFE0E', domain: 'Discipline, structure, boundaries' },
  { name: 'Jupiter', icon: Sparkles, color: 'text-gold-400', glyph: '♃\uFE0E', domain: 'Expansion, luck, wisdom, growth' },
  { name: 'Mars', icon: Mars, color: 'text-red-400', glyph: '♂\uFE0E', domain: 'Action, courage, energy, drive' },
];

const chaldeanOrder = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
const dayRulers = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

function getCurrentPlanetaryHour(date: Date) {
  const hour = date.getHours();
  const isDaytime = hour >= 6 && hour < 18;

  const dayStart = new Date(date);
  dayStart.setHours(6, 0, 0, 0);

  const nightStart = new Date(date);
  nightStart.setHours(18, 0, 0, 0);
  if (hour < 6) {
    nightStart.setDate(nightStart.getDate() - 1);
  }

  const periodStart = isDaytime ? dayStart : nightStart;
  const elapsed = (date.getTime() - periodStart.getTime()) / (1000 * 60);
  const periodLength = 12 * 60;
  const planetaryHourLength = periodLength / 7;

  const rawHourIndex = Math.floor(elapsed / planetaryHourLength);
  const hourIndex = Math.max(0, Math.min(6, rawHourIndex));
  const minutesIntoHour = elapsed - hourIndex * planetaryHourLength;
  const minutesLeft = Math.max(0, planetaryHourLength - minutesIntoHour);

  const dayOfWeek = date.getDay();
  const dayRuler = dayRulers[dayOfWeek];
  const dayRulerIdx = chaldeanOrder.indexOf(dayRuler);
  const rulerIdx = ((dayRulerIdx + hourIndex) % 7 + 7) % 7;
  const currentRuler = chaldeanOrder[rulerIdx] ?? chaldeanOrder[0];
  const nextRuler = chaldeanOrder[(rulerIdx + 1) % 7];

  return {
    currentRuler,
    nextRuler,
    isDaytime,
    hourIndex: hourIndex + 1,
    minutesLeft: Math.round(minutesLeft),
    totalHours: 7,
  };
}

function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function PlanetaryHourCalculator({ isBlurred = false }: { isBlurred?: boolean }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const info = getCurrentPlanetaryHour(now);
  const currentPlanet = planetOrder.find((p) => p.name === info.currentRuler) ?? planetOrder[0];
  const nextPlanet = planetOrder.find((p) => p.name === info.nextRuler) ?? planetOrder[1];
  const CurrentIcon = currentPlanet.icon;
  const NextIcon = nextPlanet.icon;

  return (
    <section id="planetary-hours" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number="13"
        onParchment
        eyebrow="Planetary Hour Calculator"
        title="The sacred clock of the day"
        subtitle="Each hour of the day is ruled by a planet, following the ancient Chaldean order. Time your actions to align with the ruling planet's energy."
      />

      <ContentBlurGate isBlurred={isBlurred}>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Current hour display */}
          <div className="rounded-lg border border-gold-500/25 bg-cream-50/40 p-8">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold-600" strokeWidth={1.5} />
              <p className="font-display text-[10px] uppercase tracking-[0.2em] text-gold-600">
                Current Time · {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-6">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold-500/30">
                <CurrentIcon className={`h-10 w-10 ${currentPlanet.color}`} strokeWidth={1.2} />
              </span>
              <div>
                <p className="font-display text-[10px] uppercase tracking-[0.2em] prose-muted">
                  {info.isDaytime ? 'Day' : 'Night'} Hour {info.hourIndex} of {info.totalHours}
                </p>
                <h3 className="font-display text-3xl font-semibold text-navy-900">
                  Hour of {currentPlanet.name} <span className="text-gold-600">{currentPlanet.glyph}</span>
                </h3>
                <p className="mt-1 font-serif text-base italic prose-muted">
                  {formatMinutes(info.minutesLeft)} remaining
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-md border border-gold-500/15 bg-white/40 p-4">
              <p className="font-display text-[10px] uppercase tracking-wider text-gold-600">Best For</p>
              <p className="mt-2 font-serif text-lg leading-relaxed prose-body">{currentPlanet.domain}</p>
            </div>

            {/* Next hour preview */}
            <div className="mt-4 flex items-center gap-3 rounded-md border border-gold-500/10 bg-white/20 p-4">
              <NextIcon className={`h-5 w-5 ${nextPlanet.color}`} strokeWidth={1.4} />
              <div>
                <p className="font-display text-[10px] uppercase tracking-wider prose-muted">Next Hour</p>
                <p className="font-serif text-base prose-body">
                  {nextPlanet.name} <span className="text-gold-600">{nextPlanet.glyph}</span> — {nextPlanet.domain}
                </p>
              </div>
            </div>
          </div>

          {/* Full day schedule */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-navy-800">
              Today's Planetary Hours
            </h3>
            <hr className="gold-rule mt-3" />
            <ul className="mt-4 space-y-1.5">
              {(() => {
                const dayOfWeek = now.getDay();
                const dayRuler = dayRulers[dayOfWeek];
                const startIdx = chaldeanOrder.indexOf(dayRuler);
                const hours = [];
                for (let i = 0; i < 7; i++) {
                  const ruler = chaldeanOrder[(startIdx + i) % 7];
                  const planet = planetOrder.find((p) => p.name === ruler) ?? planetOrder[0];
                  const Icon = planet.icon;
                  const isCurrent = i === info.hourIndex - 1;
                  hours.push(
                    <li
                      key={i}
                      className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${
                        isCurrent ? 'bg-gold-400/15 ring-1 ring-gold-500/30' : 'hover:bg-cream-200/30'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${planet.color}`} strokeWidth={1.5} />
                      <span className="font-display text-[11px] font-semibold uppercase tracking-wide prose-title">
                        {planet.name} {planet.glyph}
                      </span>
                      <span className="ml-auto font-serif text-sm italic prose-muted">
                        {planet.domain.split(',')[0]}
                      </span>
                    </li>
                  );
                }
                return hours;
              })()}
            </ul>
            <p className="mt-4 font-serif text-sm italic prose-muted">
              Hours alternate between day (6am–6pm) and night (6pm–6am) periods. The cycle repeats endlessly.
            </p>
          </div>
        </div>
      </ContentBlurGate>

      <div className="mt-14"><OrnamentDivider onParchment /></div>
    </section>
  );
}