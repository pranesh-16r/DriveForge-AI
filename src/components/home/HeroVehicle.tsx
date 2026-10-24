import React from 'react';
import { motion } from 'motion/react';
import { Activity, Gauge, Wind, ShieldAlert, Cpu } from 'lucide-react';
import { Vehicle } from '../../types';

export interface HeroVehicleProps {
  vehicle?: Vehicle;
  onVehicleClick?: () => void;
  className?: string;
  is3DAvailable?: boolean;
}

export const HeroVehicle: React.FC<HeroVehicleProps> = ({
  vehicle,
  onVehicleClick,
  className = '',
}) => {
  // Default to Porsche 911 GT3 RS if not passed
  const activeName = vehicle ? `${vehicle.make} ${vehicle.model}` : 'Porsche 911 GT3 RS';
  const chassis = vehicle?.chassisCode || '992.1';
  const engine = vehicle?.engine || '4.0L Naturally Aspirated Flat-6';
  const hp = vehicle?.baselinePowerHp || 518;
  const torque = vehicle?.baselineTorqueLbFt || 342;
  const weight = vehicle?.weightKg || 1450;
  const image = vehicle?.imageUrl || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1600&q=85';

  return (
    <div className={`relative w-full max-w-5xl mx-auto ${className}`}>
      
      {/* Background Lighting & Platform Ground Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-radial from-[#0070F3]/20 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Vehicle Framing Stage */}
      <div className="relative rounded-3xl neo-panel border border-white/10 p-4 sm:p-7 overflow-hidden">
        
        {/* Subtle Engineering Grid Backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F232B_1px,transparent_1px),linear-gradient(to_bottom,#1F232B_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-30 pointer-events-none" />

        {/* Top HUD Telemetry Banner */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#0070F3] animate-pulse" />
            <span className="text-gray-300 font-bold uppercase tracking-wider">{activeName}</span>
            <span className="px-2 py-0.5 rounded bg-[#111316] text-[#0070F3] text-[10px] border border-[#0070F3]/30">
              CHASSIS {chassis}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-[#0070F3]" />
              ACTIVE SIMULATION BENCH
            </span>
            <span className="hidden sm:inline text-gray-600">|</span>
            <span className="hidden sm:inline text-gray-400">TOLERANCE 0.05mm</span>
          </div>
        </div>

        {/* Hero Vehicle Visual Canvas */}
        <div 
          onClick={onVehicleClick}
          className="relative my-4 sm:my-6 rounded-2xl overflow-hidden cursor-pointer group"
        >
          <div className="aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-2xl bg-[#111316]">
            <img
              src={image}
              alt={activeName}
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out filter contrast-110 brightness-95"
              loading="eager"
            />
          </div>

          {/* Vignette Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14161A] via-transparent to-transparent opacity-80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14161A]/60 via-transparent to-[#14161A]/60 pointer-events-none" />

          {/* Floating Telemetry Callout (Left) */}
          <div className="absolute bottom-4 left-4 z-10 hidden sm:flex flex-col gap-1.5 p-3 rounded-2xl neo-inset bg-[#111316]/90 backdrop-blur-md border border-white/10 shadow-lg">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Powertrain Spec</span>
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#0070F3]" />
              {engine}
            </span>
          </div>

          {/* Floating Telemetry Callout (Right) */}
          <div className="absolute bottom-4 right-4 z-10 hidden sm:flex flex-col gap-1.5 p-3 rounded-2xl neo-inset bg-[#111316]/90 backdrop-blur-md border border-white/10 shadow-lg text-right">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Aero & Chassis</span>
            <span className="text-xs font-mono font-bold text-white flex items-center justify-end gap-1.5">
              <Wind className="w-3.5 h-3.5 text-[#0070F3]" />
              Active DRS Wing System
            </span>
          </div>
        </div>

        {/* Bottom Hardware Telemetry HUD Strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
          <div className="p-3 rounded-2xl neo-inset bg-[#111316]/80 flex flex-col justify-center">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Engine Power</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black font-mono text-white">{hp}</span>
              <span className="text-xs font-mono text-[#0070F3]">BHP</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl neo-inset bg-[#111316]/80 flex flex-col justify-center">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Torque Peak</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black font-mono text-white">{torque}</span>
              <span className="text-xs font-mono text-[#0070F3]">LB-FT</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl neo-inset bg-[#111316]/80 flex flex-col justify-center">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Curb Weight</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black font-mono text-white">{weight}</span>
              <span className="text-xs font-mono text-[#0070F3]">KG</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl neo-inset bg-[#111316]/80 flex flex-col justify-center">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Weight Distribution</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black font-mono text-white">38:62</span>
              <span className="text-xs font-mono text-gray-400">FR/RR</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
