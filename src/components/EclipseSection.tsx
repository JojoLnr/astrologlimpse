import { Sun, Sparkles, ShieldAlert, Calendar } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import type { ZodiacSign } from './ZodiacSelector';
import eclipseData from '@/data/sections/eclipse.json';

const eclipseInfo = eclipseData.eclipseInfo;
const signEffects: Record<string, string> = eclipseData.signEffects;

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
        eyebrow={eclipseData.heading.eyebrow}
        title={eclipseData.heading.title}
        subtitle={eclipseData.heading.subtitle}
        onParchment={isParchment}
      />

      {/* Hero Section with Redesigned Eclipse Graphic on the Right */}
      <div className="mt-12 flex flex-col items-center gap-8 lg:flex-row-reverse lg:items-center lg:gap-16">
        {/* Redesigned Celestial Eclipse Graphic */}
        <div className="relative flex-shrink-0 flex items-center justify-center p-6">
          <div className="relative h-64 w-64 flex items-center justify-center">
            {/* Outer atmospheric glowing corona */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-amber-500/20 via-gold-400/30 to-amber-200/10 blur-2xl animate-pulse" style={{ animationDuration: '6s' }} />
            
            {/* Rotating subtle orbital particle ring */}
            <div className="absolute inset-0 rounded-full border border-gold-400/20 animate-spin" style={{ animationDuration: '40s' }} />
            <div className="absolute inset-4 rounded-full border border-dashed border-gold-500/15 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '50s' }} />

            {/* Glowing Golden Solar Corona Disc */}
            <div className="absolute h-48 w-48 rounded-full bg-gradient-to-tr from-amber-600 via-gold-400 to-amber-200 shadow-[0_0_60px_rgba(240,205,112,0.35)]" />

            {/* Dark Lunar Silhouette Overlapping with Rim Light (Diamond Ring Effect) */}
            <div className="absolute h-44 w-44 rounded-full bg-navy-950 shadow-2xl translate-x-2 -translate-y-2 border border-gold-300/40 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-950 to-black opacity-90" />
              {/* Diamond ring lens flare gleam at top right */}
              <div className="absolute top-3 right-8 h-3 w-3 rounded-full bg-cream-50 shadow-[0_0_12px_#fff] blur-[0.5px] animate-pulse" style={{ animationDuration: '3s' }} />
            </div>

            {/* Center astrological sun symbol watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-30">
              <span className="font-ornament text-5xl text-gold-200">☉</span>
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
            <span>Peak Window · August 26, 2026</span>
          </div>
        </div>
      </div>

      <div className="mt-14"><OrnamentDivider onParchment={isParchment} /></div>
    </div>
  );
}