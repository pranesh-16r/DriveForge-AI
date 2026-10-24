import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoInput } from '../components/ui/NeoInput';
import { NeoButton } from '../components/ui/NeoButton';
import { BuildFlowProgress } from '../components/discovery/BuildFlowProgress';
import { FlowNavigationButtons } from '../components/discovery/FlowNavigationButtons';
import { VEHICLES, ExtendedVehicle } from '../data/vehicles';
import { VEHICLE_BRANDS } from '../data/vehicleBrands';
import { VEHICLE_TYPES } from '../data/vehicleTypes';
import { Search, Check, ArrowRight, Gauge, Zap, Weight, ArrowLeft, Filter } from 'lucide-react';

export const VehiclesPage: React.FC = () => {
  const {
    activeVehicle,
    setActiveVehicle,
    selectedBrand,
    selectedVehicleType,
    setSelectedVehicleType,
    navigateTo
  } = useApp();

  const [search, setSearch] = useState('');
  const [showAllTypes, setShowAllTypes] = useState(false);

  // Active brand fallback
  const brand = selectedBrand || VEHICLE_BRANDS[0];
  const vehicleType = selectedVehicleType || VEHICLE_TYPES[0];

  // Filter vehicles: Primary match is selectedBrand
  const filteredVehicles = useMemo(() => {
    return VEHICLES.filter(v => {
      // Must match active brand
      const matchesBrand = v.brandId === brand.id;
      if (!matchesBrand) return false;

      // Type matching (unless showAllTypes is toggled or no match in this type)
      const matchesType = showAllTypes ? true : v.typeId === vehicleType.id;

      // Text search matching
      const matchesSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase()) ||
        v.trim.toLowerCase().includes(search.toLowerCase()) ||
        v.chassisCode.toLowerCase().includes(search.toLowerCase()) ||
        v.engine.toLowerCase().includes(search.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [brand.id, vehicleType.id, showAllTypes, search]);

  // If strict type filter returned 0, fallback to showing all models for this brand with a friendly banner
  const vehiclesToDisplay = filteredVehicles.length > 0
    ? filteredVehicles
    : VEHICLES.filter(v => v.brandId === brand.id);

  const handleVehicleSelect = (vehicle: ExtendedVehicle) => {
    setActiveVehicle(vehicle);
  };

  const handleContinue = () => {
    if (activeVehicle) {
      navigateTo(`/vehicles/${activeVehicle.id}`);
    }
  };

  const handleBack = () => {
    navigateTo('/vehicles/type');
  };

  return (
    <PageContainer
      eyebrow={`03 • ${brand.name.toUpperCase()} PLATFORM`}
      title="CHOOSE YOUR MODEL"
      subtitle={`Choose your production model to establish factory chassis baselines, engine output, curb weight, and gear ratios.`}
    >
      {/* Global Build Progress Stepper */}
      <BuildFlowProgress currentStep="model" />

      {/* Filter and Breadcrumbs Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#E8E2D8] border border-[#292927]/12 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1 rounded-xl bg-[#FAFAF7] border border-[#292927]/15 text-[#171717] font-mono font-black text-xs">
            {brand.logoText}
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#55534E] uppercase">ACTIVE CRITERIA</span>
            <p className="text-sm font-black text-[#171717] font-sans">
              {brand.name} • {showAllTypes ? 'All Body Styles' : vehicleType.name}
            </p>
          </div>
        </div>

        {/* Search & Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-full sm:w-64">
            <NeoInput
              placeholder={`Search ${brand.name} models...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<Search className="w-3.5 h-3.5" />}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAllTypes(!showAllTypes)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
              showAllTypes
                ? 'bg-[#171717] text-[#FAFAF7] border-[#171717] shadow-xs'
                : 'bg-[#FAFAF7] text-[#171717] hover:bg-white border-[#292927]/15'
            }`}
          >
            {showAllTypes ? 'Showing All Types' : 'Show All Types'}
          </button>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehiclesToDisplay.map(v => {
          const isSelected = activeVehicle?.id === v.id;

          return (
            <NeoCard
              key={v.id}
              interactive
              active={isSelected}
              onClick={() => handleVehicleSelect(v)}
              className={`
                space-y-4 group flex flex-col justify-between transition-all duration-300
                ${isSelected
                  ? 'border-2 border-[#171717] bg-white shadow-xl ring-2 ring-[#171717]/10'
                  : 'border border-[#292927]/12 bg-[#FAFAF7] hover:bg-white hover:border-[#171717]/40 shadow-xs'
                }
              `}
            >
              <div className="space-y-3.5">
                {/* Visual Image Container */}
                <div className="h-52 rounded-2xl overflow-hidden relative bg-[#0D0F12]">
                  <img
                    src={v.image || v.imageUrl}
                    alt={`${v.make} ${v.model}`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121417]/80 via-transparent to-transparent" />

                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 bg-[#121417]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-white border border-white/10">
                    {v.chassisCode}
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-[#28483D] text-[#FAFAF7] px-2.5 py-1 rounded-lg text-xs font-mono font-bold shadow-lg flex items-center gap-1 animate-in fade-in">
                      <Check className="w-3.5 h-3.5" /> SELECTED
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 text-xs font-mono font-bold text-gray-200">
                    {v.year} • {v.generation}
                  </div>
                </div>

                {/* Model Title & Specs */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-black text-[#28483D] mb-1">
                    <span>{v.drivetrain} • {v.fuelType}</span>
                    <span>{v.weight} KG</span>
                  </div>
                  <h3 className="text-xl font-black text-[#171717] font-sans">
                    {v.make} {v.name || v.model}
                  </h3>
                  <p className="text-xs text-[#55534E] font-mono mt-0.5 font-medium">{v.variant || v.trim}</p>
                </div>

                {/* Specs Box */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#292927]/12 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/12">
                    <span className="text-[10px] text-[#55534E] block uppercase font-bold">OUTPUT</span>
                    <span className="font-black text-[#171717]">{v.power || v.baselinePowerHp} HP / {v.torque || v.baselineTorqueLbFt} LB-FT</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/12">
                    <span className="text-[10px] text-[#55534E] block uppercase font-bold">TRANSMISSION</span>
                    <span className="font-black text-[#171717] truncate block">{v.transmission}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#383835] font-sans line-clamp-2 leading-relaxed font-medium">
                  {v.description}
                </p>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-[#292927]/12 flex items-center justify-between">
                <span className="text-xs font-mono text-[#171717] font-black">
                  MSRP ${v.priceMsrpUSD.toLocaleString()}
                </span>

                <NeoButton
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVehicleSelect(v);
                  }}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  iconPosition="right"
                >
                  {isSelected ? 'Selected ✓' : 'Select Model'}
                </NeoButton>
              </div>
            </NeoCard>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <FlowNavigationButtons
        onBack={handleBack}
        onContinue={handleContinue}
        continueDisabled={!activeVehicle}
        continueLabel="Continue to Vehicle Overview"
        backLabel="Back to Vehicle Type"
        contextText={activeVehicle ? `Selected: ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}` : undefined}
      />
    </PageContainer>
  );
};
