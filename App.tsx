import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import WorldMap from './components/WorldMap';
import Dashboard from './components/Dashboard';
import CountryDetail from './components/CountryDetail';
import ProfilePage from './components/ProfilePage';
import InvestPage from './components/InvestPage';
import AdminDashboard from './components/AdminDashboard';
import { CountryData, CountryStatus, GlobalStats, LeaderboardEntry, UserProfile } from './types';

import { LayoutDashboard, Globe, LogOut, TrendingUp, Moon, MapPin, Users, PieChart, User, Menu, X } from 'lucide-react';
import { api } from './services/api';

const SummaryItem = ({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) => (
  <div className="flex items-center gap-2 md:gap-3 px-2 md:px-4 border-r border-gray-700 last:border-0">
    <div className={`p-1.5 md:p-2 rounded-full bg-white/5 ${color}`}>
      <Icon className="w-3 h-3 md:w-4 md:h-4" />
    </div>
    <div>
      <div className="text-[9px] md:text-[10px] text-typography-grey uppercase tracking-wider font-semibold">{label}</div>
      <div className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
        {value}
      </div>
    </div>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'dashboard' | 'invest' | 'profile' | 'admin'>('map');
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalDistributed: 0,
    activeCountriesOccupancy: { name: '', value: 0, code: '' },
    activeCountriesNights: { name: '', value: 0, code: '' },
    activeCountriesStats: { development: 0, totalProposed: 0 },
    communityPoints: { weekly: { value: 0, change: 0 }, monthly: { value: 0, change: 0 }, allTime: { value: 0, change: 0 } },
    monthlyNightsGoal: { current: 0, target: 10000 }
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Hardcoded admin ID for demo
      const ADMIN_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

      try {
        const [countriesData, statsData, leaderboardData, profileData] = await Promise.all([
          api.getCountries(),
          api.getGlobalStats(),
          api.getLeaderboard(),
          api.getUserProfile(ADMIN_ID)
        ]);
        setCountries(countriesData);
        setGlobalStats(statsData);
        if (leaderboardData.length > 0) setLeaderboard(leaderboardData);
        if (profileData) setUserProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCountryClick = (id: string, name: string) => {
    // Lookup from fetched data
    const foundCountry = countries.find(c => c.id === id); // id passed from WorldMap is now Alpha-3 code if available

    if (foundCountry) {
      setSelectedCountry(foundCountry);
    } else {
      // Fallback for countries not in DB yet (display as available/none)
      // In a real app without mocks, we might just ignore or show a generic "Available" state
      // For now, we'll just set null or handle it in the UI if we want to show something for non-DB countries
      // But since we removed getMockCountryData, we can't generate it.
      // Let's just do nothing or log it.
      console.log('Country not found in DB:', id);
    }
  };

  const handleApply = () => {
    setIsApplying(true);
    alert(`Application initiated for ${selectedCountry?.name}. Integration with Typeform or internal API would happen here.`);
  };

  return (
    <div className="h-screen bg-primary text-typography-white flex flex-col overflow-hidden">

      {/* Horizontal Header Navigation */}
      <header className="h-16 bg-primary-light/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 md:px-6 shrink-0 z-40">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3 select-none cursor-pointer group" onClick={() => setActiveTab('map')}>
            {/* Custom Nextribe Logo SVG */}
            <svg width="32" height="20" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold drop-shadow-lg group-hover:text-white transition-colors md:w-[36px] md:h-[24px]">
              <path d="M30 2V38" stroke="currentColor" strokeWidth="6" strokeLinecap="butt" />
              <path d="M4 38C4 20 16 6 30 6" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <path d="M56 38C56 20 44 6 30 6" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <path d="M16 38C16 28 22 20 30 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              <path d="M44 38C44 28 38 20 30 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            </svg>

            <div className="flex flex-col justify-center leading-none">
              <span className="font-bold text-xl md:text-2xl tracking-wide text-white group-hover:text-gold transition-colors">NEXTRIBE</span>
              <span className="text-[9px] md:text-[10px] text-gold font-medium uppercase tracking-[0.2em] md:tracking-[0.25em] ml-0.5 group-hover:text-white transition-colors">Network</span>
            </div>
          </div>

          {/* Desktop Navigation Pills */}
          <nav className="hidden md:flex items-center bg-primary/50 p-1 rounded-lg border border-gray-700">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'map' ? 'bg-gold text-primary shadow-sm' : 'text-typography-grey hover:text-white hover:bg-white/5'}`}
            >
              <Globe className="w-4 h-4" />
              Map View
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-gold text-primary shadow-sm' : 'text-typography-grey hover:text-white hover:bg-white/5'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('invest')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'invest' ? 'bg-gold text-primary shadow-sm' : 'text-typography-grey hover:text-white hover:bg-white/5'}`}
            >
              <PieChart className="w-4 h-4" />
              Invest
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'admin' ? 'bg-gold text-primary shadow-sm' : 'text-typography-grey hover:text-white hover:bg-white/5'}`}
            >
              <Users className="w-4 h-4" />
              Admin
            </button>
          </nav>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-typography-grey hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Right Side: User & System Status */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden lg:flex items-center gap-2 text-xs text-typography-grey bg-primary px-3 py-1.5 rounded-full border border-gray-700">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>System Operational</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-6 border-l border-gray-700">
            <div className="text-right hidden sm:block cursor-pointer" onClick={() => setActiveTab('profile')}>
              <div className="text-sm font-bold text-white hover:text-gold transition-colors">User</div>
              <div className="text-xs text-typography-grey">Level: Explorer</div>
            </div>
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('profile')}>
              <img src="https://placehold.co/200" className={`w-9 h-9 md:w-10 md:h-10 rounded-full border-2 transition-colors ${activeTab === 'profile' ? 'border-gold' : 'border-gray-700 group-hover:border-gold'}`} alt="Profile" />
              {activeTab === 'profile' && (
                <div className="absolute -bottom-1 -right-1 bg-gold rounded-full p-0.5">
                  <User className="w-3 h-3 text-primary" />
                </div>
              )}
            </div>
            <button className="hidden sm:block p-2 text-typography-grey hover:text-red-400 transition-colors" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-primary-light border-r border-gray-800 shadow-2xl animate-slide-in-left">
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-typography-grey hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                <button
                  onClick={() => { setActiveTab('map'); setIsMobileMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3 ${activeTab === 'map' ? 'bg-gold text-primary shadow-sm' : 'text-typography-grey hover:text-white hover:bg-white/5'}`}
                >
                  <Globe className="w-5 h-5" />
                  Map View
                </button>
                <button
                  onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-gold text-primary shadow-sm' : 'text-typography-grey hover:text-white hover:bg-white/5'}`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </button>
                <button
                  onClick={() => { setActiveTab('invest'); setIsMobileMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3 ${activeTab === 'invest' ? 'bg-gold text-primary shadow-sm' : 'text-typography-grey hover:text-white hover:bg-white/5'}`}
                >
                  <PieChart className="w-5 h-5" />
                  Invest
                </button>
                <button
                  onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3 ${activeTab === 'admin' ? 'bg-gold text-primary shadow-sm' : 'text-typography-grey hover:text-white hover:bg-white/5'}`}
                >
                  <Users className="w-5 h-5" />
                  Admin
                </button>
                <button
                  onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3 ${activeTab === 'profile' ? 'bg-gold text-primary shadow-sm' : 'text-typography-grey hover:text-white hover:bg-white/5'}`}
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>

                {/* Logout */}
                <div className="pt-4 mt-4 border-t border-gray-700">
                  <button className="w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3 text-typography-grey hover:text-red-400 hover:bg-white/5">
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col overflow-hidden">

        {/* Dashboard Summary Overlay - Only visible on Map View */}
        {activeTab === 'map' && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 w-auto max-w-[90%] animate-slide-in-down">
            <div className="flex flex-row bg-primary/90 backdrop-blur-xl p-2 rounded-2xl border border-gray-700 shadow-2xl shadow-black/50">
              <SummaryItem
                label="Total Distributed"
                value={`$${globalStats.totalDistributed.toLocaleString()}`}
                icon={TrendingUp}
                color="text-green-400"
              />
              <SummaryItem
                label="Active Markets"
                value={globalStats.activeCountriesStats.totalProposed}
                icon={MapPin}
                color="text-gold"
              />
              <SummaryItem
                label="Comm. Points"
                value={globalStats.communityPoints.monthly.value.toLocaleString()}
                icon={Users}
                color="text-blue-400"
              />
              <SummaryItem
                label="Nights Goal"
                value={`${((globalStats.monthlyNightsGoal.current / globalStats.monthlyNightsGoal.target) * 100).toFixed(0)}%`}
                icon={Moon}
                color="text-purple-400"
              />
            </div>
          </div>
        )}

        {/* View Container */}
        <div className="flex-1 w-full h-full relative bg-[#151725]">
          {activeTab === 'map' && (
            <WorldMap
              onCountryClick={handleCountryClick}
              className="w-full h-full absolute inset-0"
              countries={countries}
            />
          )}

          {activeTab === 'dashboard' && (
            <div className="h-full overflow-y-auto p-6 md:p-8 custom-scrollbar">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Performance Overview</h2>
                <Dashboard
                  stats={globalStats}
                  leaderboard={leaderboard}
                  onViewFullLeaderboard={() => setActiveTab('profile')} // Linking to profile/leaderboard view
                />
              </div>
            </div>
          )}

          {activeTab === 'invest' && (
            <InvestPage />
          )}

          {activeTab === 'admin' && (
            <div className="h-full overflow-y-auto custom-scrollbar">
              <AdminDashboard />
            </div>
          )}

          {activeTab === 'profile' && (
            isLoading ? (
              <div className="p-10 text-center text-white">Profile data loading...</div>
            ) : userProfile ? (
              <ProfilePage profile={userProfile} />
            ) : (
              <div className="p-10 text-center text-white">Profile not found. Please check your connection or login status.</div>
            )
          )}
        </div>

        {/* Country Detail Modal (Slide Over) */}
        {selectedCountry && activeTab === 'map' && (
          <CountryDetail
            country={selectedCountry}
            onClose={() => setSelectedCountry(null)}
            onApply={handleApply}
          />
        )}

      </main>
    </div>
  );
};

export default App;
