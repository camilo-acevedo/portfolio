import { motion } from 'framer-motion';
import { ArrowUpRight, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NeuralCanvas } from '@/components/fx/NeuralCanvas';
import { MagneticLink } from '@/components/fx/MagneticButton';
import { DecryptText } from '@/components/fx/DecryptText';
import { useCvHref } from '@/hooks/useCvHref';

export function Hero() {
  const { t } = useTranslation();
  const cvHref = useCvHref();
  const titleLines = t('hero.titleLines', { returnObjects: true }) as string[];
  const stats = t('hero.stats', { returnObjects: true }) as { value: string; label: string }[];

  return (
    <section id="top" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <NeuralCanvas className="opacity-70" />
      </div>
      <div aria-hidden className="absolute inset-0 bg-grid opacity-20" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/10 to-bg"
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 pt-24 pb-20 sm:px-6 sm:pt-28 md:pt-32 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-bg-elevated/50 px-3 py-1 backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-xs text-fg-muted">
            <DecryptText text={t('hero.status')} trigger="mount" duration={1000} />
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle"
        >
          <DecryptText text={t('hero.eyebrow')} trigger="mount" delay={200} duration={900} />
        </motion.p>

        <h1 className="text-balance font-serif text-[42px] leading-[1.04] tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
          {titleLines.map((line, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {i === 1 ? <span className="gradient-text italic">{line}</span> : line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 max-w-2xl text-balance text-lg text-fg-muted md:text-xl"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <MagneticLink
            href="#contact"
            className="group relative gap-2 rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg transition-shadow hover:shadow-[0_0_40px_rgb(var(--accent)/0.4)]"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              {t('hero.ctaPrimary')}
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-accent-alt opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-60"
            />
          </MagneticLink>
          <MagneticLink
            href={cvHref}
            download
            className="group gap-2 rounded-full border border-border bg-bg-elevated/50 px-6 py-3 text-sm font-semibold text-fg backdrop-blur transition-all hover:border-accent/60 hover:bg-bg-elevated"
          >
            <Download size={16} className="transition-transform group-hover:translate-y-0.5" />
            <span className="ml-2">{t('hero.ctaSecondary')}</span>
          </MagneticLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.15 }}
          className="mt-14 grid grid-cols-2 gap-5 border-t border-border pt-8 md:mt-20 md:grid-cols-4 md:gap-6 md:pt-10"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + i * 0.08 }}
              className="group"
            >
              <div className="font-mono text-[26px] font-semibold text-fg transition-colors group-hover:text-accent sm:text-3xl md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-fg-subtle">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="group absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-label="Scroll to next section"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-subtle transition-colors duration-300 group-hover:text-fg">
          scroll
        </span>
        <motion.span
          aria-hidden
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-fg-muted transition-colors duration-300 group-hover:text-accent"
        >
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 1l6 6 6-6" />
          </svg>
        </motion.span>
      </motion.a>
    </section>
  );
}
