import React, { useState } from 'react';
import { COUNTRIES } from '../../data/locations';
import { Country, Region } from '../../types';
import { X, Globe, MapPin, Check } from 'lucide-react';

interface RegionSwitcherModalProps {
  currentCountry: Country | null;
  currentRegion: Region | null;
  onSelect: (country: Country, region: Region) => void;
  onClose: () => void;
}

export const RegionSwitcherModal: React.FC<RegionSwitcherModalProps> = ({
  currentCountry,
  currentRegion,
  onSelect,
  onClose
}) => {
  const [selectedCountryId, setSelectedCountryId] = useState<string>(
    currentCountry?.id || COUNTRIES[0].id
  );

  const activeCountry = COUNTRIES.find(c => c.id === selectedCountryId) || COUNTRIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-[24px] neo-panel border border-white/15 bg-[#14171E] text-white p-6 space-y-5 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#0070F3]" />
            <h3 className="text-base font-bold font-sans">Select Workshop Region</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg neo-button text-gray-400 hover:text-white border border-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Country Selector Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl neo-inset bg-[#0E1015] border border-white/5 overflow-x-auto">
          {COUNTRIES.map(country => (
            <button
              key={country.id}
              onClick={() => setSelectedCountryId(country.id)}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedCountryId === country.id
                  ? 'bg-[#0070F3] text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{country.flag}</span>
              <span className="truncate">{country.name}</span>
            </button>
          ))}
        </div>

        {/* Region Grid for Selected Country */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">
            Select State / Territory:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeCountry.regions.map(region => {
              const isSelected = currentRegion?.id === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => {
                    onSelect(activeCountry, region);
                    onClose();
                  }}
                  className={`p-3 rounded-xl text-left font-mono transition-all flex items-center justify-between gap-2 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#0070F3]/15 border-[#0070F3] text-white shadow-md'
                      : 'bg-[#181B22] border-white/5 hover:border-white/15 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#0070F3]' : 'text-gray-400'}`} />
                    <span className="text-xs font-bold truncate">{region.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#0070F3] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 text-[11px] font-mono text-gray-400 text-center">
          Changing regions updates workshop listings, local labor rates, and component currency.
        </div>
      </div>
    </div>
  );
};
