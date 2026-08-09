import { useState } from 'react';
import { ContentBlurGate } from './ContentBlurGate';

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

const signGlyphs: Record<string, string> = {
  Aries: '♈\uFE0E', Taurus: '♉\uFE0E', Gemini: '♊\uFE0E', Cancer: '♋\uFE0E',
  Leo: '♌\uFE0E', Virgo: '♍\uFE0E', Libra: '♎\uFE0E', Scorpio: '♏\uFE0E',
  Sagittarius: '♐\uFE0E', Capricorn: '♑\uFE0E', Aquarius: '♒\uFE0E', Pisces: '♓\uFE0E',
};

export default function ZodiacSelector({
  selected,
  onSelect,
  isBlurred = false,
}: {
  selected: ZodiacSign | null;
  onSelect: (sign: ZodiacSign) => void;
  isBlurred?: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="zodiac" className="mx-auto max-w-4xl px-6 py-12 text-center">
      <p className="mb-2 font-display text-[11px] font-medium uppercase tracking-[0.3em] text-gold-400">
        Personalize Your Reading
      </p>
      <h2 className="font-display text-2xl font-medium prose-title md:text-3xl">
        Select Your Star Sign
      </h2>
      <p className="mx-auto mt-3 max-w-md font-serif text-base italic prose-sub">
        The layout below adapts to your sign · revealing a tailored reading alongside the collective forecast.
      </p>

      <ContentBlurGate isBlurred={isBlurred}>
        <div className="mt-8 grid grid-cols-6 gap-1.5 sm:gap-2 md:max-w-2xl md:mx-auto">
          {ZODIAC_SIGNS.map((sign) => {
            const isSelected = selected === sign;
            const isHovered = hovered === sign;
            return (
              <button
                key={sign}
                onClick={() => onSelect(sign)}
                onMouseEnter={() => setHovered(sign)}
                onMouseLeave={() => setHovered(null)}
                className={`group flex flex-col items-center gap-1 rounded-lg py-3 transition-all duration-200 ${
                  isSelected
                    ? 'bg-gold-400/15 ring-1 ring-gold-400/40'
                    : isHovered
                      ? 'bg-navy-700/40'
                      : 'bg-transparent'
                }`}
              >
                <span
                  className={`font-display text-xl transition-colors ${
                    isSelected ? 'text-gold-300' : isHovered ? 'text-gold-300' : 'text-cream-200/40'
                  }`}
                  style={{ fontVariantEmoji: 'text', fontFamily: "'Cinzel', Georgia, serif", fontStyle: 'normal' }}
                >
                  {signGlyphs[sign]}
                </span>
                <span
                  className={`font-display text-[8px] uppercase tracking-wider transition-colors ${
                    isSelected ? 'text-gold-300' : isHovered ? 'text-cream-100/70' : 'text-cream-200/30'
                  }`}
                >
                  {sign}
                </span>
              </button>
            );
          })}
        </div>
      </ContentBlurGate>
    </section>
  );
}