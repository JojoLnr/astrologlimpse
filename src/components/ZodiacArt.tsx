import type { ZodiacSign } from '@/lib/zodiac';

function ZodiacSymbol({ sign, className }: { sign: ZodiacSign; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d={sign.svgPath} />
    </svg>
  );
}

function ConstellationSVG({ sign }: { sign: ZodiacSign }) {
  const { stars, lines } = sign.constellation;

  return (
    <svg viewBox="0 0 180 120" className="w-full h-full">
      {lines.map((line, i) => {
        const from = stars[line.from];
        const to = stars[line.to];
        if (!from || !to) return null;
        return (
          <line
            key={`line-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={sign.color}
            strokeWidth="0.6"
            opacity="0.35"
          />
        );
      })}
      {stars.map((star, i) => (
        <g key={`star-${i}`}>
          <circle cx={star.x} cy={star.y} r={star.size} fill={sign.color} opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.3;0.9;0.3"
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
              begin={`${i * 0.25}s`}
            />
          </circle>
          <circle cx={star.x} cy={star.y} r={star.size * 2.5} fill={sign.color} opacity="0.1">
            <animate
              attributeName="opacity"
              values="0.05;0.2;0.05"
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
              begin={`${i * 0.25}s`}
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}

export { ZodiacSymbol, ConstellationSVG };
