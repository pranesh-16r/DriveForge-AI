import React from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { BuildFlowProgress } from '../components/discovery/BuildFlowProgress';
import { VEHICLES, ExtendedVehicle } from '../data/vehicles';
import {
  Car,
  Box,
  Wrench,
  Zap,
  ArrowLeft,
  Check,
  ShieldCheck,
  Cpu,
  Gauge,
  Weight,
  Disc,
  Flame,
  ArrowRight
} from 'lucide-react';

export const VehicleDetailPage: React.FC = () => {
  const { activeVehicle, setActiveVehicle, navigateTo, currentPath, selectedRegion, selectedCountry } = useApp();

  // Find vehicle from path or fallback to activeVehicle
  const vehicleIdFromPath = currentPath.split('/vehicles/')[1];
  const vehicle = (VEHICLES.find(v => v.id === vehicleIdFromPath) || activeVehicle) as ExtendedVehicle;
  const isSelected = activeVehicle.id === vehicle.id;

  const handleEnterGarage = () => {
    setActiveVehicle(vehicle);
    navigateTo('/garage');
  };

  const handleBackToVehicles = () => {
    navigateTo('/vehicles');
  };

  const handleComposeBuild = () => {
    setActiveVehicle(vehicle);
    navigateTo('/build');
  };

  return (
    <PageContainer
      eyebrow="STEP 06 • PLATFORM REVEAL"
      title={`${vehicle.year} ${vehicle.make} ${vehicle.name || vehicle.model}`}
      subtitle={`${vehicle.variant || vehicle.trim} • Generation ${vehicle.generation} • Chassis ${vehicle.chassisCode}`}
      action={
        <NeoButton
          variant="outline"
          size="sm"
          onClick={handleBackToVehicles}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Vehicles
        </NeoButton>
      }
    >
      {/* Global Build Progress Stepper */}
      <BuildFlowProgress currentStep="vehicle" />

      <div className="space-y-8">
        
        {/* ================= HERO REVEAL CARD ================= */}
        <div className="relative rounded-[28px] overflow-hidden neo-panel border border-white/10 group">
          {/* Main Visual */}
          <div className="relative h-80 sm:h-[420px] md:h-[480px] w-full bg-[#0D0F12] overflow-hidden">
            <img
              src={vehicle.heroImage || vehicle.image || vehicle.imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-102 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121417] via-transparent to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#121417]/80 via-transparent to-transparent" />

            {/* Top Floating Badges */}
            <div className="absolute top-5 left-5 flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1.5 rounded-xl neo-inset bg-[#121417]/90 backdrop-blur-md text-xs font-mono font-bold text-white border border-white/10">
                CHASSIS: {vehicle.chassisCode}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl neo-inset bg-[#0070F3]/30 backdrop-blur-md text-xs font-mono font-bold text-[#0070F3] border border-[#0070F3]/50">
                OEM FACTORY CERTIFIED
              </span>
            </div>

            {/* Bottom In-Image Title & Details */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="space-y-1 text-left">
                <span className="text-xs font-mono font-bold text-[#0070F3] uppercase tracking-widest">
                  {vehicle.make} MOTORSPORT
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-white font-sans tracking-tight">
                  {vehicle.name || vehicle.model}
                </h1>
                <p className="text-sm font-mono text-gray-300">
                  {vehicle.variant || vehicle.trim} • MSRP ${vehicle.priceMsrpUSD.toLocaleString()}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0070F3] text-white text-xs font-mono font-bold shadow-xl shrink-0">
                <Check className="w-4 h-4" /> ACTIVE PLATFORM SPEC
              </div>
            </div>
          </div>
        </div>

        {/* ================= TECHNICAL SPECIFICATION GRID ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#171717] font-sans flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#28483D]" /> Factory Telemetry & Chassis Specifications
            </h2>
            <span className="text-xs font-mono text-[#55534E]">
              Direct CAD tolerance: <strong className="text-[#171717] font-bold">±0.5mm</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Engine */}
            <div className="p-4 rounded-2xl bg-[#E8E2D8] space-y-1.5 border border-[#292927]/12">
              <span className="text-[10px] font-mono text-[#55534E] uppercase font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#28483D]" /> ENGINE ARCHITECTURE
              </span>
              <p className="text-sm font-mono font-black text-[#171717] truncate" title={vehicle.engine}>
                {vehicle.engine}
              </p>
            </div>

            {/* Power */}
            <div className="p-4 rounded-2xl bg-[#E8E2D8] space-y-1.5 border border-[#292927]/12">
              <span className="text-[10px] font-mono text-[#55534E] uppercase font-bold flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#28483D]" /> BASELINE POWER
              </span>
              <p className="text-2xl font-mono font-black text-[#171717]">
                {vehicle.power || vehicle.baselinePowerHp} <span className="text-xs text-[#28483D] font-bold">HP</span>
              </p>
            </div>

            {/* Torque */}
            <div className="p-4 rounded-2xl bg-[#E8E2D8] space-y-1.5 border border-[#292927]/12">
              <span className="text-[10px] font-mono text-[#55534E] uppercase font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#28483D]" /> BASELINE TORQUE
              </span>
              <p className="text-2xl font-mono font-black text-[#171717]">
                {vehicle.torque || vehicle.baselineTorqueLbFt} <span className="text-xs text-[#28483D] font-bold">LB-FT</span>
              </p>
            </div>

            {/* Transmission */}
            <div className="p-4 rounded-2xl bg-[#E8E2D8] space-y-1.5 border border-[#292927]/12">
              <span className="text-[10px] font-mono text-[#55534E] uppercase font-bold flex items-center gap-1.5">
                <Disc className="w-3.5 h-3.5 text-[#28483D]" /> TRANSMISSION
              </span>
              <p className="text-sm font-mono font-black text-[#171717] truncate" title={vehicle.transmission}>
                {vehicle.transmission}
              </p>
            </div>

            {/* Drivetrain */}
            <div className="p-4 rounded-2xl bg-[#E8E2D8] space-y-1.5 border border-[#292927]/12">
              <span className="text-[10px] font-mono text-[#55534E] uppercase font-bold">DRIVETRAIN</span>
              <p className="text-xl font-mono font-black text-[#171717]">
                {vehicle.drivetrain}
              </p>
            </div>

            {/* Weight */}
            <div className="p-4 rounded-2xl bg-[#E8E2D8] space-y-1.5 border border-[#292927]/12">
              <span className="text-[10px] font-mono text-[#55534E] uppercase font-bold flex items-center gap-1.5">
                <Weight className="w-3.5 h-3.5 text-[#28483D]" /> CURB WEIGHT
              </span>
              <p className="text-xl font-mono font-black text-[#171717]">
                {vehicle.weight || vehicle.weightKg} <span className="text-xs text-[#28483D] font-bold">KG</span>
              </p>
            </div>

            {/* Fuel Type */}
            <div className="p-4 rounded-2xl bg-[#E8E2D8] space-y-1.5 border border-[#292927]/12">
              <span className="text-[10px] font-mono text-[#55534E] uppercase font-bold">POWERTRAIN FUEL</span>
              <p className="text-xl font-mono font-black text-[#171717]">
                {vehicle.fuelType || 'Gasoline'}
              </p>
            </div>

            {/* Regional Context */}
            <div className="p-4 rounded-2xl bg-[#E8E2D8] space-y-1.5 border border-[#292927]/12">
              <span className="text-[10px] font-mono text-[#55534E] uppercase font-bold">LOCATION HOMOLOGATION</span>
              <p className="text-xs font-mono font-black text-[#1C6E42] truncate">
                {selectedCountry ? `${selectedCountry.name} (${selectedRegion?.name || 'All Zones'})` : 'Global Homologation'}
              </p>
            </div>
          </div>
        </div>

        {/* Platform Summary Narrative */}
        <div className="p-5 rounded-2xl space-y-2 bg-[#E8E2D8] border border-[#292927]/12">
          <span className="text-xs font-mono font-black text-[#28483D] uppercase tracking-wider">
            FACTORY ARCHITECTURE SUMMARY
          </span>
          <p className="text-sm text-[#383835] leading-relaxed font-sans font-medium">
            {vehicle.description}
          </p>
        </div>

        {/* ================= PRIMARY CTA ACTIONS ================= */}
        <div className="pt-4 border-t border-[#292927]/12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <NeoButton
              variant="outline"
              size="lg"
              onClick={handleBackToVehicles}
              icon={<ArrowLeft className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              BACK TO VEHICLES
            </NeoButton>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <NeoButton
              variant="raised"
              size="lg"
              onClick={handleComposeBuild}
              icon={<Wrench className="w-5 h-5 text-[#0070F3]" />}
              className="w-full sm:w-auto"
            >
              COMPOSE BUILD
            </NeoButton>

            <NeoButton
              variant="primary"
              size="lg"
              onClick={handleEnterGarage}
              icon={<Box className="w-5 h-5" />}
              iconPosition="right"
              className="w-full sm:w-auto min-w-[200px]"
            >
              ENTER GARAGE →
            </NeoButton>
          </div>
        </div>

      </div>
    </PageContainer>
  );
};
