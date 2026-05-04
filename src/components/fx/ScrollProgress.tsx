import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 30, mass: 0.4 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent via-accent-alt to-accent bg-[length:200%_auto]"
      style={{ scaleX, animation: 'gradient-flow 6s ease infinite' }}
    />
  );
}
