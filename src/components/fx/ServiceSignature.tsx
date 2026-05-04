import { cn } from '@/lib/cn';

type Variant = 'loss' | 'pipeline' | 'flow' | 'network';

interface Props {
  variant: Variant;
  className?: string;
}

export function ServiceSignature({ variant, className }: Props) {
  return (
    <div
      className={cn(
        'relative h-10 w-32 overflow-hidden rounded-full border border-border/60 bg-bg-muted/40 px-2',
        className,
      )}
      aria-hidden
    >
      {variant === 'loss' && <Sparkline />}
      {variant === 'pipeline' && <RingSweep />}
      {variant === 'flow' && <FlowStrip />}
      {variant === 'network' && <NodeCluster />}
    </div>
  );
}

function Sparkline() {
  return (
    <svg viewBox="0 0 120 40" className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sig-loss" x1="0" x2="1">
          <stop offset="0" stopColor="rgb(var(--accent))" stopOpacity="0.3" />
          <stop offset="1" stopColor="rgb(var(--accent-alt))" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M 6 32 C 20 28, 32 18, 48 12 S 80 6, 114 4"
        stroke="url(#sig-loss)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="300"
        style={{ animation: 'loss-draw 4.5s ease-in-out infinite' }}
      />
      <circle cx="114" cy="4" r="2.2" fill="rgb(var(--accent))">
        <animate attributeName="r" values="2;4;2" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function RingSweep() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-6 w-6">
        <div
          className="absolute inset-0 rounded-full border border-border-strong/60"
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, rgb(var(--accent)) 0deg, transparent 90deg, rgb(var(--accent-alt)) 180deg, transparent 270deg)',
            animation: 'slow-spin 2.8s linear infinite',
            mask: 'radial-gradient(transparent 50%, black 52%)',
            WebkitMask: 'radial-gradient(transparent 50%, black 52%)',
          }}
        />
        <div className="absolute inset-[30%] rounded-full bg-accent" />
      </div>
      <div className="ml-2 flex flex-col gap-0.5">
        <span className="h-0.5 w-12 rounded-full bg-border-strong opacity-50" />
        <span className="h-0.5 w-8 rounded-full bg-accent" />
        <span className="h-0.5 w-10 rounded-full bg-border-strong opacity-40" />
      </div>
    </div>
  );
}

function FlowStrip() {
  const packets = [0, 1, 2, 3];
  return (
    <div className="relative flex h-full w-full items-center">
      <div className="absolute inset-x-2 top-1/2 h-3 -translate-y-1/2 overflow-hidden rounded-full border border-border-strong/40 bg-border/20" />
      {packets.map((i) => (
        <span
          key={i}
          className="absolute top-1/2 h-1.5 w-5 -translate-y-1/2 rounded-full"
          style={{
            background: i % 2 === 0 ? 'rgb(var(--accent))' : 'rgb(var(--accent-alt))',
            animation: 'flow-dot 2.4s linear infinite',
            animationDelay: `${-i * 0.6}s`,
            filter: 'drop-shadow(0 0 4px currentColor)',
            color: i % 2 === 0 ? 'rgb(var(--accent))' : 'rgb(var(--accent-alt))',
          }}
        />
      ))}
    </div>
  );
}

function NodeCluster() {
  const nodes = [
    { x: 22, y: 20 },
    { x: 60, y: 12 },
    { x: 60, y: 28 },
    { x: 100, y: 20 },
  ];
  const edges: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [1, 2],
  ];
  return (
    <svg viewBox="0 0 120 40" className="h-full w-full">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="rgb(var(--border-strong))"
          strokeOpacity="0.5"
          strokeWidth="0.6"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i === 0 || i === 3 ? 2.6 : 2.2}
          fill={i % 2 === 0 ? 'rgb(var(--accent))' : 'rgb(var(--accent-alt))'}
          style={{
            animation: 'node-pulse 2.8s ease-in-out infinite',
            animationDelay: `${i * 0.3}s`,
            transformOrigin: `${n.x}px ${n.y}px`,
            transformBox: 'fill-box',
          }}
        />
      ))}
    </svg>
  );
}
