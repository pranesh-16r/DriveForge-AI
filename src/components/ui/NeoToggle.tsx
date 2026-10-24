import React from 'react';
import { motion } from 'motion/react';

export interface NeoToggleProps {
  label?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const NeoToggle: React.FC<NeoToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  icon,
  className = '',
}) => {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`
        flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAF7] border border-[#292927]/12 transition-all cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#292927]/25'}
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-[#383835]">{icon}</span>}
        <div>
          {label && <p className="text-sm font-bold text-[#171717] font-sans">{label}</p>}
          {description && <p className="text-xs text-[#383835] font-sans">{description}</p>}
        </div>
      </div>

      <div
        className={`
          relative w-12 h-6 rounded-full p-1 transition-colors duration-200 shrink-0
          ${checked ? 'bg-[#28483D]' : 'bg-[#E8E2D8] border border-[#292927]/20'}
        `}
      >
        <motion.div
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-4 h-4 rounded-full bg-[#FAFAF7] shadow-sm"
        />
      </div>
    </div>
  );
};
