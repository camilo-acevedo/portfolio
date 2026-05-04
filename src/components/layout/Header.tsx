import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/cn';

type SectionId =
  | 'top'
  | 'about'
  | 'services'
  | 'stack'
  | 'experience'
  | 'projects'
  | 'education'
  | 'contact';

interface NavItemDef {
  id: SectionId;
  labelKey: string;
}

const NAV_ITEMS: NavItemDef[] = [
  { id: 'about', labelKey: 'nav.about' },
  { id: 'services', labelKey: 'nav.services' },
  { id: 'stack', labelKey: 'nav.stack' },
  { id: 'experience', labelKey: 'nav.experience' },
  { id: 'projects', labelKey: 'nav.projects' },
  { id: 'education', labelKey: 'nav.education' },
  { id: 'contact', labelKey: 'nav.contact' },
];

const DRAMATIC_EASE = [0.76, 0, 0.24, 1] as const;
const SOFT_EASE = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<SectionId>('top');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const ids: SectionId[] = [
      'top',
      'about',
      'services',
      'stack',
      'experience',
      'projects',
      'education',
      'contact',
    ];
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(id);
          });
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [menuOpen]);

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <FullscreenMenu
            onClose={() => setMenuOpen(false)}
            activeSection={activeSection}
            t={t}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: SOFT_EASE }}
        className="fixed right-0 top-0 z-[70] flex h-[100dvh] w-11 flex-col md:w-12"
        aria-label="Primary navigation"
      >
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 backdrop-blur-md transition-colors duration-500',
            menuOpen ? 'bg-bg/60' : 'bg-bg/25',
          )}
        />
        <motion.div
          aria-hidden
          initial={false}
          animate={{ opacity: menuOpen ? 1 : 0.55 }}
          transition={{ duration: 0.6, ease: SOFT_EASE }}
          className="pointer-events-none absolute inset-y-6 left-0 w-px bg-gradient-to-b from-transparent via-border-strong to-transparent"
        />

        <div className="relative flex h-14 shrink-0 items-center justify-center">
          <RailLangToggle />
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="group relative flex flex-1 flex-col items-center justify-center overflow-hidden text-fg-muted transition-colors duration-500 hover:text-fg"
        >
          <motion.span
            aria-hidden
            initial={false}
            animate={{ scaleY: menuOpen ? 1 : 0 }}
            transition={{ duration: 0.6, ease: SOFT_EASE }}
            className="absolute inset-y-8 left-0 w-px origin-top bg-gradient-to-b from-accent via-accent-alt to-accent"
          />
          <span
            aria-hidden
            className={cn(
              'absolute inset-y-8 left-0 w-px origin-top scale-y-0 bg-gradient-to-b from-accent via-accent-alt to-accent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
              !menuOpen && 'group-hover:scale-y-100',
            )}
          />

          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.35, ease: SOFT_EASE }}
                className="flex flex-col items-center gap-6 text-accent"
              >
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span className="absolute inline-block h-px w-4 rotate-45 bg-current" />
                  <span className="absolute inline-block h-px w-4 -rotate-45 bg-current" />
                </span>
                <VerticalLabel text="CLOSE" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.35, ease: SOFT_EASE }}
                className="flex flex-col items-center gap-6"
              >
                <span className="relative flex h-[10px] w-[22px] items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]">
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 h-px w-full origin-right bg-current transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-[0.6] group-hover:bg-accent"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-0 right-0 h-px w-[55%] origin-left bg-current transition-all duration-[600ms] delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full group-hover:bg-accent"
                  />
                  <span
                    aria-hidden
                    className="absolute -right-1 top-1/2 h-[3px] w-[3px] -translate-y-1/2 rounded-full bg-accent opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:shadow-[0_0_6px_rgb(var(--accent)/0.8)]"
                  />
                </span>
                <VerticalLabel text="MENU" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className="relative flex shrink-0 items-center justify-center pb-5 pt-4">
          <span
            aria-hidden
            className="relative flex h-1.5 w-1.5"
            title={t('nav.availability')}
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--accent)/0.7)]" />
          </span>
        </div>
      </motion.aside>
    </>
  );
}

