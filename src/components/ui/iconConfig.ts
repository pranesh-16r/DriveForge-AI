/**
 * DriveForge AI - Standardized Lucide Icon Configuration
 * Standard stroke widths, size presets, and neomorphic framing tokens
 */

import { tokens } from '../../tokens/theme';

export const ICON_SIZES = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
} as const;

export type IconSize = keyof typeof ICON_SIZES;

export const ICON_STROKE_WIDTHS = {
  thin: 1.25,
  regular: 1.5,
  medium: 1.75,
  bold: 2.0,
} as const;

export type IconStrokeWidth = keyof typeof ICON_STROKE_WIDTHS;

export const ICON_COLORS = {
  primary: 'text-[#0070F3]',
  white: 'text-white',
  muted: 'text-gray-400',
  subtle: 'text-gray-500',
  success: 'text-[#10B981]',
  warning: 'text-[#F59E0B]',
  danger: 'text-[#EF4444]',
  accent: 'text-[#38BDF8]',
} as const;

export type IconColor = keyof typeof ICON_COLORS;

export const DEFAULT_ICON_CONFIG = {
  strokeWidth: ICON_STROKE_WIDTHS.medium,
  size: ICON_SIZES.md,
  color: ICON_COLORS.primary,
};
