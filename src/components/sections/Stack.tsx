import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { DecryptText } from '@/components/fx/DecryptText';
import {
  buildAdjacency,
  EDGES,
  TOOLS,
  type StackCategory,
  type Tool,
} from '@/data/stack';
import { cn } from '@/lib/cn';

const EASE = [0.22, 1, 0.36, 1] as const;

const CATEGORY_VAR: Record<StackCategory, string> = {
  lang: '--fg',
  ml: '--accent',
  llm: '--accent',
  cloud: '--accent',
  mlops: '--accent-alt',
  data: '--accent-alt',
  viz: '--fg-muted',
};

const CATEGORY_LABEL: Record<StackCategory, string> = {
  lang: 'languages',
  ml: 'ml / dl',
  llm: 'llm / rag',
  cloud: 'cloud',
  mlops: 'mlops',
  data: 'data',
  viz: 'serving & viz',
};

const CATEGORY_ORDER: StackCategory[] = [
  'lang',
  'ml',
  'llm',
  'mlops',
  'cloud',
  'data',
  'viz',
];

type Arg =
  | { kind: 'num'; val: string }
  | { kind: 'str'; val: string }
  | { kind: 'kwarg'; key: string; val: string };

interface Command {
  id: string;
  chip: string;
  desc: string;
  label: ReactNode;
  render: () => ReactNode[];
}

