import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type GlyphVariant = 'loss' | 'pipeline' | 'flow' | 'network';

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  variant: GlyphVariant;
  className?: string;
}

export function AbstractGlyph({ variant, className }: Props) {
  return (
    <div className={cn('relative mx-auto aspect-square w-full max-w-[300px]', className)}>
      <svg
        viewBox="0 0 300 300"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <circle
          cx="150"
          cy="150"
          r="130"
          stroke="rgb(var(--border))"
          strokeWidth="0.5"
          fill="none"
          opacity="0.5"
        />
        <circle
          cx="150"
          cy="150"
          r="90"
          stroke="rgb(var(--border))"
          strokeWidth="0.4"
          fill="none"
          opacity="0.35"
          strokeDasharray="1 4"
        />
      </svg>

      <AnimatePresence mode="wait">
        <motion.div
          key={variant}
          initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="absolute inset-0"
        >
          {variant === 'loss' && <ArcGlyph />}
          {variant === 'pipeline' && <LoopGlyph />}
          {variant === 'flow' && <LinesGlyph />}
          {variant === 'network' && <RadialGlyph />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ArcGlyph() {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full">
      <defs>
        <linearGradient id="arc-grad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.2" />
          <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="1" />
        </linearGradient>
      </defs>
      <line
        x1="50"
        y1="250"
        x2="250"
        y2="250"
        stroke="rgb(var(--border-strong))"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="250"
        stroke="rgb(var(--border-strong))"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <path
        d="M 50 245 C 110 242, 160 150, 250 55"
        stroke="url(#arc-grad)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="360"
        style={{ animation: 'loss-draw 8s ease-in-out infinite' }}
      />
      <circle cx="50" cy="245" r="2.5" fill="rgb(var(--border-strong))" />
      <g>
        <circle cx="250" cy="55" r="3" fill="rgb(var(--accent))">
          <animate attributeName="r" values="3;6;3" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.3;1" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="250" cy="55" r="1.8" fill="rgb(var(--accent))" />
      </g>
    </svg>
  );
}

function LoopGlyph() {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full">
      <g style={{ transformOrigin: '150px 150px', animation: 'slow-spin 28s linear infinite' }}>
        <circle
          cx="150"
          cy="150"
          r="100"
          stroke="rgb(var(--accent))"
          strokeWidth="1.4"
          fill="none"
          strokeDasharray="560 70"
          strokeLinecap="round"
        />
        <circle cx="150" cy="50" r="4" fill="rgb(var(--accent))" />
      </g>
      <g style={{ transformOrigin: '150px 150px', animation: 'slow-spin 54s linear infinite reverse' }}>
        <circle
          cx="150"
          cy="150"
          r="64"
          stroke="rgb(var(--accent-alt))"
          strokeWidth="1"
          fill="none"
          strokeDasharray="340 60"
          strokeLinecap="round"
          opacity="0.7"
        />
        <circle cx="214" cy="150" r="3" fill="rgb(var(--accent-alt))" opacity="0.8" />
      </g>
      <circle cx="150" cy="150" r="2.5" fill="rgb(var(--fg))" opacity="0.6" />
    </svg>
  );
}

function LinesGlyph() {
  const lines = [
    { x1: 60, x2: 230, y: 100, dur: 4.2, delay: 0 },
    { x1: 70, x2: 250, y: 150, dur: 3.8, delay: 0.6 },
    { x1: 50, x2: 210, y: 200, dur: 4.4, delay: 1.2 },
  ];
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full">
      {lines.map((l, i) => (
        <g key={i}>
          <line
            x1={l.x1}
            y1={l.y}
            x2={l.x2}
            y2={l.y}
            stroke="rgb(var(--accent))"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="14 8"
            style={{
              animation: `line-breathe ${l.dur}s ease-in-out infinite`,
              animationDelay: `${l.delay}s`,
            }}
          />
          <circle cx={l.x1} cy={l.y} r="2.4" fill="rgb(var(--border-strong))" />
          <circle cx={l.x2} cy={l.y} r="3" fill="rgb(var(--accent))" />
        </g>
      ))}
      <line
        x1="150"
        y1="70"
        x2="150"
        y2="230"
        stroke="rgb(var(--border-strong))"
        strokeWidth="0.5"
        opacity="0.4"
        strokeDasharray="2 5"
      />
    </svg>
  );
}

function RadialGlyph() {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full">
      {angles.map((a, i) => {
        const rad = (a * Math.PI) / 180;
        const x2 = 150 + Math.cos(rad) * 100;
        const y2 = 150 + Math.sin(rad) * 100;
        const isAccent = i % 2 === 0;
        return (
          <g
            key={a}
            style={{
              transformOrigin: '150px 150px',
              animation: `radiate-pulse 3.2s ease-in-out infinite`,
              animationDelay: `${(i / angles.length) * 3.2}s`,
            }}
          >
            <line
              x1="150"
              y1="150"
              x2={x2}
              y2={y2}
              stroke={isAccent ? 'rgb(var(--accent))' : 'rgb(var(--accent-alt))'}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle
              cx={x2}
              cy={y2}
              r={isAccent ? 3 : 2.2}
              fill={isAccent ? 'rgb(var(--accent))' : 'rgb(var(--accent-alt))'}
            />
          </g>
        );
      })}
      <circle
        cx="150"
        cy="150"
        r="6"
        fill="rgb(var(--bg))"
        stroke="rgb(var(--fg))"
        strokeWidth="1.2"
      />
      <circle cx="150" cy="150" r="2" fill="rgb(var(--fg))" />
    </svg>
  );
}
