import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertOctagon,
  Check,
  Copy,
  Package,
  Plus,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DecryptText } from '@/components/fx/DecryptText';
import { cn } from '@/lib/cn';

const EASE = [0.22, 1, 0.36, 1] as const;

interface Role {
  id: string;
  hash: string;
  date: string;
  action: 'promote' | 'init';
  position: string;
  company: string;
  location: string;
  period: string;
  summary: string;
  highlights: string[];
}

type CategoryType = 'added' | 'improved' | 'breaking' | 'initial';
type ReleaseType = 'major' | 'minor' | 'patch';
type StatusType = 'rc' | 'stable' | 'initial';

type ChangeItem =
  | { kind: 'ref'; refIdx: number }
  | { kind: 'custom'; text: string }
  | { kind: 'metric'; metricKey: string; delta: string };

interface ReleaseCategory {
  type: CategoryType;
  items: ChangeItem[];
}

interface ReleaseData {
  version: string;
  releaseType: ReleaseType;
  status: StatusType;
  isCurrent: boolean;
  categories: ReleaseCategory[];
}

const RELEASE_DATA: Record<string, ReleaseData> = {
  'ghitss-current': {
    version: '3.0.0-rc',
    releaseType: 'major',
    status: 'rc',
    isCurrent: true,
    categories: [
      {
        type: 'added',
        items: [
          { kind: 'ref', refIdx: 0 },
          { kind: 'ref', refIdx: 1 },
          { kind: 'ref', refIdx: 3 },
        ],
      },
      {
        type: 'improved',
        items: [
          { kind: 'metric', metricKey: 'business_metrics_uplift', delta: '+25%' },
          { kind: 'metric', metricKey: 'deploy_time', delta: '−60%' },
          { kind: 'metric', metricKey: 'daily_records_processed', delta: '10M+' },
          { kind: 'metric', metricKey: 'model_auc_improvement', delta: '+15%' },
        ],
      },
    ],
  },
  'ghitss-mid': {
    version: '2.0.0',
    releaseType: 'major',
    status: 'stable',
    isCurrent: false,
    categories: [
      {
        type: 'breaking',
        items: [
          { kind: 'custom', text: 'jr_analyst.v1 → full ML/AI ownership' },
        ],
      },
      {
        type: 'added',
        items: [
          { kind: 'ref', refIdx: 1 },
          { kind: 'ref', refIdx: 2 },
          { kind: 'ref', refIdx: 3 },
          { kind: 'ref', refIdx: 5 },
        ],
      },
      {
        type: 'improved',
        items: [
          { kind: 'metric', metricKey: 'users_impacted', delta: '2M+' },
          { kind: 'metric', metricKey: 'training_dataset_size', delta: '+300%' },
          { kind: 'metric', metricKey: 'api_throughput', delta: '50K/day' },
          { kind: 'metric', metricKey: 'experiments_tracked', delta: '100+' },
        ],
      },
    ],
  },
  'claro-analyst': {
    version: '1.0.0',
    releaseType: 'major',
    status: 'initial',
    isCurrent: false,
    categories: [
      {
        type: 'initial',
        items: [
          { kind: 'ref', refIdx: 0 },
          { kind: 'ref', refIdx: 1 },
          { kind: 'ref', refIdx: 2 },
        ],
      },
      {
        type: 'improved',
        items: [
          { kind: 'metric', metricKey: 'data_mgmt_efficiency', delta: '+40%' },
          { kind: 'metric', metricKey: 'processing_time', delta: '−50%' },
        ],
      },
    ],
  },
};

const CATEGORY_CONFIG: Record<
  CategoryType,
  { Icon: LucideIcon; bullet: string; color: string; ringBg: string }
> = {
  added: {
    Icon: Plus,
    bullet: '+',
    color: 'text-accent',
    ringBg: 'bg-accent/10 text-accent ring-accent/30',
  },
  improved: {
    Icon: TrendingUp,
    bullet: '↗',
    color: 'text-emerald-500 dark:text-emerald-400',
    ringBg:
      'bg-emerald-500/10 text-emerald-500 ring-emerald-500/30 dark:text-emerald-400',
  },
  breaking: {
    Icon: AlertOctagon,
    bullet: '!',
    color: 'text-rose-500 dark:text-rose-400',
    ringBg: 'bg-rose-500/10 text-rose-500 ring-rose-500/30 dark:text-rose-400',
  },
  initial: {
    Icon: Package,
    bullet: '·',
    color: 'text-accent-alt',
    ringBg: 'bg-accent-alt/10 text-accent-alt ring-accent-alt/30',
  },
};

