import { Country, Region, RegionZone } from '../types';

export const COUNTRIES: Country[] = [
  {
    id: 'india',
    name: 'India',
    code: 'IN',
    currency: 'INR',
    currencySymbol: '₹',
    flag: '🇮🇳',
    context: 'Fast-growing performance ecosystem with dedicated track facilities, import hubs, and certified fabrication specialists.',
    regions: [
      {
        id: 'in-tamil-nadu',
        countryId: 'india',
        name: 'Tamil Nadu',
        code: 'IN-TN',
        currency: 'INR',
        currencySymbol: '₹',
        avgHourlyLaborRateUSD: 35,
        laborMultiplier: 0.45,
        shippingMultiplier: 1.25,
        locale: 'en-IN'
      },
      {
        id: 'in-karnataka',
        countryId: 'india',
        name: 'Karnataka',
        code: 'IN-KA',
        currency: 'INR',
        currencySymbol: '₹',
        avgHourlyLaborRateUSD: 40,
        laborMultiplier: 0.50,
        shippingMultiplier: 1.22,
        locale: 'en-IN'
      },
      {
        id: 'in-kerala',
        countryId: 'india',
        name: 'Kerala',
        code: 'IN-KL',
        currency: 'INR',
        currencySymbol: '₹',
        avgHourlyLaborRateUSD: 38,
        laborMultiplier: 0.48,
        shippingMultiplier: 1.26,
        locale: 'en-IN'
      },
      {
        id: 'in-maharashtra',
        countryId: 'india',
        name: 'Maharashtra',
        code: 'IN-MH',
        currency: 'INR',
        currencySymbol: '₹',
        avgHourlyLaborRateUSD: 45,
        laborMultiplier: 0.55,
        shippingMultiplier: 1.18,
        locale: 'en-IN'
      }
    ]
  },
  {
    id: 'usa',
    name: 'United States',
    code: 'US',
    currency: 'USD',
    currencySymbol: '$',
    flag: '🇺🇸',
    context: 'Global epicenter for automotive aftermarket parts, direct factory distribution, and diverse track facilities.',
    regions: [
      {
        id: 'us-california',
        countryId: 'usa',
        name: 'California',
        code: 'US-CA',
        currency: 'USD',
        currencySymbol: '$',
        avgHourlyLaborRateUSD: 195,
        laborMultiplier: 1.15,
        shippingMultiplier: 1.0,
        locale: 'en-US'
      },
      {
        id: 'us-texas',
        countryId: 'usa',
        name: 'Texas',
        code: 'US-TX',
        currency: 'USD',
        currencySymbol: '$',
        avgHourlyLaborRateUSD: 165,
        laborMultiplier: 0.95,
        shippingMultiplier: 0.98,
        locale: 'en-US'
      },
      {
        id: 'us-florida',
        countryId: 'usa',
        name: 'Florida',
        code: 'US-FL',
        currency: 'USD',
        currencySymbol: '$',
        avgHourlyLaborRateUSD: 160,
        laborMultiplier: 0.92,
        shippingMultiplier: 1.02,
        locale: 'en-US'
      },
      {
        id: 'us-new-york',
        countryId: 'usa',
        name: 'New York',
        code: 'US-NY',
        currency: 'USD',
        currencySymbol: '$',
        avgHourlyLaborRateUSD: 185,
        laborMultiplier: 1.08,
        shippingMultiplier: 1.04,
        locale: 'en-US'
      }
    ]
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    code: 'GB',
    currency: 'GBP',
    currencySymbol: '£',
    flag: '🇬🇧',
    context: 'Motorsport Valley cradle with specialized race engineering consultancies, dyno facilities, and tight chassis calibration expertise.',
    regions: [
      {
        id: 'gb-england',
        countryId: 'uk',
        name: 'England',
        code: 'GB-ENG',
        currency: 'GBP',
        currencySymbol: '£',
        avgHourlyLaborRateUSD: 175,
        laborMultiplier: 1.05,
        shippingMultiplier: 0.95,
        locale: 'en-GB'
      },
      {
        id: 'gb-scotland',
        countryId: 'uk',
        name: 'Scotland',
        code: 'GB-SCT',
        currency: 'GBP',
        currencySymbol: '£',
        avgHourlyLaborRateUSD: 155,
        laborMultiplier: 0.92,
        shippingMultiplier: 1.02,
        locale: 'en-GB'
      },
      {
        id: 'gb-wales',
        countryId: 'uk',
        name: 'Wales',
        code: 'GB-WLS',
        currency: 'GBP',
        currencySymbol: '£',
        avgHourlyLaborRateUSD: 150,
        laborMultiplier: 0.90,
        shippingMultiplier: 1.04,
        locale: 'en-GB'
      },
      {
        id: 'gb-northern-ireland',
        countryId: 'uk',
        name: 'Northern Ireland',
        code: 'GB-NIR',
        currency: 'GBP',
        currencySymbol: '£',
        avgHourlyLaborRateUSD: 145,
        laborMultiplier: 0.88,
        shippingMultiplier: 1.08,
        locale: 'en-GB'
      }
    ]
  },
  {
    id: 'australia',
    name: 'Australia',
    code: 'AU',
    currency: 'AUD',
    currencySymbol: 'A$',
    flag: '🇦🇺',
    context: 'Rigorous engineering standards (ADR compliance) with world-renowned billet engine programs and high-heat durability testing.',
    regions: [
      {
        id: 'au-nsw',
        countryId: 'australia',
        name: 'New South Wales',
        code: 'AU-NSW',
        currency: 'AUD',
        currencySymbol: 'A$',
        avgHourlyLaborRateUSD: 170,
        laborMultiplier: 1.02,
        shippingMultiplier: 1.18,
        locale: 'en-AU'
      },
      {
        id: 'au-victoria',
        countryId: 'australia',
        name: 'Victoria',
        code: 'AU-VIC',
        currency: 'AUD',
        currencySymbol: 'A$',
        avgHourlyLaborRateUSD: 165,
        laborMultiplier: 0.98,
        shippingMultiplier: 1.20,
        locale: 'en-AU'
      },
      {
        id: 'au-queensland',
        countryId: 'australia',
        name: 'Queensland',
        code: 'AU-QLD',
        currency: 'AUD',
        currencySymbol: 'A$',
        avgHourlyLaborRateUSD: 160,
        laborMultiplier: 0.95,
        shippingMultiplier: 1.22,
        locale: 'en-AU'
      },
      {
        id: 'au-western-australia',
        countryId: 'australia',
        name: 'Western Australia',
        code: 'AU-WA',
        currency: 'AUD',
        currencySymbol: 'A$',
        avgHourlyLaborRateUSD: 175,
        laborMultiplier: 1.05,
        shippingMultiplier: 1.28,
        locale: 'en-AU'
      }
    ]
  }
];

// Flat list of all supported regions
export const ALL_REGIONS: Region[] = COUNTRIES.flatMap(country => country.regions);

// Helper to look up country by id
export const getCountryById = (id: string): Country | undefined => {
  return COUNTRIES.find(c => c.id.toLowerCase() === id.toLowerCase());
};

// Helper to look up region by id
export const getRegionById = (id: string): Region | undefined => {
  return ALL_REGIONS.find(r => r.id.toLowerCase() === id.toLowerCase());
};

// Backwards-compatible RegionZone array for existing components and calculators
export const REGIONS: RegionZone[] = ALL_REGIONS.map(r => ({
  id: r.id,
  name: `${r.name} (${r.code})`,
  code: r.code,
  currency: r.currency,
  currencySymbol: r.currencySymbol,
  laborMultiplier: r.laborMultiplier,
  shippingMultiplier: r.shippingMultiplier,
  avgHourlyLaborRateUSD: r.avgHourlyLaborRateUSD
}));
