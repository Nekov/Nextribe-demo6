
export enum CountryStatus {
  NONE = 'none',
  PROPOSED = 'proposed', // Light Grey - Land plot proposed, no ambassador
  AMBASSADOR = 'ambassador', // Yellow
  SIGNED = 'signed', // Orange
  DEVELOPMENT = 'development', // Green
  OPERATING = 'operating' // Purple
}

export interface Ambassador {
  id: string;
  name: string;
  avatarUrl: string;
  joinedDate: string;
  contributionPoints: number;
}

export interface CountryData {
  id: string; // ISO 3166-1 alpha-3 usually for maps
  name: string;
  status: CountryStatus;
  progress: number; // 0-100
  ambassador?: Ambassador;
  description?: string;

  // Specific Metrics
  locationsProposed: number;
  locationsTarget: number;
  architectsRecommended: number;
  architectsTarget: number;
  lawyerRecommended: boolean;
  ambassadorApplications: number;
  ambassadorTarget: number;

  // Optional
  hospitalityPartner: boolean;
  contentCreators: number;
  contentCreatorsTarget: number;
  mediaPartners: boolean;
  b2bClients: number;
  b2bClientsTarget: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
  points: number;
  change: number; // + or - from last period
}

export interface TimeframeStats {
  value: number;
  change: number; // Percentage or absolute change
}

export interface GlobalStats {
  totalDistributed: number;

  // Enhanced Country Metrics
  activeCountriesOccupancy: { name: string; value: number; code: string };
  activeCountriesNights: { name: string; value: number; code: string };

  // Expanded Active Countries logic
  activeCountriesStats: {
    development: number; // In Development or Operating
    totalProposed: number; // At least land proposed (includes all statuses >= PROPOSED)
  };

  // Community Points with Timeframes
  communityPoints: {
    weekly: TimeframeStats;
    monthly: TimeframeStats;
    allTime: TimeframeStats;
  };

  // Monthly Goal
  monthlyNightsGoal: {
    current: number;
    target: number;
  };
  // New fields for dashboard visualizations
  nightsGrowth: { date: string; nights: number }[]; // Array of nightly totals over time
  topCountries: { name: string; value: number; code: string }[]; // Ranked list of countries by metric
}

export interface UserInvestment {
  id: string;
  name: string;
  location: string;
  country: string;
  image: string;
  investmentSize: number; // USD
  yearlyReturnVal: number; // USD
  yearlyReturnPct: number; // %
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  level: string;
  totalPoints: number;
  nextLevelPoints: number;
  totalInvested: number; // USD
  totalYearlyReturn: number; // USD
  totalYearlyReturnPct: number; // Average %
  remainingFreeNights: number;
  investments: UserInvestment[];
}

export interface CabinOpportunity {
  id: string;
  title: string;
  images: string[];
  location: string;
  country: string;
  capacity: number; // people
  amenities: string[];
  tags: string[];
  distanceFromCity: string;
  totalPrice: number; // USD for whole unit
  availableSharesPct: number; // 0-100
  expectedRoiPct: number; // e.g., 10.5
}
