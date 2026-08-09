import { Moon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gold-400/15 bg-navy-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <Moon className="h-5 w-5 text-gold-300" strokeWidth={1.4} />
          <p className="font-display text-base font-semibold uppercase tracking-[0.15em] text-gold-200">
            Celestial Currents
          </p>
          <div className="mx-auto flex max-w-[200px] items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-400/30" />
            <span className="font-ornament text-gold-400/40 text-sm">✦</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-400/30" />
          </div>
          <p className="max-w-md font-serif text-lg italic text-cream-200/50">
            A living guide to the cosmic weather. The planets move · and so can you.
          </p>
          <p className="mt-3 font-display text-[10px] uppercase tracking-[0.2em] text-cream-300/30">
            For reflection and inspiration. Not a substitute for professional guidance.
          </p>
        </div>
      </div>
    </footer>
  );
}