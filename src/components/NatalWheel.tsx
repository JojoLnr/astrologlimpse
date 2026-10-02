import { useState, useRef, useEffect } from 'react';
import { zodiacSigns } from '@/lib/zodiac';

interface House {
  number: number;
  label: string;
  description: string;
}

const houses: House[] = [
  { number: 1, label: '1st House', description: 'Self, identity, and physical body. We analyze your Ascendant degree to determine how the world first perceives you.' },
  { number: 2, label: '2nd House', description: 'Values, resources, and earning capacity. We track Venus transits here for financial timing windows.' },
  { number: 3, label: '3rd House', description: 'Communication, siblings, and short journeys. Mercury activity here reveals when your words carry the most weight.' },
  { number: 4, label: '4th House', description: 'Home, family roots, and inner foundation. Lunar transits here mark pivotal emotional shifts.' },
  { number: 5, label: '5th House', description: 'Creativity, romance, and self-expression. We monitor for Venus and Mars alignments triggering creative breakthroughs.' },
  { number: 6, label: '6th House', description: 'Health, daily routines, and service. We flag when Mercury retrogrades here to warn against burnout.' },
  { number: 7, label: '7th House', description: 'Partnerships, marriage, and open enemies. Critical transit alerts fire when Saturn crosses this cusp.' },
  { number: 8, label: '8th House', description: 'Transformation, shared resources, and the occult. Pluto activity here signals deep psychological rebirth.' },
  { number: 9, label: '9th House', description: 'Higher education, travel, and philosophy. Jupiter transits here expand your worldview and opportunity horizon.' },
  { number: 10, label: '10th House', description: 'Career, public standing, and reputation. We calculate exact degrees every hour to pinpoint when Mars leaves this house.' },
  { number: 11, label: '11th House', description: 'Community, friendships, and aspirations. We track social cycle timing for optimal networking windows.' },
  { number: 12, label: '12th House', description: 'The unconscious, solitude, and hidden matters. We monitor for karmic triggers and spiritual retreat periods.' },
];

