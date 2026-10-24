import React from 'react';
import { NeoCard } from './NeoCard';
import { NeoButton } from './NeoButton';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <NeoCard variant="panel" radius="24" className={`p-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}>
      {icon && (
        <div className="w-16 h-16 rounded-2xl neo-inset flex items-center justify-center text-[#0070F3] mb-5 border border-white/5 shadow-inner">
          {icon}
        </div>
      )}

      <h3 className="text-xl font-bold text-white mb-2 font-sans tracking-tight">{title}</h3>
      <p className="text-sm text-gray-400 font-sans max-w-md mb-6 leading-relaxed">{description}</p>

      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {secondaryActionText && (
            <NeoButton variant="outline" size="md" onClick={onSecondaryAction}>
              {secondaryActionText}
            </NeoButton>
          )}
          {actionText && (
            <NeoButton variant="primary" size="md" onClick={onAction}>
              {actionText}
            </NeoButton>
          )}
        </div>
      )}
    </NeoCard>
  );
};
