import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { neoSprings, neoPanelMotion } from '../../tokens/motion';

export interface NeoPanelProps extends Omit<HTMLMotionProps<'div'>, 'title' | 'children'> {
  title?: React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  radius?: '20' | '24' | '28';
  animateIn?: boolean;
}

export const NeoPanel: React.FC<NeoPanelProps> = ({
  title,
  subtitle,
  badge,
  action,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  radius = '24',
  animateIn = false,
  ...props
}) => {
  const radiusClass = {
    '20': 'rounded-[20px]',
    '24': 'rounded-[24px]',
    '28': 'rounded-[28px]',
  }[radius];

  return (
    <motion.div
      variants={animateIn ? neoPanelMotion : undefined}
      initial={animateIn ? 'initial' : undefined}
      animate={animateIn ? 'animate' : undefined}
      exit={animateIn ? 'exit' : undefined}
      transition={neoSprings.smooth}
      className={`neo-panel relative overflow-hidden text-[#171717] ${radiusClass} ${className}`}
      {...props}
    >
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#292927]/12 to-transparent pointer-events-none" />

      {(title || action || badge) && (
        <div className={`px-6 py-5 border-b border-[#292927]/10 flex flex-wrap items-center justify-between gap-4 ${headerClassName}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              {typeof title === 'string' ? (
                <h3 className="text-lg font-black text-[#171717] tracking-tight font-sans">{title}</h3>
              ) : (
                title
              )}
              {badge}
            </div>
            {subtitle && <p className="text-xs text-[#383835] font-sans tracking-wide">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={`p-6 ${bodyClassName}`}>{children}</div>
    </motion.div>
  );
};
