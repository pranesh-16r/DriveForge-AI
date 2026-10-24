import React from 'react';
import { ConfidenceLevel } from '../../types/analysis';
import { ConfidenceService } from '../../services/confidenceService';
import { ShieldCheck, Info, AlertTriangle } from 'lucide-react';

interface DataConfidenceBadgeProps {
  level: ConfidenceLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const DataConfidenceBadge: React.FC<DataConfidenceBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const config = ConfidenceService.getConfig(level);

  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5 gap-1 font-mono tracking-wider',
    md: 'text-[10px] px-2.5 py-0.5 gap-1.5 font-mono font-bold tracking-wider',
    lg: 'text-xs px-3 py-1 gap-2 font-mono font-bold tracking-wider'
  }[size];

  return (
    <span
      title={config.description}
      className={`inline-flex items-center rounded-full border ${config.badgeBg} ${config.badgeBorder} ${config.textColor} ${sizeClasses} ${className}`}
    >
      {showIcon && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} shrink-0`} />
      )}
      <span>{config.label}</span>
    </span>
  );
};
