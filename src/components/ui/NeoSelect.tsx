import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NeoSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
}

export const NeoSelect: React.FC<NeoSelectProps> = ({
  label,
  options,
  icon,
  error,
  helperText,
  className = '',
  id,
  value,
  onChange,
  disabled,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-bold text-[#171717] uppercase tracking-wider font-mono">
          {label}
        </label>
      )}

      <div className={`relative flex items-center bg-[#FAFAF7] border border-[#292927]/18 focus-within:border-[#171717] rounded-2xl transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {icon && <div className="pl-4 text-[#383835] shrink-0">{icon}</div>}

        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full bg-transparent px-4 py-3 text-sm text-[#171717] font-sans font-medium appearance-none cursor-pointer
            focus:outline-none disabled:cursor-not-allowed
            ${icon ? 'pl-2.5' : ''}
            pr-10
            ${className}
          `}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-[#FAFAF7] text-[#171717]">
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 pointer-events-none text-[#383835]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="text-xs text-[#8B221A] font-mono font-bold tracking-wide">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#383835]">{helperText}</p>
      ) : null}
    </div>
  );
};
