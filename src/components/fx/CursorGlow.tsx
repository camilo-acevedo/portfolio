import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.14;
      pos.current.y += (target.current.y - pos.current.y) * 0.14;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.current.x - 200}px, ${
          pos.current.y - 200
        }px, 0)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        ref={ref}
        aria-hidden="true"
        className="absolute h-[400px] w-[400px] rounded-full opacity-30 mix-blend-screen dark:opacity-40"
        style={{
          background:
            'radial-gradient(circle, rgb(var(--accent) / 0.35) 0%, rgb(var(--accent-alt) / 0.15) 30%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}
