import React from 'react';

export interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
  rightElement?: React.ReactNode;
}

export const NeoInput: React.FC<NeoInputProps> = ({
  label,
  icon,
  error,
  helperText,
  rightElement,
  className = '',
  id,
  disabled,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-[#171717] uppercase tracking-wider font-mono">
          {label}
        </label>
      )}

      <div
        className={`relative flex items-center bg-[#FAFAF7] rounded-2xl transition-all duration-200 border ${
          error
            ? 'border-[#B8644A] ring-1 ring-[#B8644A]/30'
            : 'border-[#292927]/18 focus-within:border-[#171717] focus-within:ring-1 focus-within:ring-[#171717]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {icon && <div className="pl-4 text-[#383835] shrink-0">{icon}</div>}

        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`
            w-full bg-transparent px-4 py-3 text-sm text-[#171717] placeholder-[#737067] font-sans font-medium
            focus:outline-none disabled:cursor-not-allowed
            ${icon ? 'pl-2.5' : ''}
            ${rightElement ? 'pr-2' : ''}
            ${className}
          `}
          {...props}
        />

        {rightElement && <div className="pr-3 shrink-0">{rightElement}</div>}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-[#8B221A] font-mono font-bold tracking-wide flex items-center gap-1.5 pt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8644A] inline-block" />
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="text-xs text-[#383835] font-sans pt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};
