import { Moon } from 'lucide-react';

const sections = [
  { id: 'transits', label: 'Transits' },
  { id: 'lunar', label: 'Lunar' },
  { id: 'tarot', label: 'Tarot' },
  { id: 'elements', label: 'Elements' },
  { id: 'shadow', label: 'Shadow' },
  { id: 'crystals', label: 'Crystals' },
  { id: 'void-moon', label: 'Void Moon' },
  { id: 'mantras', label: 'Mantras' },
  { id: 'birth-chart', label: 'Birth Chart' },
  { id: 'compatibility', label: 'Synastry' },
  { id: 'fixed-stars', label: 'Fixed Stars' },
  { id: 'sabian', label: 'Sabian' },
  { id: 'planetary-hours', label: 'Hours' },
  { id: 'elemental-modality', label: 'Modality' },
  { id: 'mythology', label: 'Myths' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold-400/15 bg-navy-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <a href="#top" className="flex items-center gap-2.5">
          <Moon className="h-5 w-5 text-gold-300" strokeWidth={1.4} />
          <span className="font-display text-base font-semibold uppercase tracking-[0.15em] text-gold-200">
            Astrologlimpse
          </span>
        </a>
        <nav className="hidden items-center gap-0.5 md:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full px-3 py-1 font-display text-[10px] font-medium uppercase tracking-wider text-cream-200/50 transition-colors hover:text-gold-300"
            >
              {s.label}
            </a>
          ))}
        </nav>
        <span className="font-serif text-sm italic text-gold-400/60">Aug 2026</span>
      </div>
    </header>
  );
}