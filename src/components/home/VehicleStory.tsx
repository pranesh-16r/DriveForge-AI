import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FeatureSection } from './FeatureSection';
import { NeoCard } from '../ui/NeoCard';
import { NeoButton } from '../ui/NeoButton';
import { VEHICLES } from '../../data/vehicles';
import { Vehicle } from '../../types';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Gauge, Zap, Weight, Disc, Check } from 'lucide-react';

export const VehicleStory: React.FC = () => {
  const { setActiveVehicle, navigateTo } = useApp();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const vehicle = VEHICLES[selectedIdx];

  const handleSelectVehicle = (v: Vehicle) => {
    setActiveVehicle(v);
    navigateTo('/build');
  };

  return (
    <FeatureSection
      id="vehicles"
      stepNumber="02"
      category="OEM BASELINE PLATFORM"
      title="SELECT YOUR VEHICLE"
      subtitle="Start with the vehicle you actually own."
      description="DriveForge AI grounds every modification plan in certified factory chassis geometry, curb weight, engine thermodynamics, and manufacturer powertrain tolerances."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Interactive Vehicle Selector List */}
        <div className="lg:col-span-4 space-y-2.5">
          <p className="text-xs font-mono uppercase tracking-wider text-[#55534E] font-bold pl-1">
            Certified Manufacturer Platforms
          </p>

          <div className="space-y-2">
            {VEHICLES.map((v, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`
                    w-full text-left p-3.5 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between
                    ${isSelected 
                      ? 'border-2 border-[#171717] bg-white shadow-md ring-2 ring-[#171717]/10' 
                      : 'border border-[#292927]/12 bg-[#FAFAF7] hover:bg-white hover:border-[#171717]/30 shadow-xs'
                    }
                  `}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[#171717] font-sans">{v.make} {v.model}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#E8E2D8] text-[#171717] border border-[#292927]/15">
                        {v.chassisCode}
                      </span>
                    </div>
                    <p className="text-xs text-[#55534E] font-mono font-medium">{v.baselinePowerHp} HP • {v.drivetrain}</p>
                  </div>

                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-[#28483D] text-[#FAFAF7] flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Large Vehicle Showcase Visual & Specifications */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <NeoCard variant="panel" radius="28" className="p-5 sm:p-7 space-y-6 overflow-hidden border border-[#292927]/15 bg-[#FAFAF7]">
                
                {/* Vehicle Visual */}
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#0D0F12]">
                  <img
                    src={vehicle.imageUrl}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover object-center filter contrast-105 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14161A]/80 via-transparent to-transparent opacity-70" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#111316]/90 backdrop-blur text-xs font-mono font-bold text-white border border-white/10">
                      {vehicle.year} {vehicle.make}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#28483D]/90 backdrop-blur text-xs font-mono font-bold text-[#FAFAF7] border border-white/20">
                      OEM CERTIFIED
                    </span>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#E8E2D8] border border-[#292927]/12 space-y-1">
                    <span className="text-[10px] font-mono text-[#55534E] font-bold uppercase flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-[#28483D]" /> Baseline Power
                    </span>
                    <p className="text-xl font-mono font-black text-[#171717]">{vehicle.baselinePowerHp} <span className="text-xs text-[#28483D] font-bold">HP</span></p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#E8E2D8] border border-[#292927]/12 space-y-1">
                    <span className="text-[10px] font-mono text-[#55534E] font-bold uppercase flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#28483D]" /> Factory Torque
                    </span>
                    <p className="text-xl font-mono font-black text-[#171717]">{vehicle.baselineTorqueLbFt} <span className="text-xs text-[#28483D] font-bold">LB-FT</span></p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#E8E2D8] border border-[#292927]/12 space-y-1">
                    <span className="text-[10px] font-mono text-[#55534E] font-bold uppercase flex items-center gap-1">
                      <Weight className="w-3 h-3 text-[#28483D]" /> Curb Weight
                    </span>
                    <p className="text-xl font-mono font-black text-[#171717]">{vehicle.weightKg} <span className="text-xs text-[#28483D] font-bold">KG</span></p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#E8E2D8] border border-[#292927]/12 space-y-1">
                    <span className="text-[10px] font-mono text-[#55534E] font-bold uppercase flex items-center gap-1">
                      <Disc className="w-3 h-3 text-[#28483D]" /> Drivetrain
                    </span>
                    <p className="text-xl font-mono font-black text-[#171717]">{vehicle.drivetrain}</p>
                  </div>
                </div>

                {/* Engine Description & Action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-[#292927]/12">
                  <div className="space-y-0.5">
                    <p className="text-xs font-mono text-[#55534E] font-bold uppercase">Engine Architecture</p>
                    <p className="text-sm text-[#171717] font-sans font-bold">{vehicle.engine}</p>
                  </div>

                  <NeoButton
                    variant="primary"
                    size="md"
                    onClick={() => handleSelectVehicle(vehicle)}
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Select Platform for Build
                  </NeoButton>
                </div>

              </NeoCard>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </FeatureSection>
  );
};
