import { Sun, Sparkles, ShieldAlert, Calendar } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import type { ZodiacSign } from './ZodiacSelector';

const eclipseInfo = {
  type: 'Total Solar Eclipse',
  sign: 'Leo',
  visibility: 'Partial across Europe, total in Arctic & parts of Russia',
  magnitude: '1.039',
  duration: '2 min 18 sec (totality)',
  peakUTC: '19:44 UTC',
  saros: 'Saros 129',
};

const signEffects: Record<string, string> = {
  Aries: 'A creative project or romantic situation reaches a turning point. Your courage is being tested — not to fight, but to create.',
  Taurus: 'A home, family, or financial matter shifts. What you have been building slowly is ready for its next phase. Trust the foundation.',
  Gemini: 'A conversation, idea, or sibling connection sparks a new direction. Your words carry more weight than usual — use them carefully.',
  Cancer: 'Your relationship with money and self-worth is being recalibrated. Release a scarcity story that no longer belongs to you.',
  Leo: 'This is YOUR eclipse. A reinvention of identity, appearance, or life direction is underway. Step into the version of yourself you have been becoming.',
  Virgo: 'A private chapter closes so a public one can begin. Rest, retreat, and listen to your dreams — they are especially clear now.',
  Libra: 'A friendship, community, or long-held dream is restructured. The people around you are mirrors; notice what they reflect.',
  Scorpio: 'Your career or public role is eclipsed and reborn. A responsibility you have outgrown is being cleared from your path.',
  Sagittarius: 'A belief, worldview, or travel plan expands or shifts. What you thought was true is being updated — let it.',
  Capricorn: 'A financial partnership, investment, or deep attachment transforms. Shared resources are being rebalanced.',
  Aquarius: 'A significant relationship reaches its threshold. The question is not whether to commit, but to what and to whom.',
  Pisces: 'A daily routine, health practice, or work project resets. Small habits seeded now compound for the next six months.',
};

