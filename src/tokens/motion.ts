import { Transition, Variants } from 'motion/react';

/**
 * DriveForge AI - Standardized Framer Motion Physics & Variant Configurations
 * Complements tactile neomorphism with crisp spring dynamics and zero-jank entrance effects.
 */

// Spring physics configurations tuned for physical tactile feel
export const neoSprings = {
  // Snappy physical button presses & hover states
  tactile: {
    type: 'spring',
    stiffness: 450,
    damping: 30,
    mass: 0.8,
  } as Transition,

  // Smooth panel / modal / page transitions
  smooth: {
    type: 'spring',
    stiffness: 350,
    damping: 32,
    mass: 1,
  } as Transition,

  // Soft subtle element reveals
  gentle: {
    type: 'spring',
    stiffness: 260,
    damping: 25,
  } as Transition,

  // Fast micro-interactions (toggles, chips, badges)
  snappy: {
    type: 'spring',
    stiffness: 550,
    damping: 35,
  } as Transition,
};

// Standardized motion variants
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
};

export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: neoSprings.smooth,
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.99,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

export const scaleUpVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: neoSprings.smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.18 },
  },
};

export const staggerContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

// Tactile hover & tap interaction variants for Neomorphic components
export const neoButtonMotion: Variants = {
  initial: { scale: 1, y: 0 },
  hover: { scale: 1.018, transition: neoSprings.tactile },
  tap: { scale: 0.975, y: 1, transition: neoSprings.snappy },
};

export const neoCardMotion: Variants = {
  initial: { y: 0, scale: 1 },
  hover: { y: -3, scale: 1.005, transition: neoSprings.tactile },
  tap: { y: 0, scale: 0.995, transition: neoSprings.snappy },
};

export const neoPanelMotion: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: neoSprings.smooth },
  exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
};
