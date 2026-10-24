import React from 'react';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className = '',
}) => {
  return (
    <div className={`mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 ${align === 'center' ? 'text-center md:text-center' : ''} ${className}`}>
      <div className={`space-y-1.5 ${align === 'center' ? 'mx-auto max-w-2xl' : ''}`}>
        {eyebrow && (
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0070F3] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0070F3]" />
            {eyebrow}
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-gray-400 font-sans max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0 pt-2 md:pt-0">{action}</div>}
    </div>
  );
};
