import type { ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';

type AnimationType = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-in';

const animationClasses: Record<AnimationType, string> = {
  'fade-up': 'opacity-0 translate-y-6',
  'fade-in': 'opacity-0',
  'slide-left': 'opacity-0 -translate-x-6',
  'slide-right': 'opacity-0 translate-x-6',
  'scale-in': 'opacity-0 scale-97',
};

const visibleClass = 'opacity-100 translate-x-0 translate-y-0 scale-100';

export default function Reveal({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref as never}
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? visibleClass : animationClasses[animation]
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
