import { useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Stack } from '@/components/sections/Stack';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';
import { ScrollProgress } from '@/components/fx/ScrollProgress';
import { CursorGlow } from '@/components/fx/CursorGlow';

function DocumentMeta() {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    document.title = t('meta.title');
    document.documentElement.lang = i18n.resolvedLanguage ?? 'en';
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('meta.description'));
  }, [t, i18n.resolvedLanguage]);
  return null;
}

function LangReveal({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const el = ref.current;
      if (!el) return;
      el.classList.remove('lang-blur-reveal');
      void el.offsetWidth;
      el.classList.add('lang-blur-reveal');
    };
    i18n.on('languageChanged', handler);
    return () => {
      i18n.off('languageChanged', handler);
    };
  }, [i18n]);

  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DocumentMeta />
      <div className="relative min-h-screen bg-bg text-fg">
        <ScrollProgress />
        <CursorGlow />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025] mix-blend-overlay bg-noise"
        />
        <div className="relative z-[2]">
          <Header />
          <LangReveal>
            <main className="md:pr-12">
              <Hero />
              <About />
              <Services />
              <Stack />
              <Experience />
              <Projects />
              <Education />
              <Contact />
            </main>
            <div className="md:pr-12">
              <Footer />
            </div>
          </LangReveal>
        </div>
      </div>
    </ThemeProvider>
  );
}
