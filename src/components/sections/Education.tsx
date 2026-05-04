import { motion } from 'framer-motion';
import { Check, GraduationCap, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DecryptText } from '@/components/fx/DecryptText';
import { cn } from '@/lib/cn';

const EASE = [0.22, 1, 0.36, 1] as const;

type DegreeStatus = 'in-progress' | 'complete';

interface Degree {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  status: DegreeStatus;
  specialization: string;
}

interface Certification {
  id: string;
  title: string;
  institution: string;
  note?: string;
}

export function Education() {
  const { t } = useTranslation();
  const degrees = t('education.degrees', { returnObjects: true }) as Degree[];
  const certs = t('education.certs', { returnObjects: true }) as Certification[];

  return (
    <section id="education" className="relative border-t border-border py-20 sm:py-24 md:py-32 lg:py-36">
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
            <DecryptText text={t('education.label')} duration={700} />
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-serif text-[40px] leading-[1.02] tracking-tight sm:text-5xl sm:leading-[0.98] md:text-7xl lg:text-[88px] text-balance"
          >
            {t('education.title')}{' '}
            <span className="gradient-text italic">{t('education.titleAccent')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="max-w-xl text-base text-fg-muted md:text-lg"
          >
            {t('education.subtitle')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle"
        >
          <GraduationCap size={12} strokeWidth={1.8} />
          <span>{t('education.degreesLabel')}</span>
          <span className="h-px flex-1 bg-border" />
        </motion.div>

        <div className="divide-y divide-border/60 border-y border-border/60">
          {degrees.map((d, i) => (
            <DegreeRow
              key={d.id}
              degree={d}
              index={i}
              statusInProgress={t('education.statusInProgress')}
              statusComplete={t('education.statusComplete')}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle md:mt-20"
        >
          <Sparkles size={12} strokeWidth={1.8} />
          <span>{t('education.certsLabel')}</span>
          <span className="ml-1 rounded-full border border-border bg-bg-muted/50 px-2 py-0.5 text-[10px] text-fg-muted">
            {certs.length}
          </span>
          <span className="h-px flex-1 bg-border" />
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface DegreeRowProps {
  degree: Degree;
  index: number;
  statusInProgress: string;
  statusComplete: string;
}

function DegreeRow({ degree, index, statusInProgress, statusComplete }: DegreeRowProps) {
  const isInProgress = degree.status === 'in-progress';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: 0.35 + index * 0.08, ease: EASE }}
      className="grid gap-4 py-7 md:grid-cols-[auto_1fr_auto] md:gap-10 md:py-9"
    >
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle md:w-40">
        <div>{degree.period}</div>
        <div className="mt-1 text-[10px] text-fg-subtle/80">{degree.location}</div>
      </div>

      <div>
        <h3 className="font-serif text-2xl leading-[1.15] tracking-tight text-fg text-balance md:text-3xl lg:text-[32px]">
          {degree.degree}
        </h3>
        <div className="mt-2 font-mono text-[12px] uppercase tracking-[0.16em] text-fg-muted">
          {degree.institution}
        </div>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-fg-muted md:text-[15px]">
          {degree.specialization}
        </p>
      </div>

      <div className="md:self-start">
        {isInProgress ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent ring-1 ring-inset ring-accent/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {statusInProgress}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-500 ring-1 ring-inset ring-emerald-500/30 dark:text-emerald-400">
            <Check size={10} strokeWidth={2.5} />
            {statusComplete}
          </span>
        )}
      </div>
    </motion.div>
  );
}

interface CertCardProps {
  cert: Certification;
  index: number;
}

function CertCard({ cert, index }: CertCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: 0.45 + index * 0.05, ease: EASE }}
      whileHover={{ y: -2 }}
      className={cn(
        'group relative flex min-h-[104px] flex-col rounded-2xl border border-border/60 bg-bg-elevated/30 p-4 backdrop-blur-sm transition-colors duration-500 md:p-5',
        'hover:border-accent/40',
      )}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
        {cert.institution}
      </div>
      <h3 className="mt-2 font-serif text-[17px] leading-[1.25] tracking-tight text-fg md:text-[18px]">
        {cert.title}
      </h3>
      {cert.note && (
        <p className="mt-auto pt-2 font-mono text-[11px] italic text-fg-subtle">— {cert.note}</p>
      )}
    </motion.article>
  );
}
