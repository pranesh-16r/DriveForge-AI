import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'gold' | 'neon';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[#0070F3] text-white border-transparent shadow-[0_0_10px_rgba(0,112,243,0.4)]',
    secondary: 'bg-[#1F242C] text-gray-300 border-white/10',
    destructive: 'bg-red-500/20 text-red-400 border-red-500/30',
    outline: 'text-gray-300 border-white/15',
    gold: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40 shadow-[0_0_10px_rgba(245,158,11,0.25)]',
    neon: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]',
  }[variant];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-semibold transition-colors focus:outline-none uppercase tracking-wider',
        variantStyles,
        className
      )}
      {...props}
    />
  );
};
