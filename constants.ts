

import { CountryStatus } from './types';

export const COLORS = {
  NONE: '#2E344D', // Uncolored
  PROPOSED: '#A7A9B2', // Cool Grey - Land proposed, no ambassador
  AMBASSADOR: '#D9A441', // Yellow/Gold
  SIGNED: '#F97316', // Orange
  DEVELOPMENT: '#3F5B4C', // Forest Green
  OPERATING: '#988ACF', // Pastel Purple

  BG: '#1E2233',
  TEXT: '#F2F2F2',
  TEXT_MUTED: '#C8CBD3'
};



// Currency Rates relative to USD
export const CURRENCY_RATES: Record<string, number> = {
  'USD': 1,
  'EUR': 0.92,
  'SOL': 9.85, // Example rate
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
  'ROU': CountryStatus.AMBASSADOR, // Romania
  'GRC': CountryStatus.AMBASSADOR, // Greece
  'SVN': CountryStatus.AMBASSADOR, // Slovenia
  'ITA': CountryStatus.AMBASSADOR, // Italy
  'MYS': CountryStatus.AMBASSADOR, // Malaysia
  'CYP': CountryStatus.AMBASSADOR, // Cyprus

  // Keeping existing ones for richness if not conflicting
  'FRA': CountryStatus.AMBASSADOR,
  'DEU': CountryStatus.AMBASSADOR,
  'GBR': CountryStatus.AMBASSADOR,

  // Land Proposed
  'LTU': CountryStatus.PROPOSED, // Lithuania
  'POL': CountryStatus.PROPOSED, // Poland
  'JPN': CountryStatus.PROPOSED, // Japan

  // Defaults/Previous (Optional, can be cleared if strict adherence needed)
  'USA': CountryStatus.NONE,
  'TUR': CountryStatus.NONE,
  'HRV': CountryStatus.NONE,
};
