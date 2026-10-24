import React from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoCard } from '../components/ui/NeoCard';
import { BuildFlowProgress } from '../components/discovery/BuildFlowProgress';
import { FlowNavigationButtons } from '../components/discovery/FlowNavigationButtons';
import { Region } from '../types';
import { Check, MapPin, Wrench, Truck, ArrowLeft } from 'lucide-react';
import { COUNTRIES } from '../data/locations';

export const RegionSelectionPage: React.FC = () => {
  const { selectedCountry, selectedRegion, setSelectedRegion, navigateTo } = useApp();

  // If user navigates directly without a country, default to India
  const activeCountry = selectedCountry || COUNTRIES[0];

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
  };

  const handleContinue = () => {
    if (selectedRegion) {
      navigateTo('/experience');
    }
  };

  const handleBack = () => {
    navigateTo('/location');
  };

  return (
    <PageContainer
      eyebrow={`STEP 01B • ${activeCountry.name.toUpperCase()} REGIONAL ZONE`}
      title="SELECT YOUR STATE / REGION"
      subtitle={`DriveForge calibrates verified master workshop labor rates and parts shipping indices for ${activeCountry.name}.`}
    >
      {/* Global Build Progress Stepper */}
      <BuildFlowProgress currentStep="location" />

      {/* Country summary pill */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#E8E2D8] border border-[#292927]/12 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label={activeCountry.name}>
            {activeCountry.flag}
          </span>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#55534E] uppercase">ACTIVE COUNTRY</span>
            <p className="text-sm font-black text-[#171717] font-sans">{activeCountry.name} ({activeCountry.code})</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('/location')}
          className="text-xs font-mono font-bold text-[#171717] hover:text-[#28483D] transition-colors flex items-center gap-1 cursor-pointer bg-[#FAFAF7] px-3 py-1.5 rounded-lg border border-[#292927]/12"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Change Country
        </button>
      </div>

      {/* Regions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeCountry.regions.map(region => {
          const isSelected = selectedRegion?.id === region.id;

          return (
            <NeoCard
              key={region.id}
              interactive
              active={isSelected}
              onClick={() => handleRegionSelect(region)}
              className={`
                space-y-4 relative flex flex-col justify-between transition-all duration-300
                ${isSelected 
                  ? 'border-2 border-[#171717] bg-white shadow-xl ring-2 ring-[#171717]/10' 
                  : 'border border-[#292927]/12 bg-[#FAFAF7] hover:bg-white hover:border-[#171717]/40 shadow-xs'
                }
              `}
            >
              <div className="space-y-3.5">
                {/* Header with icon & badge */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#E8E2D8] flex items-center justify-center text-[#171717] border border-[#292927]/12">
                    <MapPin className="w-5 h-5 text-[#28483D]" />
                  </div>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#28483D] text-[#FAFAF7] text-[11px] font-mono font-bold shadow-md">
                      <Check className="w-3.5 h-3.5" /> ACTIVE REGION
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-[#171717] uppercase px-2 py-0.5 rounded bg-[#E8E2D8] border border-[#292927]/15">
                      {region.code}
                    </span>
                  )}
                </div>

                {/* State Title */}
                <div>
                  <p className="text-[10px] font-mono font-black text-[#28483D] uppercase tracking-wider">{region.code}</p>
                  <h3 className="text-xl font-black text-[#171717] font-sans">{region.name}</h3>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-2 pt-2 border-t border-[#292927]/12">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#55534E] flex items-center gap-1.5 font-medium">
                      <Wrench className="w-3 h-3 text-[#28483D]" /> WORKSHOP LABOR
                    </span>
                    <span className="text-[#171717] font-black">
                      ${region.avgHourlyLaborRateUSD}/hr
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#55534E] flex items-center gap-1.5 font-medium">
                      <Truck className="w-3 h-3 text-[#1C6E42]" /> SHIPPING INDEX
                    </span>
                    <span className="text-[#1C6E42] font-black">
                      {region.shippingMultiplier}x
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#55534E] font-medium">CURRENCY</span>
                    <span className="text-[#171717] font-bold">
                      {region.currency} ({region.currencySymbol})
                    </span>
                  </div>
                </div>
              </div>

              {/* Selection Status Action */}
              <div className="pt-3 border-t border-[#292927]/12">
                <div
                  className={`
                    w-full py-2 px-3 rounded-xl text-center text-xs font-mono font-bold transition-all
                    ${isSelected
                      ? 'bg-[#171717] text-[#FAFAF7] shadow-md'
                      : 'bg-[#E8E2D8] text-[#171717] hover:bg-[#171717] hover:text-[#FAFAF7] border border-[#292927]/15'
                    }
                  `}
                >
                  {isSelected ? 'Region Confirmed ✓' : 'Select Region'}
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
        continueDisabled={!selectedRegion}
        continueLabel="Continue to Experience Mode"
        backLabel="Back to Country"
        contextText={selectedRegion ? `Configured Zone: ${selectedRegion.name} (${activeCountry.name})` : undefined}
      />
    </PageContainer>
  );
};
