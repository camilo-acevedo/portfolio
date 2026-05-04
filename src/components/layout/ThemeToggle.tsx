import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/cn';

interface Props {
  className?: string;
}

export function ThemeToggle({ className }: Props) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleTheme(e);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full',
        'border border-border bg-bg-elevated/50 backdrop-blur',
        'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:border-accent/50 hover:bg-bg-elevated hover:shadow-[0_0_18px_-4px_rgb(var(--accent)/0.35)]',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500',
          'group-hover:opacity-100',
          isDark
            ? 'bg-gradient-to-br from-accent-alt/15 to-transparent'
            : 'bg-gradient-to-br from-amber-400/20 to-transparent',
        )}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ y: 18, rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, rotate: 0, opacity: 1, scale: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'relative flex items-center justify-center',
            isDark ? 'text-accent-alt' : 'text-amber-500 dark:text-amber-400',
          )}
        >
          {isDark ? (
            <Moon size={15} strokeWidth={1.6} />
          ) : (
            <Sun size={15} strokeWidth={1.8} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
