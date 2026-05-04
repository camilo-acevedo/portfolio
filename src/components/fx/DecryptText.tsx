import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789@#$%&?!';

interface Props {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  as?: 'span' | 'div';
  trigger?: 'mount' | 'inView';
}

export function DecryptText({
  text,
  className,
  delay = 0,
  duration = 900,
  as: Tag = 'span',
  trigger = 'inView',
}: Props) {
  const [output, setOutput] = useState(trigger === 'mount' ? text.replace(/\S/g, '·') : text);
  const ref = useRef<HTMLElement>(null);
  const startedRef = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setOutput(text);
      return;
    }

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const begin = performance.now() + delay;
      const len = text.length;
      let raf = 0;
      const step = (now: number) => {
        const t = Math.max(0, now - begin);
        const progress = Math.min(1, t / duration);
        let out = '';
        for (let i = 0; i < len; i++) {
          const ch = text[i];
          if (ch === ' ') {
            out += ' ';
            continue;
          }
          const charProgress = Math.min(1, Math.max(0, progress * len - i * 0.6));
          if (charProgress >= 1) {
            out += ch;
          } else if (charProgress <= 0) {
            out += CHARSET[Math.floor(Math.random() * CHARSET.length)];
          } else {
            out += CHARSET[Math.floor(Math.random() * CHARSET.length)];
          }
        }
        setOutput(out);
        if (progress < 1) raf = requestAnimationFrame(step);
        else setOutput(text);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    };

    if (trigger === 'mount') {
      const cleanup = start();
      return cleanup;
    }

    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            start();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [text, delay, duration, reduced, trigger]);

  return (
    <Tag
      ref={ref as never}
      className={cn('inline-block', className)}
      aria-label={text}
    >
      {output}
    </Tag>
  );
}
