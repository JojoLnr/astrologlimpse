import { Lock, Crown } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAuth } from '@/lib/auth';

export default function PremiumContent({ children }: { children: ReactNode }) {
  const { isPaidMember } = useAuth();

  if (isPaidMember) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div
        className="pointer-events-none select-none opacity-30 [filter:blur(14px)_saturate(0.5)]"
        aria-hidden="true"
      >
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-navy-950/40 backdrop-blur-[2px]">
        <button
          onClick={() => {
            const event = new CustomEvent('open-membership');
            window.dispatchEvent(event);
          }}
          className="flex max-w-xs flex-col items-center gap-3 rounded-2xl border border-gold-400/50 bg-navy-900/95 px-8 py-6 text-center shadow-2xl transition-all hover:border-gold-400/80 hover:bg-navy-900"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
            <Lock className="h-5 w-5 text-gold-300" strokeWidth={1.5} />
          </div>
          <span className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-gold-300">
            Members Only
          </span>
          <span className="flex items-center gap-1.5 font-serif text-sm italic text-cream-200/60">
            <Crown className="h-3.5 w-3.5 text-gold-400" strokeWidth={1.5} />
            Click to unlock full access
          </span>
        </button>
      </div>
    </div>
  );
}
