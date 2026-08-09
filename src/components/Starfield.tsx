import { useMemo } from 'react';

interface Star {
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
}

interface DustParticle {
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
  drift: string;
}

export default function Starfield({ variant = 'navy' }: { variant?: 'navy' | 'cream' }) {
  const stars = useMemo<Star[]>(() => {
    const arr: Star[] = [];
    for (let i = 0; i < 40; i++) {
      arr.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 1.2 + 0.4,
        delay: `${Math.random() * 6}s`,
        duration: `${5 + Math.random() * 6}s`,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }
    return arr;
  }, []);

  const dust = useMemo<DustParticle[]>(() => {
    const arr: DustParticle[] = [];
    for (let i = 0; i < 25; i++) {
      arr.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 3,
        delay: `${Math.random() * 8}s`,
        duration: `${12 + Math.random() * 14}s`,
        drift: `${(Math.random() - 0.5) * 40}px`,
      });
    }
    return arr;
  }, []);

  const starColor = variant === 'cream' ? 'bg-navy-700/20' : 'bg-gold-100';

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {variant === 'navy' && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(23,36,96,0.35), transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(16,27,72,0.25), transparent 70%)',
          }}
        />
      )}
      {stars.map((s, i) => (
        <div
          key={`star-${i}`}
          className={`absolute rounded-full ${starColor} animate-twinkle-soft`}
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
      {variant === 'navy' &&
        dust.map((d, i) => (
          <div
            key={`dust-${i}`}
            className="absolute rounded-full bg-gold-300/20 animate-gold-dust"
            style={{
              top: d.top,
              left: d.left,
              width: `${d.size}px`,
              height: `${d.size}px`,
              animationDelay: d.delay,
              animationDuration: d.duration,
              '--drift': d.drift,
            } as React.CSSProperties}
          />
        ))}
      {variant === 'navy' && (
        <>
          <div className="absolute top-[6%] right-[8%] h-56 w-56 rounded-full bg-gold-400/3 blur-3xl animate-float-soft" />
          <div className="absolute bottom-[12%] left-[4%] h-64 w-64 rounded-full bg-navy-600/15 blur-3xl animate-float-soft" style={{ animationDelay: '9s' }} />
        </>
      )}
    </div>
  );
}
