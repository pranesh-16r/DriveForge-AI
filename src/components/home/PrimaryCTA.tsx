import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Wrench } from 'lucide-react';

export interface PrimaryCTAProps {
  label?: string;
  onClick: () => void;
  size?: 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export const PrimaryCTA: React.FC<PrimaryCTAProps> = ({
  label = 'START BUILD',
  onClick,
  size = 'lg',
  className = '',
  icon
}) => {
  const sizeClasses = size === 'lg' 
    ? 'px-8 py-4 text-sm sm:text-base font-bold tracking-wider' 
    : 'px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wide';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.025, translateY: -1 }}
      whileTap={{ scale: 0.975, translateY: 1 }}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      className={`
        relative group inline-flex items-center justify-center gap-3 rounded-2xl
        bg-[#28483D] hover:bg-[#1E362E]
        text-[#FAFAF7] font-mono uppercase select-none cursor-pointer font-bold
        shadow-[0_4px_20px_rgba(40,72,61,0.35)]
        border border-[#28483D]/40
        hover:shadow-[0_8px_30px_rgba(40,72,61,0.5)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#28483D]
        transition-all duration-200
        ${sizeClasses}
        ${className}
      `}
    >
      {icon || <Wrench className="w-4 h-4 text-white/90 group-hover:rotate-12 transition-transform duration-200" />}
      <span>{label}</span>
      <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform duration-200" />
    </motion.button>
  );
};
