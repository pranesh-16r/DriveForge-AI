import { Vehicle, Country, Region } from './index';
import { BuildComponent } from './build';
import { Workshop } from '../lib/workshops/workshopTypes';
import { BuildPerformanceAnalysis } from './analysis';

export interface BuildReport {
  reportId: string;
  generatedDate: string;
  buildId: string;
  buildName: string;
  version: number;
  vehicle: Vehicle;
  country: Country | null;
  region: Region | null;
  components: BuildComponent[];
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
    status: 'COMPLIANT' | 'REVIEW_REQUIRED' | 'CONFLICT_DETECTED';
  };
  performanceAnalysis?: BuildPerformanceAnalysis;
  performanceSummary: {
    baselinePowerHp: number;
    projectedPowerHp: number;
    powerGainHp: number;
    baselineWeightKg: number;
    projectedWeightKg: number;
    weightDeltaKg: number;
    baselineZeroToSixty: number;
    projectedZeroToSixty: number;
  };
  homologationStatus: 'HOMOLOGATED' | 'VERIFIED' | 'REVIEW_REQUIRED' | 'CONDITIONALLY_APPROVED';
  verificationRequirements: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'CRITICAL' | 'RECOMMENDED' | 'STANDARD';
    componentName?: string;
  }>;
  aiRecommendations?: {
    summary: string;
    concerns: string[];
    nextSteps: string[];
  };
  workshop?: {
    workshop: Workshop;
    matchLevel: string;
    servicesMatched: string[];
  };
  disclaimer: string;
}
