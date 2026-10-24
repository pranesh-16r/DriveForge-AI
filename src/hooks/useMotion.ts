import { useReducedMotion } from 'motion/react';

export const useMotion = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeInVariants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  const scaleUpVariants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  };

  const springTransition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  };

  return {
    shouldReduceMotion,
    fadeInVariants,
    scaleUpVariants,
    springTransition,
  };
};