export function Experience() {
  const { t } = useTranslation();
  const roles = t('experience.roles', { returnObjects: true }) as Role[];

  const categoryLabels = t('experience.changelog.categoryLabels', {
    returnObjects: true,
  }) as Record<CategoryType, string>;
  const releaseTypeLabels = t('experience.changelog.releaseTypeLabels', {
    returnObjects: true,
  }) as Record<ReleaseType, string>;
  const statusLabels = t('experience.changelog.statusLabels', {
    returnObjects: true,
  }) as Record<StatusType, string>;
  const packageName = t('experience.changelog.packageName');
  const metaLine = t('experience.changelog.metaLine');
  const currentLabel = t('experience.changelog.current');

  const defaultOpenId = useMemo(
    () => roles.find((r) => RELEASE_DATA[r.id]?.isCurrent)?.id ?? roles[0]?.id ?? '',
    [roles],
  );
  const [openId, setOpenId] = useState<string>(defaultOpenId);

  const currentVersion =
    roles.map((r) => RELEASE_DATA[r.id]).find((r) => r?.isCurrent)?.version ?? '';
  const currentBanner = t('experience.changelog.currentBanner', {
    version: currentVersion,
  });

  const totalChanges = Object.values(RELEASE_DATA).reduce(
    (sum, r) => sum + r.categories.reduce((s, c) => s + c.items.length, 0),
    0,
  );

  return (
    <section id="experience" className="relative border-t border-border py-20 sm:py-24 md:py-32 lg:py-36">
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
            <DecryptText text={t('experience.label')} duration={700} />
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-serif text-[40px] leading-[1.02] tracking-tight sm:text-5xl sm:leading-[0.98] md:text-7xl lg:text-[88px] text-balance"
          >
            {t('experience.title')}{' '}
            <span className="gradient-text italic">{t('experience.titleAccent')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="max-w-xl text-base text-fg-muted md:text-lg"
          >
            {t('experience.subtitle')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="overflow-hidden rounded-3xl border border-border/60 bg-bg-elevated/40 backdrop-blur-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-border/60 px-4 py-3 sm:px-5 sm:py-3.5 md:px-7">
            <div className="flex min-w-0 items-center gap-2 font-mono text-[11.5px] text-fg-muted sm:text-[12px]">
              <span className="text-accent">◉</span>
              <span className="text-fg">{packageName}</span>
              <span className="hidden text-border-strong sm:inline">·</span>
              <span className="hidden text-fg-subtle sm:inline">{metaLine}</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              <span className="text-accent">{totalChanges}</span> changes
              <span className="text-border-strong"> · </span>
              <span className="text-fg-muted">{roles.length}</span> releases
            </div>
          </div>

          <div className="relative overflow-hidden border-b border-border/60 bg-accent/5">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent-alt/10 bg-[length:200%_auto] animate-[gradient-flow_8s_ease_infinite]"
            />
            <div className="relative flex items-center gap-3 px-4 py-3 sm:px-5 md:px-7">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-[12px] text-fg-muted">
                {currentBanner.split(currentVersion).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="mx-0.5 rounded-full bg-accent/15 px-1.5 py-0.5 font-medium text-accent ring-1 ring-inset ring-accent/30">
                        {currentVersion}
                      </span>
                    )}
                  </span>
                ))}
              </span>
            </div>
          </div>

          <ul>
            {roles.map((role, i) => {
              const data = RELEASE_DATA[role.id];
              if (!data) return null;
              return (
                <AccordionRelease
                  key={role.id}
                  role={role}
                  data={data}
                  index={i}
                  isOpen={openId === role.id}
                  onToggle={() =>
                    setOpenId((prev) => (prev === role.id ? '' : role.id))
                  }
                  categoryLabels={categoryLabels}
                  releaseTypeLabels={releaseTypeLabels}
                  statusLabels={statusLabels}
                  currentLabel={currentLabel}
                  packageName={packageName}
                  t={t}
                />
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

interface AccordionReleaseProps {
  role: Role;
  data: ReleaseData;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  categoryLabels: Record<CategoryType, string>;
  releaseTypeLabels: Record<ReleaseType, string>;
  statusLabels: Record<StatusType, string>;
  currentLabel: string;
  packageName: string;
  t: (key: string) => string;
}

function AccordionRelease({
  role,
  data,
  index,
  isOpen,
  onToggle,
  categoryLabels,
  releaseTypeLabels,
  statusLabels,
  currentLabel,
  packageName,
  t,
}: AccordionReleaseProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.35 + index * 0.1, ease: EASE }}
      className={cn(
        'relative border-t border-border/60 first:border-t-0',
        isOpen && data.isCurrent && 'bg-gradient-to-b from-accent/[0.04] to-transparent',
      )}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group relative flex w-full items-center gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5 sm:py-5 md:gap-6 md:px-7 md:py-6"
      >
        {isOpen && (
          <motion.span
            layoutId="release-row-indicator"
            aria-hidden
            className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 bg-accent"
            transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.7 }}
          />
        )}

        <span
          className={cn(
            'hidden shrink-0 font-mono text-[12px] transition-colors duration-500 sm:inline-block',
            isOpen ? 'text-accent' : 'text-fg-subtle group-hover:text-fg-muted',
          )}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[14px] md:text-[15.5px]">
              <span className="text-fg-muted">{packageName}</span>
              <span className="text-accent">@</span>
              <span
                className={cn(
                  'font-semibold transition-colors duration-500',
                  isOpen ? 'text-accent' : 'text-fg',
                )}
              >
                v{data.version}
              </span>
            </span>
            {data.isCurrent && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent ring-1 ring-inset ring-accent/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                {currentLabel}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 font-mono text-[11px] text-fg-subtle">
            <span className="truncate font-sans text-[13px] text-fg-muted md:text-[13.5px]">
              {role.position}
            </span>
            <span className="text-border-strong">·</span>
            <span>@ {role.company}</span>
            <span className="text-border-strong">·</span>
            <span>{role.date}</span>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <TypePill type={data.releaseType} label={releaseTypeLabels[data.releaseType]} />
          <StatusPill status={data.status} label={statusLabels[data.status]} />
        </div>

        <motion.span
          aria-hidden
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-500',
            isOpen
              ? 'border-accent/50 bg-accent/10 text-accent'
              : 'border-border text-fg-subtle group-hover:border-border-strong group-hover:text-fg',
          )}
        >
          <Plus size={14} strokeWidth={1.5} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.55, ease: EASE },
              opacity: { duration: 0.35, ease: EASE },
            }}
            className="overflow-hidden"
          >
            <ReleaseBody
              role={role}
              data={data}
              categoryLabels={categoryLabels}
              packageName={packageName}
              t={t}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

