import { cn } from '@/lib/cn';

type Variant = 'loss' | 'pipeline' | 'flow' | 'network';

interface Props {
  variant: Variant;
  className?: string;
  intense?: boolean;
}

export function ServiceBackdrop({ variant, className, intense = false }: Props) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {variant === 'loss' && <TrainingChart intense={intense} />}
      {variant === 'pipeline' && <CIPipelineLoop intense={intense} />}
      {variant === 'flow' && <DataPipes intense={intense} />}
      {variant === 'network' && <FeedforwardNet intense={intense} />}
    </div>
  );
}

/* ───────────────────────────── ml_dev ───────────────────────────── */

function TrainingChart({ intense }: { intense: boolean }) {
  const mainCurve = 'M 40 150 C 90 135, 130 90, 200 60 S 320 22, 380 16';
  const valCurve = 'M 40 155 C 95 142, 140 110, 210 80 S 335 45, 380 34';
  const gridY = [30, 60, 90, 120, 150];
  const predictions = Array.from({ length: 16 }, (_, i) => {
    const x = 50 + i * 20;
    const t = i / 15;
    const base = 150 - 135 * (1 - Math.exp(-2.6 * t));
    const jitter = (Math.sin(i * 2.1) + Math.cos(i * 3.3)) * 4;
    return { x, y: base + jitter };
  });

  return (
    <svg
      viewBox="0 0 400 180"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="loss-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.3" />
          <stop offset="50%" stopColor="rgb(var(--accent))" stopOpacity="1" />
          <stop offset="100%" stopColor="rgb(var(--accent-alt))" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="loss-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity={intense ? 0.25 : 0.18} />
          <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0" />
        </linearGradient>
        <filter id="loss-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {gridY.map((y) => (
        <line
          key={y}
          x1="36"
          y1={y}
          x2="384"
          y2={y}
          stroke="rgb(var(--border))"
          strokeOpacity={intense ? 0.6 : 0.35}
          strokeDasharray="2 6"
          strokeWidth="0.8"
        />
      ))}

      <line x1="36" y1="18" x2="36" y2="158" stroke="rgb(var(--border-strong))" strokeOpacity="0.5" strokeWidth="0.8" />
      <line x1="36" y1="158" x2="384" y2="158" stroke="rgb(var(--border-strong))" strokeOpacity="0.5" strokeWidth="0.8" />

      <g fontFamily="'Geist Mono', monospace" fontSize="7" fill="rgb(var(--fg-subtle))">
        <text x="32" y="33" textAnchor="end">1.0</text>
        <text x="32" y="93" textAnchor="end">0.5</text>
        <text x="32" y="153" textAnchor="end">0.0</text>
      </g>

      <path d={`${mainCurve} L 380 158 L 40 158 Z`} fill="url(#loss-area)" />

      {predictions.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={intense ? 2 : 1.6}
          fill="rgb(var(--accent-alt))"
          opacity={intense ? 0.7 : 0.5}
        />
      ))}

      <path
        d={valCurve}
        stroke="rgb(var(--accent-alt))"
        strokeWidth="1.4"
        strokeDasharray="4 4"
        strokeOpacity={intense ? 0.8 : 0.55}
        fill="none"
        strokeLinecap="round"
      />

      <path
        d={mainCurve}
        stroke="url(#loss-stroke)"
        strokeWidth={intense ? 3 : 2.4}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="800"
        filter="url(#loss-glow)"
        style={{ animation: 'loss-draw 6s ease-in-out infinite' }}
      />

      <g>
        <circle cx="380" cy="16" r="3" fill="rgb(var(--accent))" opacity={intense ? 1 : 0.9}>
          <animate attributeName="r" values="3;6;3" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.4;1" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="380" cy="16" r="2" fill="rgb(var(--accent))" />
      </g>
    </svg>
  );
}

/* ───────────────────────────── mlops ───────────────────────────── */

function CIPipelineLoop({ intense }: { intense: boolean }) {
  const cx = 100;
  const cy = 100;
  const r = 62;
  const stages = 5;
  const nodes = Array.from({ length: stages }).map((_, i) => {
    const ang = (i / stages) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r };
  });

  const arcs = nodes.map((n, i) => {
    const next = nodes[(i + 1) % stages];
    return `M ${n.x} ${n.y} A ${r} ${r} 0 0 1 ${next.x} ${next.y}`;
  });

  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <filter id="pipe-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <radialGradient id="pipe-center" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity={intense ? 0.25 : 0.15} />
          <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={r + 14} fill="url(#pipe-center)" />

      <circle
        cx={cx}
        cy={cy}
        r={r - 18}
        stroke="rgb(var(--border))"
        strokeWidth="0.6"
        strokeDasharray="2 4"
        fill="none"
        opacity={intense ? 0.7 : 0.5}
      />

      {arcs.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="rgb(var(--border-strong))"
          strokeOpacity={intense ? 0.6 : 0.4}
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
      ))}

      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'slow-spin 10s linear infinite' }}>
        <path
          d={arcs[0]}
          stroke="rgb(var(--accent))"
          strokeWidth={intense ? 2.2 : 1.8}
          fill="none"
          strokeLinecap="round"
          filter="url(#pipe-glow)"
          opacity="0.9"
        />
      </g>

      {nodes.map((n, i) => (
        <g key={i}>
          <circle
            cx={n.x}
            cy={n.y}
            r={intense ? 7 : 6}
            fill="rgb(var(--bg-elevated))"
            stroke="rgb(var(--border-strong))"
            strokeWidth="0.8"
          />
          <circle
            cx={n.x}
            cy={n.y}
            r={intense ? 3.2 : 2.8}
            fill="rgb(var(--accent))"
            style={{
              animation: 'stage-advance 5s ease-in-out infinite',
              animationDelay: `${(i / stages) * 5}s`,
              transformOrigin: `${n.x}px ${n.y}px`,
              transformBox: 'fill-box',
              filter: 'drop-shadow(0 0 6px rgb(var(--accent) / 0.9))',
            }}
          />
        </g>
      ))}

      <g fontFamily="'Geist Mono', monospace" textAnchor="middle">
        <text x={cx} y={cy - 2} fontSize="9" fill="rgb(var(--fg))" fontWeight="600">
          ci / cd
        </text>
        <text x={cx} y={cy + 12} fontSize="7" fill="rgb(var(--fg-subtle))">
          loop
        </text>
      </g>
    </svg>
  );
}

