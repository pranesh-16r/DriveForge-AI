import React from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoCard } from '../components/ui/NeoCard';
import { COUNTRIES } from '../data/locations';
import { BuildFlowProgress } from '../components/discovery/BuildFlowProgress';
import { FlowNavigationButtons } from '../components/discovery/FlowNavigationButtons';
import { Country } from '../types';
import { Check, Globe, MapPin, DollarSign, Layers } from 'lucide-react';

export const LocationPage: React.FC = () => {
  const { selectedCountry, setSelectedCountry, navigateTo } = useApp();

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleContinue = () => {
    if (selectedCountry) {
      navigateTo('/location/region');
    }
  };

  const handleBack = () => {
    navigateTo('/');
  };

  return (
    <PageContainer
      eyebrow="STEP 01 • GEOGRAPHIC CONTEXT"
      title="WHERE ARE YOU BUILDING?"
      subtitle="Your region helps DriveForge estimate costs, component shipping lead times, verified workshop availability, and build context."
    >
      {/* Global Build Progress Stepper */}
      <BuildFlowProgress currentStep="location" />

      {/* Country Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COUNTRIES.map(country => {
          const isSelected = selectedCountry?.id === country.id;

          return (
            <NeoCard
              key={country.id}
              interactive
              active={isSelected}
              onClick={() => handleCountrySelect(country)}
              className={`
                space-y-5 relative flex flex-col justify-between transition-all duration-300
                ${isSelected 
                  ? 'border-2 border-[#171717] bg-white shadow-xl ring-2 ring-[#171717]/10' 
                  : 'border border-[#292927]/12 bg-[#FAFAF7] hover:bg-white hover:border-[#171717]/40 shadow-xs'
                }
              `}
            >
              <div className="space-y-4">
                {/* Flag and Code Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl select-none" role="img" aria-label={country.name}>
                      {country.flag}
                    </span>
                    <span className="text-xs font-mono font-black text-[#171717] bg-[#E8E2D8] px-2.5 py-0.5 rounded-md border border-[#292927]/15">
                      {country.code}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#28483D] text-[#FAFAF7] text-[11px] font-mono font-bold shadow-md animate-in fade-in">
                      <Check className="w-3.5 h-3.5" /> SELECTED
                    </span>
                  )}
                </div>

                {/* Country Name */}
                <div>
                  <h3 className="text-2xl font-black text-[#171717] font-sans tracking-tight">
                    {country.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs font-mono text-[#55534E]">
                    <DollarSign className="w-3.5 h-3.5 text-[#28483D]" />
                    <span>Currency: <strong className="text-[#171717] font-bold">{country.currency} ({country.currencySymbol})</strong></span>
                  </div>
                </div>

                {/* Regional Context */}
                <p className="text-xs text-[#383835] font-sans leading-relaxed pt-3 border-t border-[#292927]/12 font-medium">
                  {country.context}
                </p>

                {/* Supported States preview badge */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#55534E] font-bold block mb-1.5">
                    SUPPORTED REGIONS:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {country.regions.map(r => (
                      <span
                        key={r.id}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#E8E2D8] text-[#171717] font-semibold border border-[#292927]/15"
                      >
                        {r.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selection Status Action */}
              <div className="pt-4 border-t border-[#292927]/12">
                <div
                  className={`
                    w-full py-2.5 px-3 rounded-xl text-center text-xs font-mono font-bold transition-all
                    ${isSelected
                      ? 'bg-[#171717] text-[#FAFAF7] shadow-md'
                      : 'bg-[#E8E2D8] text-[#171717] hover:bg-[#171717] hover:text-[#FAFAF7] border border-[#292927]/15'
                    }
                  `}
                >
                  {isSelected ? 'Country Selected ✓' : 'Select Country'}
                </div>
              </div>
            </NeoCard>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <FlowNavigationButtons
        onBack={handleBack}
        onContinue={handleContinue}
        continueDisabled={!selectedCountry}
        continueLabel="Continue to Region"
        backLabel="Back to Home"
        contextText={selectedCountry ? `Selected: ${selectedCountry.name} (${selectedCountry.currency})` : undefined}
      />
    </PageContainer>
  );
};
