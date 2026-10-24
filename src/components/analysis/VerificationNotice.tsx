import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

interface VerificationNoticeProps {
  title: string;
  description: string;
  whyItMatters: string;
  actionRequired?: string;
  isSafetyCritical?: boolean;
  className?: string;
}

export const VerificationNotice: React.FC<VerificationNoticeProps> = ({
  title,
  description,
  whyItMatters,
  actionRequired,
  isSafetyCritical = false,
  className = ''
}) => {
  return (
    <div
      className={`p-4 rounded-2xl neo-panel border transition-all ${
        isSafetyCritical
          ? 'bg-red-500/10 border-red-500/30 text-gray-200'
          : 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-gray-200'
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            isSafetyCritical ? 'bg-red-500/20 text-red-400' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
          }`}
        >
          {isSafetyCritical ? <ShieldAlert className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
        </div>

        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-mono font-black uppercase text-white tracking-wide">
              {title}
            </h4>
            {isSafetyCritical && (
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-red-500/25 text-red-300 border border-red-500/40">
                Safety Critical
              </span>
            )}
          </div>

          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            {description}
          </p>

          <div className="pt-1 text-[11px] font-mono text-gray-400">
            <span className="text-[#F59E0B] font-bold">Why It Matters: </span>
            {whyItMatters}
          </div>

          {actionRequired && (
            <div className="pt-1 text-[11px] font-mono text-[#38BDF8] flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span>Required Action: {actionRequired}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
