import React from 'react';
import { cn } from '../../lib/utils';

interface RetroGridProps {
  className?: string;
  angle?: number;
  cellSize?: number;
  opacity?: number;
  lightLineColor?: string;
  darkLineColor?: string;
}

export const RetroGrid: React.FC<RetroGridProps> = ({
  className,
  angle = 65,
  cellSize = 50,
  opacity = 0.35,
  darkLineColor = '#F59E0B',
}) => {
  return (
    <div
      className={cn(
        'pointer-events-none absolute size-full overflow-hidden opacity-[var(--opacity)] [perspective:300px]',
        className
      )}
      style={
        {
          '--opacity': opacity,
          '--cell-size': `${cellSize}px`,
        } as React.CSSProperties
      }
    >
      {/* Grid */}
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          style={
            {
              '--grid-angle': `${angle}deg`,
              backgroundImage: `linear-gradient(to right, ${darkLineColor} 1px, transparent 0), linear-gradient(to bottom, ${darkLineColor} 1px, transparent 0)`,
              backgroundSize: `${cellSize}px ${cellSize}px`,
              backgroundRepeat: 'repeat',
              height: '300%',
              width: '600%',
              marginLeft: '-250%',
              transformOrigin: '100% 0 0',
            } as React.CSSProperties
          }
          className="animate-grid [background-repeat:repeat] [inset:0%_0px]"
        />
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#121417] via-transparent to-transparent" />
    </div>
  );
};