/* ──────────────────────────── data_eng ──────────────────────────── */

function DataPipes({ intense }: { intense: boolean }) {
  const pipes = [
    { y: 38, color: 'rgb(var(--accent))', speed: 3.8, delayBase: 0 },
    { y: 92, color: 'rgb(var(--accent-alt))', speed: 4.4, delayBase: 0.6 },
    { y: 146, color: 'rgb(var(--accent))', speed: 4.1, delayBase: 1.2 },
  ];
  const packetsPerPipe = 4;

  return (
    <svg
      viewBox="0 0 400 184"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <filter id="pipe-pkt-glow" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>

      {pipes.map((pipe, pIdx) => (
        <g key={pIdx}>
          <rect
            x="16"
            y={pipe.y - 8}
            width="368"
            height="16"
            rx="8"
            stroke="rgb(var(--border-strong))"
            strokeWidth="0.8"
            strokeOpacity={intense ? 0.8 : 0.55}
            fill="rgb(var(--border))"
            fillOpacity={intense ? 0.15 : 0.08}
          />

          <circle cx="16" cy={pipe.y} r="3" fill="rgb(var(--border-strong))" opacity={intense ? 0.8 : 0.5} />
          <circle cx="384" cy={pipe.y} r="3" fill="rgb(var(--border-strong))" opacity={intense ? 0.8 : 0.5} />

          {Array.from({ length: packetsPerPipe }).map((_, i) => {
            const delay = -((i / packetsPerPipe) * pipe.speed) - pipe.delayBase;
            return (
              <rect
                key={i}
                x="-40"
                y={pipe.y - 4}
                width="28"
                height="8"
                rx="2"
                fill={pipe.color}
                opacity={intense ? 0.95 : 0.75}
                filter="url(#pipe-pkt-glow)"
                style={{
                  animation: `flow-dot ${pipe.speed}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/* ──────────────────────────── consulting ──────────────────────────── */

function FeedforwardNet({ intense }: { intense: boolean }) {
  const layers = [
    { x: 70, nodes: [50, 92, 134] },
    { x: 200, nodes: [36, 78, 120, 162] },
    { x: 330, nodes: [70, 128] },
  ];
  const edges: Array<{ x1: number; y1: number; x2: number; y2: number; hot: boolean; delay: number }> = [];
  for (let l = 0; l < layers.length - 1; l++) {
    const a = layers[l];
    const b = layers[l + 1];
    a.nodes.forEach((ay, ai) => {
      b.nodes.forEach((by, bi) => {
        const idx = ai * b.nodes.length + bi;
        edges.push({
          x1: a.x,
          y1: ay,
          x2: b.x,
          y2: by,
          hot: idx % 3 === 0,
          delay: ((ai + bi + l) % 5) * 0.35,
        });
      });
    });
  }

  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke={e.hot ? 'rgb(var(--accent))' : 'rgb(var(--border-strong))'}
          strokeOpacity={e.hot ? (intense ? 0.75 : 0.55) : intense ? 0.35 : 0.22}
          strokeWidth={e.hot ? 1 : 0.6}
          style={
            e.hot
              ? {
                  strokeDasharray: '80 80',
                  animation: 'loss-draw 4s linear infinite',
                  animationDelay: `${e.delay}s`,
                }
              : undefined
          }
        />
      ))}

      {layers.map((layer, li) =>
        layer.nodes.map((y, ni) => {
          const isAccent = (li + ni) % 2 === 0;
          return (
            <g key={`${li}-${ni}`}>
              <circle
                cx={layer.x}
                cy={y}
                r={intense ? 7 : 6}
                fill="rgb(var(--bg-elevated))"
                stroke={isAccent ? 'rgb(var(--accent))' : 'rgb(var(--accent-alt))'}
                strokeWidth="1.2"
              />
              <circle
                cx={layer.x}
                cy={y}
                r={intense ? 3.2 : 2.8}
                fill={isAccent ? 'rgb(var(--accent))' : 'rgb(var(--accent-alt))'}
                filter="url(#node-glow)"
                style={{
                  animation: 'node-pulse 3.6s ease-in-out infinite',
                  animationDelay: `${(li * 3 + ni) * 0.25}s`,
                  transformOrigin: `${layer.x}px ${y}px`,
                  transformBox: 'fill-box',
                }}
              />
            </g>
          );
        }),
      )}

      <g fontFamily="'Geist Mono', monospace" fontSize="7" fill="rgb(var(--fg-subtle))" textAnchor="middle">
        <text x="70" y="170" opacity={intense ? 0.9 : 0.7}>
          audit
        </text>
        <text x="200" y="190" opacity={intense ? 0.9 : 0.7}>
          enable
        </text>
        <text x="330" y="170" opacity={intense ? 0.9 : 0.7}>
          ship
        </text>
      </g>
    </svg>
  );
}
