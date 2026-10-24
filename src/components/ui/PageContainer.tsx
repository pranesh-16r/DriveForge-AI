import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  className?: string;
  maxWidth?: '5xl' | '6xl' | '7xl' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  subtitle,
  eyebrow,
  action,
  className = '',
  maxWidth = '7xl',
}) => {
  const widthClasses = {
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full',
  }[maxWidth];

  return (
    <div className={`w-full ${widthClasses} mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 ${className}`}>
      {(title || eyebrow) && (
        <div className="pb-6 border-b border-[#292927]/12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            {eyebrow && (
              <p className="text-xs font-mono font-black uppercase tracking-widest text-[#28483D] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#28483D]" />
                {eyebrow}
              </p>
            )}
            {title && (
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-tight font-sans">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base text-[#4A4843] font-medium font-sans max-w-3xl leading-relaxed mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
};
