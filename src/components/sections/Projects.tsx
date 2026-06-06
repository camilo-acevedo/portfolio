import { AnimatePresence, motion } from 'framer-motion';
import { Github, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DecryptText } from '@/components/fx/DecryptText';
import { cn } from '@/lib/cn';

const EASE = [0.22, 1, 0.36, 1] as const;

interface Metric {
  value: string;
  label: string;
}

interface CaseStudyContent {
  problem: string;
  approach: string;
  outcome: string;
}

interface Project {
  id: string;
  number: string;
  featured: boolean;
  name: string;
  tagline: string;
  period: string;
  summary: string;
  repo: string;
  caseStudy: CaseStudyContent;
  metrics: Metric[];
  stack: string[];
}

type ColumnKey = 'problem' | 'approach' | 'outcome';

interface RoadmapItem {
  name: string;
  tagline: string;
  status: string;
  tags: string[];
}

interface RoadmapContent {
  label: string;
  title: string;
  titleAccent: string;
  note: string;
  items: RoadmapItem[];
}

export function Projects() {
  const { t } = useTranslation();
  const items = t('projects.items', { returnObjects: true }) as Project[];
  const labels = t('projects.labels', { returnObjects: true }) as Record<string, string>;
  const roadmap = t('projects.roadmap', { returnObjects: true }) as RoadmapContent;
  const [openId, setOpenId] = useState<string>(items[0]?.id ?? '');

  return (
    <section id="projects" className="relative border-t border-border py-20 sm:py-24 md:py-32 lg:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-16 flex flex-col items-start gap-5 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle"
          >
            <DecryptText text={t('projects.label')} duration={700} />
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-serif text-[40px] leading-[1.02] tracking-tight sm:text-5xl sm:leading-[0.98] md:text-7xl lg:text-[88px] text-balance"
          >
            {t('projects.title')}{' '}
            <span className="gradient-text italic">{t('projects.titleAccent')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="max-w-xl text-base text-fg-muted md:text-lg"
          >
            {t('projects.subtitle')}
          </motion.p>
        </div>

        <ul>
          {items.map((item, i) => (
            <AccordionProject
              key={item.id}
              project={item}
              index={i}
              isOpen={openId === item.id}
              onToggle={() => setOpenId((prev) => (prev === item.id ? '' : item.id))}
              labels={labels}
            />
          ))}
        </ul>

        <Roadmap roadmap={roadmap} />
      </div>
    </section>
  );
}

function Roadmap({ roadmap }: { roadmap: RoadmapContent }) {
  if (!roadmap?.items?.length) return null;

  return (
    <div className="mt-24 md:mt-32">
      <div className="mb-10 flex flex-col items-start gap-4 md:mb-12">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle"
        >
          <Sparkles size={13} strokeWidth={1.5} className="text-accent" />
          {roadmap.label}
        </motion.span>
        <motion.h3
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="font-serif text-3xl leading-[1.05] tracking-tight sm:text-4xl md:text-5xl text-balance"
        >
          {roadmap.title}{' '}
          <span className="gradient-text italic">{roadmap.titleAccent}</span>
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="max-w-xl text-sm text-fg-muted md:text-base"
        >
          {roadmap.note}
        </motion.p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 md:gap-5">
        {roadmap.items.map((item, i) => (
          <RoadmapCard key={item.name} item={item} index={i} />
        ))}
      </ul>
    </div>
  );
}

function RoadmapCard({ item, index }: { item: RoadmapItem; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.1 + index * 0.08, ease: EASE }}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-dashed border-border-strong/70 bg-bg-elevated/30 p-6 transition-colors hover:border-accent/40 md:p-7"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className="font-serif text-xl tracking-tight text-fg md:text-2xl">
          {item.name}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-accent ring-1 ring-inset ring-accent/30">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          {item.status}
        </span>
      </div>

      <p className="relative text-[14px] leading-relaxed text-fg-muted">
        {item.tagline}
      </p>

      <div className="relative mt-auto flex flex-wrap gap-1.5 pt-1">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-bg-muted/60 px-2 py-0.5 font-mono text-[10.5px] text-fg-subtle"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.li>
  );
}

interface AccordionProjectProps {
  project: Project;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  labels: Record<string, string>;
}

