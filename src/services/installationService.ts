import { Country, Region, Vehicle } from '../types';
import { ExtendedModificationComponent, InstallationDifficulty } from '../types/modification';
import { RegionalCostRange, CostConfidenceLevel } from '../types/build';
import { PricingService } from './pricingService';

export class InstallationService {
  /**
   * Difficulty multipliers account for specialized calibration or tooling.
   */
  private static readonly DIFFICULTY_FACTORS: Record<InstallationDifficulty | 'specialist', { min: number; max: number; label: string }> = {
    bolt_on: { min: 0.85, max: 1.05, label: 'Bolt-On (Direct Fit)' },
    moderate: { min: 0.95, max: 1.20, label: 'Moderate (Alignment / Seal Test)' },
    professional_required: { min: 1.05, max: 1.35, label: 'Professional Required' },
    specialist: { min: 1.20, max: 1.50, label: 'Master Specialist Required' }
  };

  /**
   * Calculates regional installation cost range for a component on a vehicle.
   */
  public static calculateRegionalInstallationCost(
    component: ExtendedModificationComponent,
    vehicle: Vehicle,
    country: Country | null,
    region: Region | null
  ): RegionalCostRange & { hours: number; laborRateHourly: number; difficultyLabel: string; confidence: CostConfidenceLevel } {
    const currency = region?.currency || country?.currency || 'USD';
    const currencySymbol = region?.currencySymbol || country?.currencySymbol || '$';
    
    // Base labor rate in USD
    const hourlyRateUSD = region?.avgHourlyLaborRateUSD || 150;
    const laborMultiplier = region?.laborMultiplier || 1.0;
    
    // Base install hours
    const hours = component.installationEstimate?.hours || component.installHours || 2.0;
    
    // Map difficulty
    const diff = component.installationDifficulty || 'moderate';
    const factorConfig = this.DIFFICULTY_FACTORS[diff] || this.DIFFICULTY_FACTORS.moderate;

    // Currency exchange
    const exchangeRate = currency === 'INR' ? 85.0 : currency === 'GBP' ? 0.79 : currency === 'AUD' ? 1.54 : 1.0;

    // Hourly rate in local currency
    const hourlyRateLocal = hourlyRateUSD * laborMultiplier * exchangeRate;

    // Compute min and max labor range
    let minLabor = hours * hourlyRateLocal * factorConfig.min;
    let maxLabor = hours * hourlyRateLocal * factorConfig.max;

    // Clean rounding
    if (currency === 'INR') {
      minLabor = Math.round(minLabor / 200) * 200;
      maxLabor = Math.round(maxLabor / 200) * 200;
    } else {
      minLabor = Math.round(minLabor / 10) * 10;
      maxLabor = Math.round(maxLabor / 10) * 10;
    }

    const display = `${PricingService.formatCurrency(minLabor, currency, currencySymbol)} – ${PricingService.formatCurrency(maxLabor, currency, currencySymbol)}`;

    return {
      min: minLabor,
      max: maxLabor,
      display,
      hours,
      laborRateHourly: Math.round(hourlyRateLocal),
      difficultyLabel: factorConfig.label,
      confidence: 'HIGH CONFIDENCE'
    };
  }
}
