import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { neoSprings } from '../../tokens/motion';

export interface NeoButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'raised' | 'primary' | 'inset' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  active?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  variant = 'raised',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  active = false,
  disabled = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs rounded-xl font-medium gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-2xl font-semibold gap-2',
    lg: 'px-7 py-3.5 text-base rounded-2xl font-bold gap-2.5',
  };

  const getVariantStyles = () => {
    if (disabled) {
      return 'bg-[#E8E2D8] text-[#737067] border border-[#292927]/15 cursor-not-allowed opacity-60';
    }

    if (variant === 'primary' || active) {
      return 'neo-button-primary';
    }

    switch (variant) {
      case 'inset':
        return 'neo-inset text-[#28483D] font-mono font-bold tracking-wide';
      case 'outline':
        return 'bg-[#FAFAF7] text-[#171717] border border-[#292927]/20 hover:border-[#28483D] hover:bg-[#FFFFFF] shadow-xs';
      case 'ghost':
        return 'bg-transparent text-[#292927] hover:bg-[#E8E2D8]/60 hover:text-[#171717]';
      case 'raised':
      default:
        return 'neo-button text-[#171717]';
    }
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.018 }}
      whileTap={disabled ? undefined : { scale: 0.975, y: 1 }}
      transition={neoSprings.tactile}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center tracking-wide transition-colors duration-200
        select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#28483D]
        ${sizeStyles[size]}
        ${getVariantStyles()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
    </motion.button>
  );
};
