import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { authService } from '../services/auth';
import { lsAudio } from '../utils/lsAudio';
import { toast } from 'sonner';
import {
  User,
  ShieldCheck,
  MapPin,
  Car,
  Wrench,
  Layers,
  Sparkles,
  Zap,
  Lock,
  LogOut,
  ArrowRight,
  Sliders,
  DollarSign,
  Volume2,
  VolumeX,
  FileText,
  BookmarkCheck,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    setCurrentUser,
    logoutUser,
    activeVehicle,
    selectedCountry,
    selectedRegion,
    experienceMode,
    setExperienceMode,
    buildComponents,
    buildState,
    totalBuildCostUSD,
    navigateTo
  } = useApp();

  const [soundEnabled, setSoundEnabled] = useState(lsAudio.enabled);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(currentUser?.name || 'Chief Engineer');

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    lsAudio.enabled = next;
    if (next) lsAudio.playRatchet();
    toast.info(next ? 'GTA Mechanic Sound FX Enabled' : 'Sound FX Muted');
  };

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    if (currentUser) {
      const updated = { ...currentUser, name: newName.trim() };
      setCurrentUser(updated);
      try {
        localStorage.setItem('driveforge_auth_user', JSON.stringify(updated));
      } catch {}
      setEditingName(false);
      toast.success('Driver callsign updated successfully!');
    }
  };

  const handleQuickSwitch = async (email: string, pass: string, name: string) => {
    lsAudio.playRatchet();
    const res = await authService.login({ email, password: pass, rememberMe: true });
    if (res.success && res.user) {
      setCurrentUser(res.user);
      lsAudio.playEngineRev();
      toast.success(`Switched active profile to ${name}!`);
    }
  };

  const handleLogout = () => {
    logoutUser();
    lsAudio.playRatchet();
    toast.success('Logged out successfully. Workshop doors locked.');
    navigateTo('/login');
  };

  return (
    <PageContainer
      eyebrow="DRIVER & MECHANIC TERMINAL"
      title="Driver Profile & Workshop Credentials"
      subtitle="Manage your personal garage allocation, active vehicle platform, regional labor rates, and physical build records."
    >
      <div className="space-y-8">
        
        {/* TOP SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Driver Identity Card */}
          <NeoCard variant="panel" radius="28" className="p-6 space-y-5 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFB800] text-black font-black text-lg flex items-center justify-center font-mono shadow-md shadow-[#FFB800]/20">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'D'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                    {currentUser?.name || 'Guest Driver'}
                  </h3>
                  <p className="text-xs font-mono text-[#FFB800]">
                    {currentUser?.email || 'guest@driveforge.com'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#FFB800]/15 text-[#FFB800] px-2.5 py-1 rounded-full border border-[#FFB800]/30">
                BAY 04
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Account Type:</span>
                <span className="text-white font-bold uppercase">{currentUser?.role || 'Guest Mechanic'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Security Accreditation:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> DMV Level 4
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Chop Shop Access:</span>
                <span className="text-white font-bold">24/7 San Andreas</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              {editingName ? (
                <form onSubmit={handleUpdateName} className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="flex-1 bg-[#121417] border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#FFB800]"
                    placeholder="Enter callsign"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#FFB800] text-black font-mono font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingName(false)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingName(true)}
                  className="text-xs font-mono text-[#FFB800] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Wrench className="w-3.5 h-3.5" /> Edit Callsign
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-mono text-red-400 hover:text-red-300 hover:underline cursor-pointer flex items-center gap-1 ml-auto"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </NeoCard>

          {/* 2. Active Vehicle Platform */}
          <NeoCard variant="panel" radius="28" className="p-6 space-y-5 border border-white/10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-[#FFB800]" />
                  <h3 className="text-sm font-bold font-mono text-white uppercase">
                    Assigned Vehicle Platform
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  {activeVehicle.year} MODEL
                </span>
              </div>

              <div>
                <h4 className="text-lg font-black text-white font-sans uppercase">
                  {activeVehicle.make} {activeVehicle.model}
                </h4>
                <p className="text-xs font-mono text-gray-400 mt-0.5">
                  Trim: {activeVehicle.trim} • {activeVehicle.drivetrain} • {activeVehicle.engine}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-gray-400 block uppercase">Stock Power</span>
                  <span className="font-bold text-white">{activeVehicle.baselinePowerHp} HP</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-gray-400 block uppercase">Curb Weight</span>
                  <span className="font-bold text-white">{activeVehicle.weightKg} kg</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('/garage')}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>View in 3D Garage Showroom</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </NeoCard>

          {/* 3. Regional Labor & Currency */}
          <NeoCard variant="panel" radius="28" className="p-6 space-y-5 border border-white/10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold font-mono text-white uppercase">
                    Regional Tuning Zone
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {selectedRegion?.currency || 'USD'} ({selectedRegion?.currencySymbol || '$'})
                </span>
              </div>

              <div>
                <h4 className="text-lg font-black text-white font-sans uppercase">
                  {selectedRegion?.name || 'California (US-CA)'}
                </h4>
                <p className="text-xs font-mono text-gray-400 mt-0.5">
                  Country: {selectedCountry?.name || 'United States'}
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Labor Hourly Rate:</span>
                  <span className="text-white font-bold">
                    {selectedRegion?.currencySymbol}{selectedRegion?.avgHourlyLaborRateUSD || 195} / hr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping Multiplier:</span>
                  <span className="text-white font-bold">
                    {selectedRegion?.shippingMultiplier ? `${selectedRegion.shippingMultiplier}x` : '1.0x'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('/location')}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Change Region / Currency</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </NeoCard>

        </div>

        {/* SECTION 2: PHYSICAL BUILD OVERVIEW & QUICK ACTIONS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#16191F] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[#FFB800] text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4" />
                <span>Active Physical Build Spec</span>
              </div>
              <h3 className="text-2xl font-black text-white uppercase font-sans tracking-tight">
                {buildState?.buildName || 'Street Spec Build'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                {buildComponents.length} COMPONENTS INSTALLED
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/30 text-xs font-mono font-bold">
                EST: ${totalBuildCostUSD.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => navigateTo('/build')}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer group"
            >
              <Wrench className="w-5 h-5 text-[#FFB800] mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-white font-sans uppercase">Modify Build</p>
              <p className="text-[10px] font-mono text-gray-400 mt-0.5">Add & remove components</p>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/build/analysis')}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer group"
            >
              <Zap className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-white font-sans uppercase">Build Analysis</p>
              <p className="text-[10px] font-mono text-gray-400 mt-0.5">Dyno & compatibility check</p>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/reports')}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer group"
            >
              <FileText className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-white font-sans uppercase">Build Report</p>
              <p className="text-[10px] font-mono text-gray-400 mt-0.5">Generate printable PDF</p>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/vault')}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer group"
            >
              <BookmarkCheck className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-white font-sans uppercase">Build Vault</p>
              <p className="text-[10px] font-mono text-gray-400 mt-0.5">Saved project archives</p>
            </button>
          </div>
        </div>

        {/* SECTION 3: QUICK PROFILE SWITCHER & AUDIO PREFERENCES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Quick Profile Switcher */}
          <NeoCard variant="panel" radius="28" className="p-6 space-y-4 border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                <User className="w-4 h-4 text-[#FFB800]" />
                <span>Switch Driver Profile (1-Click)</span>
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleQuickSwitch('franklin@ls-customs.sa', 'tunerpass123', 'Franklin Clinton')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer"
              >
                <p className="font-bold text-white text-xs truncate">Franklin C.</p>
                <p className="text-[10px] text-gray-400">Street Tuner</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSwitch('hao@ls-customs.sa', 'mastertech77', 'Hao')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer"
              >
                <p className="font-bold text-[#FFB800] text-xs truncate">Hao Tech</p>
                <p className="text-[10px] text-gray-400">Master Mech</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSwitch('guest@driveforge.com', 'driver2026', 'Guest Driver')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer"
              >
                <p className="font-bold text-cyan-400 text-xs truncate">Guest Rig</p>
                <p className="text-[10px] text-gray-400">Test Driver</p>
              </button>
            </div>
          </NeoCard>

          {/* Preferences & Experience Mode */}
          <NeoCard variant="panel" radius="28" className="p-6 space-y-4 border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Workshop Preferences</span>
              </h4>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {/* Experience Mode Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <p className="font-bold text-white uppercase">Experience Mode</p>
                  <p className="text-[10px] text-gray-400">
                    {experienceMode === 'beginner' ? 'Simple explanations & guided advice' : 'Deep technical engineering specs'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = experienceMode === 'beginner' ? 'enthusiast' : 'beginner';
                    setExperienceMode(next);
                    toast.success(`Switched to ${next.toUpperCase()} Mode`);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-colors cursor-pointer ${
                    experienceMode === 'enthusiast' ? 'bg-[#0070F3] text-white' : 'bg-[#FFB800] text-black'
                  }`}
                >
                  {experienceMode.toUpperCase()}
                </button>
              </div>

              {/* Sound Effects Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <p className="font-bold text-white uppercase">Mechanic Sound Synthesizer</p>
                  <p className="text-[10px] text-gray-400">Pneumatic wrench, spray paint & turbo flutter</p>
                </div>
                <button
                  type="button"
                  onClick={toggleSound}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    soundEnabled ? 'bg-[#FFB800] text-black' : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </NeoCard>

        </div>

      </div>
    </PageContainer>
  );
};
