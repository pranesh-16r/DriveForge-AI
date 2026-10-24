import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoInput } from '../components/ui/NeoInput';
import { BuildFlowProgress } from '../components/discovery/BuildFlowProgress';
import { FlowNavigationButtons } from '../components/discovery/FlowNavigationButtons';
import { VEHICLE_BRANDS } from '../data/vehicleBrands';
import { VehicleBrand } from '../types';
import { Check, Search, ShieldCheck, Car, Sparkles } from 'lucide-react';

export const BrandsPage: React.FC = () => {
  const { selectedBrand, setSelectedBrand, navigateTo } = useApp();
  const [search, setSearch] = useState('');

  const filteredBrands = VEHICLE_BRANDS.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.country.toLowerCase().includes(search.toLowerCase()) ||
    b.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleBrandSelect = (brand: VehicleBrand) => {
    setSelectedBrand(brand);
  };

  const handleContinue = () => {
    if (selectedBrand) {
      navigateTo('/vehicles/type');
    }
  };

  const handleBack = () => {
    navigateTo('/experience');
  };

  return (
    <PageContainer
      eyebrow="01 • VEHICLE SELECTION"
      title="WHAT ARE YOU BUILDING?"
      subtitle="Select a verified automotive manufacturer. DriveForge grounds every modification plan in certified factory chassis geometry and tolerances."
    >
      {/* Global Build Progress Stepper */}
      <BuildFlowProgress currentStep="brand" />

      {/* Search Bar */}
      <div className="max-w-md">
        <NeoInput
          placeholder="Filter manufacturers (e.g. Porsche, BMW, Toyota)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map(brand => {
          const isSelected = selectedBrand?.id === brand.id;

          return (
            <NeoCard
              key={brand.id}
              interactive
              active={isSelected}
              onClick={() => handleBrandSelect(brand)}
              className={`
                space-y-5 relative flex flex-col justify-between transition-all duration-300 group
                ${isSelected
                  ? 'border-2 border-[#171717] bg-white shadow-xl ring-2 ring-[#171717]/10'
                  : 'border border-[#292927]/12 bg-[#FAFAF7] hover:bg-white hover:border-[#171717]/40 shadow-xs'
                }
              `}
            >
              <div className="space-y-4">
                {/* Brand Header */}
                <div className="flex items-center justify-between">
                  <div className="px-3.5 py-1.5 rounded-xl font-mono font-black tracking-widest text-sm text-[#171717] border border-[#292927]/15 bg-[#E8E2D8]">
                    {brand.logoText}
                  </div>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#28483D] text-[#FAFAF7] text-[11px] font-mono font-bold shadow-md">
                      <Check className="w-3.5 h-3.5" /> SELECTED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#55534E] font-bold uppercase">
                      FOUNDED {brand.foundedYear}
                    </span>
                  )}
                </div>

                {/* Name & Origin */}
                <div>
                  <span className="text-[10px] font-mono font-black text-[#28483D] uppercase tracking-wider">
                    {brand.country} • OEM CERTIFIED
                  </span>
                  <h3 className="text-2xl font-black text-[#171717] font-sans mt-0.5">
                    {brand.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-[#383835] font-sans leading-relaxed pt-2 border-t border-[#292927]/12 font-medium">
                  {brand.description}
                </p>

                {/* Supported Categories */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#55534E] font-semibold">
                    <span>SUPPORTED VEHICLES:</span>
                    <span className="text-[#171717] font-black">{brand.modelsCount} SHOWCASE PLATFORMS</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {brand.vehicleTypes.map(t => (
                      <span
                        key={t}
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#E8E2D8] text-[#171717] border border-[#292927]/15 uppercase"
                      >
                        {t.replace('-', ' ')}
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
                  {isSelected ? 'Platform Selected ✓' : 'Select Manufacturer'}
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
        continueDisabled={!selectedBrand}
        continueLabel="Continue to Vehicle Type"
        backLabel="Back to Experience"
        contextText={selectedBrand ? `Selected Brand: ${selectedBrand.name} (${selectedBrand.country})` : undefined}
      />
    </PageContainer>
  );
};
