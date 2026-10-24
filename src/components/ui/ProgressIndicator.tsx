import React from 'react';

export interface ProgressIndicatorProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'amber' | 'red';
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  label,
  sublabel,
  showPercent = true,
  size = 'md',
  color = 'blue',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  const barColors = {
    blue: 'from-[#0051B3] to-[#0070F3] shadow-[0_0_10px_rgba(0,112,243,0.5)]',
    green: 'from-[#059669] to-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    amber: 'from-[#D97706] to-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    red: 'from-[#DC2626] to-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.5)]',
  }[color];

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="font-semibold text-gray-300 uppercase tracking-wider">{label}</span>
          <div className="flex items-center gap-2">
            {sublabel && <span className="text-gray-400 font-sans">{sublabel}</span>}
            {showPercent && <span className="font-bold text-[#0070F3]">{Math.round(clamped)}%</span>}
          </div>
        </div>
      )}

      <div className={`w-full neo-inset rounded-full p-0.5 overflow-hidden relative ${heightStyles}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-300 ease-out ${barColors}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
