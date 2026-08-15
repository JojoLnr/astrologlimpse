import { ChevronDown } from 'lucide-react';
import content from '@/data/sections/hero.json';

export default function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-4xl px-6 pt-20 pb-12 text-center">
      <div className="animate-fade-up">
        <div className="mx-auto mb-6 flex max-w-[200px] items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-400/40" />
          <span className="font-ornament text-gold-400 text-base">✦</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-400/40" />
        </div>

        <p className="mb-3 font-display text-[11px] font-medium uppercase tracking-[0.35em] text-gold-400">
          {content.eyebrow}
        </p>

        <h1 className="font-display text-5xl font-medium leading-[1.1] text-cream-50 md:text-6xl lg:text-7xl">
          Astro<span className="text-gold-shine italic">loglimpse</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg font-serif text-lg italic leading-relaxed text-cream-200/60">
          {content.subtitle}
        </p>

        <div className="mx-auto mt-8 flex max-w-[200px] items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-400/40" />
          <span className="font-ornament text-gold-400 text-base">✦</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-400/40" />
        </div>

        <a
          href="#zodiac"
          className="mt-10 inline-flex flex-col items-center gap-1.5 text-gold-400/60 transition-colors hover:text-gold-300"
        >
          <span className="font-display text-[10px] uppercase tracking-[0.3em]">Choose Your Sign</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
