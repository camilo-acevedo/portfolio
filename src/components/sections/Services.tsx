import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AbstractGlyph } from '@/components/fx/AbstractGlyph';
import { DecryptText } from '@/components/fx/DecryptText';
import { cn } from '@/lib/cn';

type GlyphVariant = 'loss' | 'pipeline' | 'flow' | 'network';

interface Service {
  id: string;
  version: string;
  code: string;
  backdrop: GlyphVariant;
  name: string;
  tagline: string;
  summary: string;
  inputs: string;
  outputs: string;
  stages: string[];
  metrics: string[];
  useCases: string[];
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function Services() {
  const { t } = useTranslation();
  const items = t('services.items', { returnObjects: true }) as Service[];
  const labels = t('services.labels', { returnObjects: true }) as Record<string, string>;
  const [openId, setOpenId] = useState<string>(items[0]?.id ?? '');

  const open = items.find((i) => i.id === openId) ?? items[0];
  const openIndex = items.findIndex((i) => i.id === openId);

  return (
    <section id="services" className="relative border-t border-border py-20 sm:py-24 md:py-32 lg:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-20 flex flex-col items-start gap-5 md:mb-28">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle"
          >
            <DecryptText text={t('services.label')} duration={700} />
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-serif text-[40px] leading-[1.02] tracking-tight sm:text-5xl sm:leading-[0.98] md:text-7xl lg:text-[88px] text-balance"
          >
            {t('services.title')}{' '}
            <span className="gradient-text italic">{t('services.titleAccent')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="max-w-xl text-base text-fg-muted md:text-lg"
          >
            {t('services.subtitle')}
          </motion.p>
        </div>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <aside className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:sticky lg:top-32"
            >
              <AbstractGlyph variant={open.backdrop} />

              <div className="mt-10 border-t border-border/60 pt-6">
                <div className="flex items-baseline justify-between font-mono text-[11px] text-fg-subtle">
                  <span className="uppercase tracking-[0.22em]">{labels.stages}</span>
                  <span>
                    <AnimatedCount value={openIndex + 1} />
                    <span className="text-border-strong"> / </span>
                    <span>{String(items.length).padStart(2, '0')}</span>
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={open.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="mt-5 space-y-4"
                  >
                    <div className="font-mono text-[13px]">
                      <span className="text-accent">$</span>
                      <span className="ml-1.5 text-fg">{open.code}</span>
                      <span className="ml-1.5 text-fg-subtle">· {open.version}</span>
                    </div>
                    <div className="font-mono text-[12px] leading-relaxed text-fg-muted">
                      {open.stages.map((s, i) => (
                        <span key={s}>
                          <span className={i === 0 ? 'text-accent' : ''}>{s}</span>
                          {i < open.stages.length - 1 && (
                            <span className="mx-1.5 text-border-strong">→</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </aside>

          <div className="lg:col-span-8">
            <ul>
              {items.map((item, i) => (
                <AccordionRow
                  key={item.id}
                  item={item}
                  index={i}
                  labels={labels}
                  isOpen={item.id === openId}
                  onOpen={() => setOpenId(item.id)}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

interface RowProps {
  item: Service;
  index: number;
  labels: Record<string, string>;
  isOpen: boolean;
  onOpen: () => void;
}

function AccordionRow({ item, index, labels, isOpen, onOpen }: RowProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.25 + index * 0.08, ease: EASE }}
      className="relative border-t border-border/60 last:border-b"
    >
      <button
        onClick={onOpen}
        aria-expanded={isOpen}
        className="group relative flex w-full items-baseline gap-6 py-8 text-left md:gap-8 md:py-10"
      >
        {isOpen && (
          <motion.span
            layoutId="service-row-indicator"
            aria-hidden
            className="absolute left-[-24px] top-1/2 h-5 w-[2px] -translate-y-1/2 bg-accent"
            transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.7 }}
          />
        )}

        <span
          className={cn(
            'shrink-0 font-mono text-sm transition-colors duration-500',
            isOpen ? 'text-accent' : 'text-fg-subtle group-hover:text-fg-muted',
          )}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <span
          className={cn(
            'flex-1 font-serif text-3xl leading-[1.05] tracking-tight transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:text-4xl lg:text-5xl',
            isOpen ? 'text-fg' : 'text-fg-muted group-hover:text-fg',
          )}
          style={{ transform: isOpen ? 'translateX(6px)' : 'translateX(0)' }}
        >
          {item.name}
        </span>

        <motion.span
          aria-hidden
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-500',
            isOpen
              ? 'border-accent/50 bg-accent/10 text-accent'
              : 'text-fg-subtle group-hover:border-border-strong group-hover:text-fg',
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
            <RowBody item={item} labels={labels} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function RowBody({ item, labels }: { item: Service; labels: Record<string, string> }) {
  return (
    <div className="pb-12 pl-10 pr-0 md:pl-16">
      <motion.p
        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="font-serif text-2xl italic leading-[1.15] tracking-tight text-fg text-balance md:text-3xl"
      >
        &ldquo;{item.tagline}&rdquo;
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        className="mt-6 max-w-xl text-[15px] leading-relaxed text-fg-muted"
      >
        {item.summary}
      </motion.p>

      <dl className="mt-10 space-y-3 font-mono text-[13px]">
        <DefRow label={labels.inputs} value={item.inputs} delay={0.3} />
        <DefRow label={labels.outputs} value={item.outputs} delay={0.37} />
      </dl>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
        className="mt-10"
      >
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
          {labels.useCases}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {item.useCases.map((u, i) => (
            <motion.span
              key={u}
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, delay: 0.55 + i * 0.06, ease: EASE }}
              className="rounded-full border border-border px-3 py-1 text-[12px] text-fg-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              {u}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
        className="mt-10"
      >
        <a
          href="#contact"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-fg bg-fg px-5 py-2.5 text-[13px] font-semibold text-bg transition-colors hover:border-accent hover:bg-transparent hover:text-fg"
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            {labels.cta}
            <ArrowUpRight
              size={14}
              className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </a>
      </motion.div>
    </div>
  );
}

function DefRow({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className="flex items-start gap-6 border-b border-border/40 pb-3"
    >
      <dt className="w-24 shrink-0 text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
        {label}
      </dt>
      <dd className="flex-1 text-fg">{value}</dd>
    </motion.div>
  );
}

function AnimatedCount({ value }: { value: number }) {
  const str = String(value).padStart(2, '0');
  return (
    <span className="relative inline-flex overflow-hidden align-middle text-fg">
      <AnimatePresence mode="popLayout" initial={false}>
        {str.split('').map((ch, i) => (
          <motion.span
            key={`${ch}-${i}-${value}`}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="inline-block"
          >
            {ch}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
