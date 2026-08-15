import { Moon, User, Crown } from 'lucide-react';
import { useAuth } from '@/lib/auth';

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
  const { user, isPaidMember, loading } = useAuth();

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
        <div className="flex items-center gap-3">
          {!loading && user ? (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-account'))}
              className="flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/5 px-3.5 py-1.5 transition-all hover:border-gold-400/40 hover:bg-gold-400/10"
            >
              {isPaidMember ? (
                <Crown className="h-3.5 w-3.5 text-gold-300" strokeWidth={1.8} />
              ) : (
                <User className="h-3.5 w-3.5 text-cream-200/60" strokeWidth={1.8} />
              )}
              <span className="font-display text-[10px] font-semibold uppercase tracking-wider text-gold-200">
                {isPaidMember ? 'Member' : 'Account'}
              </span>
            </button>
          ) : !loading ? (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-auth'))}
              className="rounded-full border border-cream-200/15 px-3.5 py-1.5 font-display text-[10px] font-semibold uppercase tracking-wider text-cream-200/60 transition-all hover:border-gold-400/30 hover:text-gold-300"
            >
              Sign In
            </button>
          ) : null}
          <span className="hidden font-serif text-sm italic text-gold-400/60 sm:inline">Aug 2026</span>
        </div>
      </div>
    </header>
  );
}
