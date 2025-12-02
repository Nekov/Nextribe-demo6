import React, { useState } from 'react';
import { UserProfile } from '../types';
import { CURRENCY_RATES } from '../constants';
import {
    Trophy, Award, Wallet, TrendingUp, Moon, MapPin, DollarSign,
    ArrowRightLeft, HandHeart, BarChart3, Calendar, PieChart
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';

interface ProfilePageProps {
    profile: UserProfile;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile }) => {
    const [currency, setCurrency] = useState<string>('USD');

    // Helper to format money based on selected currency
    const formatMoney = (usdAmount: number) => {
        const rate = CURRENCY_RATES[currency] || 1;
        const converted = usdAmount * rate;

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: (currency === 'BTC' || currency === 'ETH') ? 4 : 0,
            maximumFractionDigits: (currency === 'BTC' || currency === 'ETH') ? 6 : 0,
        });

        return formatter.format(converted);
    };

    const levelProgress = Math.min(100, (profile.totalPoints / profile.nextLevelPoints) * 100);

    // Custom Tooltip for Recharts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-primary border border-gray-700 p-3 rounded-lg shadow-xl">
                    <p className="text-gray-300 text-sm mb-1">{label}</p>
                    <p className="text-gold font-bold text-lg">
                        {formatMoney(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-full overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gradient-to-b from-primary to-black">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header & Main Stats */}
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between bg-primary-light/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <img
                                src={profile.avatarUrl}
                                alt={profile.name}
                                className="w-24 h-24 rounded-full border-4 border-gold/20 shadow-2xl object-cover"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-gold text-primary text-xs font-bold px-2 py-1 rounded-full border-2 border-primary shadow-lg flex items-center gap-1">
                                <Award className="w-3 h-3" /> {profile.level}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white tracking-tight">{profile.name}</h1>
                            <div className="flex items-center gap-3 mt-2 text-typography-grey">
                                <span className="flex items-center gap-1 text-sm bg-white/5 px-2 py-1 rounded">
                                    <MapPin className="w-3 h-3 text-gold" /> Global Citizen
                                </span>
                                <span className="flex items-center gap-1 text-sm bg-white/5 px-2 py-1 rounded">
                                    <Calendar className="w-3 h-3 text-gold" /> Member since 2023
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Currency Selector */}
                    <div className="flex items-center bg-black/40 p-1.5 rounded-xl border border-white/10">
                        <div className="px-3 flex items-center gap-2 text-typography-grey text-xs font-medium uppercase tracking-wider border-r border-white/10 mr-1">
                            <ArrowRightLeft className="w-3 h-3" /> Currency
                        </div>
                        <div className="flex gap-1">
                            {Object.keys(CURRENCY_RATES).map(curr => (
                                <button
                                    key={curr}
                                    onClick={() => setCurrency(curr)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${currency === curr ? 'bg-gold text-primary shadow-lg shadow-gold/20' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                >
                                    {curr}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Investment Stats - Large Card */}
                    <div className="md:col-span-8 bg-gradient-to-br from-primary-light to-primary p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                            <TrendingUp className="w-64 h-64 text-gold" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-2 bg-gold/10 rounded-lg text-gold">
                                            <Wallet className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-typography-grey text-sm font-medium uppercase tracking-wider">Total Portfolio Value</h3>
                                    </div>
                                    <div className="text-5xl font-bold text-white tracking-tight">{formatMoney(profile.totalInvested)}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-typography-grey mb-1">Yearly Return</div>
                                    <div className="text-2xl font-bold text-green-400 flex items-center justify-end gap-2">
                                        +{formatMoney(profile.totalYearlyReturn)}
                                        <span className="text-xs bg-green-400/20 text-green-400 px-2 py-1 rounded-full font-mono">
                                            {profile.totalYearlyReturnPct}% APY
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Revenue Chart */}
                            <div className="h-64 w-full mt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-white font-semibold flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-gold" /> Monthly Revenue
                                    </h4>
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={profile.monthlyRevenue}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#666"
                                            tick={{ fill: '#888', fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            stroke="#666"
                                            tick={{ fill: '#888', fontSize: 12 }}
                                            tickFormatter={(value) => `$${value}`}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#D4AF37', strokeWidth: 1, strokeDasharray: '5 5' }} />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#D4AF37"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Right Column Stats */}
                    <div className="md:col-span-4 space-y-6">

                        {/* Free Nights */}
                        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 opacity-20">
                                <Moon className="w-32 h-32 text-purple-400 blur-xl" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                        <Moon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-gray-300 text-sm font-medium uppercase tracking-wider">Free Nights</h3>
                                </div>

                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <div className="text-4xl font-bold text-white">{profile.remainingFreeNights}</div>
                                        <div className="text-xs text-purple-300 mt-1">Remaining</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-gray-400">{profile.totalFreeNights}</div>
                                        <div className="text-xs text-gray-500">Total / Year</div>
                                    </div>
                                </div>

                                {/* Progress Bar for Nights */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Used: {profile.usedFreeNights}</span>
                                        <span>{Math.round((profile.usedFreeNights / profile.totalFreeNights) * 100)}% Used</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                                            style={{ width: `${(profile.usedFreeNights / profile.totalFreeNights) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Membership Level */}
                        <div className="bg-primary-light p-6 rounded-3xl border border-white/5 shadow-xl">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-typography-grey text-sm font-medium uppercase tracking-wider">Status</h3>
                                    <div className="text-2xl font-bold text-white mt-1">{profile.totalPoints.toLocaleString()} <span className="text-sm text-gold">pts</span></div>
                                </div>
                                <Trophy className="w-8 h-8 text-gold opacity-50" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-typography-grey">
                                    <span>Next: {profile.nextLevelPoints.toLocaleString()}</span>
                                    <span>{Math.round(levelProgress)}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-gold to-yellow-200 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                                        style={{ width: `${levelProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Investments List */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <PieChart className="text-gold w-6 h-6" /> Your Portfolio
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profile.investments.map(inv => (
                            <div key={inv.id} className="bg-primary-light rounded-2xl border border-white/5 overflow-hidden hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 transition-all duration-300 group flex flex-col">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={inv.image} alt={inv.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-gold" /> {inv.country}
                                    </div>
                                    <div className="absolute bottom-4 left-4">
                                        <h3 className="text-xl font-bold text-white mb-0.5">{inv.name}</h3>
                                        <div className="text-xs text-gray-300 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {inv.location}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-black/20 p-3 rounded-xl">
                                            <div className="text-[10px] uppercase text-typography-grey font-bold tracking-wider mb-1">Invested</div>
                                            <div className="text-white font-bold text-lg">{formatMoney(inv.investmentSize)}</div>
                                        </div>
                                        <div className="bg-green-900/10 p-3 rounded-xl border border-green-500/10">
                                            <div className="text-[10px] uppercase text-green-400/70 font-bold tracking-wider mb-1">Yearly Return</div>
                                            <div className="text-green-400 font-bold text-lg">{formatMoney(inv.yearlyReturnVal)}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-white/5">
                                        <span>ROI: <span className="text-green-400 font-bold">{inv.yearlyReturnPct}%</span></span>
                                        <button className="text-gold hover:text-white transition-colors flex items-center gap-1">
                                            View Details <ArrowRightLeft className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add New Investment Placeholder */}
                        <div className="bg-gradient-to-br from-primary-light/50 to-primary/30 rounded-2xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center p-8 hover:border-gold/50 hover:bg-primary-light transition-all cursor-pointer group min-h-[300px]">
                            <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4 group-hover:bg-gold group-hover:text-primary transition-all duration-300 shadow-xl">
                                <DollarSign className="w-8 h-8 text-gray-500 group-hover:text-primary" />
                            </div>
                            <h3 className="text-white font-bold text-lg">New Investment</h3>
                            <p className="text-sm text-typography-grey text-center mt-2 max-w-[200px]">
                                Explore premium cabins and expand your portfolio.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Action */}
                <div className="flex justify-center pt-8 pb-12">
                    <button className="flex items-center gap-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-primary font-bold py-4 px-10 rounded-full shadow-lg shadow-gold/20 transition-all transform hover:scale-105 hover:shadow-gold/40">
                        <HandHeart className="w-5 h-5" /> Contribute for Additional Points
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;
