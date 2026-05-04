import { motion } from 'framer-motion';
import {
  ArrowUp,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { DecryptText } from '@/components/fx/DecryptText';
import { useCvHref } from '@/hooks/useCvHref';

const EASE = [0.22, 1, 0.36, 1] as const;

interface SocialLinkDef {
  key: 'github' | 'linkedin' | 'email' | 'cv';
  icon: LucideIcon;
  href: string;
  external?: boolean;
  download?: boolean;
}

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const buildDate = '2026-04';
  const cvHref = useCvHref();

  const SOCIAL_LINKS: SocialLinkDef[] = [
    { key: 'github', icon: Github, href: 'https://github.com/camilo-acevedo', external: true },
    {
      key: 'linkedin',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/bryam-camilo-acevedo',
      external: true,
    },
    { key: 'email', icon: Mail, href: 'mailto:acevedo8022013@gmail.com' },
    { key: 'cv', icon: Download, href: cvHref, download: true },
  ];

  const socials = t('footer.socials', { returnObjects: true }) as Record<string, string>;

  return (
    <footer className="relative border-t border-border py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-1/2 h-[240px] w-[420px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-16 flex flex-col items-start gap-5 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle"
          >
            <DecryptText text={t('footer.label')} duration={700} />
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-serif text-[40px] leading-[1.02] tracking-tight sm:text-5xl sm:leading-[0.98] md:text-7xl lg:text-[88px] text-balance"
          >
            {t('footer.cta')}{' '}
            <span className="gradient-text italic">{t('footer.ctaAccent')}</span>
          </motion.h2>

          <motion.a
            href="#top"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-fg-muted transition-colors hover:text-accent"
          >
            <ArrowUp
              size={12}
              className="transition-transform duration-500 group-hover:-translate-y-0.5"
            />
            {t('footer.backToTop')}
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-10 md:gap-3"
        >
          {SOCIAL_LINKS.map((s, i) => (
            <SocialLink
              key={s.key}
              icon={s.icon}
              label={socials[s.key]}
              href={s.href}
              external={s.external}
              download={s.download}
              index={i}
            />
          ))}
        </motion.div>

        <div className="mt-12 grid gap-6 border-t border-border/60 pt-8 md:mt-16 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-mono text-[11px] text-fg-subtle"
          >
            <div>
              <span className="text-accent">◉</span>{' '}
              <span className="text-fg">camilo.dev</span>{' '}
              <span className="text-fg-subtle">@</span>
              <span className="text-fg-muted">{t('footer.versionLabel')}</span>{' '}
              <span className="text-border-strong">·</span>{' '}
              <span>{t('footer.buildLabel', { date: buildDate })}</span>
            </div>
            <div className="mt-1.5 text-fg-subtle/80">
              {t('footer.rights', { year })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden text-center font-mono text-[11px] italic text-fg-subtle md:block"
          >
            {t('footer.tagline')}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-2 md:justify-end"
          >
            <LanguageToggle />
            <ThemeToggle />
          </motion.div>

          <div className="font-mono text-[11px] italic text-fg-subtle md:hidden">
            {t('footer.tagline')}
          </div>
        </div>
      </div>
    </footer>
  );
}

interface SocialLinkProps {
  icon: LucideIcon;
  label: string;
  href: string;
  external?: boolean;
  download?: boolean;
  index: number;
}

function SocialLink({ icon: Icon, label, href, external, download, index }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      download={download ? '' : undefined}
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: 0.35 + index * 0.06, ease: EASE }}
      whileHover={{ y: -2 }}
      className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-bg-elevated/30 px-4 py-2 font-mono text-[12px] text-fg-muted backdrop-blur transition-colors duration-300 hover:border-accent/50 hover:text-fg"
    >
      <Icon size={13} strokeWidth={1.8} />
      <span>{label}</span>
      {(external || download) && (
        <ArrowUpRight
          size={11}
          className="text-fg-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
        />
      )}
    </motion.a>
  );
}
