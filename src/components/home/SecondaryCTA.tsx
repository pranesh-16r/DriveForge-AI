import React from 'react';
import { motion } from 'motion/react';
import { Eye, ChevronRight } from 'lucide-react';

export interface SecondaryCTAProps {
  label?: string;
  onClick: () => void;
  size?: 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export const SecondaryCTA: React.FC<SecondaryCTAProps> = ({
  label = 'EXPLORE GARAGE',
  onClick,
  size = 'lg',
  className = '',
  icon
}) => {
  const sizeClasses = size === 'lg' 
    ? 'px-7 py-4 text-sm sm:text-base font-semibold tracking-wider' 
    : 'px-5 py-2.5 text-xs sm:text-sm font-medium tracking-wide';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02, translateY: -1 }}
      whileTap={{ scale: 0.98, translateY: 1 }}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      className={`
        inline-flex items-center justify-center gap-2.5 rounded-2xl
        bg-[#FAFAF7] text-[#171717] font-mono uppercase select-none cursor-pointer font-bold
        border border-[#292927]/20 hover:border-[#171717] hover:bg-[#E8E2D8]
        shadow-sm transition-all duration-200
        ${sizeClasses}
        ${className}
      `}
    >
      {icon || <Eye className="w-4 h-4 text-[#28483D]" />}
      <span>{label}</span>
      <ChevronRight className="w-4 h-4 text-[#4A4843] group-hover:text-[#171717] group-hover:translate-x-0.5 transition-transform" />
    </motion.button>
  );
};
