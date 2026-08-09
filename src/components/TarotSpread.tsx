import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import type { TarotCard } from '@/lib/types';
import { SectionHeading, OrnamentDivider } from './SectionHeading';

export default function TarotSpread({ cards }: { cards: TarotCard[] }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setRevealed((prev) => { const n = new Set(prev); n.add(i); return n; });

  const revealAll = () => setRevealed(new Set(cards.map((_, i) => i)));

  return (
    <section id="tarot" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number="03"
        onParchment
        eyebrow="Collective Tarot & Oracle Spread"
        title="A five-card reading for the collective"
        subtitle="Each card maps to a dimension of the current cosmic energy. Tap a card to reveal its message."
      />
      <div className="mt-6 flex justify-end">
        <button
          onClick={revealAll}
          className="inline-flex items-center gap-2 font-display text-[10px] font-medium uppercase tracking-wider text-gold-300/80 transition-colors hover:text-gold-200"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Reveal All
        </button>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card, i) => {
          const isRevealed = revealed.has(i);
          return (
            <button
              key={card.id}
              onClick={() => toggle(i)}
              className="group relative h-80 text-left [perspective:1000px]"
            >
              <div
                className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
                style={{ transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                {/* Back */}
                <div className="absolute inset-0 flex items-center justify-center rounded-lg border border-gold-400/20 bg-navy-800 [backface-visibility:hidden]">
                  <span className="font-ornament text-3xl text-gold-400/30 transition-transform duration-300 group-hover:scale-110">✦</span>
                </div>
                {/* Front */}
                <div className="absolute inset-0 flex flex-col rounded-lg border border-gold-400/25 bg-navy-800 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                    {card.position_label}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold leading-tight text-cream-50">
                    {card.card_name}
                  </h3>
                  <p className={`mt-1 font-display text-[10px] font-medium uppercase tracking-wider ${card.upright ? 'text-moon-300' : 'text-gold-500'}`}>
                    {card.upright ? 'Upright' : 'Reversed'}
                  </p>
                  <p className="mt-3 font-serif text-sm italic leading-relaxed text-cream-200/45">{card.card_meaning}</p>
                  <p className="mt-auto font-serif text-sm leading-relaxed text-cream-200/75">{card.interpretation}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-14"><OrnamentDivider onParchment /></div>
    </section>
  );
}