function VerticalLabel({ text }: { text: string }) {
  return (
    <span className="flex flex-col items-center gap-[5px] font-mono text-[10px] font-medium uppercase tracking-[0.25em] transition-colors duration-500">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 + i * 0.04, ease: SOFT_EASE }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

function RailLangToggle() {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage ?? 'en').startsWith('es') ? 'ES' : 'EN';
  const next = current === 'EN' ? 'es' : 'en';

  return (
    <button
      onClick={() => void i18n.changeLanguage(next)}
      className="group relative flex h-9 w-9 items-center justify-center font-mono text-[11px] font-medium tracking-[0.15em] text-fg-muted transition-colors duration-500 hover:text-accent"
      aria-label={`Switch language to ${next.toUpperCase()}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: SOFT_EASE }}
          className="inline-block"
        >
          {current}
        </motion.span>
      </AnimatePresence>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-1.5 h-px w-3 origin-center scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
    </button>
  );
}

interface FullscreenMenuProps {
  onClose: () => void;
  activeSection: SectionId;
  t: (key: string, options?: Record<string, unknown>) => string;
}

function FullscreenMenu({ onClose, activeSection, t }: FullscreenMenuProps) {
  return (
    <motion.div
      key="menu-overlay"
      initial={{ clipPath: 'circle(0% at calc(100% - 28px) 50%)' }}
      animate={{
        clipPath: 'circle(160% at calc(100% - 28px) 50%)',
        transition: { duration: 0.75, ease: DRAMATIC_EASE },
      }}
      exit={{
        clipPath: 'circle(0% at calc(100% - 28px) 50%)',
        transition: { duration: 0.65, delay: 0.3, ease: DRAMATIC_EASE },
      }}
      className="fixed inset-0 z-[60] pr-12 md:pr-14"
      style={{ willChange: 'clip-path' }}
    >
      <div aria-hidden className="absolute inset-0 bg-bg" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 bg-grid"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.6, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: SOFT_EASE }}
        className="pointer-events-none absolute -left-20 top-10 h-[380px] w-[380px] rounded-full bg-accent/15 blur-[140px]"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.5, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: SOFT_EASE }}
        className="pointer-events-none absolute right-0 bottom-10 h-[360px] w-[360px] rounded-full bg-accent-alt/15 blur-[140px]"
      />

      <div className="relative flex h-full flex-col">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, delay: 0.35, ease: SOFT_EASE }}
          className="flex shrink-0 items-center justify-between gap-4 border-b border-border/60 px-5 py-3.5 sm:px-6 sm:py-4 md:px-10"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgb(var(--accent)/0.6)]" />
            </span>
            <span className="font-mono text-[13px] font-semibold text-fg">
              camilo.dev
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle sm:inline">
              · {t('nav.availability')}
            </span>
          </div>
        </motion.div>

        <div className="relative flex flex-1 items-center overflow-hidden px-5 sm:px-6 md:px-12 lg:px-20">
          <nav aria-label="Main menu" className="w-full">
            <ul className="md:space-y-0">
              {NAV_ITEMS.map((item, i) => {
                const isActive = activeSection === item.id;
                const lastIdx = NAV_ITEMS.length - 1;
                return (
                  <li
                    key={item.id}
                    className="overflow-hidden border-b border-border/40 last:border-b-0 md:border-b-0"
                  >
                    <motion.a
                      href={`#${item.id}`}
                      onClick={onClose}
                      initial={{ opacity: 0, x: '-100%' }}
                      animate={{
                        opacity: 1,
                        x: '0%',
                        transition: {
                          duration: 0.8,
                          delay: 0.35 + i * 0.08,
                          ease: SOFT_EASE,
                        },
                      }}
                      exit={{
                        opacity: 0,
                        x: '110%',
                        transition: {
                          duration: 0.4,
                          delay: (lastIdx - i) * 0.04,
                          ease: DRAMATIC_EASE,
                        },
                      }}
                      className={cn(
                        'group relative flex items-baseline gap-3 py-3 md:gap-6 md:py-0',
                        'font-sans uppercase tracking-tight',
                        'text-[clamp(1.4rem,4.6vh,1.85rem)] font-extrabold leading-[1.1]',
                        'md:text-[clamp(2rem,7.5vh,5rem)] md:font-black md:leading-[0.95]',
                        'transition-colors duration-300',
                        isActive
                          ? 'text-accent'
                          : 'text-fg hover:text-accent-alt',
                      )}
                    >
                      <span
                        className={cn(
                          'shrink-0 self-center font-mono text-[10px] font-normal uppercase tracking-[0.2em] md:text-[12px]',
                          isActive ? 'text-accent/80' : 'text-fg-subtle',
                        )}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="relative flex-1 md:flex-initial">
                        {t(item.labelKey)}
                        {isActive && (
                          <motion.span
                            aria-hidden
                            layoutId="menu-active-dot"
                            className="absolute -right-3 top-1/2 inline-block h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent md:-right-6 md:h-2.5 md:w-2.5"
                            transition={{
                              type: 'spring',
                              stiffness: 320,
                              damping: 28,
                            }}
                          />
                        )}
                      </span>
                      <ArrowUpRight
                        aria-hidden
                        size={16}
                        strokeWidth={1.5}
                        className={cn(
                          'shrink-0 self-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-5 md:w-5',
                          'text-fg-subtle opacity-40 md:opacity-0',
                          'md:group-hover:translate-x-1 md:group-hover:-translate-y-1 md:group-hover:opacity-100',
                          isActive && 'text-accent opacity-70 md:opacity-60',
                        )}
                      />
                    </motion.a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <motion.footer
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.55, delay: 0.7, ease: SOFT_EASE }}
          className="relative flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-3 sm:gap-4 sm:px-6 sm:py-4 md:px-10"
        >
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SocialIcon
              href="https://github.com/camilo-acevedo"
              label="GitHub"
              icon={Github}
            />
            <SocialIcon
              href="https://www.linkedin.com/in/bryam-camilo-acevedo"
              label="LinkedIn"
              icon={Linkedin}
            />
            <SocialIcon
              href="mailto:acevedo8022013@gmail.com"
              label="Email"
              icon={Mail}
            />
          </div>

          <a
            href="#contact"
            onClick={onClose}
            className="group relative inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-full bg-fg px-5 text-[12.5px] font-semibold text-bg transition-transform hover:scale-[1.03]"
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-alt transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
            />
            <span className="relative z-10 inline-flex items-center gap-1.5 lowercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-bg/80 opacity-70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-bg" />
              </span>
              {t('nav.hire')}
            </span>
          </a>
        </motion.footer>
      </div>
    </motion.div>
  );
}

function SocialIcon({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof Github;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-bg-elevated/50 text-fg-muted transition-colors hover:border-accent/50 hover:text-fg"
    >
      <Icon size={14} strokeWidth={1.8} />
    </a>
  );
}
