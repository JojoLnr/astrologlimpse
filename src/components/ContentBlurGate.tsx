import type { ReactNode } from 'react';
import { Lock, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface ContentBlurGateProps {
  children: ReactNode;
  isBlurred: boolean;
}

export function ContentBlurGate({ children, isBlurred }: ContentBlurGateProps) {
  const { user, isPaidMember } = useAuth();

  if (!isBlurred || isPaidMember) return <>{children}</>;

  const handleClick = () => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth'));
    } else {
      window.dispatchEvent(new CustomEvent('open-membership'));
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="[filter:blur(14px)_saturate(0.4)] opacity-25 select-none pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-navy-950/30 backdrop-blur-[2px]">
        <button
          onClick={handleClick}
          className="flex max-w-xs flex-col items-center gap-4 rounded-2xl border border-gold-400/50 bg-navy-900/95 px-10 py-8 text-center shadow-2xl transition-all hover:border-gold-400/80 hover:bg-navy-900"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
            <Lock className="h-6 w-6 text-gold-300" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-gold-300">
              Subscriber Content
            </p>
            <p className="mt-2 font-serif text-sm italic leading-relaxed text-cream-200/60">
              This reading is reserved for members of the Celestial Currents circle.
            </p>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-5 py-2 font-display text-[11px] font-medium uppercase tracking-[0.15em] text-gold-300 transition-colors hover:bg-gold-400/20">
            {user ? (
              <>
                <Crown className="h-3.5 w-3.5" strokeWidth={1.5} />
                Join to Unlock
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
                Sign In to Unlock
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}

export default ContentBlurGate;
