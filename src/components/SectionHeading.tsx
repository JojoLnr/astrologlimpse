export function SectionHeading({
  number,
  eyebrow,
  title,
  subtitle,
  onParchment = false,
}: {
  number: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  onParchment?: boolean;
}) {
  const eyebrowColor = onParchment ? 'text-gold-600' : 'text-gold-400';
  const titleColor = onParchment ? 'text-navy-900' : 'text-cream-50';
  const subColor = onParchment ? 'text-navy-800/55' : 'text-cream-200/50';
  const ruleColor = onParchment ? 'bg-gold-500/40' : 'bg-gold-400/40';

  return (
    <div className="max-w-2xl">
      <div className="mb-3 flex items-center gap-3">
        <span className="font-display text-sm font-semibold text-gold-500">{number}</span>
        <span className={`h-px w-8 ${ruleColor}`} />
        <p className={`font-display text-[11px] font-medium uppercase tracking-[0.25em] ${eyebrowColor}`}>
          {eyebrow}
        </p>
      </div>
      <h2 className={`font-display text-3xl font-medium leading-tight md:text-4xl ${titleColor}`}>
        {title}
      </h2>
      <p className={`mt-3 font-serif text-lg italic leading-relaxed ${subColor}`}>
        {subtitle}
      </p>
    </div>
  );
}

export function OrnamentDivider({ onParchment = false }: { onParchment?: boolean }) {
  const color = onParchment ? 'text-gold-500/50' : 'text-gold-400/40';
  return (
    <div className="flex items-center gap-4">
      <span className={`h-px flex-1 ${onParchment ? 'bg-gold-500/20' : 'bg-gold-400/15'}`} />
      <span className={`font-ornament text-sm ${color}`}>✦</span>
      <span className={`h-px flex-1 ${onParchment ? 'bg-gold-500/20' : 'bg-gold-400/15'}`} />
    </div>
  );
}
