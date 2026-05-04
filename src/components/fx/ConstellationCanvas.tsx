import { useEffect, useRef } from 'react';
import type { PositionedTool } from '@/data/stack';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeColors } from '@/hooks/useThemeColors';

interface Props {
  nodes: PositionedTool[];
  edges: Array<[string, string]>;
  activeId: string | null;
}

export function ConstellationCanvas({ nodes, edges, activeId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef<string | null>(activeId);
  const reduced = useReducedMotion();
  const colors = useThemeColors();

  useEffect(() => {
    activeRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const posMap = new Map<string, { x: number; y: number }>();
    const refreshPositions = () => {
      posMap.clear();
      nodes.forEach((n) => {
        posMap.set(n.id, { x: (n.x / 100) * width, y: (n.y / 100) * height });
      });
    };

    let dashOffset = 0;
    const startTime = performance.now();
    let raf = 0;

    const draw = (now: number) => {
      refreshPositions();
      ctx.clearRect(0, 0, width, height);
      const active = activeRef.current;
      dashOffset -= 0.55;

      const hotEdges: Array<[string, string]> = [];
      const coldEdges: Array<[string, string]> = [];
      edges.forEach(([a, b]) => {
        if (active && (a === active || b === active)) hotEdges.push([a, b]);
        else coldEdges.push([a, b]);
      });

      ctx.setLineDash([]);
      coldEdges.forEach(([a, b]) => {
        const pa = posMap.get(a);
        const pb = posMap.get(b);
        if (!pa || !pb) return;
        ctx.strokeStyle = `rgb(${colors.border})`;
        ctx.globalAlpha = active ? 0.25 : 0.55;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      if (active && hotEdges.length > 0) {
        ctx.setLineDash([5, 7]);
        ctx.lineDashOffset = reduced ? 0 : dashOffset;
        hotEdges.forEach(([a, b]) => {
          const pa = posMap.get(a);
          const pb = posMap.get(b);
          if (!pa || !pb) return;
          const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
          grad.addColorStop(0, `rgb(${colors.accent})`);
          grad.addColorStop(1, `rgb(${colors.accentAlt})`);
          ctx.strokeStyle = grad;
          ctx.globalAlpha = 0.95;
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        });
        ctx.setLineDash([]);

        if (!reduced) {
          const phase = ((now - startTime) / 1400) % 1;
          hotEdges.forEach(([a, b]) => {
            const pa = posMap.get(a);
            const pb = posMap.get(b);
            if (!pa || !pb) return;
            const from = a === active ? pa : pb;
            const to = a === active ? pb : pa;
            const t = phase;
            const x = from.x + (to.x - from.x) * t;
            const y = from.y + (to.y - from.y) * t;
            ctx.globalAlpha = Math.sin(t * Math.PI);
            ctx.fillStyle = `rgb(${colors.accent})`;
            ctx.shadowColor = `rgb(${colors.accent})`;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }

        const ap = posMap.get(active);
        if (ap) {
          ctx.strokeStyle = `rgb(${colors.accent})`;
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = 0.8;
          for (let i = 0; i < 3; i++) {
            const phase = ((now - startTime) / 2800 + i / 3) % 1;
            ctx.globalAlpha = (1 - phase) * 0.4;
            ctx.beginPath();
            ctx.arc(ap.x, ap.y, 20 + phase * 50, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [nodes, edges, colors, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
