import React, { useState, useEffect } from 'react';
import { CabinOpportunity } from '../types';
import { MapPin, Users, ArrowRight, DollarSign, Info, Calendar, TrendingUp, Moon, CheckCircle2, Check, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface InvestPageProps {}

interface OpportunityCardProps {
  opportunity: CabinOpportunity;
  onSelect: () => void;
  isSelected: boolean;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onSelect, isSelected }) => {
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
                    <div className="flex items-center gap-2"><Users className="w-3 h-3" /> Cap: {opportunity.capacity}</div>
                    {opportunity.amenities.slice(0, 3).map((am, idx) => (
                        <div key={idx} className="flex items-center gap-2 truncate">
                            <span className="w-1 h-1 bg-gray-500 rounded-full"></span> {am}
                        </div>
                    ))}
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
                        <span className="font-bold text-white">${opportunity.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-typography-grey uppercase">Available Shares</span>
                        <span className="font-bold text-gold">{opportunity.availableSharesPct}%</span>
                    </div>
                    <div className={`w-full border transition-colors py-2 rounded text-sm font-bold flex items-center justify-center gap-2 ${isSelected ? 'bg-gold text-primary border-gold shadow-sm' : 'bg-primary text-white border-gray-700 group-hover:border-gold group-hover:text-gold'}`}>
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
  const [sharesCount, setSharesCount] = useState<number>(1);
  const [loading, setLoading] = useState(true);

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
      return <div className="flex items-center justify-center h-full text-gold"><Loader2 className="animate-spin w-10 h-10"/></div>;
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

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden bg-[#151725]">
       
       {/* Left Side: Opportunities Grid */}
       <div className="flex-1 h-full overflow-y-auto p-6 custom-scrollbar">
          <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Nextribe Projects</h1>
              <p className="text-typography-grey text-sm">Select a project from our global network to simulate your returns.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 pb-20">
              {opportunities.map(opp => (
                  <OpportunityCard 
                    key={opp.id}
                    opportunity={opp} 
                    onSelect={() => setSelectedOpp(opp)} 
                    isSelected={selectedOpp.id === opp.id}
                />
              ))}
          </div>
       </div>

       {/* Right Side: Sticky Calculator */}
       <div className="w-full lg:w-[400px] bg-primary border-l border-gray-800 h-auto lg:h-full overflow-y-auto custom-scrollbar p-6 shadow-2xl z-20 relative">
           <div className="sticky top-0 bg-primary pb-4 z-10 border-b border-gray-800 mb-6">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   <DollarSign className="text-gold w-5 h-5" /> ROI Calculator
               </h2>
               <p className="text-xs text-typography-grey mt-1">Simulating returns for <span className="text-gold font-semibold">{selectedOpp.title}</span></p>
           </div>

           <div className="space-y-8">
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
                   <div className="text-3xl font-bold text-white">${investmentCost.toLocaleString()}</div>
               </div>

               {/* Returns Breakdown */}
               <div className="space-y-4">
                   <div className="flex items-center justify-between p-3 border-b border-gray-800">
                       <div className="flex items-center gap-3">
                           <div className="p-2 bg-purple-900/30 rounded text-purple-400"><Moon className="w-4 h-4" /></div>
                           <span className="text-sm text-typography-grey">Free Nights / Year</span>
                       </div>
                       <span className="font-bold text-white text-lg">{Math.floor(freeNights)}</span>
                   </div>

                   <div className="flex items-center justify-between p-3 border-b border-gray-800">
                       <div className="flex items-center gap-3">
                           <div className="p-2 bg-green-900/30 rounded text-green-400"><TrendingUp className="w-4 h-4" /></div>
                           <span className="text-sm text-typography-grey">Est. Yearly Cash ROI</span>
                       </div>
                       <div className="text-right">
                            <span className="font-bold text-green-400 text-lg">+${yearlyRoiVal.toLocaleString()}</span>
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
                       <span className="font-mono text-white">${val5Years.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                   </div>
                    <div className="w-full h-1 bg-gray-700 rounded-full mb-3">
                        <div className="h-full bg-gold rounded-full" style={{ width: '60%' }}></div>
                    </div>
                   <div className="flex justify-between items-end mb-2">
                       <span className="text-xs text-typography-grey">10 Years</span>
                       <span className="font-mono text-white">${val10Years.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                   </div>
                   <div className="w-full h-1 bg-gray-700 rounded-full">
                        <div className="h-full bg-gold rounded-full" style={{ width: '85%' }}></div>
                    </div>
               </div>

               {/* Call to Action */}
               <button className="w-full bg-gold hover:bg-yellow-500 text-primary font-bold py-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2">
                   <Calendar className="w-5 h-5" /> Book Session
               </button>
               <p className="text-[10px] text-center text-gray-500">
                   *Projections are estimates based on historical data and market trends. Returns are not guaranteed.
               </p>

           </div>
       </div>

    </div>
  );
};

export default InvestPage;