interface ReleaseBodyProps {
  role: Role;
  data: ReleaseData;
  categoryLabels: Record<CategoryType, string>;
  packageName: string;
  t: (key: string) => string;
}

function ReleaseBody({
  role,
  data,
  categoryLabels,
  packageName,
  t,
}: ReleaseBodyProps) {
  return (
    <div className="px-4 pb-8 pt-1 sm:px-5 sm:pb-10 sm:pt-2 md:px-7 md:pb-12 md:pl-[76px]">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        className="max-w-2xl text-[14px] leading-relaxed text-fg-muted md:text-[15px]"
      >
        {role.summary}
      </motion.p>

      <div className="mt-8 space-y-7">
        {data.categories.map((cat, catIdx) => (
          <motion.div
            key={cat.type}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2 + catIdx * 0.08,
              ease: EASE,
            }}
          >
            <CategoryHeader
              type={cat.type}
              label={categoryLabels[cat.type]}
              count={cat.items.length}
            />
            <ul className="mt-3 space-y-1.5 pl-6">
              {cat.items.map((item, itemIdx) => (
                <motion.li
                  key={itemIdx}
                  initial={{ opacity: 0, x: -6, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.45,
                    delay: 0.25 + catIdx * 0.08 + itemIdx * 0.04,
                    ease: EASE,
                  }}
                >
                  <ChangeItemRow
                    item={item}
                    role={role}
                    bullet={CATEGORY_CONFIG[cat.type].bullet}
                    color={CATEGORY_CONFIG[cat.type].color}
                  />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
      >
        <InstallCommand version={data.version} packageName={packageName} t={t} />
      </motion.div>
    </div>
  );
}

function CategoryHeader({
  type,
  label,
  count,
}: {
  type: CategoryType;
  label: string;
  count: number;
}) {
  const cfg = CATEGORY_CONFIG[type];
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden
        className={cn(
          'inline-flex h-5 w-5 items-center justify-center rounded-full ring-1 ring-inset',
          cfg.ringBg,
        )}
      >
        <cfg.Icon size={11} strokeWidth={2} />
      </span>
      <span className={cn('font-mono text-[11px] uppercase tracking-[0.2em]', cfg.color)}>
        {label}
      </span>
      <span className="font-mono text-[10px] text-fg-subtle">({count})</span>
    </div>
  );
}

function ChangeItemRow({
  item,
  role,
  bullet,
  color,
}: {
  item: ChangeItem;
  role: Role;
  bullet: string;
  color: string;
}) {
  if (item.kind === 'metric') {
    return (
      <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-3">
        <span className={cn('shrink-0 select-none font-mono text-[12px]', color)}>
          {bullet}
        </span>
        <span className="truncate font-mono text-[13px] text-fg-muted">
          {item.metricKey}
        </span>
        <span className={cn('font-mono text-[13px] font-semibold', color)}>
          {item.delta}
        </span>
      </div>
    );
  }

  const text = item.kind === 'ref' ? role.highlights[item.refIdx] : item.text;

  return (
    <div className="flex gap-3 font-mono text-[13px] leading-relaxed md:text-[13.5px]">
      <span className={cn('shrink-0 select-none', color)}>{bullet}</span>
      <span className="text-fg">{text}</span>
    </div>
  );
}

function TypePill({ type, label }: { type: ReleaseType; label: string }) {
  const config = {
    major:
      'bg-rose-500/10 text-rose-500 ring-rose-500/25 dark:text-rose-400',
    minor: 'bg-accent/10 text-accent ring-accent/25',
    patch: 'bg-bg-muted text-fg-subtle ring-border',
  }[type];
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ring-1 ring-inset',
        config,
      )}
    >
      {label}
    </span>
  );
}

