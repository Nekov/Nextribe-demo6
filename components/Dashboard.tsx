
import React, { useState } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlobalStats, LeaderboardEntry } from '../types';
import { Trophy, DollarSign, MapPin, TrendingUp, Hotel, Moon, ChevronRight } from 'lucide-react';
import { COLORS } from '../constants';

interface DashboardProps {
    stats: GlobalStats;
    leaderboard: LeaderboardEntry[];
    onViewFullLeaderboard?: () => void;
}

const StatCard = ({ title, value, icon: Icon, subValue, colorClass = "text-gold" }: { title: string, value: string | number, icon: any, subValue?: string, colorClass?: string }) => (
    <div className="bg-primary-light p-6 rounded-xl border border-gray-800 shadow-lg hover:border-gold/30 transition-colors h-full flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 bg-primary rounded-lg ${colorClass}`}>
                <Icon className="w-6 h-6" />
            </div>
            {subValue && <span className="text-xs font-medium text-secondary-teal bg-secondary-teal/10 px-2 py-1 rounded">{subValue}</span>}
        </div>
        <div>
            <h4 className="text-typography-grey text-sm font-medium mb-1">{title}</h4>
            <div className="text-2xl font-bold text-white">{value}</div>
        </div>
    </div>
);

const RevenueChart = ({ data }: { data: { name: string; value: number }[] }) => (
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart
            data={data}
            margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" stroke="#2E344D" />
            <XAxis dataKey="name" stroke="#756C87" axisLine={false} tickLine={false} />
            <YAxis stroke="#756C87" axisLine={false} tickLine={false} />
            <Tooltip
                contentStyle={{ backgroundColor: '#1E2233', border: '1px solid #D9A441', borderRadius: '8px' }}
                itemStyle={{ color: '#F2F2F2' }}
            />
            <Area type="monotone" dataKey="value" stroke={COLORS.GOLD} fill={COLORS.GOLD} fillOpacity={0.3} />
        </AreaChart>
    </ResponsiveContainer>
);

