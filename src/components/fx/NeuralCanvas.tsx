import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeColors } from '@/hooks/useThemeColors';
import { cn } from '@/lib/cn';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Props {
  density?: number;
  linkDistance?: number;
  className?: string;
}

export function NeuralCanvas({ density = 0.00011, linkDistance = 140, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const reduced = useReducedMotion();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(40, Math.floor(width * height * density));
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.6,
      }));
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    const accent = colors.accent || '0 255 209';
    const accentAlt = colors.accentAlt || '167 139 250';
    const lineAlphaMul = isLight ? 1.4 : 0.6;
    const nodeAlpha = isLight ? 1 : 0.85;
    const lineWidth = isLight ? 1.1 : 0.65;
    const nodeScale = isLight ? 1.3 : 1;

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (const p of particles) {
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 26000) {
            const f = (1 - d2 / 26000) * 0.12;
            p.vx += (dx / Math.max(Math.sqrt(d2), 1)) * f;
            p.vy += (dy / Math.max(Math.sqrt(d2), 1)) * f;
          }
        }
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
      }

      const linkSq = linkDistance * linkDistance;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkSq) {
            const alpha = Math.min(1, (1 - d2 / linkSq) * lineAlphaMul);
            ctx.strokeStyle = `rgb(${accent} / ${alpha.toFixed(3)})`;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const mdx = mouse.active ? p.x - mouse.x : 0;
        const mdy = mouse.active ? p.y - mouse.y : 0;
        const hot = mouse.active && mdx * mdx + mdy * mdy < 18000;
        const fillAlpha = hot ? 1 : nodeAlpha;
        ctx.fillStyle = `rgb(${hot ? accentAlt : accent} / ${fillAlpha})`;
        if (isLight) {
          ctx.shadowColor = `rgb(${hot ? accentAlt : accent})`;
          ctx.shadowBlur = hot ? 10 : 4;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, (hot ? p.r * 1.8 : p.r) * nodeScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    if (!reduced) rafRef.current = requestAnimationFrame(tick);
    else {
      ctx.fillStyle = `rgb(${accent} / 0.6)`;
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced, colors, density, linkDistance, isLight]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none h-full w-full', className)}
    />
  );
}
