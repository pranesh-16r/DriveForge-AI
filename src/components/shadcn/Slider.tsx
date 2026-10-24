import React from 'react';
import { cn } from '../../lib/utils';
import { gtaSoundEngine } from '../../utils/soundEffects';

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  label?: string;
  unit?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  unit = '',
  className,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('w-full space-y-2', className)}>
      {(label || unit) && (
        <div className="flex items-center justify-between text-xs font-mono font-bold">
          <span className="text-gray-400 uppercase">{label}</span>
          <span className="text-[#F59E0B]">
            {value}
            {unit}
          </span>
        </div>
      )}
      <div className="relative flex items-center select-none touch-none w-full h-5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            onChange(Number(e.target.value));
          }}
          onMouseDown={() => gtaSoundEngine.playClick()}
          className="w-full h-2.5 bg-[#14171D] rounded-lg appearance-none cursor-pointer accent-[#F59E0B] border border-white/10 focus:outline-none"
          style={{
            background: `linear-gradient(to right, #F59E0B 0%, #F59E0B ${percentage}%, #181B20 ${percentage}%, #181B20 100%)`,
          }}
        />
      </div>
    </div>
  );
};
