import React from 'react';
import { LucideIcon } from 'lucide-react';
import {
  ICON_SIZES,
  ICON_STROKE_WIDTHS,
  ICON_COLORS,
  IconSize,
  IconStrokeWidth,
  IconColor,
} from './iconConfig';

export interface IconProps {
  icon: LucideIcon;
  size?: IconSize | number;
  strokeWidth?: IconStrokeWidth | number;
  color?: IconColor | string;
  frame?: 'none' | 'inset' | 'raised' | 'panel' | 'glow';
  frameSize?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({
  icon: Component,
  size = 'md',
  strokeWidth = 'medium',
  color = 'primary',
  frame = 'none',
  frameSize = 'md',
  className = '',
  style,
}) => {
  const numericSize = typeof size === 'number' ? size : ICON_SIZES[size] || 20;
  const numericStroke = typeof strokeWidth === 'number' ? strokeWidth : ICON_STROKE_WIDTHS[strokeWidth] || 1.75;
  const colorClass = ICON_COLORS[color as IconColor] || color;

  const frameSizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-3xl',
  }[frameSize];

  if (frame === 'none') {
    return (
      <Component
        size={numericSize}
        strokeWidth={numericStroke}
        className={`shrink-0 ${colorClass} ${className}`}
        style={style}
      />
    );
  }

  const getFrameStyles = () => {
    switch (frame) {
      case 'inset':
        return 'neo-inset border border-white/5 shadow-inner';
      case 'raised':
        return 'neo-raised border border-white/10';
      case 'panel':
        return 'neo-panel border border-[#2A2F38]';
      case 'glow':
        return 'neo-panel border border-[#0070F3]/40 shadow-[0_0_20px_rgba(0,112,243,0.3)]';
      default:
        return '';
    }
  };

  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${frameSizeClasses} ${getFrameStyles()} ${className}`} style={style}>
      <Component
        size={numericSize}
        strokeWidth={numericStroke}
        className={colorClass}
      />
    </div>
  );
};