const CountryHighlightCard = ({ title, country, value, subLabel, type }: { title: string, country: { name: string, code: string }, value: string | number, subLabel: string, type: 'occupancy' | 'nights' }) => (
    <div className="relative overflow-hidden bg-primary-light p-6 rounded-xl border border-gray-800 shadow-lg group hover:border-gold/50 transition-all duration-300 h-full">
        <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <img
                src={`https://flagcdn.com/w320/${country.code}.png`}
                alt="flag bg"
                className="w-48 h-auto transform rotate-12 translate-x-10 -translate-y-10"
            />
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-typography-grey text-xs uppercase tracking-widest font-semibold">{title}</span>
                {type === 'occupancy' ? <TrendingUp className="w-4 h-4 text-green-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
            </div>

            <div className="flex items-center gap-4 mb-4">
                <img
                    src={`https://flagcdn.com/w160/${country.code}.png`}
                    alt={country.name}
                    className="w-16 h-auto rounded shadow-sm border border-white/10"
                />
                <h3 className="text-2xl font-bold text-white">{country.name}</h3>
            </div>

            <div className="bg-primary/50 p-3 rounded-lg border border-gray-700 inline-block backdrop-blur-sm">
                <span className={`text-2xl font-bold ${type === 'occupancy' ? 'text-green-400' : 'text-purple-400'}`}>{value}</span>
                <span className="text-xs text-typography-grey ml-2 uppercase font-medium">{subLabel}</span>
            </div>
        </div>
    </div>
);

const CommunityPointsCard = ({ points }: { points: GlobalStats['communityPoints'] }) => {
    const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('monthly');

    const currentData = points[timeframe];

    return (
        <div className="bg-primary-light p-6 rounded-xl border border-gray-800 shadow-lg h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-primary rounded-lg text-gold">
                    <Trophy className="w-6 h-6" />
                </div>
                <div className="flex bg-primary rounded-lg p-1 gap-1">
                    {(['weekly', 'monthly', 'allTime'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={`px-2 py-1 text-[10px] uppercase font-bold rounded transition-colors ${timeframe === t ? 'bg-gold text-primary' : 'text-typography-grey hover:text-white'}`}
                        >
                            {t === 'allTime' ? 'All' : t.slice(0, 3)}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="text-typography-grey text-sm font-medium mb-1">Community Points</h4>
                <div className="flex items-end gap-3">
                    <div className="text-2xl font-bold text-white">{currentData.value.toLocaleString()}</div>
                    <div className={`text-xs font-medium px-1.5 py-0.5 rounded mb-1 ${currentData.change >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                        {currentData.change >= 0 ? '+' : ''}{currentData.change}%
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActiveCountriesCard = ({ stats }: { stats: GlobalStats['activeCountriesStats'] }) => (
    <div className="bg-primary-light p-6 rounded-xl border border-gray-800 shadow-lg h-full flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
            <div className="p-3 bg-primary rounded-lg text-secondary-teal">
                <MapPin className="w-6 h-6" />
            </div>
        </div>
        <div>
            <h4 className="text-typography-grey text-sm font-medium mb-1">Expansion Status</h4>
            <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-white">{stats.development}</div>
                <span className="text-sm text-typography-grey">in Development</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700 flex items-center justify-between text-xs">
                <span className="text-typography-grey">Total Presence</span>
                <span className="text-white font-bold bg-gray-700 px-2 py-0.5 rounded-full">{stats.totalProposed} Markets</span>
            </div>
        </div>
    </div>
);

const NightsGoalCard = ({ current, target }: { current: number, target: number }) => {
    const percentage = Math.min(100, (current / target) * 100);
    return (
        <div className="bg-primary-light p-6 rounded-xl border border-gray-800 shadow-lg h-full flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <div className="text-xs text-typography-grey uppercase tracking-wider font-semibold mb-1">Monthly Goal</div>
                    <h4 className="text-white font-bold flex items-center gap-2">
                        <Moon className="w-4 h-4 text-purple-400" /> Total Nights Booked
                    </h4>
                </div>
                <div className="text-right">
                    <span className="text-lg font-bold text-gold">{current.toLocaleString()}</span>
                    <span className="text-xs text-typography-grey"> / {target.toLocaleString()}</span>
                </div>
            </div>
            <div className="h-3 w-full bg-primary rounded-full overflow-hidden relative">
                <div
                    className="h-full bg-gradient-to-r from-purple-600 to-gold transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="mt-2 text-right text-[10px] text-typography-grey">
                {percentage.toFixed(1)}% of monthly target reached
            </div>
        </div>
    );
};

// NightsGrowthChart: displays a line chart of total nights over time
const NightsGrowthChart = ({ data }: { data: { date: string; nights: number }[] }) => (
    <div className="bg-primary-light p-6 rounded-xl border border-gray-800 shadow-lg h-full">
        <h4 className="text-lg font-bold text-white mb-2">Nights Growth</h4>
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E344D" />
                <XAxis dataKey="date" stroke="#756C87" axisLine={false} tickLine={false} />
                <YAxis stroke="#756C87" axisLine={false} tickLine={false} />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1E2233', border: '1px solid #D9A441', borderRadius: '8px' }}
                    itemStyle={{ color: '#F2F2F2' }}
                />
                <Line type="monotone" dataKey="nights" stroke={COLORS.AMBASSADOR} strokeWidth={3} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats, leaderboard, onViewFullLeaderboard }) => {

    // Mock Chart Data
    const revenueData = [
        { name: 'W1', value: 4000 },
        { name: 'W2', value: 3000 },
        { name: 'W3', value: 2000 },
        { name: 'W4', value: 2780 },
        { name: 'W5', value: 1890 },
        { name: 'W6', value: 2390 },
        { name: 'W7', value: 3490 },
    ];

    return (
        <div className="w-full space-y-6 p-2">

            {/* Top Row: Key Stats & Interactive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-auto lg:h-40">
                <StatCard
                    title="Total Distributed"
                    value="$566,444"
                    icon={DollarSign}
                    subValue="Paid to community"
                    colorClass="text-green-400"
                />
                <CommunityPointsCard points={stats.communityPoints} />
                <ActiveCountriesCard stats={stats.activeCountriesStats} />
                <NightsGoalCard current={stats.monthlyNightsGoal.current} target={stats.monthlyNightsGoal.target} />
                <NightsGrowthChart data={stats.nightsGrowth} />
                <NightsGrowthChart data={stats.nightsGrowth} />
            </div>

            {/* Middle Row: Country Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto">
                <CountryHighlightCard
                    title="Most Active Market (Occupancy)"
                    country={stats.activeCountriesOccupancy}
                    value={`${stats.activeCountriesOccupancy.value}%`}
                    subLabel="Avg. Occupancy"
                    type="occupancy"
                />
                <CountryHighlightCard
                    title="Most Active Market (Volume)"
                    country={stats.activeCountriesNights}
                    value={stats.activeCountriesNights.value.toLocaleString()}
                    subLabel="Nights Booked"
                    type="nights"
                />
                <CountryHighlightCard
                    title="Top Country (Occupancy) – Austria"
                    country={{ name: "Austria", code: "at" }}
                    value="78%"
                    subLabel="Avg. Occupancy"
                    type="occupancy"
                />
                <CountryHighlightCard
                    title="Top Country (Nights) – Greece"
                    country={{ name: "Greece", code: "gr" }}
                    value={12345}
                    subLabel="Nights Booked"
                    type="nights"
                />
            </div>

            {/* Bottom Row: Charts & Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chart Section */}
                <div className="lg:col-span-2 bg-primary-light p-6 rounded-xl border border-gray-800 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Revenue Distribution</h3>
                        <div className="flex gap-2">
                            <span className="text-xs bg-primary px-3 py-1 rounded text-gold cursor-pointer border border-gold/20">Weekly</span>
                            <span className="text-xs bg-primary px-3 py-1 rounded text-typography-grey cursor-pointer hover:text-white">Monthly</span>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.AMBASSADOR} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={COLORS.AMBASSADOR} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2E344D" vertical={false} />
                                <XAxis dataKey="name" stroke="#756C87" axisLine={false} tickLine={false} />
                                <YAxis stroke="#756C87" axisLine={false} tickLine={false} prefix="$" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1E2233', border: '1px solid #D9A441', borderRadius: '8px' }}
                                    itemStyle={{ color: '#F2F2F2' }}
                                />
                                <Area type="monotone" dataKey="value" stroke={COLORS.AMBASSADOR} fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-primary-light p-6 rounded-xl border border-gray-800 shadow-lg flex flex-col max-h-[400px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Trophy className="text-gold w-5 h-5" /> Top Contributors
                        </h3>
                        {onViewFullLeaderboard && (
                            <button
                                onClick={onViewFullLeaderboard}
                                className="text-xs text-secondary-teal hover:text-white flex items-center gap-1 transition-colors"
                            >
                                View Full List <ChevronRight className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* Person of the Month Highlight */}
                    <div className="mb-4 p-4 bg-gradient-to-br from-secondary-lavender/20 to-primary rounded-lg border border-secondary-lavender/30 flex items-center gap-4 shrink-0">
                        <div className="relative">
                            <img src={leaderboard[0].avatarUrl} alt="Top" className="w-14 h-14 rounded-full border-2 border-gold" />
                            <div className="absolute -bottom-2 -right-2 bg-gold text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">POM</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-secondary-lavender uppercase tracking-wider font-semibold">Person of the Month</div>
                            <div className="text-base font-bold text-white">{leaderboard[0].name}</div>
                            <div className="text-xs text-typography-grey">{leaderboard[0].points} pts</div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {leaderboard.slice(1).map((user, idx) => (
                            <div key={user.id} className="flex items-center justify-between p-2 bg-primary rounded-lg hover:bg-primary/70 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="text-typography-grey font-mono text-xs w-4">#{idx + 2}</div>
                                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <div className="text-sm font-medium text-white">{user.name}</div>
                                        <div className="text-xs text-typography-grey">{user.country}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gold">{user.points}</div>
                                    <div className={`text-[10px] ${user.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {user.change > 0 ? '+' : ''}{user.change}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
