import React from 'react';
import { useApp } from '../../context/AppContext';
import { NeoButton } from '../ui/NeoButton';
import { X, Car, MapPin, Sliders, ChevronRight } from 'lucide-react';

export interface MobileNavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  mainNavItems: MobileNavItem[];
  secondaryNavItems: MobileNavItem[];
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  mainNavItems,
  secondaryNavItems,
}) => {
  const { navigateTo, activeVehicle, currentRegion } = useApp();

  if (!isOpen) return null;

  const handleNavigate = (path: string) => {
    navigateTo(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm h-full neo-panel border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto z-10 space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#2A2F38] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl neo-button-primary flex items-center justify-center font-black text-sm text-white font-mono">
              DF
            </div>
            <div>
              <p className="text-base font-black text-white font-sans tracking-tight">DRIVEFORGE AI</p>
              <p className="text-[10px] text-gray-400 font-mono">ENGINEERING SYSTEM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl neo-inset text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Vehicle & Region Quick Card */}
        <div className="neo-inset p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-400 uppercase">ACTIVE VEHICLE</span>
            <button
              onClick={() => handleNavigate('/vehicles')}
              className="text-xs font-mono text-[#0070F3] hover:underline flex items-center gap-1"
            >
              Change <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-sm font-bold text-white font-sans flex items-center gap-2">
            <Car className="w-4 h-4 text-[#0070F3]" />
            {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
          </p>
        </div>

        {/* Primary Links */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
            CORE PLATFORM
          </p>
          {mainNavItems.map(item => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="w-full flex items-center justify-between p-3 rounded-2xl neo-raised hover:neo-raised-active text-left transition-all text-sm font-semibold text-gray-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#0070F3]">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 bg-[#0070F3] text-white text-xs font-mono rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Secondary Links */}
        <div className="space-y-1">
          <p className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
            ANALYSIS & SYSTEM
          </p>
          {secondaryNavItems.map(item => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left text-xs font-medium text-gray-300"
            >
              <span className="text-gray-400">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#2A2F38] space-y-3">
          <NeoButton
            variant="primary"
            fullWidth
            onClick={() => handleNavigate('/login')}
          >
            Sign In / Register
          </NeoButton>
          <div className="flex justify-between items-center text-xs font-mono text-gray-400 px-1">
            <span>REGION: {currentRegion.code}</span>
            <span>SYSTEM v1.0</span>
          </div>
        </div>

      </div>
    </div>
  );
};
