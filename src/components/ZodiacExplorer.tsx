import { useState, useRef, useEffect } from 'react';
import { zodiacSigns, type ZodiacSign } from '@/lib/zodiac';
import { ZodiacSymbol, ConstellationSVG } from '@/components/ZodiacArt';
import { Sparkles, Flame, Mountain, Wind, Droplet, MousePointerClick } from 'lucide-react';

const elementIcons: Record<string, typeof Flame> = {
  Fire: Flame,
  Earth: Mountain,
  Air: Wind,
  Water: Droplet,
};

const elementColors: Record<string, string> = {
  Fire: '#e94560',
  Earth: '#43aa8b',
  Air: '#f4a261',
  Water: '#48cae4',
};

function ZodiacWheel({ onSelect, selectedSign }: { onSelect: (sign: ZodiacSign) => void; selectedSign: ZodiacSign | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(400);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setSize(Math.min(w, 480));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const center = size / 2;
  const radius = size / 2 - 36;
  const innerRadius = radius * 0.52;

  return (
    <div ref={containerRef} className="relative w-full flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Outer ring */}
        <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(196,163,116,0.08)" strokeWidth="1" />
        <circle cx={center} cy={center} r={radius - 8} fill="none" stroke="rgba(196,163,116,0.05)" strokeWidth="1" strokeDasharray="2 4" />
        {/* Inner ring */}
        <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="rgba(196,163,116,0.06)" strokeWidth="1" />
        <circle cx={center} cy={center} r={innerRadius - 6} fill="none" stroke="rgba(196,163,116,0.04)" strokeWidth="1" strokeDasharray="1 3" />

        {/* Center area: prompt or selected sign */}
        {selectedSign ? (
          <g>
            <circle cx={center} cy={center} r={innerRadius * 0.4} fill="none" stroke={selectedSign.color} strokeWidth="0.5" opacity="0.3" />
            <g transform={`translate(${center - 16}, ${center - 16}) scale(0.32)`}>
              <path
                d={selectedSign.svgPath}
                fill="none"
                stroke={selectedSign.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        ) : (
          <g>
            <circle cx={center} cy={center} r={innerRadius * 0.42} fill="none" stroke="rgba(196,163,116,0.12)" strokeWidth="0.5" />
            <circle cx={center} cy={center} r={innerRadius * 0.42} fill="rgba(196,163,116,0.02)" />
            <g transform={`translate(${center - 12}, ${center - 22})`}>
              <MousePointerClick x={0} y={0} width={24} height={24} stroke="rgba(196,163,116,0.4)" strokeWidth={1.5} />
            </g>
            <text
              x={center}
              y={center + 10}
              textAnchor="middle"
              fontSize="11"
              fill="rgba(196,163,116,0.5)"
              style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}
            >
              Select a sign
            </text>
            <text
              x={center}
              y={center + 26}
              textAnchor="middle"
              fontSize="8"
              fill="rgba(255,255,255,0.2)"
              style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}
            >
              TO REVEAL ITS WISDOM
            </text>
          </g>
        )}

        {/* Sign buttons */}
        {zodiacSigns.map((sign, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          const isActive = selectedSign?.name === sign.name;
          const iconSize = 40;

          return (
            <g
              key={sign.name}
              onClick={() => onSelect(sign)}
              className="cursor-pointer"
              style={{ transition: 'all 0.4s ease' }}
            >
              {/* Glow circle for active */}
              {isActive && (
                <circle
                  cx={x}
                  cy={y}
                  r={iconSize / 2 + 8}
                  fill={sign.color}
                  opacity="0.12"
                >
                  <animate attributeName="r" values={`${iconSize / 2 + 6};${iconSize / 2 + 12};${iconSize / 2 + 6}`} dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Button background */}
              <circle
                cx={x}
                cy={y}
                r={iconSize / 2}
                fill={isActive ? `${sign.color}30` : `${sign.color}12`}
                stroke={isActive ? sign.color : `${sign.color}50`}
                strokeWidth={isActive ? '1.5' : '1'}
                style={{ transition: 'all 0.4s ease' }}
              />
              {/* SVG Symbol */}
              <g transform={`translate(${x - 13}, ${y - 13}) scale(0.26)`} style={{ transition: 'all 0.4s ease' }}>
                <path
                  d={sign.svgPath}
                  fill="none"
                  stroke={isActive ? sign.color : `${sign.color}cc`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              {/* Name label */}
              <text
                x={x}
                y={y + iconSize / 2 + 14}
                textAnchor="middle"
                fontSize="9"
                fill={isActive ? 'rgba(245,237,224,0.95)' : 'rgba(245,237,224,0.5)'}
                style={{ transition: 'all 0.4s ease', fontFamily: 'Inter, sans-serif', fontWeight: 500, letterSpacing: '0.05em' }}
              >
                {sign.name.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Rotating decorative ring */}
        <g style={{ transformOrigin: 'center' }}>
          <animateTransform attributeName="transform" type="rotate" from={`0 ${center} ${center}`} to={`360 ${center} ${center}`} dur="120s" repeatCount="indefinite" />
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const r1 = radius + 6;
            const r2 = radius + 14;
            const x1 = center + Math.cos(angle) * r1;
            const y1 = center + Math.sin(angle) * r1;
            const x2 = center + Math.cos(angle) * r2;
            const y2 = center + Math.sin(angle) * r2;
            return (
              <line key={`tick-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(196,163,116,0.15)" strokeWidth="1" />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export function ZodiacExplorer() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);

  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-400/[0.06] border border-champagne-400/15 backdrop-blur-sm mb-4">
          <Sparkles className="w-4 h-4 text-champagne-300" />
          <span className="text-xs text-champagne-200/80 tracking-[0.15em] uppercase">Explore the Zodiac</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-champagne-50 mb-3 tracking-tight">
          Twelve Signs, Infinite Wisdom
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base font-serif font-light italic">
          Tap any sign on the wheel to reveal its element, ruling planet, strengths, and deep cosmic significance.
        </p>
      </div>

      {/* Zodiac wheel */}
      <ZodiacWheel onSelect={setSelectedSign} selectedSign={selectedSign} />

      {/* Sign details panel */}
      {selectedSign && (
        <div
          key={selectedSign.name}
          className="animate-[fadeInUp_0.5s_ease-out] mt-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl overflow-hidden relative"
        >
          {/* Color glow */}
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[100px] opacity-[0.12]"
            style={{ background: selectedSign.color }}
          />
          {/* Gradient top border */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(to right, transparent, ${selectedSign.color}, transparent)` }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-0">
            {/* Left: Visual side */}
            <div className="relative p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/[0.06] flex flex-col items-center justify-center min-h-[280px]">
              {/* Constellation backdrop */}
              <div className="absolute inset-0 opacity-50">
                <ConstellationSVG sign={selectedSign} />
              </div>

              {/* Big SVG symbol */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center border"
                  style={{
                    borderColor: `${selectedSign.color}40`,
                    background: `${selectedSign.color}10`,
                    color: selectedSign.color,
                    boxShadow: `0 0 40px ${selectedSign.color}20`,
                  }}
                >
                  <ZodiacSymbol sign={selectedSign} className="w-12 h-12" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-serif text-champagne-50">{selectedSign.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selectedSign.dates}</p>
                </div>

                {/* Element badge */}
                {(() => {
                  const Icon = elementIcons[selectedSign.element];
                  const eColor = elementColors[selectedSign.element];
                  return (
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium"
                      style={{
                        borderColor: `${eColor}30`,
                        background: `${eColor}10`,
                        color: eColor,
                      }}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      {selectedSign.element} Element
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Right: Details side */}
            <div className="p-6 sm:p-8">
              {/* Element & Planet cards */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 hover:bg-white/[0.04] transition-colors duration-300">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600 mb-2">Element</p>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const Icon = elementIcons[selectedSign.element];
                      const eColor = elementColors[selectedSign.element];
                      return Icon ? (
                        <Icon className="w-4 h-4" style={{ color: eColor }} />
                      ) : null;
                    })()}
                    <p className="text-lg text-champagne-50 font-medium">{selectedSign.element}</p>
                  </div>
                </div>
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 hover:bg-white/[0.04] transition-colors duration-300">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600 mb-2">Ruling Planet</p>
                  <p className="text-lg text-champagne-50 font-medium">{selectedSign.planet}</p>
                </div>
              </div>

              {/* Strengths */}
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 mb-5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600 mb-3">Strengths</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSign.strengths.map((strength, i) => (
                    <span
                      key={strength}
                      className="px-3 py-1.5 rounded-full text-sm border transition-all duration-300 hover:scale-105"
                      style={{
                        borderColor: `${selectedSign.color}25`,
                        background: `${selectedSign.color}08`,
                        color: '#e2e8f0',
                        animation: `fadeInUp 0.4s ease-out ${i * 0.08}s both`,
                      }}
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deep Significance */}
              <div
                className="rounded-xl p-4 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${selectedSign.color}06, transparent)`,
                  border: `1px solid ${selectedSign.color}15`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" style={{ color: selectedSign.color }} />
                  <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: `${selectedSign.color}cc` }}>
                    Deep Significance
                  </p>
                </div>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  {selectedSign.significance}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