interface Entry {
  id: string;
  label: ReactNode;
  output: ReactNode[];
  currentLineIdx: number;
  complete: boolean;
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function Stack() {
  const { t } = useTranslation();
  const adjacency = useMemo(() => buildAdjacency(EDGES), []);
  const commands = useMemo(() => buildCommands(adjacency), [adjacency]);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  const streaming = entries.some((e) => !e.complete);

  const runCommand = useCallback((cmd: Command) => {
    const output = cmd.render();
    setEntries((prev) => [
      ...prev,
      {
        id: uid(),
        label: cmd.label,
        output,
        currentLineIdx: -1,
        complete: false,
      },
    ]);
  }, []);

  useEffect(() => {
    if (hasStarted) return;
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (list) => {
        if (list[0]?.isIntersecting) {
          setHasStarted(true);
          setTimeout(() => runCommand(commands[0]), 420);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasStarted, commands, runCommand]);

  useEffect(() => {
    const last = entries[entries.length - 1];
    if (!last || last.complete) return;

    const timer = window.setTimeout(
      () => {
        setEntries((prev) =>
          prev.map((e, i) => {
            if (i !== prev.length - 1) return e;
            const nextIdx = e.currentLineIdx + 1;
            if (nextIdx >= e.output.length) return { ...e, complete: true };
            return { ...e, currentLineIdx: nextIdx };
          }),
        );
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth',
        });
      },
      last.currentLineIdx < 0 ? 220 : 60 + Math.random() * 90,
    );

    return () => window.clearTimeout(timer);
  }, [entries]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [entries.length]);

  const handleChip = (cmd: Command) => {
    if (streaming) return;
    runCommand(cmd);
  };

  const handleClear = () => {
    setEntries([]);
    setTimeout(() => runCommand(commands[0]), 180);
  };

  return (
    <section id="stack" className="relative border-t border-border py-20 sm:py-24 md:py-32 lg:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-14 flex flex-col items-start gap-5 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle"
          >
            <DecryptText text={t('stack.label')} duration={700} />
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-serif text-[40px] leading-[1.02] tracking-tight sm:text-5xl sm:leading-[0.98] md:text-7xl lg:text-[88px] text-balance"
          >
            {t('stack.title')}{' '}
            <span className="gradient-text italic">{t('stack.titleAccent')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="max-w-xl text-base text-fg-muted md:text-lg"
          >
            {t('stack.subtitle')}
          </motion.p>
        </div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="overflow-hidden rounded-3xl border border-border/50 bg-bg-elevated/60 shadow-[0_20px_60px_-30px_rgb(0_0_0/0.25)] backdrop-blur-xl"
        >
          <div
            aria-hidden
            className="h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent"
          />

          <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 md:px-7">
            <div className="flex items-center gap-2 font-mono text-[11.5px] sm:text-[12px]">
              <span className="text-accent">$</span>
              <span className="text-fg">stack.py</span>
              <span className="text-border-strong">·</span>
              <span className="text-fg-subtle">python 3.11</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <span className="hidden sm:inline">live</span>
              </span>
              <button
                onClick={handleClear}
                disabled={streaming}
                className="inline-flex items-center gap-1 font-mono text-[11px] text-fg-subtle transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="clear session"
              >
                <RotateCcw size={10} />
                <span className="hidden sm:inline">clear</span>
              </button>
            </div>
          </div>

          <div
            aria-hidden
            className="mx-5 h-px bg-gradient-to-r from-transparent via-border to-transparent md:mx-7"
          />

          <div
            ref={scrollRef}
            className="relative max-h-[440px] min-h-[280px] overflow-y-auto scrollbar-none px-4 py-5 font-mono text-[12.5px] leading-[1.7] sm:px-5 sm:py-6 sm:text-[13px] md:max-h-[520px] md:min-h-[340px] md:px-7 md:py-8 md:text-[13.5px]"
            style={{
              maskImage:
                'linear-gradient(to bottom, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)',
            }}
          >
            <div className="mb-6 italic text-fg-subtle">
              <Hl.Cm>
                # <Hl.Num>{TOOLS.length}</Hl.Num> tools · <Hl.Num>7</Hl.Num>{' '}
                categories · run <Hl.Fn>stack.help()</Hl.Fn> to list methods
              </Hl.Cm>
            </div>

            <AnimatePresence initial={false}>
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="mb-5"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-accent">&gt;&gt;&gt;</span>
                    <span className="break-all">{entry.label}</span>
                  </div>
                  {entry.output.length > 0 && (
                    <div className="mt-2 space-y-[3px] border-l border-accent-alt/25 pl-4">
                      {entry.output
                        .slice(0, entry.currentLineIdx + 1)
                        .map((line, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -4, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.3, ease: EASE }}
                          >
                            {line}
                          </motion.div>
                        ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {!streaming && entries.length > 0 && (
              <div className="flex items-baseline gap-2 text-accent">
                <span>&gt;&gt;&gt;</span>
                <span className="inline-block h-[14px] w-[2px] translate-y-[2px] animate-pulse bg-accent" />
              </div>
            )}
          </div>

          <div
            aria-hidden
            className="mx-5 h-px bg-gradient-to-r from-transparent via-border to-transparent md:mx-7"
          />
          <div className="px-4 py-3 md:px-5">
            <div className="flex flex-wrap gap-x-1 gap-y-1.5">
              {commands.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => handleChip(cmd)}
                  disabled={streaming}
                  title={cmd.desc}
                  className={cn(
                    'group relative inline-flex items-center rounded-full px-3 py-1.5 font-mono text-[11px] text-fg-muted transition-colors duration-300',
                    'hover:bg-accent/[0.08] hover:text-accent',
                    'disabled:cursor-not-allowed disabled:opacity-40',
                  )}
                >
                  {cmd.chip}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const Hl = {
  Fn: ({ children }: { children: ReactNode }) => (
    <span className="text-accent">{children}</span>
  ),
  Num: ({ children }: { children: ReactNode }) => (
    <span className="text-accent-alt">{children}</span>
  ),
  Str: ({ children }: { children: ReactNode }) => (
    <span className="text-amber-400 dark:text-amber-300">{children}</span>
  ),
  Kw: ({ children }: { children: ReactNode }) => (
    <span className="text-rose-400 dark:text-rose-300">{children}</span>
  ),
  Pn: ({ children }: { children: ReactNode }) => (
    <span className="text-fg-subtle">{children}</span>
  ),
  Cm: ({ children }: { children: ReactNode }) => (
    <span className="italic text-fg-subtle">{children}</span>
  ),
};

function Cmd({ name, args = [] }: { name: string; args?: Arg[] }) {
  return (
    <span>
      <span className="text-fg">stack</span>
      <Hl.Pn>.</Hl.Pn>
      <Hl.Fn>{name}</Hl.Fn>
      <Hl.Pn>(</Hl.Pn>
      {args.map((arg, i) => (
        <span key={i}>
          {i > 0 && <Hl.Pn>, </Hl.Pn>}
          {arg.kind === 'num' && <Hl.Num>{arg.val}</Hl.Num>}
          {arg.kind === 'str' && <Hl.Str>{arg.val}</Hl.Str>}
          {arg.kind === 'kwarg' && (
            <>
              <span className="text-fg-muted">{arg.key}</span>
              <Hl.Pn>=</Hl.Pn>
              <Hl.Str>{arg.val}</Hl.Str>
            </>
          )}
        </span>
      ))}
      <Hl.Pn>)</Hl.Pn>
    </span>
  );
}

function ProfBar({ level, className }: { level: number; className?: string }) {
  const pct = Math.round(level * 100);
  return (
    <span
      aria-label={`${pct}% proficiency`}
      className={cn(
        'relative inline-block h-[3px] w-[64px] overflow-hidden rounded-full bg-bg-muted align-middle md:w-[92px]',
        className,
      )}
    >
      <motion.span
        initial={{ width: 0 }}
        animate={{ width: `${level * 100}%` }}
        transition={{ duration: 0.9, ease: EASE }}
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent/60 via-accent to-accent-alt"
      />
    </span>
  );
}

function ToolRow({ tool, idx }: { tool: Tool; idx: number }) {
  return (
    <div className="group -mx-2 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 rounded-md px-2 py-1 transition-colors duration-300 hover:bg-accent/[0.04] sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:gap-x-4">
      <span className="text-fg-subtle">
        [<Hl.Num>{idx}</Hl.Num>]
      </span>
      <span className="truncate text-fg">{tool.label}</span>
      <ProfBar level={tool.level} className="hidden sm:inline-block" />
      <span className="tabular-nums text-fg-subtle">
        <Hl.Num>{tool.level.toFixed(2)}</Hl.Num>
        <span className="mx-1.5 text-border-strong">·</span>
        <Hl.Num>{tool.years}</Hl.Num>
        y
      </span>
    </div>
  );
}

function ToolDetailRow({ tool }: { tool: Tool }) {
  return (
    <div className="group -mx-2 rounded-md px-2 py-1.5 transition-colors duration-300 hover:bg-accent/[0.04]">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-x-4">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{
              background: `rgb(var(${CATEGORY_VAR[tool.category]}))`,
              boxShadow: `0 0 6px rgb(var(${CATEGORY_VAR[tool.category]}) / 0.5)`,
            }}
          />
          <span className="truncate text-fg">{tool.label}</span>
          {tool.learning && <LearningBadge />}
        </div>
        <ProfBar level={tool.level} className="hidden sm:inline-block" />
        <span className="tabular-nums text-fg-subtle">
          <Hl.Num>{tool.level.toFixed(2)}</Hl.Num>
          <span className="mx-1.5 text-border-strong">·</span>
          <Hl.Num>{tool.years}</Hl.Num>
          y
        </span>
      </div>
      <div className="mt-1 pl-3.5 italic text-fg-subtle">
        <Hl.Cm># {tool.note}</Hl.Cm>
      </div>
    </div>
  );
}

function LearningBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-1.5 py-[1px] font-mono text-[9px] uppercase tracking-wider text-accent ring-1 ring-inset ring-accent/30">
      <span className="relative flex h-1 w-1">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-70" />
        <span className="relative h-1 w-1 rounded-full bg-accent" />
      </span>
      learning
    </span>
  );
}

function CategoryRow({
  category,
  count,
  avg,
  learning,
}: {
  category: StackCategory;
  count: number;
  avg: number;
  learning: number;
}) {
  const varName = CATEGORY_VAR[category];
  return (
    <div className="group -mx-2 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 rounded-md px-2 py-1 transition-colors duration-300 hover:bg-accent/[0.04] md:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] md:gap-x-4">
      <span
        aria-hidden
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{
          background: `rgb(var(${varName}))`,
          boxShadow: `0 0 6px rgb(var(${varName}) / 0.5)`,
        }}
      />
      <span className="truncate text-fg">{CATEGORY_LABEL[category]}</span>
      <ProfBar level={avg} className="hidden md:inline-block" />
      <span className="tabular-nums text-fg-subtle">
        <Hl.Num>{count}</Hl.Num>
        <span className="mx-1 text-border-strong">·</span>
        <Hl.Num>{avg.toFixed(2)}</Hl.Num>
      </span>
      <span className="hidden w-[72px] text-right tabular-nums text-fg-subtle md:inline">
        {learning > 0 ? (
          <>
            <Hl.Num>{learning}</Hl.Num>{' '}
            <span className="text-[11px]">learning</span>
          </>
        ) : (
          <span className="text-fg-subtle/60">—</span>
        )}
      </span>
    </div>
  );
}

function StatsLine({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="group -mx-2 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 rounded-md px-2 py-0.5 transition-colors duration-300 hover:bg-accent/[0.04] md:grid-cols-[180px_auto] md:gap-x-4">
      <span className="truncate text-fg-subtle">{label}</span>
      <span className="tabular-nums text-fg">
        <Hl.Num>{value}</Hl.Num>
      </span>
    </div>
  );
}

function HelpLine({ method, desc }: { method: ReactNode; desc: string }) {
  return (
    <div className="group -mx-2 flex flex-wrap items-baseline gap-x-4 rounded-md px-2 py-0.5 transition-colors duration-300 hover:bg-accent/[0.04]">
      <span className="min-w-[260px] whitespace-nowrap">{method}</span>
      <span className="text-fg-subtle">→ {desc}</span>
    </div>
  );
}

function buildCommands(adjacency: Map<string, Set<string>>): Command[] {
  return [
    {
      id: 'summary',
      chip: 'summary()',
      desc: 'overview',
      label: <Cmd name="summary" />,
      render: () => [
        <div>
          <Hl.Num>{TOOLS.length}</Hl.Num> tools <Hl.Pn>·</Hl.Pn>{' '}
          <Hl.Num>{EDGES.length}</Hl.Num> connections <Hl.Pn>·</Hl.Pn>{' '}
          <Hl.Num>{CATEGORY_ORDER.length}</Hl.Num> categories <Hl.Pn>·</Hl.Pn>{' '}
          <Hl.Num>{TOOLS.filter((t) => t.learning).length}</Hl.Num> in
          active learning
        </div>,
      ],
    },
    {
      id: 'top5',
      chip: 'top(5)',
      desc: 'highest proficiency',
      label: <Cmd name="top" args={[{ kind: 'num', val: '5' }]} />,
      render: () => {
        const top = [...TOOLS].sort((a, b) => b.level - a.level).slice(0, 5);
        return top.map((t, i) => <ToolRow key={t.id} tool={t} idx={i} />);
      },
    },
    {
      id: 'categories',
      chip: 'categories()',
      desc: 'breakdown by category',
      label: <Cmd name="categories" />,
      render: () => {
        const rows = CATEGORY_ORDER.map((cat) => {
          const list = TOOLS.filter((t) => t.category === cat);
          const avg = list.length
            ? list.reduce((s, t) => s + t.level, 0) / list.length
            : 0;
          const learning = list.filter((t) => t.learning).length;
          return { cat, count: list.length, avg, learning };
        });
        return [
          <div className="mb-1 text-fg-subtle">
            <Hl.Num>{rows.length}</Hl.Num> categories:
          </div>,
          ...rows.map((r) => (
            <CategoryRow
              key={r.cat}
              category={r.cat}
              count={r.count}
              avg={r.avg}
              learning={r.learning}
            />
          )),
        ];
      },
    },
    {
      id: 'filterLLM',
      chip: 'filter(category="llm")',
      desc: 'LLM & RAG stack',
      label: (
        <Cmd
          name="filter"
          args={[{ kind: 'kwarg', key: 'category', val: '"llm"' }]}
        />
      ),
      render: () => {
        const list = TOOLS.filter((t) => t.category === 'llm').sort(
          (a, b) => b.level - a.level,
        );
        return [
          <div className="mb-1 text-fg-subtle">
            <Hl.Num>{list.length}</Hl.Num> tools returned:
          </div>,
          ...list.map((t) => <ToolDetailRow key={t.id} tool={t} />),
        ];
      },
    },
    {
      id: 'filterCloud',
      chip: 'filter(category="cloud")',
      desc: 'cloud tools',
      label: (
        <Cmd
          name="filter"
          args={[{ kind: 'kwarg', key: 'category', val: '"cloud"' }]}
        />
      ),
      render: () => {
        const cloud = TOOLS.filter((t) => t.category === 'cloud').sort(
          (a, b) => b.level - a.level,
        );
        return [
          <div className="mb-1 text-fg-subtle">
            <Hl.Num>{cloud.length}</Hl.Num> tools returned:
          </div>,
          ...cloud.map((t) => <ToolDetailRow key={t.id} tool={t} />),
        ];
      },
    },
    {
      id: 'connectedPython',
      chip: 'connected("python")',
      desc: 'tools used with Python',
      label: <Cmd name="connected" args={[{ kind: 'str', val: '"python"' }]} />,
      render: () => {
        const neighbors = [...(adjacency.get('python') ?? [])]
          .map((id) => TOOLS.find((t) => t.id === id))
          .filter((t): t is Tool => Boolean(t))
          .sort((a, b) => b.level - a.level);
        return [
          <div>
            <Hl.Num>{neighbors.length}</Hl.Num> tools returned:
          </div>,
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {neighbors.map((n) => (
              <span
                key={n.id}
                className="group inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-bg-muted/40 px-2.5 py-[3px] font-mono text-[11.5px] text-fg transition-colors hover:border-accent/40 hover:bg-accent/[0.06]"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full transition-shadow"
                  style={{
                    background: `rgb(var(${CATEGORY_VAR[n.category]}))`,
                    boxShadow: `0 0 5px rgb(var(${CATEGORY_VAR[n.category]}) / 0.6)`,
                  }}
                />
                {n.label}
              </span>
            ))}
          </div>,
        ];
      },
    },
    {
      id: 'search',
      chip: 'search("rag")',
      desc: 'search label + notes',
      label: <Cmd name="search" args={[{ kind: 'str', val: '"rag"' }]} />,
      render: () => {
        const q = 'rag';
        const matches = TOOLS.filter(
          (t) =>
            t.label.toLowerCase().includes(q) ||
            t.note.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            CATEGORY_LABEL[t.category].toLowerCase().includes(q),
        ).sort((a, b) => b.level - a.level);
        return [
          <div className="mb-1 text-fg-subtle">
            <Hl.Num>{matches.length}</Hl.Num> matches for <Hl.Str>"rag"</Hl.Str>:
          </div>,
          ...matches.map((t) => <ToolDetailRow key={t.id} tool={t} />),
        ];
      },
    },
    {
      id: 'learning',
      chip: 'learning()',
      desc: 'currently exploring',
      label: <Cmd name="learning" />,
      render: () => {
        const list = TOOLS.filter((t) => t.learning).sort(
          (a, b) => b.level - a.level,
        );
        return [
          <div className="mb-1 text-fg-subtle">
            <Hl.Num>{list.length}</Hl.Num> tools tagged{' '}
            <Hl.Str>"learning"</Hl.Str>:
          </div>,
          ...list.map((t) => <ToolDetailRow key={t.id} tool={t} />),
          <div className="mt-2 italic text-fg-subtle">
            <Hl.Cm>
              # active focus: LLMs · RAG · data governance — connecting the
              M.Sc. research to production
            </Hl.Cm>
          </div>,
        ];
      },
    },
    {
      id: 'stats',
      chip: 'stats()',
      desc: 'aggregate metrics',
      label: <Cmd name="stats" />,
      render: () => {
        const totalTools = TOOLS.length;
        const totalEdges = EDGES.length;
        const avg =
          TOOLS.reduce((s, t) => s + t.level, 0) / Math.max(totalTools, 1);
        const prod = TOOLS.filter((t) => t.level >= 0.8).length;
        const learningCount = TOOLS.filter((t) => t.learning).length;
        const degrees = new Map<string, number>();
        EDGES.forEach(([a, b]) => {
          degrees.set(a, (degrees.get(a) ?? 0) + 1);
          degrees.set(b, (degrees.get(b) ?? 0) + 1);
        });
        const sorted = [...degrees.entries()].sort((a, b) => b[1] - a[1]);
        const mostConn = sorted[0];
        const mostConnTool = mostConn
          ? TOOLS.find((t) => t.id === mostConn[0])
          : undefined;
        return [
          <StatsLine label="total tools" value={totalTools} />,
          <StatsLine label="categories" value={CATEGORY_ORDER.length} />,
          <StatsLine label="connections (edges)" value={totalEdges} />,
          <StatsLine label="avg proficiency" value={avg.toFixed(2)} />,
          <StatsLine label="production-ready (≥ 0.8)" value={prod} />,
          <StatsLine label="in active learning" value={learningCount} />,
          <StatsLine
            label="most connected"
            value={
              mostConnTool ? `${mostConnTool.label} (${mostConn?.[1] ?? 0})` : '—'
            }
          />,
        ];
      },
    },
    {
      id: 'leastUsed',
      chip: 'least_used(5)',
      desc: 'bottom 5',
      label: <Cmd name="least_used" args={[{ kind: 'num', val: '5' }]} />,
      render: () => {
        const least = [...TOOLS].sort((a, b) => a.level - b.level).slice(0, 5);
        return least.map((t, i) => <ToolRow key={t.id} tool={t} idx={i} />);
      },
    },
    {
      id: 'help',
      chip: 'help()',
      desc: 'list all methods',
      label: <Cmd name="help" />,
      render: () => [
        <div className="text-fg-subtle italic">
          <Hl.Cm># Available methods on camilo-stack:</Hl.Cm>
        </div>,
        <HelpLine method={<Cmd name="summary" />} desc="overview" />,
        <HelpLine
          method={<Cmd name="top" args={[{ kind: 'num', val: 'n' }]} />}
          desc="top n by proficiency"
        />,
        <HelpLine
          method={<Cmd name="categories" />}
          desc="breakdown by category"
        />,
        <HelpLine
          method={
            <Cmd
              name="filter"
              args={[{ kind: 'kwarg', key: 'category', val: '"X"' }]}
            />
          }
          desc="filter by category"
        />,
        <HelpLine
          method={<Cmd name="connected" args={[{ kind: 'str', val: '"tool"' }]} />}
          desc="neighbors in the graph"
        />,
        <HelpLine
          method={<Cmd name="search" args={[{ kind: 'str', val: '"query"' }]} />}
          desc="search labels + notes"
        />,
        <HelpLine method={<Cmd name="learning" />} desc="currently exploring" />,
        <HelpLine method={<Cmd name="stats" />} desc="aggregate metrics" />,
        <HelpLine
          method={<Cmd name="least_used" args={[{ kind: 'num', val: 'n' }]} />}
          desc="bottom n by proficiency"
        />,
      ],
    },
  ];
}
