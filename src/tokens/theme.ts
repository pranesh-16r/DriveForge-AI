/**
 * DriveForge AI - Design Tokens
 * Premium Neomorphism + Engineering Industrial Aesthetics
 */

export const tokens = {
  colors: {
    black: '#121212',
    charcoal: '#171717',
    graphite: '#292927',
    darkGrey: '#383835',
    mediumGrey: '#4A4843',
    borderGrey: '#D6D0C4',
    lightGrey: '#383835',
    offWhite: '#F4F1EA',
    white: '#FAFAF7',
    
    // Accent - Deep Racing Emerald & Warm Copper
    accent: {
      primary: '#28483D',
      secondary: '#B47A52',
      glow: 'rgba(40, 72, 61, 0.25)',
      subtle: 'rgba(40, 72, 61, 0.10)',
      border: 'rgba(40, 72, 61, 0.35)',
    },

    // Status States with High Contrast for WCAG AA
    status: {
      compatible: {
        bg: 'rgba(40, 72, 61, 0.12)',
        text: '#1E4D3A',
        border: 'rgba(40, 72, 61, 0.3)',
        dot: '#28483D',
        label: 'COMPATIBLE',
      },
      verificationRequired: {
        bg: 'rgba(180, 122, 82, 0.15)',
        text: '#8A4B1A',
        border: 'rgba(180, 122, 82, 0.35)',
        dot: '#B47A52',
        label: 'VERIFICATION REQ.',
      },
      conflict: {
        bg: 'rgba(184, 100, 74, 0.15)',
        text: '#8B221A',
        border: 'rgba(184, 100, 74, 0.35)',
        dot: '#B8644A',
        label: 'CONFLICT DETECTED',
      },
      pending: {
        bg: 'rgba(41, 41, 39, 0.10)',
        text: '#292927',
        border: 'rgba(41, 41, 39, 0.25)',
        dot: '#292927',
        label: 'PENDING CALC',
      },
    },
  },

  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    surfaceSm: '20px',
    surfaceMd: '24px',
    surfaceLg: '28px',
    full: '9999px',
  },

  shadows: {
    raised: '6px 6px 14px rgba(0, 0, 0, 0.65), -5px -5px 12px rgba(255, 255, 255, 0.035)',
    raisedHover: '8px 8px 20px rgba(0, 0, 0, 0.75), -6px -6px 14px rgba(255, 255, 255, 0.05)',
    raisedActive: '0 0 0 1px rgba(0, 112, 243, 0.5), 6px 6px 16px rgba(0, 0, 0, 0.65), -5px -5px 12px rgba(255, 255, 255, 0.04)',
    inset: 'inset 4px 4px 8px rgba(0, 0, 0, 0.75), inset -3px -3px 6px rgba(255, 255, 255, 0.03)',
    panel: '10px 10px 24px rgba(0, 0, 0, 0.7), -8px -8px 20px rgba(255, 255, 255, 0.03)',
    glowBlue: '0 0 20px rgba(0, 112, 243, 0.25)',
  },

  typography: {
    fontDisplay: "'Outfit', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },

  spacing: {
    containerMax: '1280px',
    sectionGap: '3.5rem',
  },
} as const;

export type StatusType = keyof typeof tokens.colors.status;
