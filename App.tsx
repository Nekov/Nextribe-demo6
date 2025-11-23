
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import WorldMap from './components/WorldMap';
import Dashboard from './components/Dashboard';
import CountryDetail from './components/CountryDetail';
import ProfilePage from './components/ProfilePage';
import InvestPage from './components/InvestPage';
import { CountryData, CountryStatus, GlobalStats, LeaderboardEntry } from './types';
import { getMockCountryData, MOCK_GLOBAL_STATS, MOCK_LEADERBOARD, MOCK_USER_PROFILE, MOCK_OPPORTUNITIES } from './constants';
import { LayoutDashboard, Globe, LogOut, TrendingUp, Moon, MapPin, Users, PieChart, User } from 'lucide-react';
import { api } from './services/api';

const SummaryItem = ({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) => (
  <div className="flex items-center gap-3 px-2 md:px-4 border-r border-gray-700 last:border-0">
    <div className={`p-2 rounded-full bg-white/5 ${color}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <div className="text-[10px] text-typography-grey uppercase tracking-wider font-semibold">{label}</div>
      <div className="text-sm font-bold text-white flex items-center gap-2">
          {value}
      </div>
    </div>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'dashboard' | 'invest' | 'profile'>('map');
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalStats>(MOCK_GLOBAL_STATS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);

  useEffect(() => {
    const fetchData = async () => {
      const [countriesData, statsData, leaderboardData] = await Promise.all([
        api.getCountries(),
        api.getGlobalStats(),
        api.getLeaderboard()
      ]);
      setCountries(countriesData);
      setGlobalStats(statsData);
      if (leaderboardData.length > 0) setLeaderboard(leaderboardData);
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
        const mockStatus = CountryStatus.NONE;
        const data = getMockCountryData(id, name, mockStatus);
        setSelectedCountry(data);
    }
  };

  const handleApply = () => {
    setIsApplying(true);
    alert(`Application initiated for ${selectedCountry?.name}. Integration with Typeform or internal API would happen here.`);
  };

  return (
    <div className="h-screen bg-primary text-typography-white flex flex-col overflow-hidden">
      
      {/* Horizontal Header Navigation */}
      <header className="h-16 bg-primary-light/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 shrink-0 z-40">
         <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3 select-none cursor-pointer group" onClick={() => setActiveTab('map')}>
               {/* Custom Nextribe Logo SVG */}
               <svg width="36" height="24" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold drop-shadow-lg group-hover:text-white transition-colors">
                  <path d="M30 2V38" stroke="currentColor" strokeWidth="6" strokeLinecap="butt" />
                  <path d="M4 38C4 20 16 6 30 6" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  <path d="M56 38C56 20 44 6 30 6" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  <path d="M16 38C16 28 22 20 30 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                  <path d="M44 38C44 28 38 20 30 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
               </svg>
              
              <div className="flex flex-col justify-center leading-none">
                <span className="font-bold text-2xl tracking-wide text-white group-hover:text-gold transition-colors">NEXTRIBE</span>
                <span className="text-[10px] text-gold font-medium uppercase tracking-[0.25em] ml-0.5 group-hover:text-white transition-colors">Network</span>
              </div>
            </div>
            
            {/* Navigation Pills */}
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
            </nav>
         </div>

         {/* Right Side: User & System Status */}
         <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-xs text-typography-grey bg-primary px-3 py-1.5 rounded-full border border-gray-700">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>System Operational</span>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-700">
                <div className="text-right hidden sm:block cursor-pointer" onClick={() => setActiveTab('profile')}>
                    <div className="text-sm font-bold text-white hover:text-gold transition-colors">{MOCK_USER_PROFILE.name}</div>
                    <div className="text-xs text-typography-grey">Level: {MOCK_USER_PROFILE.level}</div>
                </div>
                <div className="relative group cursor-pointer" onClick={() => setActiveTab('profile')}>
                    <img src={MOCK_USER_PROFILE.avatarUrl} className={`w-10 h-10 rounded-full border-2 transition-colors ${activeTab === 'profile' ? 'border-gold' : 'border-gray-700 group-hover:border-gold'}`} alt="Profile" />
                    {activeTab === 'profile' && (
                        <div className="absolute -bottom-1 -right-1 bg-gold rounded-full p-0.5">
                             <User className="w-3 h-3 text-primary" />
                        </div>
                    )}
                </div>
                <button className="p-2 text-typography-grey hover:text-red-400 transition-colors" title="Logout">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
         </div>
      </header>

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
                      value={`${((globalStats.monthlyNightsGoal.current / globalStats.monthlyNightsGoal.target)*100).toFixed(0)}%`} 
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

            {activeTab === 'profile' && (
                <ProfilePage profile={MOCK_USER_PROFILE} />
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
