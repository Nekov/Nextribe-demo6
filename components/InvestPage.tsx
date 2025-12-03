import React, { useState, useEffect } from 'react';
import { CabinOpportunity } from '../types';
import { COUNTRY_ADR_MAP, CURRENCY_RATES, COLORS } from '../constants';
import { MapPin, Users, ArrowRight, DollarSign, Info, Calendar, TrendingUp, Moon, CheckCircle2, Check, Loader2, Wifi, Utensils, Car, Waves, Thermometer, Wind, Monitor, Coffee } from 'lucide-react';
import { api } from '../services/api';

interface InvestPageProps { }

interface OpportunityCardProps {
    opportunity: CabinOpportunity;
    onSelect: () => void;
    isSelected: boolean;
    currency: string;
    rate: number;
    onRoiClick: (e: React.MouseEvent) => void;
}

const AMENITY_ICONS: Record<string, any> = {
    'Wifi': Wifi,
    'Kitchen': Utensils,
    'Parking': Car,
    'Pool': Waves,
    'Hot Tub': Thermometer, // Using Thermometer as proxy or maybe Bath if available, but Thermometer implies heat
    'AC': Wind,
    'Heating': Thermometer,
    'Workspace': Monitor,
    'Coffee': Coffee
};

const formatPrice = (amount: number, currency: string, rate: number) => {
    const value = amount * rate;
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'BTC' ? '₿' : currency === 'ETH' ? 'Ξ' : '◎';

    if (currency === 'BTC' || currency === 'ETH') {
        return `${symbol}${value.toFixed(4)}`;
    }
    if (currency === 'SOL') {
        return `${symbol}${value.toFixed(2)}`;
    }
    return `${symbol}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onSelect, isSelected, currency, rate, onRoiClick }) => {
    const [activeImgIndex, setActiveImgIndex] = useState(0);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveImgIndex((prev) => (prev + 1) % opportunity.images.length);
    };

    return (
        <div
            className={`relative bg-primary-light rounded-xl overflow-hidden transition-all duration-300 group flex flex-col h-full cursor-pointer ${isSelected ? 'ring-2 ring-gold shadow-lg shadow-gold/10 scale-[1.01]' : 'border border-gray-800 hover:border-gold/40'}`}
            onClick={onSelect}
        >
            {/* Image Slider */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={opportunity.images[activeImgIndex] || 'https://placehold.co/600x400?text=No+Image'}
                    alt={opportunity.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Navigation Area for Images */}
                <div className="absolute inset-0 flex" onClick={nextImage}>
                    {/* Invisible clickable area */}
                </div>

                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white pointer-events-none">
                    {activeImgIndex + 1}/{opportunity.images.length || 1}
                </div>
                <div className="absolute top-3 left-3 bg-gold text-primary font-bold text-xs px-2 py-1 rounded shadow-sm">
                    ROI: {opportunity.expectedRoiPct}%
                </div>

                {isSelected && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full shadow-md animate-in fade-in zoom-in duration-200">
                        <Check className="w-4 h-4" strokeWidth={3} />
                    </div>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white leading-tight">{opportunity.title}</h3>
                    <span className="text-[10px] text-typography-grey border border-gray-700 px-2 py-1 rounded shrink-0 ml-2">{opportunity.distanceFromCity}</span>
                </div>

                <div className="flex items-center gap-1 text-sm text-gold mb-4">
                    <MapPin className="w-3 h-3" /> {opportunity.location}, {opportunity.country}
                </div>

                {/* Amenities Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4 text-xs text-typography-grey">
                    <div className="flex items-center gap-2"><Users className="w-3 h-3 text-gold" /> Cap: {opportunity.capacity}</div>
                    {opportunity.amenities.slice(0, 3).map((am, idx) => {
                        const Icon = AMENITY_ICONS[am] || CheckCircle2;
                        return (
                            <div key={idx} className="flex items-center gap-2 truncate">
                                <Icon className="w-3 h-3 text-gold" /> {am}
                            </div>
                        );
                    })}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {opportunity.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-primary px-2 py-1 rounded text-secondary-teal border border-secondary-teal/20">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-typography-grey uppercase">Unit Price</span>
                        <span className="font-bold text-white">{formatPrice(opportunity.totalPrice, currency, rate)}</span>
                    </div>
                    <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-typography-grey uppercase">Available Shares</span>
                            <span className="font-bold text-gold text-xs">{opportunity.availableSharesPct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gold rounded-full"
                                style={{ width: `${opportunity.availableSharesPct}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className={`w-full border transition-colors py-2 rounded text-sm font-bold flex items-center justify-center gap-2 ${isSelected ? 'bg-gold text-primary border-gold shadow-sm' : 'bg-primary text-white border-gray-700 group-hover:border-gold group-hover:text-gold'}`} onClick={onRoiClick}>
                        {isSelected ? 'Viewing ROI' : 'Calculate ROI'} <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

const InvestPage: React.FC<InvestPageProps> = () => {
    const [opportunities, setOpportunities] = useState<CabinOpportunity[]>([]);
    const [selectedOpp, setSelectedOpp] = useState<CabinOpportunity | null>(null);
    const [showRoiModal, setShowRoiModal] = useState(false);
    const [sharesCount, setSharesCount] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState<string>('USD');

    const rate = CURRENCY_RATES[currency];


    useEffect(() => {
        const fetchOpps = async () => {
            const data = await api.getOpportunities();
            setOpportunities(data);
            if (data.length > 0) {
                setSelectedOpp(data[0]);
            }
            setLoading(false);
        };
        fetchOpps();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full text-gold"><Loader2 className="animate-spin w-10 h-10" /></div>;
    }

    if (!selectedOpp) {
        return <div className="flex items-center justify-center h-full text-white">No opportunities found.</div>;
    }

    // Calculator Logic
    // Assuming each property is divided into 12 shares total
    const totalShares = 12;
    const sharePercentage = sharesCount / totalShares; // 0.083 to 1.0
    const investmentCost = selectedOpp.totalPrice * sharePercentage;

    // Free nights:
    // Base logic: 1 share (1/12) = 30 nights. 
    // Cap at 30% of year = 110 nights.
    const rawNights = 30 * sharesCount;
    const maxNights = 365 * 0.30;
    const freeNights = Math.min(rawNights, maxNights);

    const yearlyRoiVal = investmentCost * (selectedOpp.expectedRoiPct / 100);

    // Projections
    const growthRate = 0.05; // Conservative 5% appreciation
    const val5Years = investmentCost * Math.pow(1 + growthRate, 5);
    const val10Years = investmentCost * Math.pow(1 + growthRate, 10);

    const estimatedAdr = COUNTRY_ADR_MAP[selectedOpp.country] || COUNTRY_ADR_MAP['Unknown'];

    return (
        <div className="lg:h-full flex flex-col lg:flex-row h-full lg:overflow-hidden overflow-y-auto bg-[#151725]">

            {/* Left Side: Opportunities Grid */}
            <div className="w-full shrink-0 lg:shrink lg:flex-1 lg:h-full lg:overflow-y-auto p-4 md:p-6 custom-scrollbar">
                <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Nextribe Projects</h1>
                        <p className="text-typography-grey text-xs md:text-sm">Select a project from our global network to simulate your returns.</p>
                    </div>

                    {/* Currency Selector */}
                    <div className="flex bg-primary border border-gray-700 rounded-lg p-1">
                        {Object.keys(CURRENCY_RATES).map((curr) => (
                            <button
                                key={curr}
                                onClick={() => setCurrency(curr)}
                                className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${currency === curr ? 'bg-gold text-primary' : 'text-typography-grey hover:text-white'}`}
                            >
                                {curr}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6 pb-6">
                    {opportunities.map(opp => (
                        <OpportunityCard
                            key={opp.id}
                            opportunity={opp}
                            onSelect={() => setSelectedOpp(opp)}
                            isSelected={selectedOpp.id === opp.id}
                            currency={currency}
                            rate={rate}
                            onRoiClick={(e) => {
                                e.stopPropagation();
                                setSelectedOpp(opp);
                                setShowRoiModal(true);
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Right Side: Calculator */}
            <div className="w-full lg:w-[400px] bg-primary border-t lg:border-t-0 lg:border-l border-gray-800 lg:h-full lg:overflow-y-auto custom-scrollbar p-4 md:p-6 shadow-2xl lg:z-20 relative shrink-0">
                <div className="lg:sticky top-0 bg-primary pb-4 border-b border-gray-800 mb-6">
                    <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                        <DollarSign className="text-gold w-5 h-5" /> ROI Calculator
                    </h2>
                    <p className="text-xs text-typography-grey mt-1">Simulating returns for <span className="text-gold font-semibold">{selectedOpp.title}</span></p>
                </div>

                <div className="space-y-6 md:space-y-8">
                    {/* Share Selection Slider */}
                    <div>
                        <label className="text-sm font-medium text-white mb-4 flex justify-between">
                            <span>Investment Size</span>
                            <span className="text-gold font-bold">{sharesCount} / {totalShares} Shares</span>
                        </label>

                        <div className="px-2">
                            <input
                                type="range"
                                min="1"
                                max="12"
                                step="1"
                                value={sharesCount}
                                onChange={(e) => setSharesCount(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
                            />
                            <div className="flex justify-between text-[10px] text-typography-grey mt-2 font-medium uppercase tracking-wider">
                                <span>Min (8.3%)</span>
                                <span>50%</span>
                                <span>Full (100%)</span>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-primary-light border border-gray-700 rounded-lg flex justify-between items-center">
                            <span className="text-xs text-typography-grey">Ownership</span>
                            <span className="text-sm font-bold text-white">{(sharePercentage * 100).toFixed(1)}%</span>
                        </div>
                    </div>

                    {/* Investment Cost */}
                    <div className="bg-primary-light p-4 rounded-xl border border-gray-800">
                        <div className="text-xs text-typography-grey uppercase font-semibold mb-1">Required Investment</div>
                        <div className="text-2xl md:text-3xl font-bold text-white">{formatPrice(investmentCost, currency, rate)}</div>
                    </div>

                    {/* Returns Breakdown */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-900/30 rounded text-purple-400"><Moon className="w-4 h-4" /></div>
                                <span className="text-xs md:text-sm text-typography-grey">Free Nights / Year</span>
                            </div>
                            <span className="font-bold text-white text-base md:text-lg">{Math.floor(freeNights)}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-900/30 rounded text-blue-400"><DollarSign className="w-4 h-4" /></div>
                                <span className="text-xs md:text-sm text-typography-grey">Est. Country ADR</span>
                            </div>
                            <span className="font-bold text-white text-base md:text-lg">{formatPrice(estimatedAdr, currency, rate)}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-900/30 rounded text-green-400"><TrendingUp className="w-4 h-4" /></div>
                                <span className="text-xs md:text-sm text-typography-grey">Est. Yearly Cash ROI</span>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-green-400 text-base md:text-lg">+{formatPrice(yearlyRoiVal, currency, rate)}</span>
                                <div className="text-[10px] text-typography-grey">({selectedOpp.expectedRoiPct}%)</div>
                            </div>
                        </div>
                    </div>

                    {/* Future Value Projection */}
                    <div className="bg-gradient-to-br from-primary-light to-primary border border-gray-700 p-4 rounded-xl">
                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <Info className="w-3 h-3 text-gold" /> Asset Value Projection
                        </h4>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-typography-grey">5 Years</span>
                            <span className="font-mono text-white text-sm md:text-base">{formatPrice(val5Years, currency, rate)}</span>
                        </div>
                        <div className="w-full h-1 bg-gray-700 rounded-full mb-3">
                            <div className="h-full bg-gold rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-typography-grey">10 Years</span>
                            <span className="font-mono text-white text-sm md:text-base">{formatPrice(val10Years, currency, rate)}</span>
                        </div>
                        <div className="w-full h-1 bg-gray-700 rounded-full">
                            <div className="h-full bg-gold rounded-full" style={{ width: '85%' }}></div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <button className="w-full bg-gold hover:bg-yellow-500 text-primary font-bold py-3 md:py-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2">
                        <Calendar className="w-5 h-5" /> Book Session
                    </button>
                    <p className="text-[10px] text-center text-gray-500">
                        *Projections are estimates based on historical data and market trends. Returns are not guaranteed.
                    </p>

                </div>
            </div>

        </div>
    );

    {/* ROI Details Modal */ }
    {
        showRoiModal && selectedOpp && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowRoiModal(false)}>
                <div className="bg-primary-light p-6 rounded-xl max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => setShowRoiModal(false)}
                    >
                        ✕
                    </button>
                    <h2 className="text-xl font-bold mb-4 text-white">
                        ROI Details for {selectedOpp.title}
                    </h2>
                    <p className="text-typography-grey mb-2">Expected ROI: {selectedOpp.expectedRoiPct}%</p>
                    <p className="text-typography-grey mb-2">Free Nights per Year: {Math.floor(freeNights)}</p>
                    <p className="text-typography-grey mb-2">Estimated Country ADR: {formatPrice(estimatedAdr, currency, rate)}</p>
                    <p className="text-typography-grey mb-2">Yearly Cash ROI: +{formatPrice(yearlyRoiVal, currency, rate)} ({selectedOpp.expectedRoiPct}%)</p>
                </div>
            </div>
        )
    }

};

export default InvestPage;