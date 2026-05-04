import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface Props {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
  as?: 'p' | 'span' | 'div' | 'h2' | 'h3';
}

export function StaggerWords({
  text,
  className,
  delay = 0,
  step = 0.04,
  as: Tag = 'div',
}: Props) {
  const words = text.split(/(\s+)/);
  return (
    <Tag className={className}>
      {words.map((word, i) =>
        /^\s+$/.test(word) ? (
          <span key={i}>{word}</span>
        ) : (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span
              initial={{ opacity: 0, y: '60%', filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: '0%', filter: 'blur(0px)' }}
              transition={{
                duration: 0.6,
                delay: delay + (i / 2) * step,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn('inline-block will-change-[transform,opacity,filter]')}
            >
              {word}
            </motion.span>
          </span>
        ),
      )}
    </Tag>
  );
}
