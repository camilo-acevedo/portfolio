import { useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props {
  children: ReactNode;
  className?: string;
  radius?: number;
  hoverOnly?: boolean;
}

export function Spotlight({ children, className, radius = 320, hoverOnly = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    ref.current.style.setProperty('--spot-opacity', '1');
  };

  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty('--spot-opacity', '0');
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn('group relative isolate', className)}
      style={
        {
          '--spot-size': `${radius}px`,
          '--spot-opacity': hoverOnly ? '0' : '1',
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: 'var(--spot-opacity, 0)',
          background:
            'radial-gradient(var(--spot-size, 320px) circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(var(--accent) / 0.18), rgb(var(--accent-alt) / 0.08) 40%, transparent 70%)',
        }}
      />
      {children}
    </div>
  );
}
