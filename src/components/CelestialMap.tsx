import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';
import headingData from '@/data/sections/celestial-map.json';

// Base positions (ecliptic degrees) for Aug 8 2026
const PLANETS_BASE = [
  { name: 'Mercury', symbol: '☿\uFE0E', deg: 165, orbitR: 48,  size: 5,   color: '#d4a430', dailyMotion: 4.0 },
  { name: 'Venus',   symbol: '♀\uFE0E', deg: 120, orbitR: 72,  size: 6,   color: '#f0cd72', dailyMotion: 1.2 },
  { name: 'Earth',   symbol: '⊕\uFE0E', deg: 42,  orbitR: 98,  size: 5.5, color: '#3a6ea8', dailyMotion: 0.98, hasMoon: true },
  { name: 'Mars',    symbol: '♂\uFE0E', deg: 195, orbitR: 124, size: 5.5, color: '#e07040', dailyMotion: 0.52 },
  { name: 'Jupiter', symbol: '♃\uFE0E', deg: 138, orbitR: 150, size: 10,  color: '#d4a430', dailyMotion: 0.083 },
  { name: 'Saturn',  symbol: '♄\uFE0E', deg: 322, orbitR: 175, size: 9,   color: '#a87b18', dailyMotion: 0.033 },
  { name: 'Uranus',  symbol: '♅\uFE0E', deg: 58,  orbitR: 196, size: 7,   color: '#7db8d0', dailyMotion: 0.011 },
  { name: 'Neptune', symbol: '♆\uFE0E', deg: 2,   orbitR: 215, size: 7,   color: '#6080c8', dailyMotion: 0.006 },
];

const ZODIAC = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
];

const ZODIAC_GLYPHS: Record<string, string> = {
  Aries:'♈\uFE0E',Taurus:'♉\uFE0E',Gemini:'♊\uFE0E',Cancer:'♋\uFE0E',Leo:'♌\uFE0E',Virgo:'♍\uFE0E',
  Libra:'♎\uFE0E',Scorpio:'♏\uFE0E',Sagittarius:'♐\uFE0E',Capricorn:'♑\uFE0E',Aquarius:'♒\uFE0E',Pisces:'♓\uFE0E',
};

const ZODIAC_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

