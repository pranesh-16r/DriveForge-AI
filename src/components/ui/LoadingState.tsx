import React from 'react';
import { Cpu } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  subtext?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'RUNNING ENGINEERING TELEMETRY CALCULATION...',
  subtext = 'Analyzing vehicle tolerance matrices and fitment parameters',
  className = '',
}) => {
  return (
    <div className={`w-full py-16 flex flex-col items-center justify-center text-center space-y-6 ${className}`}>
      <div className="relative">
        {/* Outer Pulsing Glow Ring */}
        <div className="w-16 h-16 rounded-3xl neo-panel flex items-center justify-center relative animate-pulse border border-[#0070F3]/40 shadow-[0_0_25px_rgba(0,112,243,0.3)]">
          <Cpu className="w-8 h-8 text-[#0070F3] animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      </div>

      <div className="space-y-1.5 max-w-md">
        <p className="text-xs font-mono font-bold text-white tracking-widest uppercase">
          {message}
        </p>
        {subtext && (
          <p className="text-xs text-gray-400 font-sans">
            {subtext}
          </p>
        )}
      </div>

      {/* Engineering Progress Bar */}
      <div className="w-48 h-1 neo-inset rounded-full overflow-hidden">
        <div className="h-full bg-[#0070F3] animate-pulse w-2/3 rounded-full" />
      </div>
    </div>
  );
};