function AccordionProject({
  project,
  index,
  isOpen,
  onToggle,
  labels,
}: AccordionProjectProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: 0.15 + index * 0.08, ease: EASE }}
      className="relative border-t border-border/60 last:border-b"
    >
      {project.featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/50 via-accent-alt/30 to-transparent"
        />
      )}

      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group relative flex w-full items-center gap-4 py-7 text-left sm:gap-5 sm:py-8 md:gap-10 md:py-10"
      >
        {isOpen && (
          <motion.span
            layoutId="project-row-indicator"
            aria-hidden
            className="absolute left-[-24px] top-1/2 h-6 w-[2px] -translate-y-1/2 bg-accent"
            transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.7 }}
          />
        )}

        <span
          className={cn(
            'shrink-0 font-serif italic leading-none tracking-tight transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
            'text-[36px] sm:text-[44px] md:text-[68px] lg:text-[84px]',
            isOpen
              ? 'text-fg'
              : project.featured
                ? 'text-fg-muted group-hover:text-fg'
                : 'text-fg-subtle group-hover:text-fg-muted',
          )}
        >
          {project.number}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 md:gap-2">
          <span
            className={cn(
              'font-serif leading-[1.08] tracking-tight transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'text-[19px] sm:text-2xl md:text-4xl lg:text-[44px]',
              isOpen ? 'text-fg' : 'text-fg-muted group-hover:text-fg',
            )}
            style={{ transform: isOpen ? 'translateX(4px)' : 'translateX(0)' }}
          >
            {project.name}
          </span>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-subtle md:text-[11px]">
            <span className="h-px w-8 bg-border-strong md:w-10" />
            <span>{project.period}</span>
          </div>
        </div>

        {project.featured && (
          <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent ring-1 ring-inset ring-accent/30 sm:inline-flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {labels.featured}
          </span>
        )}

        <motion.span
          aria-hidden
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-500',
            isOpen
              ? 'border-accent/50 bg-accent/10 text-accent'
              : 'border-border text-fg-subtle group-hover:border-border-strong group-hover:text-fg',
          )}
        >
          <Plus size={15} strokeWidth={1.5} />
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
              height: { duration: 0.6, ease: EASE },
              opacity: { duration: 0.4, ease: EASE },
            }}
            className="overflow-hidden"
          >
            <ProjectBody project={project} labels={labels} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function ProjectBody({
  project,
  labels,
}: {
  project: Project;
  labels: Record<string, string>;
}) {
  const columns: ColumnKey[] = ['problem', 'approach', 'outcome'];

  return (
    <div className="pb-14 md:pb-16">
      <motion.p
        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        className="max-w-3xl font-serif text-xl italic leading-snug text-fg-muted md:text-2xl lg:text-3xl text-balance"
      >
        &ldquo;{project.tagline}&rdquo;
      </motion.p>

      <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-10 lg:gap-14">
        {columns.map((col, ci) => (
          <motion.div
            key={col}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.2 + ci * 0.08, ease: EASE }}
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                {labels[col]}
              </span>
              <span
                aria-hidden
                className="h-px flex-1 bg-gradient-to-r from-border-strong to-transparent"
              />
            </div>
            <p className="text-[14.5px] leading-[1.7] text-fg-muted md:text-[15.5px]">
              {project.caseStudy[col]}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
        className="mt-14 border-y border-border/60 py-10 md:mt-16 md:py-12"
      >
        <div className="grid gap-10 md:grid-cols-3 md:gap-6">
          {project.metrics.map((m, mi) => (
            <PullQuoteMetric
              key={m.label}
              value={m.value}
              label={m.label}
              delay={0.55 + mi * 0.07}
              isFirst={mi === 0}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.8, ease: EASE }}
        className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[12px]"
      >
        <span className="uppercase tracking-[0.2em] text-fg-subtle">{labels.stack}</span>
        <span className="text-border-strong">·</span>
        <span className="text-fg-muted">
          {project.stack.map((s, si) => (
            <span key={s}>
              <span className="transition-colors hover:text-fg">{s}</span>
              {si < project.stack.length - 1 && (
                <span className="mx-1.5 text-border-strong">·</span>
              )}
            </span>
          ))}
        </span>
      </motion.div>

      <motion.a
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.9, ease: EASE }}
        className="group/repo mt-7 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle transition-colors hover:border-accent/50 hover:text-accent"
      >
        <Github size={14} strokeWidth={1.5} />
        {labels.viewSource}
        <span aria-hidden className="transition-transform group-hover/repo:translate-x-0.5">
          ↗
        </span>
      </motion.a>
    </div>
  );
}

function PullQuoteMetric({
  value,
  label,
  delay,
  isFirst,
}: {
  value: string;
  label: string;
  delay: number;
  isFirst: boolean;
}) {
  const isLong = value.length > 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={cn(
        'relative flex flex-col items-start md:items-center md:text-center',
        !isFirst && 'md:border-l md:border-border/50 md:pl-6 lg:pl-10',
      )}
    >
      <div
        className={cn(
          'font-serif leading-none tabular-nums tracking-tight text-fg',
          isLong ? 'text-4xl md:text-5xl lg:text-[56px]' : 'text-5xl md:text-6xl lg:text-[72px]',
        )}
      >
        {value}
      </div>
      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-fg-subtle">
        {label}
      </div>
    </motion.div>
  );
}
