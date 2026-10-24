import React from 'react';
import { motion, useReducedMotion, HTMLMotionProps } from 'motion/react';

export interface PageTransitionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  preset?: 'slideUp' | 'fade' | 'scale';
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  preset = 'slideUp',
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  const getVariants = () => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      };
    }

    switch (preset) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.97 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.97 },
        };
      case 'slideUp':
      default:
        return {
          initial: { opacity: 0, y: 14, scale: 0.995 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -10, scale: 0.995 },
        };
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={getVariants()}
      transition={{
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`w-full ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
