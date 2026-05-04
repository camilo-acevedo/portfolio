import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';

interface StatusRow {
  key: string;
  value: string;
  pulse?: boolean;
}

export function StatusCard({ className }: { className?: string }) {
  const { t } = useTranslation();
  const rows = t('about.status.rows', { returnObjects: true }) as StatusRow[];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-bg-elevated/60 backdrop-blur-xl',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-alt/5"
      />

      <div className="relative flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2 font-mono text-xs text-fg-muted">
          <span className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-red-400/70" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
            <span className="h-2 w-2 rounded-full bg-green-400/70" />
          </span>
          <span className="ml-2">{t('about.status.title')}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          {t('about.status.live')}
        </div>
      </div>

      <div className="relative p-5">
        <ul className="divide-y divide-border/60">
          {rows.map((row, i) => (
            <motion.li
              key={row.key}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex items-center justify-between gap-4 py-2.5 font-mono text-sm"
            >
              <span className="text-fg-subtle">{row.key}</span>
              <span className="flex items-center gap-2 text-fg">
                {row.pulse && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative h-2 w-2 rounded-full bg-accent" />
                  </span>
                )}
                {row.value}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
