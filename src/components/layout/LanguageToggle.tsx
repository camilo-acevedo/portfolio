import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';

interface Props {
  className?: string;
}

export function LanguageToggle({ className }: Props) {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? 'en';
  const isEn = current.startsWith('en');

  const switchTo = (lng: 'en' | 'es') => {
    if (lng !== current) void i18n.changeLanguage(lng);
  };

  return (
    <div
      className={cn(
        'relative flex h-9 items-center rounded-full border border-border bg-bg-elevated/50 p-0.5 backdrop-blur',
        className,
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-accent/15 border border-accent/40"
        style={{ left: isEn ? 2 : 'calc(50% + 0px)' }}
      />
      <button
        onClick={() => switchTo('en')}
        className={cn(
          'relative z-10 h-8 px-3 text-xs font-mono uppercase tracking-wider transition-colors',
          isEn ? 'text-accent' : 'text-fg-muted hover:text-fg',
        )}
      >
        EN
      </button>
      <button
        onClick={() => switchTo('es')}
        className={cn(
          'relative z-10 h-8 px-3 text-xs font-mono uppercase tracking-wider transition-colors',
          !isEn ? 'text-accent' : 'text-fg-muted hover:text-fg',
        )}
      >
        ES
      </button>
    </div>
  );
}