export default function EclipseSection({
  selectedSign,
  number = '01',
  theme = 'section-navy',
}: {
  selectedSign: ZodiacSign | null;
  number?: string;
  theme?: 'section-navy' | 'section-parchment';
}) {
  const isParchment = theme === 'section-parchment';

  return (
    <div id="eclipse" className="relative mx-auto max-w-7xl px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: isParchment
            ? 'radial-gradient(1px 1px at 20% 30%, #0b1333, transparent), radial-gradient(1px 1px at 60% 70%, #0b1333, transparent), radial-gradient(1px 1px at 85% 20%, #0b1333, transparent), radial-gradient(1px 1px at 35% 85%, #0b1333, transparent)'
            : 'radial-gradient(1px 1px at 20% 30%, #f0cd70, transparent), radial-gradient(1px 1px at 60% 70%, #f0cd70, transparent), radial-gradient(1px 1px at 85% 20%, #f0cd70, transparent), radial-gradient(1px 1px at 35% 85%, #f0cd70, transparent)',
          backgroundSize: '200px 200px',
        }}
      />

      <SectionHeading
        number={number}
        eyebrow="August 12, 2026"
        title="The Great Solar Eclipse"
        subtitle="A total solar eclipse in Leo — a portal of creative reinvention. Navigating astronomy, astrology, and personal alignment."
        onParchment={isParchment}
      />

      {/* Hero Section with Visual on the Right */}
      <div className="mt-12 flex flex-col items-center gap-8 lg:flex-row-reverse lg:items-center lg:gap-16">
        {/* Visual on the Right */}
        <div className="relative flex-shrink-0">
          <div className="relative h-64 w-64">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-navy-900 animate-twinkle-soft" style={{ animationDuration: '12s' }} />
            <div className="absolute inset-4 rounded-full bg-navy-950 shadow-2xl shadow-navy-950" />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(240,205,112,0.15) 50%, transparent 65%)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-ornament text-6xl text-gold-400/30">☉</span>
            </div>
          </div>
        </div>

        {/* Specs on the Left */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { label: 'Type', value: eclipseInfo.type },
              { label: 'Zodiac Sign', value: eclipseInfo.sign },
              { label: 'Peak Time', value: eclipseInfo.peakUTC },
              { label: 'Totality', value: eclipseInfo.duration },
              { label: 'Magnitude', value: eclipseInfo.magnitude },
              { label: 'Saros Cycle', value: eclipseInfo.saros },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-lg border p-4 ${
                  isParchment
                    ? 'border-gold-500/25 bg-cream-50/60'
                    : 'border-gold-500/30 bg-navy-900/60'
                }`}
              >
                <p className={`font-display text-[9px] font-semibold uppercase tracking-[0.15em] ${isParchment ? 'text-gold-600' : 'text-gold-400'}`}>
                  {item.label}
                </p>
                <p className={`mt-1.5 font-serif text-base ${isParchment ? 'text-navy-900' : 'text-cream-50'}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <p className={`mt-5 font-serif text-base italic leading-relaxed ${isParchment ? 'text-navy-800/70' : 'text-cream-200/70'}`}>
            Visibility: {eclipseInfo.visibility}
          </p>
        </div>
      </div>

      <hr className="gold-rule my-12" />

      {/* Compact Two-Column Info & Personal Sign Forecast */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Core Astrological & Safety Summary */}
        <div
          className={`space-y-6 rounded-xl border p-6 sm:p-8 ${
            isParchment
              ? 'border-gold-500/20 bg-cream-50/50 text-navy-900'
              : 'border-gold-500/30 bg-navy-900/50 text-cream-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-gold-500" strokeWidth={1.5} />
            <h3 className={`font-display text-sm font-semibold uppercase tracking-[0.15em] ${isParchment ? 'text-navy-900' : 'text-cream-50'}`}>
              Core Astrological Meaning
            </h3>
          </div>
          <p className={`font-serif text-base leading-relaxed ${isParchment ? 'text-navy-800/85' : 'text-cream-100/85'}`}>
            This eclipse falls in Leo, a fixed fire sign ruled by the Sun. Eclipses in Leo speak to identity, creative self-expression, and the courage to be seen. A solar eclipse is a supercharged New Moon — a portal for bold beginnings, but only after something old has been released. Expect sudden clarity about who you are and what you are here to create.
          </p>

          <div className={`pt-4 border-t ${isParchment ? 'border-gold-500/15' : 'border-gold-500/30'}`}>
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-5 w-5 text-gold-500" strokeWidth={1.5} />
              <h3 className={`font-display text-sm font-semibold uppercase tracking-[0.15em] ${isParchment ? 'text-navy-900' : 'text-cream-50'}`}>
                Guidance & Precautions
              </h3>
            </div>
            <p className={`mt-3 font-serif text-base leading-relaxed ${isParchment ? 'text-navy-800/85' : 'text-cream-100/85'}`}>
              Avoid impulsive decisions around career or relationships during the three-day window. Use this portal for inner journaling, creative intention-setting, and observing what is revealed.
            </p>
          </div>
        </div>

        {/* Selected Sign Personal Forecast */}
        <div
          className={`flex flex-col justify-between rounded-xl border-2 p-6 sm:p-8 ${
            isParchment
              ? 'border-gold-400/40 bg-gold-400/10 text-navy-900'
              : 'border-gold-400/40 bg-gold-400/15 text-cream-50'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className={`font-display text-[10px] font-semibold uppercase tracking-[0.2em] ${isParchment ? 'text-gold-700' : 'text-gold-300'}`}>
                Personalized Forecast
              </span>
              <span className={`font-display text-xs font-bold uppercase tracking-widest ${isParchment ? 'text-navy-900' : 'text-cream-50'}`}>
                {selectedSign ? selectedSign : 'General Collective'}
              </span>
            </div>
            <h3 className={`mt-2 font-display text-2xl font-semibold ${isParchment ? 'text-navy-900' : 'text-cream-50'}`}>
              {selectedSign ? `How the Eclipse Shapes ${selectedSign}` : 'Select Your Sign Above'}
            </h3>
            <p className={`mt-4 font-serif text-lg leading-relaxed ${isParchment ? 'text-navy-900/90' : 'text-cream-100/90'}`}>
              {selectedSign && signEffects[selectedSign]
                ? signEffects[selectedSign]
                : 'Select your zodiac sign at the top of the page to unlock your custom eclipse forecast and tailored insights for this celestial portal.'}
            </p>
          </div>
          <div className={`mt-8 pt-4 border-t flex items-center gap-2 text-xs font-display uppercase tracking-wider ${isParchment ? 'border-gold-500/20 text-gold-700' : 'border-gold-500/40 text-gold-300'}`}>
            <Calendar className="h-4 w-4" />
            <span>Peak Window · August 12, 2026</span>
          </div>
        </div>
      </div>

      <div className="mt-14"><OrnamentDivider onParchment={isParchment} /></div>
    </div>
  );
}