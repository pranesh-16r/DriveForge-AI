import { Vehicle, Country, Region, ExperienceMode } from './index';
import { BuildComponent, BuildNote, BuildHealthStatus } from './build';

export interface SavedBuild {
  buildId: string; // e.g. "DF-BUILD-001"
  version: number;
  buildName: string;
  vehicle: Vehicle;
  country: Country | null;
  region: Region | null;
  experienceMode: ExperienceMode;
  componentIds: string[];
  components: BuildComponent[];
  notes: BuildNote[];
  costSummary: {
    partsCostUSD: number;
    laborCostUSD: number;
    totalCostUSD: number;
    regionalDisplayParts: string;
    regionalDisplayLabor: string;
    regionalDisplayTotal: string;
    currency: string;
    currencySymbol: string;
  };
  compatibilitySummary: {
    compatibleCount: number;
    conditionalCount: number;
    conflictCount: number;
    verificationRequiredCount: number;
    hasCriticalConflict: boolean;
  };
  buildHealth: {
    status: BuildHealthStatus;
    label: string;
  };
  performanceSummary?: {
    baselinePowerHp: number;
    projectedPowerHp: number;
    powerGainHp: number;
    baselineWeightKg: number;
    projectedWeightKg: number;
    weightDeltaKg: number;
  };
  selectedWorkshopId?: string;
  projectStatus?: 'draft' | 'in_progress' | 'tuning' | 'completed';
  projectGoal?: 'Track Attack' | 'Street Performance' | 'Drag Spec' | 'Show & Stance' | 'Daily Clubsport' | string;
  targetBudgetUSD?: number;
  createdAt: string;
  updatedAt: string;
}
