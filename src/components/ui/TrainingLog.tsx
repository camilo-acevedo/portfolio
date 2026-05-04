import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';

interface LogEntry {
  ts: string;
  level: 'INFO' | 'EVENT' | 'STATUS';
  msg: string;
}

const levelStyles: Record<LogEntry['level'], string> = {
  INFO: 'text-fg-subtle',
  EVENT: 'text-accent',
  STATUS: 'text-accent-alt',
};

const levelBg: Record<LogEntry['level'], string> = {
  INFO: 'bg-fg-subtle/10 text-fg-subtle border-fg-subtle/20',
  EVENT: 'bg-accent/10 text-accent border-accent/30',
  STATUS: 'bg-accent-alt/10 text-accent-alt border-accent-alt/30',
};

export function TrainingLog({ className }: { className?: string }) {
  const { t } = useTranslation();
  const entries = t('about.log.entries', { returnObjects: true }) as LogEntry[];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-bg-elevated/40 backdrop-blur-xl',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay bg-grid"
      />

      <div className="relative flex items-center justify-between border-b border-border px-5 py-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-fg-muted">
          <span className="text-accent">$</span>
          <span>{t('about.log.title')}</span>
        </div>
        <span className="text-fg-subtle">{t('about.log.hint')}</span>
      </div>

      <div className="relative max-h-[420px] overflow-hidden p-5">
        <ol className="space-y-2 font-mono text-[13px] leading-relaxed">
          {entries.map((entry, i) => (
            <motion.li
              key={entry.ts}
              initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
            >
              <span className="text-fg-subtle">[{entry.ts}]</span>
              <span
                className={cn(
                  'rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                  levelBg[entry.level],
                )}
              >
                {entry.level}
              </span>
              <span className={cn('flex-1 min-w-0 break-words', levelStyles[entry.level])}>
                {entry.msg}
              </span>
            </motion.li>
          ))}
          <motion.li
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: entries.length * 0.08 + 0.2 }}
            className="flex items-center gap-2 pt-2"
          >
            <span className="text-accent">$</span>
            <span className="inline-block h-4 w-2 animate-pulse bg-accent" />
          </motion.li>
        </ol>
      </div>
    </div>
  );
}
