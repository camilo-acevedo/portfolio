import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ChatConversation } from '@/components/fx/ChatConversation';
import { DecryptText } from '@/components/fx/DecryptText';

export function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="relative overflow-hidden border-t border-border py-20 sm:py-24 md:py-32 lg:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 h-[320px] w-[320px] rounded-full bg-accent-alt/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated/60 px-3 py-1 backdrop-blur"
          >
            <Terminal size={11} className="text-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-muted">
              <DecryptText text={t('about.label')} duration={700} />
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-serif text-[34px] leading-[1.05] tracking-tight sm:text-4xl md:text-6xl lg:text-7xl text-balance"
          >
            <span className="text-fg-muted">{t('about.title')}</span>{' '}
            <span className="gradient-text italic">{t('about.titleAccent')}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-balance text-base text-fg-muted md:text-lg"
          >
            {t('about.lead')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14"
        >
          <ChatConversation />
        </motion.div>
      </div>
    </section>
  );
}
