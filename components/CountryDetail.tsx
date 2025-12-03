
import React, { useEffect, useState } from 'react';
import { CountryData, CountryStatus } from '../types';
import { X, CheckCircle, Circle, Building, Scale, Users, Briefcase, Home, Video, Camera, HandHeart } from 'lucide-react';
import { COLORS } from '../constants';
import { generateCountryInsight, generateApplicationMotivation } from '../services/geminiService';

interface CountryDetailProps {
  country: CountryData;
  onClose: () => void;
  onApply: () => void;
}

import ProgressBar from './ProgressBar';

const BooleanItem = ({ checked, label }: { checked: boolean, label: string }) => (
  <div className="flex justify-between items-center mb-6 py-1">
    <span className="text-sm font-medium text-typography-white">{label}</span>
    {checked ? <CheckCircle className="w-5 h-5 text-gold" /> : <Circle className="w-5 h-5 text-typography-grey" />}
  </div>
);

const CountryDetail: React.FC<CountryDetailProps> = ({ country, onClose, onApply }) => {
  const [aiDescription, setAiDescription] = useState<string>("");
  const [motivation, setMotivation] = useState<string>("");

  useEffect(() => {
    const fetchAi = async () => {
      const desc = await generateCountryInsight(country.name);
      setAiDescription(desc);
      if (country.status === CountryStatus.NONE) {
        const mot = await generateApplicationMotivation(country.name);
        setMotivation(mot);
      }
    };
    fetchAi();
  }, [country]);

  // Logic to hide apply button if ambassador exists
  const hasAmbassador = country.status === CountryStatus.AMBASSADOR ||
    country.status === CountryStatus.SIGNED ||
    country.status === CountryStatus.DEVELOPMENT ||
    country.status === CountryStatus.OPERATING;

  const handleContribute = () => {
    // Placeholder for contribute navigation
    alert(`Opening contribution page for ${country.name}. Propose a person or solution.`);
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300">
      <div className="w-full md:max-w-4xl bg-primary h-full overflow-y-auto shadow-2xl border-l border-gray-800 animate-slide-in-right p-4 md:p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-6 md:mb-8">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Overall Progress Circle */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path className="text-primary-light" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-gold" strokeDasharray={`${country.progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
              <div className="absolute text-center">
                <div className="text-xs text-typography-grey">Overall</div>
                <div className="text-lg md:text-xl font-bold text-white">{country.progress}%</div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-typography-white mb-1">{country.name}</h2>
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider`}
                  style={{
                    backgroundColor: country.status === CountryStatus.NONE ? COLORS.NONE :
                      country.status === CountryStatus.PROPOSED ? COLORS.PROPOSED :
                        country.status === CountryStatus.AMBASSADOR ? COLORS.AMBASSADOR :
                          country.status === CountryStatus.SIGNED ? COLORS.SIGNED : COLORS.DEVELOPMENT,
                    color: country.status === CountryStatus.AMBASSADOR ? '#1E2233' : 'white'
                  }}
                >
                  {country.status === CountryStatus.NONE ? 'Available Market' :
                    country.status === CountryStatus.PROPOSED ? 'Land Proposed' : country.status}
                </span>

                {/* Contribute Button (Always visible) */}
                <button
                  onClick={handleContribute}
                  className="px-2 md:px-3 py-1 rounded-full text-xs font-semibold border border-gold text-gold hover:bg-gold hover:text-primary transition-colors flex items-center gap-1"
                >
                  <HandHeart className="w-3 h-3" /> Contribute
                </button>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary-light rounded-full transition-colors shrink-0">
            <X className="text-typography-grey hover:text-white w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* About Section */}
        <div className="bg-primary-light rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-700">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-3">About This Expansion</h3>
          <p className="text-typography-grey leading-relaxed text-sm md:text-base">
            {aiDescription || country.description}
          </p>

          {!hasAmbassador && (
            <div className="mt-4 md:mt-6 bg-gradient-to-r from-gold/20 to-transparent p-3 md:p-4 rounded-lg border-l-4 border-gold">
              <h4 className="text-gold font-bold text-base md:text-lg mb-1">Become the Ambassador</h4>
              <p className="text-xs md:text-sm text-typography-grey mb-3 md:mb-4">Reward: <span className="text-white font-bold">5% Revenue Share</span> + Exclusive Network Access.</p>
              {motivation && <p className="text-xs italic text-gray-400 mb-3 md:mb-4">"{motivation}"</p>}
              <button
                onClick={onApply}
                className="bg-gold hover:bg-yellow-500 text-primary font-bold py-2 md:py-3 px-4 md:px-6 rounded shadow-lg transition-transform transform hover:scale-105 text-sm md:text-base w-full md:w-auto"
              >
                Apply Now
              </button>
            </div>
          )}

          {hasAmbassador && country.ambassador && (
            <div className="mt-4 md:mt-6 flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-primary rounded-lg border border-gray-800">
              <img src={country.ambassador.avatarUrl} alt={country.ambassador.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gold" />
              <div>
                <div className="text-xs text-typography-grey uppercase">Current Ambassador</div>
                <div className="font-bold text-white text-sm md:text-base">{country.ambassador.name}</div>
                <div className="text-xs text-secondary-teal">Joined {country.ambassador.joinedDate}</div>
              </div>
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Required Elements */}
          <div className="bg-primary-light/50 p-4 md:p-6 rounded-xl border border-gray-800">
            <h3 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6 flex items-center gap-2">
              <CheckCircle className="text-gold w-4 h-4 md:w-5 md:h-5" /> Required Elements
            </h3>

            <ProgressBar
              label="Locations Proposed"
              current={country.locationsProposed}
              target={country.locationsTarget}
            />
            <ProgressBar
              label="Architects Recommended"
              current={country.architectsRecommended}
              target={country.architectsTarget}
            />
            <BooleanItem label="Lawyer Recommended" checked={country.lawyerRecommended} />
            <ProgressBar
              label="Ambassador Applications"
              current={country.ambassadorApplications}
              target={country.ambassadorTarget}
            />
          </div>

          {/* Optional Elements */}
          <div className="bg-primary-light/50 p-4 md:p-6 rounded-xl border border-gray-800">
            <h3 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6 flex items-center gap-2">
              <Circle className="text-typography-grey w-4 h-4 md:w-5 md:h-5" /> Optional Elements
            </h3>

            <BooleanItem label="Hospitality Partner" checked={country.hospitalityPartner} />

            <ProgressBar
              label="Content Creators"
              current={country.contentCreators}
              target={country.contentCreatorsTarget}
            />

            <BooleanItem label="Media Partners" checked={country.mediaPartners} />

            <ProgressBar
              label="B2B Clients"
              current={country.b2bClients}
              target={country.b2bClientsTarget}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CountryDetail;
