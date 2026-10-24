import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Clock } from 'lucide-react';
import { StatusType, tokens } from '../../tokens/theme';

export interface StatusBadgeProps {
  status: StatusType | 'exact' | 'minor_mod' | 'incompatible';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  // Normalize legacy string status
  let mappedStatus: StatusType = 'compatible';
  if (status === 'conflict' || status === 'incompatible') mappedStatus = 'conflict';
  else if (status === 'verificationRequired' || status === 'minor_mod') mappedStatus = 'verificationRequired';
  else if (status === 'pending') mappedStatus = 'pending';
  else mappedStatus = 'compatible';

  const config = tokens.colors.status[mappedStatus];

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[10px] gap-1 rounded-md font-mono',
    md: 'px-3 py-1 text-xs gap-1.5 rounded-lg font-mono',
    lg: 'px-4 py-1.5 text-xs gap-2 rounded-xl font-mono font-bold',
  };

  const getIcon = () => {
    switch (mappedStatus) {
      case 'compatible':
        return <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#10B981]" />;
      case 'verificationRequired':
        return <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#F59E0B]" />;
      case 'conflict':
        return <AlertOctagon className="w-3.5 h-3.5 shrink-0 text-[#EF4444]" />;
      case 'pending':
        return <Clock className="w-3.5 h-3.5 shrink-0 text-[#A0A8B8]" />;
    }
  };

  return (
    <span
      className={`
        inline-flex items-center tracking-wider font-semibold border uppercase
        shadow-sm backdrop-blur-md select-none
        ${sizeStyles[size]}
        ${className}
      `}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
      }}
    >
      {showIcon && getIcon()}
      <span>{label || config.label}</span>
    </span>
  );
};
