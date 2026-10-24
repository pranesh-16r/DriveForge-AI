import React from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoCard } from '../components/ui/NeoCard';
import { BuildFlowProgress } from '../components/discovery/BuildFlowProgress';
import { FlowNavigationButtons } from '../components/discovery/FlowNavigationButtons';
import { VEHICLE_TYPES } from '../data/vehicleTypes';
import { VEHICLES } from '../data/vehicles';
import { VehicleTypeCategory } from '../types';
import { Check, ShieldCheck, Gauge, Zap, Disc, Compass, ArrowLeft } from 'lucide-react';
import { VEHICLE_BRANDS } from '../data/vehicleBrands';

export const VehicleTypePage: React.FC = () => {
  const { selectedBrand, selectedVehicleType, setSelectedVehicleType, navigateTo } = useApp();

  const activeBrand = selectedBrand || VEHICLE_BRANDS[0];

  const handleTypeSelect = (type: VehicleTypeCategory) => {
    setSelectedVehicleType(type);
  };

  const handleContinue = () => {
    if (selectedVehicleType) {
      navigateTo('/vehicles');
    }
  };

  const handleBack = () => {
    navigateTo('/brands');
  };

  // Helper to count available models for active brand & type
  const getModelCountForType = (typeId: string) => {
    return VEHICLES.filter(v => v.brandId === activeBrand.id && v.typeId === typeId).length;
  };

  return (
    <PageContainer
      eyebrow={`02 • ${activeBrand.name.toUpperCase()} PLATFORM ARCHITECTURE`}
      title="CHOOSE YOUR BODY STYLE"
      subtitle={`Select a chassis body style for your ${activeBrand.name} build. DriveForge configures body rigidity, suspension geometry, and aerodynamic balance.`}
    >
      {/* Global Build Progress Stepper */}
      <BuildFlowProgress currentStep="type" />

      {/* Brand Context Indicator */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#E8E2D8] border border-[#292927]/12 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-xl bg-[#FAFAF7] border border-[#292927]/15 text-[#171717] font-mono font-black text-xs">
            {activeBrand.logoText}
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#55534E] uppercase">ACTIVE MANUFACTURER</span>
            <p className="text-sm font-black text-[#171717] font-sans">{activeBrand.name} ({activeBrand.country})</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('/brands')}
          className="text-xs font-mono font-bold text-[#171717] hover:text-[#28483D] transition-colors flex items-center gap-1 cursor-pointer bg-[#FAFAF7] px-3 py-1.5 rounded-lg border border-[#292927]/12"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Change Brand
        </button>
      </div>

      {/* Vehicle Type Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {VEHICLE_TYPES.map(type => {
          const isSelected = selectedVehicleType?.id === type.id;
          const modelCount = getModelCountForType(type.id);

          return (
            <NeoCard
              key={type.id}
              interactive
              active={isSelected}
              onClick={() => handleTypeSelect(type)}
              className={`
                space-y-4 relative flex flex-col justify-between transition-all duration-300
                ${isSelected
                  ? 'border-2 border-[#171717] bg-white shadow-xl ring-2 ring-[#171717]/10'
                  : 'border border-[#292927]/12 bg-[#FAFAF7] hover:bg-white hover:border-[#171717]/40 shadow-xs'
                }
              `}
            >
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-[#28483D] uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#E8E2D8] border border-[#292927]/15">
                    {type.badge}
                  </span>

                  {isSelected && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#28483D] text-[#FAFAF7] text-[11px] font-mono font-bold shadow-md">
                      <Check className="w-3.5 h-3.5" /> ACTIVE TYPE
                    </span>
                  )}
                </div>

                {/* Name */}
                <div>
                  <h3 className="text-2xl font-black text-[#171717] font-sans">
                    {type.name}
                  </h3>
                  <span className="text-xs font-mono text-[#55534E] mt-1 block font-medium">
                    {modelCount > 0 ? (
                      <span className="text-[#1C6E42] font-black">{modelCount} {activeBrand.name} model{modelCount > 1 ? 's' : ''} available</span>
                    ) : (
                      <span>Supported across catalog</span>
                    )}
                  </span>
                </div>

                {/* Short Description */}
                <p className="text-xs text-[#383835] font-sans leading-relaxed pt-2 border-t border-[#292927]/12 font-medium">
                  {type.shortDescription}
                </p>
              </div>

              {/* Selection Status Action */}
              <div className="pt-3 border-t border-[#292927]/12">
                <div
                  className={`
                    w-full py-2.5 px-3 rounded-xl text-center text-xs font-mono font-bold transition-all
                    ${isSelected
                      ? 'bg-[#171717] text-[#FAFAF7] shadow-md'
                      : 'bg-[#E8E2D8] text-[#171717] hover:bg-[#171717] hover:text-[#FAFAF7] border border-[#292927]/15'
                    }
                  `}
                >
                  {isSelected ? 'Architecture Selected ✓' : 'Select Architecture'}
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
        continueDisabled={!selectedVehicleType}
        continueLabel="Continue to Model Selection"
        backLabel="Back to Brand"
        contextText={selectedVehicleType ? `Selected Architecture: ${selectedVehicleType.name}` : undefined}
      />
    </PageContainer>
  );
};
