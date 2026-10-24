import React from 'react';

export interface NeoSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  minLabel?: string;
  maxLabel?: string;
}

export const NeoSlider: React.FC<NeoSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  disabled = false,
  className = '',
  minLabel,
  maxLabel,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`space-y-2 w-full ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[#171717] uppercase tracking-wider font-mono">{label}</span>
        <span className="font-mono font-bold text-[#28483D] bg-[#28483D]/10 border border-[#28483D]/30 px-2.5 py-0.5 rounded-lg">
          {value} {unit}
        </span>
      </div>

      <div className="relative flex items-center h-8 bg-[#E8E2D8] border border-[#292927]/12 rounded-2xl px-3">
        {/* Track Fill */}
        <div
          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-2.5 bg-[#28483D] rounded-full transition-all duration-150"
          style={{ width: `calc(${percentage}% - ${percentage * 0.1}px)` }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-transparent appearance-none cursor-pointer focus:outline-none z-10 
                     [&::-webkit-slider-thumb]:appearance-none 
                     [&::-webkit-slider-thumb]:w-5 
                     [&::-webkit-slider-thumb]:h-5 
                     [&::-webkit-slider-thumb]:rounded-full 
                     [&::-webkit-slider-thumb]:bg-[#FAFAF7] 
                     [&::-webkit-slider-thumb]:border-2 
                     [&::-webkit-slider-thumb]:border-[#28483D] 
                     [&::-webkit-slider-thumb]:shadow-md 
                     [&::-webkit-slider-thumb]:transition-transform 
                     [&::-webkit-slider-thumb]:hover:scale-110"
        />
      </div>

      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-[11px] font-mono text-[#383835]">
          <span>{minLabel || `${min} ${unit}`}</span>
          <span>{maxLabel || `${max} ${unit}`}</span>
        </div>
      )}
    </div>
  );
};
