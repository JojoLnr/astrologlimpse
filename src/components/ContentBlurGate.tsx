import type { ReactNode } from 'react';

interface ContentBlurGateProps {
  children: ReactNode;
  isBlurred: boolean;
}

export function ContentBlurGate({ children, isBlurred }: ContentBlurGateProps) {
  if (!isBlurred) return <>{children}</>;

  return (
    <div className="relative overflow-hidden">
      {/* Blurred body content */}
      <div className="filter blur-[6px] select-none pointer-events-none opacity-40 transition-all duration-300">
        {children}
      </div>

      {/* Optional preview badge / overlay indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="rounded-full border border-gold-400/30 bg-navy-950/80 px-4 py-1.5 shadow-lg backdrop-blur-md">
          <span className="font-display text-xs uppercase tracking-widest text-gold-300">
            ✦ Preview Locked ✦
          </span>
        </div>
      </div>
    </div>
  );
}

// Providing a default export as well fixes TS2613 build errors across all files
export default ContentBlurGate;