import { Country, Region } from '../types';
import { ExtendedModificationComponent } from '../types/modification';
import { RegionalCostRange, CostConfidenceLevel, PriceSourceType } from '../types/build';

export interface CurrencyFormatConfig {
  code: string;
  symbol: string;
  locale: string;
}

export class PricingService {
  /**
   * Currency exchange rates relative to baseline USD.
   * India: ~₹85 + import/freight tariffs factored in per region.
   * UK: ~£0.79
   * Australia: ~A$1.54
   */
  private static readonly BASE_EXCHANGE_RATES: Record<string, number> = {
    INR: 85.0,
    USD: 1.0,
    GBP: 0.79,
    AUD: 1.54
  };

  /**
   * Format numbers according to region and locale standards.
   * Explicitly supports Indian numbering system (Lakhs / Crores: 1,20,000) for INR.
   */
  public static formatCurrency(amount: number, currency: string, currencySymbol: string): string {
    const rounded = Math.round(amount);

    if (currency === 'INR') {
      // Indian numbering format (e.g. 1,20,000)
      const formatted = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
      }).format(rounded);
      return `${currencySymbol}${formatted}`;
    }

    if (currency === 'GBP') {
      const formatted = new Intl.NumberFormat('en-GB', {
        maximumFractionDigits: 0
      }).format(rounded);
      return `${currencySymbol}${formatted}`;
    }

    if (currency === 'AUD') {
      const formatted = new Intl.NumberFormat('en-AU', {
        maximumFractionDigits: 0
      }).format(rounded);
      return `${currencySymbol}${formatted}`;
    }

    // Default USD
    const formatted = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(rounded);
    return `${currencySymbol}${formatted}`;
  }

  /**
   * Compact currency string for chips / badges (e.g., ₹35K–₹42K or $9.2K–$10.4K)
   */
  public static formatCompactRange(min: number, max: number, currencySymbol: string, currency: string): string {
    const formatValue = (val: number): string => {
      if (currency === 'INR') {
        if (val >= 100000) {
          const l = (val / 100000).toFixed(1).replace(/\.0$/, '');
          return `${l}L`;
        }
        if (val >= 1000) {
          const k = Math.round(val / 1000);
          return `${k}K`;
        }
        return `${Math.round(val)}`;
      }

      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1).replace(/\.0$/, '')}K`;
      }
      return `${Math.round(val)}`;
    };

    return `${currencySymbol}${formatValue(min)}–${currencySymbol}${formatValue(max)}`;
  }

  /**
   * Calculate regional part price range for a component.
   * Incorporates baseline USD part prices, regional shipping multipliers, and currency conversion.
   */
  public static calculateRegionalPartCost(
    component: ExtendedModificationComponent,
    country: Country | null,
    region: Region | null
  ): RegionalCostRange & { currency: string; currencySymbol: string; confidence: CostConfidenceLevel; sourceType: PriceSourceType } {
    const currency = region?.currency || country?.currency || 'USD';
    const currencySymbol = region?.currencySymbol || country?.currencySymbol || '$';
    const exchangeRate = this.BASE_EXCHANGE_RATES[currency] || 1.0;
    const shippingMultiplier = region?.shippingMultiplier || 1.0;

    // Base USD from component
    const minUSD = component.estimatedPrice.minUSD || component.priceUSD * 0.95;
    const maxUSD = component.estimatedPrice.maxUSD || component.priceUSD * 1.08;

    // Convert with regional factors
    // If INR, account for standard automotive import and local logistics
    const regionalDutyFactor = currency === 'INR' ? 1.15 : 1.0;

    let minLocal = minUSD * exchangeRate * shippingMultiplier * regionalDutyFactor;
    let maxLocal = maxUSD * exchangeRate * shippingMultiplier * regionalDutyFactor;

    // Clean rounding based on currency scale
    if (currency === 'INR') {
      minLocal = Math.round(minLocal / 500) * 500;
      maxLocal = Math.round(maxLocal / 500) * 500;
    } else {
      minLocal = Math.round(minLocal / 10) * 10;
      maxLocal = Math.round(maxLocal / 10) * 10;
    }

    const display = `${this.formatCurrency(minLocal, currency, currencySymbol)} – ${this.formatCurrency(maxLocal, currency, currencySymbol)}`;

    // Confidence derived deterministically from part data depth
    let confidence: CostConfidenceLevel = 'MEDIUM CONFIDENCE';
    if (component.brand && component.partNumber && component.specifications) {
      confidence = 'HIGH CONFIDENCE';
    } else if (!component.partNumber) {
      confidence = 'LOW CONFIDENCE';
    }

    return {
      min: minLocal,
      max: maxLocal,
      display,
      currency,
      currencySymbol,
      confidence,
      sourceType: 'Indicative Regional Estimate'
    };
  }
}
