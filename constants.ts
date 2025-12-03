

import { CountryStatus } from './types';

export const COLORS = {
  NONE: '#2E344D', // Uncolored
  PROPOSED: '#A7A9B2', // Cool Grey - Land proposed, no ambassador
  AMBASSADOR: '#D9A441', // Yellow/Gold
  SIGNED: '#F97316', // Orange
  DEVELOPMENT: '#3F5B4C', // Forest Green
  OPERATING: '#988ACF', // Pastel Purple
  GOLD: '#D9A441', // Gold

  BG: '#1E2233',
  TEXT: '#F2F2F2',
  TEXT_MUTED: '#C8CBD3'
};



// Currency Rates relative to USD
export const CURRENCY_RATES: Record<string, number> = {
  'USD': 1,
  'EUR': 0.92,
  'SOL': 0.0066, // ~$150 USD
  'BTC': 0.000015, // Example rate
  'ETH': 0.00031
};



// Pre-defined status map based on user requirements
export const COUNTRY_STATUS_MAP: Record<string, CountryStatus> = {
  // In Development
  'BGR': CountryStatus.DEVELOPMENT, // Bulgaria

  // Land Signed
  'AUT': CountryStatus.SIGNED, // Austria

  // Ambassador
  'ITA': CountryStatus.AMBASSADOR, // Italy
  'LTU': CountryStatus.AMBASSADOR, // Lithuania
  'CYP': CountryStatus.AMBASSADOR, // Cyprus
  'ROU': CountryStatus.AMBASSADOR, // Romania

  // Land Proposed
  'SVN': CountryStatus.PROPOSED, // Slovenia
  'LVA': CountryStatus.PROPOSED, // Latvia

  // Defaults/Previous (Resetting others to NONE/Available as implied)
  'MYS': CountryStatus.NONE,
  'FRA': CountryStatus.NONE,
  'DEU': CountryStatus.NONE,
  'GBR': CountryStatus.NONE,
  'POL': CountryStatus.NONE,
  'JPN': CountryStatus.NONE,
  'USA': CountryStatus.NONE,
  'TUR': CountryStatus.NONE,
  'HRV': CountryStatus.NONE,
  'GRC': CountryStatus.NONE,
  'SVK': CountryStatus.PROPOSED,
  'FIN': CountryStatus.PROPOSED,
  'PRT': CountryStatus.PROPOSED,
  'CRI': CountryStatus.PROPOSED
};

// Estimated Average Daily Rate (ADR) per country in USD
export const COUNTRY_ADR_MAP: Record<string, number> = {
  'Bulgaria': 120,
  'Austria': 250,
  'Romania': 110,
  'Greece': 200,
  'Slovenia': 180,
  'Italy': 220,
  'Malaysia': 150,
  'Cyprus': 190,
  'France': 280,
  'Germany': 240,
  'United Kingdom': 260,
  'Lithuania': 130,
  'Poland': 125,
  'Japan': 300,
  'United States': 350,
  'Turkey': 140,
  'Croatia': 170,
  // Fallback
  'Unknown': 150
};
