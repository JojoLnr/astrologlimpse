import { useMemo } from 'react';
import { zodiacSigns } from '@/lib/zodiac';
import { generateReading } from '@/lib/reading';
import { Sparkles } from 'lucide-react';

interface ReadingDisplayProps {
  signName: string;
}

export function ReadingDisplay({ signName }: ReadingDisplayProps) {
  const sign = useMemo(() => zodiacSigns.find((s) => s.name === signName), [signName]);
  const reading = useMemo(() => (sign ? generateReading(sign) : []), [sign]);

  if (!sign) return null;

  return (
    <div className="animate-[fadeInUp_0.5s_ease-out] space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border border-white/10"
          style={{ background: `${sign.color}22`, color: sign.color }}
        >
          {sign.glyph}
        </div>
        <div>
          <h3 className="text-xl font-serif text-white">{sign.name} — Complete Reading</h3>
          <p className="text-sm text-slate-400">Your 10-point cosmic blueprint</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {reading.map((point, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: `${sign.color}22`, color: sign.color }}
              >
                {i + 1}
              </div>
              <h4 className="text-sm font-medium text-white">{point.title}</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{point.description}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 pt-4 text-slate-500 text-xs">
        <Sparkles className="w-3 h-3 text-amber-300/50" />
        <span>This reading was channeled from the current planetary alignments</span>
      </div>
    </div>
  );
}
