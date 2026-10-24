import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { neoSprings, neoCardMotion } from '../../tokens/motion';

export interface NeoCardProps extends HTMLMotionProps<'div'> {
  variant?: 'raised' | 'inset' | 'panel' | 'flat';
  radius?: '20' | '24' | '28' | 'lg';
  interactive?: boolean;
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  variant = 'raised',
  radius = '24',
  interactive = false,
  active = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const radiusClass = {
    '20': 'rounded-[20px]',
    '24': 'rounded-[24px]',
    '28': 'rounded-[28px]',
    'lg': 'rounded-2xl',
  }[radius];

  const getVariantStyles = () => {
    if (active) {
      return 'neo-raised-active border-[#28483D]';
    }

    switch (variant) {
      case 'inset':
        return 'neo-inset';
      case 'panel':
        return 'neo-panel';
      case 'flat':
        return 'bg-[#FAFAF7] border border-[#292927]/12';
      case 'raised':
      default:
        return interactive ? 'neo-raised neo-raised-hover cursor-pointer' : 'neo-raised';
    }
  };

  return (
    <motion.div
      variants={interactive ? neoCardMotion : undefined}
      whileHover={interactive ? 'hover' : undefined}
      whileTap={interactive ? 'tap' : undefined}
      transition={neoSprings.tactile}
      onClick={onClick}
      className={`
        p-6 relative overflow-hidden transition-colors duration-200 text-[#171717]
        ${radiusClass}
        ${getVariantStyles()}
        ${className}
      `}
      {...props}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#292927]/10 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};