function degToXY(deg: number, r: number, cx: number, cy: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function degToSign(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  const idx = Math.floor(normalized / 30);
  return ZODIAC_NAMES[idx];
}

function degToSignDegree(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  const degInSign = Math.floor(normalized % 30);
  return `${degInSign}°`;
}

// Visual rotation speed for each planet (degrees per frame at ~60fps)
const VISUAL_SPEEDS: Record<string, number> = {
  Mercury: 0.35,
  Venus: 0.22,
  Earth: 0.18,
  Mars: 0.12,
  Jupiter: 0.06,
  Saturn: 0.04,
  Uranus: 0.025,
  Neptune: 0.018,
};

interface StarDot { cx: number; cy: number; r: number; }

export default function CelestialMap({ isBlurred = false }: { isBlurred?: boolean }) {
  const size = 500;
  const cx = size / 2;
  const cy = size / 2;

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  }, []);

  const [dayOffset, setDayOffset] = useState<number | null>(null);
  const [animDegrees, setAnimDegrees] = useState<Record<string, number>>({});
  const rafRef = useRef<number>(0);
  const animDegRef = useRef<Record<string, number>>({});

  // Initialize animation degrees from base positions
  useEffect(() => {
    const init: Record<string, number> = {};
    for (const p of PLANETS_BASE) {
      init[p.name] = p.deg;
    }
    animDegRef.current = init;
    setAnimDegrees(init);
  }, []);

  // Auto-rotate animation when no date is selected (dayOffset === null)
  useEffect(() => {
    if (dayOffset !== null) return;

    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(100, now - lastTime) / 16.67; // normalize to ~60fps
      lastTime = now;

      const next = { ...animDegRef.current };
      for (const p of PLANETS_BASE) {
        const speed = VISUAL_SPEEDS[p.name] ?? 0.1;
        next[p.name] = (next[p.name] + speed * dt) % 360;
      }
      animDegRef.current = next;
      setAnimDegrees(next);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [dayOffset]);

  const handleSliderChange = useCallback((val: number) => {
    setDayOffset(val);
    const synced: Record<string, number> = {};
    for (const p of PLANETS_BASE) {
      synced[p.name] = ((p.deg + p.dailyMotion * val) % 360 + 360) % 360;
    }
    animDegRef.current = synced;
    setAnimDegrees(synced);
  }, []);

  const selectedDate = useMemo(() => {
    if (dayOffset === null) return today;
    const d = new Date(today);
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [today, dayOffset]);

  const planets = useMemo(() => {
    return PLANETS_BASE.map((p) => {
      const deg = dayOffset === null
        ? (animDegrees[p.name] ?? p.deg)
        : ((p.deg + p.dailyMotion * dayOffset) % 360 + 360) % 360;
      return { ...p, deg };
    });
  }, [dayOffset, animDegrees]);

  const stars = useMemo<StarDot[]>(() => {
    const arr: StarDot[] = [];
    for (let i = 0; i < 80; i++) {
      const t = (i * 137.508) % 360;
      const r = 10 + (i * 73.1) % 235;
      const rad = (t * Math.PI) / 180;
      arr.push({
        cx: cx + r * Math.cos(rad),
        cy: cy + r * Math.sin(rad),
        r: 0.4 + (i % 3) * 0.4,
      });
    }
    return arr;
  }, [cx, cy]);

  const quickJumps = [
    { offset: 0, label: 'Today' },
    { offset: 7, label: '+1 wk' },
    { offset: 14, label: '+2 wks' },
    { offset: 21, label: '+3 wks' },
    { offset: 30, label: '+1 mo' },
  ];

  const isAutoRotating = dayOffset === null;

  return (
    <section id="celestial-map" className="section-navy mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number={headingData.heading.number}
        eyebrow={headingData.heading.eyebrow}
        title={headingData.heading.title}
        subtitle={headingData.heading.subtitle}
      />

      <ContentBlurGate isBlurred={isBlurred}>
        {/* Date selector */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gold-400" strokeWidth={1.5} />
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
              {isAutoRotating
                ? 'Live · Planets rotating in real time'
                : selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDayOffset((d) => Math.max(0, (d ?? 0) - 1))}
                disabled={dayOffset !== null && dayOffset === 0}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gold-400/20 text-gold-300 transition-colors hover:border-gold-400/50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <input
                type="range"
                min={0}
                max={30}
                value={dayOffset ?? 0}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="celestial-slider flex-1"
                aria-label="Days from today"
              />
              <button
                onClick={() => setDayOffset((d) => Math.min(30, (d ?? -1) + 1))}
                disabled={dayOffset !== null && dayOffset === 30}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gold-400/20 text-gold-300 transition-colors hover:border-gold-400/50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-1.5">
              {quickJumps.map((btn) => (
                <button
                  key={btn.offset}
                  onClick={() => handleSliderChange(btn.offset)}
                  className={`flex-shrink-0 rounded-md px-3 py-1.5 font-display text-[10px] font-medium uppercase tracking-wider transition-all ${
                    dayOffset === btn.offset
                      ? 'bg-gold-400/20 text-gold-300 ring-1 ring-gold-400/40'
                      : 'text-cream-200/50 hover:bg-navy-700/40 hover:text-gold-300'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
              {isAutoRotating && (
                <button
                  onClick={() => setDayOffset(null)}
                  className="flex-shrink-0 rounded-md px-3 py-1.5 font-display text-[10px] font-medium uppercase tracking-wider bg-gold-400/10 text-gold-300 ring-1 ring-gold-400/30"
                >
                  Live
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-14">
          {/* SVG Orrery */}
          <div className="w-full max-w-[500px] flex-shrink-0">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full" aria-label="Celestial positions map">
              <circle cx={cx} cy={cy} r={cx - 4} fill="#09102a" />
              {stars.map((s, i) => (
                <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#faedb8" opacity="0.35" />
              ))}
              <circle cx={cx} cy={cy} r={238} fill="none" stroke="rgba(212,164,48,0.18)" strokeWidth="1" />
              <circle cx={cx} cy={cy} r={228} fill="none" stroke="rgba(212,164,48,0.10)" strokeWidth="1" />

              {ZODIAC.map((sign, i) => {
                const startDeg = i * 30 - 90;
                const midDeg = startDeg + 15;
                const innerR = 220;
                const outerR = 238;
                const labelR = 246;
                const s = { x: cx + innerR * Math.cos((startDeg * Math.PI) / 180), y: cy + innerR * Math.sin((startDeg * Math.PI) / 180) };
                const e = { x: cx + outerR * Math.cos((startDeg * Math.PI) / 180), y: cy + outerR * Math.sin((startDeg * Math.PI) / 180) };
                const lp = { x: cx + labelR * Math.cos((midDeg * Math.PI) / 180), y: cy + labelR * Math.sin((midDeg * Math.PI) / 180) };
                return (
                  <g key={sign}>
                    <line x1={s.x} y1={s.y} x2={e.x} y2={e.y} stroke="rgba(212,164,48,0.30)" strokeWidth="1" />
                    <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central" fontSize="10" fill="rgba(212,164,48,0.65)" fontFamily="Georgia, serif" style={{ fontVariantEmoji: 'text' }}>
                      {ZODIAC_GLYPHS[sign]}
                    </text>
                  </g>
                );
              })}

              {planets.map((p) => (
                <circle key={`orbit-${p.name}`} cx={cx} cy={cy} r={p.orbitR} fill="none" stroke="rgba(212,164,48,0.12)" strokeWidth="1" strokeDasharray="3 4" />
              ))}

              <circle cx={cx} cy={cy} r={22} fill="url(#sunGrad)" />
              <circle cx={cx} cy={cy} r={24} fill="none" stroke="rgba(212,164,48,0.5)" strokeWidth="1" />
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="14" fill="#f7edcf" fontFamily="Georgia" style={{ fontVariantEmoji: 'text' }}>☉</text>

              {planets.map((p) => {
                const pos = degToXY(p.deg, p.orbitR, cx, cy);
                return (
                  <g key={p.name} style={{ transition: isAutoRotating ? 'none' : 'transform 1s ease-in-out' }}>
                    <g transform={`translate(${pos.x}, ${pos.y})`}>
                      <circle cx={0} cy={0} r={p.size + 4} fill={p.color} opacity="0.15" />
                      <circle cx={0} cy={0} r={p.size} fill={p.color} opacity="0.90" />
                      {p.hasMoon && (
                        <g className="animate-orbit-slow" style={{ transformOrigin: '0px 0px', animationDuration: '6s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}>
                          <g transform="translate(12, 0)"><circle cx={0} cy={0} r={3} fill="#c0b090" opacity="0.85" /></g>
                        </g>
                      )}
                      <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontSize={p.size * 1.3} fill="#09102a" fontFamily="Georgia" fontWeight="bold" style={{ fontVariantEmoji: 'text' }}>{p.symbol}</text>
                      <text x={0} y={p.size + 10} textAnchor="middle" fontSize="7.5" fill="rgba(247,237,207,0.70)" fontFamily="Georgia, serif" letterSpacing="0.5">{p.name}</text>
                    </g>
                  </g>
                );
              })}

              <defs>
                <radialGradient id="sunGrad" cx="40%" cy="35%">
                  <stop offset="0%" stopColor="#faedb8" />
                  <stop offset="60%" stopColor="#d4a430" />
                  <stop offset="100%" stopColor="#a87b18" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* Planet legend */}
          <div className="w-full max-w-sm">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-400">
              {isAutoRotating
                ? 'Live positions · Rotating'
                : `Positions · ${selectedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
            </p>
            <hr className="gold-rule mt-3" />
            <ul className="mt-4 space-y-3">
              {planets.map((p) => {
                const sign = degToSign(p.deg);
                const signDeg = degToSignDegree(p.deg);
                return (
                  <li key={p.name} className="grid grid-cols-[28px_100px_1fr] items-baseline gap-2">
                    <span className="font-serif text-base text-gold-300" style={{ fontVariantEmoji: 'text' }}>{p.symbol}</span>
                    <span className="font-display text-[11px] font-semibold uppercase tracking-wide text-cream-100">
                      {p.name} <span className="text-gold-400/70">in</span> {sign}
                    </span>
                    <span className="prose-body font-serif text-sm italic">{signDeg} {sign}</span>
                  </li>
                );
              })}
            </ul>
            <hr className="gold-rule mt-6" />
            <p className="mt-4 font-serif text-sm italic prose-muted">
              {isAutoRotating
                ? 'The planets are rotating in real time at their relative speeds. Use the slider or quick-jump buttons above to pause and explore a specific date.'
                : 'Planet positions are approximate ecliptic degrees for educational reference. Use the slider to see how the planets shift day by day.'}
            </p>
          </div>
        </div>
      </ContentBlurGate>

      <div className="mt-14"><OrnamentDivider /></div>
    </section>
  );
}