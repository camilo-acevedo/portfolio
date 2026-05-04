import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeColors } from '@/hooks/useThemeColors';
import { cn } from '@/lib/cn';

interface Point {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  cls: 0 | 1 | 2;
}

const CLUSTERS: Array<{ cx: number; cy: number }> = [
  { cx: 0.28, cy: 0.34 },
  { cx: 0.7, cy: 0.28 },
  { cx: 0.52, cy: 0.74 },
];

const PALETTE = (accent: string, accentAlt: string, fg: string) => [
  accent,
  accentAlt,
  fg,
];

function gauss() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function makePoints(count = 72): Point[] {
  return Array.from({ length: count }, () => {
    const cls = Math.floor(Math.random() * 3) as 0 | 1 | 2;
    const c = CLUSTERS[cls];
    return {
      sx: Math.random(),
      sy: Math.random(),
      tx: Math.min(0.96, Math.max(0.04, c.cx + gauss() * 0.06)),
      ty: Math.min(0.96, Math.max(0.04, c.cy + gauss() * 0.06)),
      cls,
    };
  });
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function TrainingPlot({ className }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(2.3);
  const [acc, setAcc] = useState(0.33);
  const reduced = useReducedMotion();
  const colors = useThemeColors();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let points = makePoints();
    const totalEpochs = 80;
    const lossCurve: number[] = [];
    let startTime = performance.now();
    const stepDuration = 110;
    let raf = 0;
    let inView = false;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.2 },
    );
    io.observe(wrap);

    const restart = () => {
      points = makePoints();
      lossCurve.length = 0;
      startTime = performance.now();
    };

    const palette = PALETTE(
      `rgb(${colors.accent})`,
      `rgb(${colors.accentAlt})`,
      `rgb(${colors.fg} / 0.85)`,
    );

    const draw = (now: number) => {
      if (!inView && !reduced) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const elapsed = now - startTime;
      const rawEpoch = Math.min(totalEpochs, elapsed / stepDuration);
      const progress = Math.min(1, rawEpoch / totalEpochs);
      const eased = easeInOut(progress);

      ctx.clearRect(0, 0, width, height);

      const padX = 56;
      const padY = 28;
      const plotW = Math.max(40, width - padX * 2);
      const plotH = Math.max(40, height - padY * 2);

      ctx.strokeStyle = `rgb(${colors.border} / 0.5)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 4; i++) {
        const y = padY + (plotH / 4) * i;
        ctx.moveTo(padX, y);
        ctx.lineTo(padX + plotW, y);
        const x = padX + (plotW / 4) * i;
        ctx.moveTo(x, padY);
        ctx.lineTo(x, padY + plotH);
      }
      ctx.stroke();

      ctx.strokeStyle = `rgb(${colors.border})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padX, padY);
      ctx.lineTo(padX, padY + plotH);
      ctx.lineTo(padX + plotW, padY + plotH);
      ctx.stroke();

      ctx.font = '10px "Geist Mono", monospace';
      ctx.fillStyle = `rgb(${colors.fg} / 0.4)`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText('1.0', padX - 8, padY);
      ctx.fillText('0.5', padX - 8, padY + plotH / 2);
      ctx.fillText('0.0', padX - 8, padY + plotH);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('0', padX, padY + plotH + 6);
      ctx.fillText(String(Math.floor(totalEpochs / 2)), padX + plotW / 2, padY + plotH + 6);
      ctx.fillText(String(totalEpochs), padX + plotW, padY + plotH + 6);

      for (const p of points) {
        const x = padX + (p.sx + (p.tx - p.sx) * eased) * plotW;
        const y = padY + (p.sy + (p.ty - p.sy) * eased) * plotH;
        ctx.fillStyle = palette[p.cls];
        ctx.shadowColor = palette[p.cls];
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      const loss = 2.3 * Math.exp(-3.4 * progress) + 0.05 + Math.random() * 0.02;
      lossCurve.push(loss);
      if (lossCurve.length > totalEpochs + 2) lossCurve.shift();

      ctx.strokeStyle = `rgb(${colors.accent})`;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = `rgb(${colors.accent})`;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      lossCurve.forEach((l, i) => {
        const x = padX + (i / totalEpochs) * plotW;
        const y = padY + (l / 2.4) * plotH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (progress < 1) {
        const lastIdx = lossCurve.length - 1;
        const x = padX + (lastIdx / totalEpochs) * plotW;
        const y = padY + (lossCurve[lastIdx] / 2.4) * plotH;
        ctx.fillStyle = `rgb(${colors.accent})`;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      setEpoch(Math.floor(rawEpoch));
      setLoss(loss);
      setAcc(Math.min(0.99, 0.33 + 0.66 * eased));

      if (progress >= 1 && elapsed > stepDuration * totalEpochs + 1800) {
        restart();
      }

      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      for (let i = 0; i <= totalEpochs; i++) {
        lossCurve.push(2.3 * Math.exp(-3.4 * (i / totalEpochs)) + 0.05);
      }
      startTime = performance.now() - stepDuration * totalEpochs;
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced, colors, i18n.resolvedLanguage]);

  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const labels =
    lang === 'es'
      ? { title: 'live training', legend: ['clase a', 'clase b', 'clase c'] }
      : { title: 'live training', legend: ['class a', 'class b', 'class c'] };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-bg-elevated/50 backdrop-blur-xl',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-fg-muted">
          <span className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-red-400/70" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
            <span className="h-2 w-2 rounded-full bg-green-400/70" />
          </span>
          <span className="ml-2">{labels.title}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-accent">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          {t('about.status.live')}
        </div>
      </div>

      <div ref={wrapRef} className="relative h-[320px] w-full">
        <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-3 gap-0 border-t border-border font-mono text-xs">
        <div className="border-r border-border px-4 py-3">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">epoch</div>
          <div className="mt-1 text-base text-fg">{epoch.toString().padStart(2, '0')}/80</div>
        </div>
        <div className="border-r border-border px-4 py-3">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">loss</div>
          <div className="mt-1 text-base text-accent">{loss.toFixed(3)}</div>
        </div>
        <div className="px-4 py-3">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">accuracy</div>
          <div className="mt-1 text-base text-accent-alt">{(acc * 100).toFixed(1)}%</div>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-border px-5 py-3 font-mono text-[10px] text-fg-subtle">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-accent" /> {labels.legend[0]}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-accent-alt" /> {labels.legend[1]}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-fg/80" /> {labels.legend[2]}
        </span>
      </div>
    </div>
  );
}
