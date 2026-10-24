import { ConfidenceLevel } from '../types/analysis';

export interface ConfidenceConfig {
  label: ConfidenceLevel;
  shortLabel: string;
  description: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  dotColor: string;
}

export class ConfidenceService {
  private static readonly CONFIGS: Record<ConfidenceLevel, ConfidenceConfig> = {
    'KNOWN DATA': {
      label: 'KNOWN DATA',
      shortLabel: 'Verified Data',
      description: 'Factory OEM baseline or certified manufacturer engineering specification.',
      badgeBg: 'bg-[#10B981]/15',
      badgeBorder: 'border-[#10B981]/35',
      textColor: 'text-[#10B981]',
      dotColor: 'bg-[#10B981]'
    },
    'ESTIMATED': {
      label: 'ESTIMATED',
      shortLabel: 'Deterministic Model',
      description: 'Calculated deterministically based on component flow benches, dyno data, and vehicle weight delta.',
      badgeBg: 'bg-[#0070F3]/15',
      badgeBorder: 'border-[#0070F3]/35',
      textColor: 'text-[#38BDF8]',
      dotColor: 'bg-[#0070F3]'
    },
    'ASSUMPTION': {
      label: 'ASSUMPTION',
      shortLabel: 'Engineering Assumption',
      description: 'Derived using baseline automotive physics, transmission efficiency (15% drivetrain loss), or standard ambient conditions.',
      badgeBg: 'bg-purple-500/15',
      badgeBorder: 'border-purple-500/35',
      textColor: 'text-purple-300',
      dotColor: 'bg-purple-400'
    },
    'USER INPUT': {
      label: 'USER INPUT',
      shortLabel: 'Driver Provided',
      description: 'Parameter provided directly through user customization or selected region profile.',
      badgeBg: 'bg-amber-500/15',
      badgeBorder: 'border-amber-500/35',
      textColor: 'text-amber-300',
      dotColor: 'bg-amber-400'
    },
    'VERIFICATION REQUIRED': {
      label: 'VERIFICATION REQUIRED',
      shortLabel: 'Inspect Physically',
      description: 'Requires physical inspection, laser alignment, wheel barrel clearance check, or wideband lambda dyno tuning.',
      badgeBg: 'bg-rose-500/15',
      badgeBorder: 'border-rose-500/35',
      textColor: 'text-rose-400',
      dotColor: 'bg-rose-500'
    }
  };

  public static getConfig(level: ConfidenceLevel): ConfidenceConfig {
    return this.CONFIGS[level] || this.CONFIGS['ESTIMATED'];
  }
}