export function NatalWheel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(400);
  const [activeHouse, setActiveHouse] = useState<number | null>(null);
  const [autoIndex, setAutoIndex] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setSize(Math.min(w, 440));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasScrolled(true);
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasScrolled) return;
    const interval = setInterval(() => {
      setAutoIndex((prev) => (prev + 1) % 12);
    }, 2500);
    return () => clearInterval(interval);
  }, [hasScrolled]);

  const center = size / 2;
  const outerR = size / 2 - 20;
  const innerR = outerR * 0.55;
  const houseR = outerR - 6;
  const currentHouse = activeHouse ?? autoIndex;

  const houseAngles = houses.map((_, i) => {
    const angle = (i / 12) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    return { angle, rad };
  });

  return (
    <div ref={containerRef} className="relative w-full flex flex-col items-center pb-36">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {/* Outer ring */}
          <circle cx={center} cy={center} r={outerR} fill="none" stroke="rgba(196,163,116,0.1)" strokeWidth="1" />
          <circle cx={center} cy={center} r={outerR - 2} fill="none" stroke="rgba(196,163,116,0.05)" strokeWidth="1" strokeDasharray="1 3" />

          {/* Inner ring */}
          <circle cx={center} cy={center} r={innerR} fill="none" stroke="rgba(196,163,116,0.08)" strokeWidth="1" />
          <circle cx={center} cy={center} r={innerR - 4} fill="none" stroke="rgba(196,163,116,0.04)" strokeWidth="1" strokeDasharray="1 2" />

          {/* House divisions */}
          {houseAngles.map((ha, i) => {
            const x1 = center + Math.cos(ha.rad) * innerR;
            const y1 = center + Math.sin(ha.rad) * innerR;
            const x2 = center + Math.cos(ha.rad) * outerR;
            const y2 = center + Math.sin(ha.rad) * outerR;
            return (
              <line
                key={`div-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={currentHouse === i ? 'rgba(196,163,116,0.4)' : 'rgba(196,163,116,0.08)'}
                strokeWidth={currentHouse === i ? '1.5' : '1'}
                style={{ transition: 'all 0.5s ease' }}
              />
            );
          })}

          {/* House sectors (clickable) */}
          {houses.map((house, i) => {
            const startAngle = ((i / 12) * 360 - 90 - 15) * (Math.PI / 180);
            const endAngle = ((i / 12) * 360 - 90 + 15) * (Math.PI / 180);
            const midAngle = ((i / 12) * 360 - 90) * (Math.PI / 180);
            const labelR = (innerR + outerR) / 2;

            const x1 = center + Math.cos(startAngle) * innerR;
            const y1 = center + Math.sin(startAngle) * innerR;
            const x2 = center + Math.cos(endAngle) * innerR;
            const y2 = center + Math.sin(endAngle) * innerR;
            const x3 = center + Math.cos(endAngle) * outerR;
            const y3 = center + Math.sin(endAngle) * outerR;
            const x4 = center + Math.cos(startAngle) * outerR;
            const y4 = center + Math.sin(startAngle) * outerR;

            const path = `M ${x1} ${y1} A ${innerR} ${innerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${outerR} ${outerR} 0 0 0 ${x4} ${y4} Z`;
            const isActive = currentHouse === i;
            const labelX = center + Math.cos(midAngle) * labelR;
            const labelY = center + Math.sin(midAngle) * labelR;

            return (
              <g key={`house-${i}`}>
                <path
                  d={path}
                  fill={isActive ? 'rgba(196,163,116,0.08)' : 'transparent'}
                  stroke="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveHouse(i)}
                  onMouseLeave={() => setActiveHouse(null)}
                  style={{ transition: 'fill 0.3s ease' }}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill={isActive ? 'rgba(212,184,150,0.9)' : 'rgba(196,163,116,0.3)'}
                  className="cursor-pointer select-none"
                  style={{ transition: 'all 0.3s ease', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  onMouseEnter={() => setActiveHouse(i)}
                  onMouseLeave={() => setActiveHouse(null)}
                >
                  {house.number}
                </text>
                {isActive && (
                  <circle
                    cx={labelX}
                    cy={labelY}
                    r="16"
                    fill="rgba(196,163,116,0.06)"
                    stroke="rgba(196,163,116,0.2)"
                    strokeWidth="0.5"
                  >
                    <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Rotating zodiac ring */}
          <g style={{ transformOrigin: 'center', animation: hasScrolled ? 'natalRotate 180s linear infinite' : 'none' }}>
            {zodiacSigns.map((sign, i) => {
              const angle = (i / 12) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const r = outerR + 12;
              const x = center + Math.cos(rad) * r;
              const y = center + Math.sin(rad) * r;
              return (
                <g key={`z-${i}`} transform={`translate(${x - 10}, ${y - 10}) scale(0.2)`}>
                  <path
                    d={sign.svgPath}
                    fill="none"
                    stroke="rgba(196,163,116,0.3)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })}
          </g>

          {/* Center: planet positions */}
          <g>
            <circle cx={center} cy={center} r={innerR * 0.35} fill="rgba(196,163,116,0.03)" stroke="rgba(196,163,116,0.08)" strokeWidth="0.5" />
            <text x={center} y={center - 6} textAnchor="middle" fontSize="9" fill="rgba(196,163,116,0.4)" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
              NATAL
            </text>
            <text x={center} y={center + 8} textAnchor="middle" fontSize="9" fill="rgba(196,163,116,0.4)" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
              CHART
            </text>
            {/* Small planet dots */}
            {[
              { angle: 35, r: innerR * 0.25, color: '#e9c46a', label: '☉' },
              { angle: 120, r: innerR * 0.22, color: '#778da9', label: '☽' },
              { angle: 210, r: innerR * 0.28, color: '#e94560', label: '♂' },
              { angle: 300, r: innerR * 0.24, color: '#43aa8b', label: '♀' },
            ].map((p, i) => {
              const rad = (p.angle * Math.PI) / 180;
              const px = center + Math.cos(rad) * p.r;
              const py = center + Math.sin(rad) * p.r;
              return (
                <g key={`planet-${i}`}>
                  <circle cx={px} cy={py} r="2.5" fill={p.color} opacity="0.6">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${3 + i}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
                  </circle>
                  <circle cx={px} cy={py} r="5" fill={p.color} opacity="0.1">
                    <animate attributeName="opacity" values="0.05;0.2;0.05" dur={`${3 + i}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
                  </circle>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Tooltip overlay */}
        {hasScrolled && (
          <div
            className="absolute pointer-events-none z-20 max-w-xs animate-[fadeIn_0.3s_ease-out]"
            style={{
              left: '50%',
              top: '100%',
              transform: 'translate(-50%, 12px)',
            }}
          >
            <div className="rounded-xl border border-champagne-400/20 bg-midnight-800/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-[glow_2s_ease-in-out_infinite]" />
                <p className="text-xs font-medium text-champagne-200 tracking-wide uppercase">
                  {houses[currentHouse].label}
                </p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {houses[currentHouse].description}
              </p>
            </div>
          </div>
        )}
      </div>

      {!hasScrolled && (
        <p className="mt-6 text-xs text-slate-600 tracking-wide">
          Scroll to activate the live natal wheel
        </p>
      )}
    </div>
  );
}