function StatusPill({ status, label }: { status: StatusType; label: string }) {
  const config = {
    rc: {
      cls: 'bg-amber-500/10 text-amber-500 ring-amber-500/25 dark:text-amber-400',
      dot: 'bg-amber-500 dark:bg-amber-400',
    },
    stable: {
      cls: 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/25 dark:text-emerald-400',
      dot: 'bg-emerald-500 dark:bg-emerald-400',
    },
    initial: {
      cls: 'bg-bg-muted text-fg-subtle ring-border',
      dot: 'bg-fg-subtle',
    },
  }[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ring-1 ring-inset',
        config.cls,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {label}
    </span>
  );
}

function InstallCommand({
  version,
  packageName,
  t,
}: {
  version: string;
  packageName: string;
  t: (key: string) => string;
}) {
  const [copied, setCopied] = useState(false);
  const cmd = `pip install ${packageName}==${version}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="mt-8 inline-flex max-w-full items-center gap-3 overflow-hidden rounded-full border border-border/60 bg-bg-muted/50 px-4 py-2 font-mono text-[12px]">
      <span className="shrink-0 text-accent">$</span>
      <span className="truncate">
        <span className="text-fg-muted">pip install </span>
        <span className="text-accent-alt">{packageName}</span>
        <span className="text-fg-subtle">==</span>
        <span className="text-amber-500 dark:text-amber-400">{version}</span>
      </span>
      <button
        onClick={handleCopy}
        className={cn(
          'flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-[10px] uppercase tracking-wider transition-colors',
          copied
            ? 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400'
            : 'text-fg-subtle hover:bg-bg/60 hover:text-fg',
        )}
        aria-label="copy install command"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1"
            >
              <Check size={11} />
              {t('experience.changelog.copied')}
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1"
            >
              <Copy size={11} />
              {t('experience.changelog.copy')}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
