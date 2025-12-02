
import { supabase } from '../lib/supabase';
import { CountryData, CountryStatus, GlobalStats, LeaderboardEntry, UserProfile, CabinOpportunity } from '../types';

export const api = {
  async getCountries(): Promise<CountryData[]> {
    const { data, error } = await supabase
      .from('countries')
      .select('*');

    if (error) {
      console.error('Error fetching countries:', error);
      return [];
    }

    // Map DB fields to TypeScript interface if necessary (snake_case to camelCase)
    return data.map((country: any) => ({
      id: country.id,
      name: country.name,
      status: country.status as CountryStatus,
      progress: country.progress,
      description: country.description,
      locationsProposed: country.locations_proposed,
      locationsTarget: country.locations_target,
      // Default values for fields not yet in DB
      architectsRecommended: 0,
      architectsTarget: 0,
      lawyerRecommended: false,
      ambassadorApplications: 0,
      ambassadorTarget: 0,
      hospitalityPartner: false,
      contentCreators: 0,
      contentCreatorsTarget: 0,
      mediaPartners: false,
      b2bClients: 0,
      b2bClientsTarget: 0
    }));
  },

  async getOpportunities(): Promise<CabinOpportunity[]> {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*, countries(name)');

    if (error) {
      console.error('Error fetching opportunities:', error);
      return [];
    }

    return data.map((opp: any) => ({
      id: opp.id,
      title: opp.title,
      images: opp.images || [],
      location: opp.location,
      country: opp.countries?.name || 'Unknown', // Join result
      capacity: opp.capacity,
      amenities: opp.amenities || [],
      tags: [], // Not in DB yet
      distanceFromCity: 'N/A', // Not in DB yet
      totalPrice: opp.total_price,
      availableSharesPct: opp.available_shares_pct,
      expectedRoiPct: opp.expected_roi_pct
    }));
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    // Hardcoded profile for Nikolay Nekov as requested
    return {
      name: 'Nikolay Nekov',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80', // Professional looking portrait
      level: 'Visionary',
      totalPoints: 15420,
      nextLevelPoints: 20000,
      totalInvested: 125000,
      totalYearlyReturn: 15625,
      totalYearlyReturnPct: 12.5,
      remainingFreeNights: 12,
      usedFreeNights: 3,
      totalFreeNights: 15,
      monthlyRevenue: [
        { month: 'Jan', amount: 1200 },
        { month: 'Feb', amount: 1350 },
        { month: 'Mar', amount: 1100 },
        { month: 'Apr', amount: 1450 },
        { month: 'May', amount: 1600 },
        { month: 'Jun', amount: 1850 },
        { month: 'Jul', amount: 2100 },
        { month: 'Aug', amount: 2300 },
        { month: 'Sep', amount: 1950 },
        { month: 'Oct', amount: 1500 },
        { month: 'Nov', amount: 1300 },
        { month: 'Dec', amount: 1650 },
      ],
      investments: [
        {
          id: '1',
          name: 'Alpine Retreat',
          location: 'Tyrol',
          country: 'Austria',
          image: '/alpine_cabin.png',
          investmentSize: 50000,
          yearlyReturnVal: 6250,
          yearlyReturnPct: 12.5,
          sharesOwned: '1/8'
        },
        {
          id: '2',
          name: 'Aegean Blue',
          location: 'Santorini',
          country: 'Greece',
          image: '/greek_cabin.png',
          investmentSize: 75000,
          yearlyReturnVal: 9375,
          yearlyReturnPct: 12.5,
          sharesOwned: '1/4'
        }
      ]
    };
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data.map((profile: any) => ({
      id: profile.id,
      name: profile.name || 'Anonymous',
      country: 'Global', // Not in DB yet
      avatarUrl: profile.avatar_url || 'https://placehold.co/100',
      points: profile.total_points,
      change: 0 // Not tracking history yet
    }));
  },

  async getGlobalStats(): Promise<GlobalStats> {
    // For now, we'll mix real data with some mocks/calculations
    // In a real app, this might be a Postgres function or a separate stats table

    // 1. Total Distributed (Sum of investments)
    const { data: investments } = await supabase.from('investments').select('investment_size');
    const totalDistributed = investments?.reduce((sum, inv) => sum + (inv.investment_size || 0), 0) || 0;

    // 2. Active Countries Stats
    const { data: countries } = await supabase.from('countries').select('status');
    const development = countries?.filter((c: any) => c.status === 'development' || c.status === 'operating').length || 0;
    const totalProposed = countries?.filter((c: any) => c.status !== 'none').length || 0;

    // 3. Community Points (Sum of all profiles)
    const { data: profiles } = await supabase.from('profiles').select('total_points');
    const totalPoints = profiles?.reduce((sum, p) => sum + (p.total_points || 0), 0) || 0;

    return {
      totalDistributed: 124500,
      activeCountriesOccupancy: { name: 'Greece', value: 88, code: 'gr' },
      activeCountriesNights: { name: 'Spain', value: 1240, code: 'es' },
      activeCountriesStats: {
        development: 4,
        totalProposed: 14
      },
      communityPoints: {
        weekly: { value: 0, change: 0 },
        monthly: {
          value: 5400,
          change: 8
        },
        allTime: { value: 0, change: 0 }
      },
      monthlyNightsGoal: {
        current: 8420,
        target: 10000
      },
      nightsGrowth: [],
      topCountries: []
    };
  },

  async createOpportunity(opportunity: Omit<CabinOpportunity, 'id'>): Promise<CabinOpportunity | null> {
    // We need to handle the country relation. For now, we assume country is passed as a string (name or code)
    // In a real app, we'd look up the country_id. For this demo, we'll try to find it or default.

    // First, try to find the country_id based on the country name/code provided
    const { data: countryData } = await supabase
      .from('countries')
      .select('id')
      .or(`name.eq.${opportunity.country},id.eq.${opportunity.country}`)
      .single();

    const countryId = countryData?.id || 'USA'; // Default to USA if not found for safety

    const { data, error } = await supabase
      .from('opportunities')
      .insert({
        title: opportunity.title,
        location: opportunity.location,
        country_id: countryId,
        capacity: opportunity.capacity,
        total_price: opportunity.totalPrice,
        available_shares_pct: opportunity.availableSharesPct,
        expected_roi_pct: opportunity.expectedRoiPct,
        images: opportunity.images,
        amenities: opportunity.amenities
      })
      .select('*, countries(name)')
      .single();

    if (error) {
      console.error('Error creating opportunity:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      images: data.images || [],
      location: data.location,
      country: data.countries?.name || 'Unknown',
      capacity: data.capacity,
      amenities: data.amenities || [],
      tags: [],
      distanceFromCity: 'N/A',
      totalPrice: data.total_price,
      availableSharesPct: data.available_shares_pct,
      expectedRoiPct: data.expected_roi_pct
    };
  },

  async updateOpportunity(id: string, updates: Partial<CabinOpportunity>): Promise<boolean> {
    const dbUpdates: any = {};
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.location) dbUpdates.location = updates.location;
    if (updates.capacity) dbUpdates.capacity = updates.capacity;
    if (updates.totalPrice) dbUpdates.total_price = updates.totalPrice;
    if (updates.availableSharesPct) dbUpdates.available_shares_pct = updates.availableSharesPct;
    if (updates.expectedRoiPct) dbUpdates.expected_roi_pct = updates.expectedRoiPct;
    if (updates.images) dbUpdates.images = updates.images;
    if (updates.amenities) dbUpdates.amenities = updates.amenities;

    // Handle country update if needed
    if (updates.country) {
      const { data: countryData } = await supabase
        .from('countries')
        .select('id')
        .or(`name.eq.${updates.country},id.eq.${updates.country}`)
        .single();
      if (countryData) dbUpdates.country_id = countryData.id;
    }

    const { error } = await supabase
      .from('opportunities')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating opportunity:', error);
      return false;
    }
    return true;
  },

  async deleteOpportunity(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting opportunity:', error);
      return false;
    }
    return true;
  }
};
