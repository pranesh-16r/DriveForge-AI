import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/auth';
import { lsAudio } from '../../utils/lsAudio';
import { VEHICLES } from '../../data/vehicles';
import { toast } from 'sonner';
import {
  Wrench,
  Gauge,
  Shield,
  Zap,
  Sparkles,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Volume2,
  VolumeX,
  Lock,
  Mail,
  User,
  ArrowRight,
  Flame,
  Layers,
  Cpu,
  Sliders,
  DollarSign,
  HelpCircle,
  Car,
  Star,
  ShieldCheck,
  Disc
} from 'lucide-react';

interface LSCustomsLandingGateProps {
  onEnterWorkshop: () => void;
}

export const LSCustomsLandingGate: React.FC<LSCustomsLandingGateProps> = ({ onEnterWorkshop }) => {
  const {
    activeVehicle,
    setActiveVehicle,
    setCurrentUser,
    isAuthenticated,
    currentUser,
    navigateTo
  } = useApp();

  // Login form state
  const [email, setEmail] = useState('franklin@ls-customs.sa');
  const [password, setPassword] = useState('tunerpass123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);

  // Live GTA 5 Tuning Bay Interactive Demo State
  const [carColor, setCarColor] = useState<string>('#0070F3');
  const [carColorName, setCarColorName] = useState<string>('Ultra Blue Metallic');
  const [neonColor, setNeonColor] = useState<string>('#00E5FF');
  const [neonColorName, setNeonColorName] = useState<string>('Electric Cyan');
  const [stanceLevel, setStanceLevel] = useState<'stock' | 'street' | 'slammed'>('street');
  const [hasTurbo, setHasTurbo] = useState<boolean>(true);
  const [armorLevel, setArmorLevel] = useState<number>(80);
  const [wheelStyle, setWheelStyle] = useState<string>('Tuner Deep-Dish');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('burton');

  // GTA V Stat Bar calculation
  const stats = {
    topSpeed: hasTurbo ? 94 : 82,
    acceleration: hasTurbo ? 96 : 76,
    braking: 88,
    traction: stanceLevel === 'slammed' ? 95 : stanceLevel === 'street' ? 89 : 80
  };

  const handleToggleSound = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    lsAudio.enabled = next;
    if (next) lsAudio.playRatchet();
  };

  // Quick preset login credential selector
  const handleQuickCredential = (presetEmail: string, presetPass: string, presetName: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    if (sfxEnabled) lsAudio.playRatchet();
    toast.info(`Loaded ${presetName} credentials! Click 'Enter Custom Bay'`);
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (sfxEnabled) lsAudio.playRatchet();

    try {
      const res = await authService.login({
        email,
        password,
        rememberMe
      });

      if (res.success && res.user) {
        setCurrentUser(res.user);
        if (sfxEnabled) {
          lsAudio.playEngineRev();
        }
        toast.success(`Welcome to Los Santos Customs, ${res.user.name}!`, {
          description: 'Workshop Bay 04 assigned. Rolling onto hydraulic lift...'
        });
        setTimeout(() => {
          setIsSubmitting(false);
          onEnterWorkshop();
        }, 600);
      } else {
        setIsSubmitting(false);
        toast.error(res.error || 'Authentication failed');
      }
    } catch {
      setIsSubmitting(false);
      toast.error('Connection to Los Santos Social Club failed');
    }
  };

  const handleGuestEnter = () => {
    if (sfxEnabled) lsAudio.playEngineRev();
    toast.success('Entering as Guest Driver', {
      description: 'Full access to LS Customs tuning, dyno simulator, and vehicle catalog.'
    });
    onEnterWorkshop();
  };

  const handleColorChange = (hex: string, name: string) => {
    setCarColor(hex);
    setCarColorName(name);
    if (sfxEnabled) lsAudio.playSpray();
  };

  const handleNeonChange = (hex: string, name: string) => {
    setNeonColor(hex);
    setNeonColorName(name);
    if (sfxEnabled) lsAudio.playRatchet();
  };

  const handleStanceChange = (level: 'stock' | 'street' | 'slammed') => {
    setStanceLevel(level);
    if (sfxEnabled) lsAudio.playHydraulics();
  };

  const handleTurboToggle = () => {
    const next = !hasTurbo;
    setHasTurbo(next);
    if (next && sfxEnabled) {
      lsAudio.playTurboWhistle();
      toast.success('Turbo Tuning Active: +20% Acceleration Boost!');
    }
  };

  return (
    <div className="relative w-full overflow-hidden text-gray-100">
      
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      {/* ========================================================================= */}
      <div className="bg-[#FFB800] text-black px-4 py-2 text-xs font-mono font-black tracking-wider uppercase flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="bg-black text-[#FFB800] px-2 py-0.5 rounded text-[10px]">24/7 OPEN</span>
          <span className="truncate">
            ⚡ DRIVEFORGE AI // CUSTOMS WORKSHOP // 4 BAYS ACTIVE // STAGE 1-4 EMS TUNING // REAL-TIME DYNO // SAN ANDREAS
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <button
            type="button"
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 bg-black/15 hover:bg-black/25 px-2.5 py-0.5 rounded transition-colors cursor-pointer text-[11px]"
            title="Toggle mechanic sound effects"
          >
            {sfxEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>SFX: {sfxEnabled ? 'ON' : 'MUTED'}</span>
          </button>
          <span className="hidden sm:inline font-mono font-bold">SAN ANDREAS DMV CERTIFIED</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO GATEWAY: BOLD WORKSHOP SHOWCASE + LIVE DRIVER CREDENTIALS CARD */}
      {/* ========================================================================= */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        
        {/* Ambient Dark Neon Garage Backdrop */}
        <div className="absolute inset-0 bg-[#0E1013] -z-20" />
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 blur-3xl opacity-20 pointer-events-none -z-10 transition-colors duration-500"
          style={{ backgroundColor: neonColor }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,184,0,0.06),transparent_60%)] -z-10" />

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: PUNCHY BRANDING & VALUE PROP */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* DriveForge Customs Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono font-bold text-gray-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800] animate-pulse" />
              <span className="text-[#FFB800] tracking-widest uppercase">DRIVEFORGE AI</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">CUSTOMS WORKSHOP BAY 04</span>
            </div>

            {/* The Legendary Question */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-[-0.04em] font-sans leading-[0.98]">
                WHAT CAN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FFD066] to-white">BEST MECHANIC</span> IN LS DO FOR YOU?
              </h1>
              <p className="text-base sm:text-lg text-gray-400 font-sans leading-relaxed max-w-xl">
                Roll into the premiere GTA-style automotive customisation garage. Respray custom pearlescent coats, install high-boost twin turbos, slam track suspensions, mount neon underglow, and test dyno fitment with real engineering physics.
              </p>
            </div>

            {/* GTA V Live Stat Bars for Active Platform */}
            <div className="p-5 rounded-3xl bg-[#16191F]/90 border border-white/10 backdrop-blur-md space-y-3 max-w-xl shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#FFB800]" />
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    ACTIVE BAY SPEC: {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#FFB800] font-bold">
                  EMS LEVEL 4 READY
                </span>
              </div>

              {/* 4 Core GTA V HUD Stat Meters */}
              <div className="space-y-2.5 text-xs font-mono">
                {/* Top Speed */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-400 uppercase">Top Speed</span>
                    <span className="text-white font-bold tabular-nums">{stats.topSpeed} / 100 (205 MPH)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden flex">
                    <div className="bg-[#0070F3] h-full" style={{ width: `${stats.topSpeed}%` }} />
                  </div>
                </div>

                {/* Acceleration */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-400 uppercase">Acceleration</span>
                    <span className="text-emerald-400 font-bold tabular-nums flex items-center gap-1">
                      {stats.acceleration} / 100 {hasTurbo && <span className="text-[10px] text-emerald-400 font-black">+18% TURBO</span>}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: `${stats.acceleration}%` }} />
                  </div>
                </div>

                {/* Braking */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-400 uppercase">Braking</span>
                    <span className="text-white font-bold tabular-nums">{stats.braking} / 100 (Race Slotted)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden flex">
                    <div className="bg-[#FFB800] h-full" style={{ width: `${stats.braking}%` }} />
                  </div>
                </div>

                {/* Traction */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-400 uppercase">Traction</span>
                    <span className="text-white font-bold tabular-nums">{stats.traction} / 100 (Slammed Camber)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden flex">
                    <div className="bg-cyan-400 h-full" style={{ width: `${stats.traction}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Feature Strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400 pt-1">
              <span className="flex items-center gap-1.5 text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-[#FFB800]" />
                100% Street Legal & Track Modes
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-gray-300">
                <Shield className="w-4 h-4 text-emerald-400" />
                Bulletproof Tires & Armor Available
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-gray-300">
                <Zap className="w-4 h-4 text-[#00E5FF]" />
                Instant Sound & Neon Previews
              </span>
            </div>

          </div>

          {/* RIGHT: DRIVER ACCESS TERMINAL (LOGIN CREDENTIALS CARD) */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#181B20]/95 border border-white/15 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#FFB800]" />
                    <span className="text-xs font-mono font-bold uppercase text-[#FFB800] tracking-wider">
                      Driver & Mechanic Terminal
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-sans mt-0.5">
                    Enter DriveForge Workshop Bay
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 px-2 py-1 rounded">
                  BAY 04
                </span>
              </div>

              {/* Fast 1-Click Profile Pickers (As seen on premier software login gates) */}
              <div className="space-y-2 mb-5">
                <span className="text-[10px] font-mono text-gray-400 uppercase block tracking-wider">
                  Quick Access Profiles (1-Click Fill):
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => handleQuickCredential('franklin@ls-customs.sa', 'tunerpass123', 'Franklin Clinton')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer"
                  >
                    <p className="font-bold text-white text-[11px] truncate">Franklin C.</p>
                    <p className="text-[9px] text-gray-400">Street Racer</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickCredential('hao@ls-customs.sa', 'mastertech77', 'Hao')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer"
                  >
                    <p className="font-bold text-[#FFB800] text-[11px] truncate">Hao Tech</p>
                    <p className="text-[9px] text-gray-400">Master Mech</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickCredential('guest@driveforge.com', 'driver2026', 'Guest Driver')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer"
                  >
                    <p className="font-bold text-cyan-400 text-[11px] truncate">Guest Rig</p>
                    <p className="text-[9px] text-gray-400">Test Driver</p>
                  </button>
                </div>
              </div>

              {/* Credentials Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Email / ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 uppercase flex items-center justify-between">
                    <span>Driver Email / Social Club ID:</span>
                    <span className="text-[10px] text-gray-500">Required</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. franklin@ls-customs.sa"
                      className="w-full bg-[#121417] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>
                </div>

                {/* Password / Passkey */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-gray-300 uppercase">
                      Mechanic PIN / Passkey:
                    </label>
                    <button
                      type="button"
                      onClick={() => navigateTo('/forgot-password')}
                      className="text-[10px] font-mono text-[#FFB800] hover:underline"
                    >
                      Forgot PIN?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#121417] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>
                </div>

                {/* Remember Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded accent-[#FFB800] cursor-pointer"
                    />
                    <span>Remember my workshop bay</span>
                  </label>
                </div>

                {/* Primary Enter Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FFB800] via-[#FFA000] to-[#E69100] hover:brightness-110 text-black font-black font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FFB800]/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Opening Hydraulic Doors...</span>
                  ) : (
                    <>
                      <Wrench className="w-4 h-4" />
                      <span>Enter Custom Bay & Tune Vehicle</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Alternative Quick Entry as Guest */}
                <button
                  type="button"
                  onClick={handleGuestEnter}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Car className="w-3.5 h-3.5 text-gray-400" />
                  <span>Continue As Guest Mechanic (Instant Tour)</span>
                </button>

              </form>

              {/* Security Seal */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  San Andreas DMV Certified
                </span>
                <span>SECURE SSL 256-BIT</span>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE 3D/LIVE GTA V TUNING BAY (RESPLAY, NEONS, SLAM & TURBO) */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#FFB800] text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              <span>Interactive Workshop Rig</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
              LIVE CUSTOMISATION BENCH
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl font-sans">
              Test paint resprays, neon underglow colors, hydraulic stance levels, and turbo blow-off flutter right here on the hoist before ordering parts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-400">Vehicle Platform:</span>
            <select
              value={activeVehicle.id}
              onChange={e => {
                const found = VEHICLES.find(v => v.id === e.target.value);
                if (found) {
                  setActiveVehicle(found);
                  if (sfxEnabled) lsAudio.playRatchet();
                }
              }}
              className="bg-[#181B20] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FFB800]"
            >
              {VEHICLES.slice(0, 8).map(v => (
                <option key={v.id} value={v.id}>
                  {v.year} {v.make} {v.model}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Visual Stage with Car & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* CAR VIEWPORT (with real neon ground reflection & stance lowering) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#16191F] border border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[420px]">
            
            {/* Top Stage Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-gray-400 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-white font-bold uppercase">HOIST #01 // {activeVehicle.model}</span>
              </div>
              <span className="text-[#FFB800] uppercase font-bold">
                COLOR: {carColorName} • STANCE: {stanceLevel.toUpperCase()}
              </span>
            </div>

            {/* Centered Vehicle Display with Dynamic Neon Reflection */}
            <div className="relative py-8 flex flex-col items-center justify-center z-10 transition-all duration-300">
              
              {/* Neon Glow Beneath Car */}
              <div
                className="absolute bottom-6 w-3/4 h-16 rounded-full blur-2xl transition-all duration-300 opacity-80"
                style={{ backgroundColor: neonColor }}
              />

              {/* Vehicle Image with Hydraulic Stance Offset */}
              <div
                className="relative transition-transform duration-300 max-w-lg w-full flex items-center justify-center"
                style={{
                  transform: stanceLevel === 'slammed'
                    ? 'translateY(24px) scale(0.98)'
                    : stanceLevel === 'street'
                    ? 'translateY(10px)'
                    : 'translateY(0px)'
                }}
              >
                <img
                  src={activeVehicle.imageUrl}
                  alt={activeVehicle.model}
                  className="w-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                />

                {/* Respray Color Ambient Tint Overlay */}
                <div
                  className="absolute inset-0 mix-blend-color opacity-25 rounded-2xl pointer-events-none transition-colors duration-300"
                  style={{ backgroundColor: carColor }}
                />
              </div>

              {/* Ground Shadow & Neon Reflection Line */}
              <div
                className="w-3/5 h-2 rounded-full blur-sm mt-2 transition-all duration-300"
                style={{
                  backgroundColor: neonColor,
                  boxShadow: `0 0 25px 4px ${neonColor}`
                }}
              />
            </div>

            {/* Bottom Telemetry HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 z-10 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-gray-400 block uppercase">Projected Power</span>
                <span className="text-base font-bold text-white font-mono tabular-nums">
                  {hasTurbo ? activeVehicle.baselinePowerHp + 145 : activeVehicle.baselinePowerHp} HP
                </span>
                {hasTurbo && <span className="text-[10px] text-emerald-400 block">+145 HP Turbo</span>}
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-gray-400 block uppercase">0-60 MPH Sprint</span>
                <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
                  {hasTurbo ? '2.7 sec' : '3.6 sec'}
                </span>
                <span className="text-[10px] text-gray-400 block">Launch Control</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-gray-400 block uppercase">Ground Clearance</span>
                <span className="text-base font-bold text-white font-mono tabular-nums">
                  {stanceLevel === 'slammed' ? '45 mm' : stanceLevel === 'street' ? '75 mm' : '110 mm'}
                </span>
                <span className="text-[10px] text-cyan-400 block">Stance Kit</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-gray-400 block uppercase">Estimated Build</span>
                <span className="text-base font-bold text-[#FFB800] font-mono tabular-nums">
                  LS$ {hasTurbo ? '42,500' : '18,200'}
                </span>
                <span className="text-[10px] text-gray-400 block">Parts + Labor</span>
              </div>
            </div>

          </div>

          {/* TUNING CONTROLS PANEL */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-[#181B20] border border-white/10 space-y-6 flex flex-col justify-between">
            
            <div className="space-y-5">
              <h3 className="text-sm font-mono font-bold uppercase text-white tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Wrench className="w-4 h-4 text-[#FFB800]" />
                <span>Customisation Controls</span>
              </h3>

              {/* 1. Respray Color Palette */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-300 uppercase flex justify-between">
                  <span>Respray Paint Finish:</span>
                  <span className="text-[#FFB800] font-bold">{carColorName}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { name: 'Ultra Blue Metallic', hex: '#0070F3' },
                    { name: 'Midnight Purple Pearl', hex: '#8B5CF6' },
                    { name: 'Race Yellow Gloss', hex: '#EAB308' },
                    { name: 'Candy Apple Red', hex: '#EF4444' },
                    { name: 'Matte Obsidian', hex: '#1C1917' },
                    { name: 'Mint Pearl Lime', hex: '#10B981' },
                  ].map(c => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleColorChange(c.hex, c.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${carColor === c.hex ? 'scale-110 border-white shadow-lg' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* 2. Neon Underglow Kit */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-300 uppercase flex justify-between">
                  <span>Neon Underglow Kit:</span>
                  <span className="text-cyan-400 font-bold">{neonColorName}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { name: 'Electric Cyan', hex: '#00E5FF' },
                    { name: 'Acid Green', hex: '#39FF14' },
                    { name: 'Neon Purple', hex: '#D946EF' },
                    { name: 'Hot Amber', hex: '#F59E0B' },
                    { name: 'Pure Crimson', hex: '#FF0055' },
                    { name: 'Neon Off', hex: '#00000000' }
                  ].map(n => (
                    <button
                      key={n.name}
                      type="button"
                      onClick={() => handleNeonChange(n.hex, n.name)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${neonColor === n.hex ? 'border-[#FFB800] bg-[#FFB800]/20 text-white font-bold' : 'border-white/10 bg-black/30 text-gray-400 hover:text-white'}`}
                    >
                      {n.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Hydraulic Stance / Suspension Slam */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-300 uppercase flex justify-between">
                  <span>Suspension Stance:</span>
                  <span className="text-white font-bold uppercase">{stanceLevel}</span>
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {(['stock', 'street', 'slammed'] as const).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleStanceChange(level)}
                      className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${stanceLevel === level ? 'bg-[#FFB800] border-[#FFB800] text-black font-bold shadow' : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'}`}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Turbocharger Boost Toggle */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>Turbo Tuning (EMS Stage 3)</span>
                  </p>
                  <p className="text-[10px] font-mono text-gray-400 mt-0.5">
                    Blow-off valve flutter & +20% power
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTurboToggle}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${hasTurbo ? 'bg-emerald-500 text-black shadow-md' : 'bg-white/10 text-gray-400'}`}
                >
                  {hasTurbo ? 'INSTALLED' : 'STOCK'}
                </button>
              </div>

            </div>

            {/* Launch Full Customizer Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onEnterWorkshop}
                className="w-full py-3.5 rounded-2xl bg-[#FFB800] hover:bg-[#FFA000] text-black font-black text-xs font-sans uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FFB800]/20 transition-all cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>Open Full Customisation Bay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. THE GTA 5 CUSTOMISATION MENU (THE 8 CORE WORKSHOP UPGRADES) */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 border-t border-white/10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FFB800] uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Los Santos Customs Catalog</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-sans">
            LEGENDARY CUSTOMISATION CATEGORIES
          </h2>
          <p className="text-sm text-gray-400 font-sans">
            Every category from GTA 5 — meticulously simulated with authentic engineering specifications, dyno predictions, and certified mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Engine & EMS Tuning',
              subtitle: 'EMS Level 1 to 4 Race Tune',
              desc: 'High-lift camshafts, blueprinted pistons, forged connecting rods, and ECU timing maps.',
              icon: <Cpu className="w-5 h-5 text-[#FFB800]" />,
              price: 'from LS$ 4,500'
            },
            {
              title: 'Turbocharger Systems',
              subtitle: 'Ball-Bearing Twin-Scroll',
              desc: 'Garrett twin-scroll turbo kits, high-flow front intercoolers, and wastegate flutter blow-off valves.',
              icon: <Flame className="w-5 h-5 text-emerald-400" />,
              price: 'from LS$ 12,500'
            },
            {
              title: 'Respray & Liveries',
              subtitle: 'Pearlescent & Matte Flips',
              desc: 'Custom chamber paint booth with chameleon coats, racing liveries, decals, and ceramic protection.',
              icon: <Sparkles className="w-5 h-5 text-purple-400" />,
              price: 'from LS$ 3,200'
            },
            {
              title: 'Hydraulics & Stance',
              subtitle: 'Competition Slammed Coilovers',
              desc: 'Airbag hydraulic suspension, adjustable camber plates, and track sway bar stiffness.',
              icon: <Layers className="w-5 h-5 text-cyan-400" />,
              price: 'from LS$ 6,800'
            },
            {
              title: 'Exhaust & Anti-Lag',
              subtitle: 'Titanium Straight Pipes',
              desc: 'High-flow titanium exhaust with deceleration pop-and-bang flame map tuning.',
              icon: <Zap className="w-5 h-5 text-amber-400" />,
              price: 'from LS$ 4,200'
            },
            {
              title: 'Wheels & Custom Tires',
              subtitle: 'Tuner, Muscle & Smoke',
              desc: 'Forged modular rims, tire lettering decals, bulletproof reinforcement, and colored burnout smoke.',
              icon: <Disc className="w-5 h-5 text-rose-400" />,
              price: 'from LS$ 5,500'
            },
            {
              title: 'Armor & Roll Cages',
              subtitle: '100% Bulletproof Reinforcement',
              desc: 'Chassis bracing, FIA 6-point weld-in roll cages, and high-tensile crash reinforcement.',
              icon: <Shield className="w-5 h-5 text-blue-400" />,
              price: 'from LS$ 15,000'
            },
            {
              title: 'Neons & Xenon Kits',
              subtitle: '360° Underglow & 8000K Lights',
              desc: 'Pulse and solid neon tubes mounted to front, sides, and rear bumpers with cockpit controller.',
              icon: <Star className="w-5 h-5 text-yellow-300" />,
              price: 'from LS$ 2,800'
            },
          ].map((cat, idx) => (
            <div
              key={cat.title}
              onClick={onEnterWorkshop}
              className="p-5 rounded-3xl bg-[#16191F] border border-white/10 hover:border-[#FFB800]/50 transition-all duration-300 space-y-3 cursor-pointer group hover:-translate-y-1 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-[#FFB800]/10 transition-colors">
                  {cat.icon}
                </div>
                <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">
                  CAT #{String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white font-sans group-hover:text-[#FFB800] transition-colors">
                  {cat.title}
                </h4>
                <p className="text-[11px] font-mono text-[#FFB800] font-semibold mt-0.5">
                  {cat.subtitle}
                </p>
                <p className="text-xs text-gray-400 mt-2 font-sans leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">{cat.price}</span>
                <span className="text-[#FFB800] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Upgrade <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. THE 4 SAN ANDREAS WORKSHOP LOCATIONS (BURTON, LSIA, LA MESA, DESERT) */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 border-t border-white/10">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-[#FFB800] uppercase tracking-wider mb-1">
              San Andreas Territory
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
              4 CERTIFIED GARAGE LOCATIONS
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-sans">
              Drive straight into any official Los Santos Customs workshop for instant hydraulic hoist service.
            </p>
          </div>

          <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            ALL 4 WORKSHOPS OPERATIONAL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'burton',
              name: 'Burton Central Bay',
              address: 'Hawick Ave & Meteor St, Burton',
              specialty: 'Supercars & High-End Imports',
              leadMechanic: 'Hao (Head Tech)',
              bays: 4,
              wait: '0 MIN'
            },
            {
              id: 'lsia',
              name: 'LSIA Airport Hangar',
              address: 'Exceptionalists Way, Airport Plaza',
              specialty: 'Drag Racing & Top Speed Dyno',
              leadMechanic: 'Dmitri (EMS Tuner)',
              bays: 6,
              wait: '0 MIN'
            },
            {
              id: 'lamesa',
              name: 'La Mesa Chop Shop',
              address: 'Popular St, Industrial Canal',
              specialty: 'Muscle Cars & Widebody Swaps',
              leadMechanic: 'Big Lou (Chassis Fab)',
              bays: 4,
              wait: '5 MIN'
            },
            {
              id: 'desert',
              name: 'Grand Senora Desert',
              address: 'Route 68, Near Sandy Shores',
              specialty: 'Trophy Trucks, 4x4s & Buggies',
              leadMechanic: 'Cletus (Off-Road Tech)',
              bays: 3,
              wait: '0 MIN'
            },
          ].map(loc => {
            const isSelected = selectedLocation === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => setSelectedLocation(loc.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${isSelected ? 'bg-[#FFB800]/10 border-[#FFB800] shadow-lg' : 'bg-[#16191F] border-white/10 hover:border-white/20'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 font-bold">
                    {loc.bays} HOIST BAYS
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {loc.wait} WAIT
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white font-sans">{loc.name}</h4>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">{loc.address}</p>
                </div>

                <div className="space-y-1 text-xs font-mono border-t border-white/5 pt-2">
                  <p className="text-[#FFB800] font-semibold">{loc.specialty}</p>
                  <p className="text-gray-400 text-[11px]">Lead: {loc.leadMechanic}</p>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 6. SOCIAL CLUB REVIEWS & TESTIMONIALS (FRANKLIN, LAMAR, BENNY, HAO) */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 border-t border-white/10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono font-bold text-[#FFB800] uppercase tracking-wider">
            Verified San Andreas Drivers
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
            SOCIAL CLUB MECHANIC REVIEWS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              author: 'Franklin Clinton',
              role: 'Street Racer & Agency Principal',
              location: 'Vinewood Hills',
              quote: 'Hao and the boys at LS Customs transformed my Bravado Buffalo STX into an unstoppable rocket. Nobody touches my transmission or turbos except this shop.',
              car: 'Buffalo STX · EMS Level 4'
            },
            {
              author: 'Lamar Davis',
              role: 'LD Organics & Street Hustler',
              location: 'Chamberlain Hills',
              quote: 'Man, that custom pearlescent midnight purple respray with the gold underglow got the whole block turning heads! Best investment in South Central.',
              car: 'Albany Emperor · Custom Stance'
            },
            {
              author: 'Benny',
              role: "Benny's Original Motor Works",
              location: 'Strawberry',
              quote: 'Real respect to the crew at Los Santos Customs. When customers need certified dyno tuning, forged engine internals, or track aero, we send them to LS Customs.',
              car: 'Sultan RS · Widebody Spec'
            }
          ].map(rev => (
            <div
              key={rev.author}
              className="p-6 rounded-3xl bg-[#16191F] border border-white/10 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#FFB800]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 font-sans italic leading-relaxed">
                  "{rev.quote}"
                </p>
              </div>

              <div className="border-t border-white/5 pt-3">
                <p className="text-sm font-bold text-white font-sans">{rev.author}</p>
                <p className="text-xs text-gray-400 font-sans">{rev.role} • {rev.location}</p>
                <p className="text-[11px] font-mono text-[#FFB800] font-semibold mt-1">
                  Build: {rev.car}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 7. PRICING & SERVICE TIERS (IN LOS SANTOS DOLLARS LS$) */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 border-t border-white/10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono font-bold text-[#FFB800] uppercase tracking-wider">
            All-Inclusive Tuning Packages
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
            WORKSHOP UPGRADE TIERS
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-sans">
            Guaranteed parts and labor pricing. All work verified on our all-wheel-drive dyno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              tier: 'Street Spec',
              price: 'LS$ 7,500',
              badge: 'Entry Level',
              features: ['EMS Stage 1 ECU Remap', 'Sport Exhaust Tips', 'Window Tint (Light Smoke)', 'San Andreas Safety Inspection']
            },
            {
              tier: 'Sport Track',
              price: 'LS$ 28,000',
              badge: 'Most Popular',
              featured: true,
              features: ['EMS Stage 2 ECU + Camshafts', 'Lowered Stance Suspension', 'Full Titanium Dual Exhaust', 'High-Grip Tuner Wheels & Tires', 'Dyno Baseline Slip']
            },
            {
              tier: 'Pro Drag & Drift',
              price: 'LS$ 65,000',
              badge: 'Track Weapon',
              features: ['EMS Stage 3 + Twin-Turbos', 'Competition Slammed Suspension', 'Flame-Tune Anti-Lag Map', '360° Neon Underglow Kit', 'Race Clutch & Limited-Slip Diff']
            },
            {
              tier: 'Benny Super Custom',
              price: 'LS$ 145,000',
              badge: 'Ultimate Build',
              features: ['Full Blueprint Forged Internals', 'Dry Carbon Widebody Kit', '100% Armor & Bulletproof Glass', 'Bespoke Pearlescent Respray', 'Lifetime Dyno & Warranty']
            },
          ].map(pkg => (
            <div
              key={pkg.tier}
              className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${pkg.featured ? 'bg-[#FFB800]/10 border-[#FFB800] shadow-xl' : 'bg-[#16191F] border-white/10'}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${pkg.featured ? 'bg-[#FFB800] text-black' : 'bg-white/10 text-gray-300'}`}>
                    {pkg.badge}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-white font-sans">{pkg.tier}</h4>
                <div className="text-2xl font-black font-mono text-white tracking-tight">
                  {pkg.price}
                </div>

                <ul className="space-y-2 text-xs font-sans text-gray-300 pt-2 border-t border-white/5">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={onEnterWorkshop}
                className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${pkg.featured ? 'bg-[#FFB800] text-black hover:bg-[#FFA000]' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                Select Package
              </button>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 8. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 border-t border-white/10">
        
        <div className="text-center space-y-2">
          <div className="text-xs font-mono font-bold text-[#FFB800] uppercase tracking-wider">
            Mechanic Answers
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight font-sans">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Can I customize any vehicle class in San Andreas?',
              a: 'Yes! We tune supercars, sports imports, American muscle, track coupes, off-road trucks, and high-end SUVs. Everything from a Pfister Comet to a Bravado Gauntlet.'
            },
            {
              q: 'Are bulletproof tires and neon underglow street legal?',
              a: 'In the State of San Andreas, all LS Customs neon underglow kits and bulletproof tire upgrades comply with local motor vehicle code provisions.'
            },
            {
              q: 'How does the live dyno simulation work?',
              a: 'Our dyno calculator uses exact thermodynamic and mechanical formulas to predict horsepower, torque, fuel duty cycle, and turbo spool RPM based on real manufacturer specs.'
            },
            {
              q: 'Can I export my build as a certified blueprint?',
              a: 'Yes, every project can be saved to your Garage Vault and exported as a JSON blueprint, dyno slip, or workshop invoice.'
            },
            {
              q: 'What is the turnaround time for a Stage 3 Turbo upgrade?',
              a: 'Standard turbo bolt-on installs and dyno calibration take approximately 4 hours. You can track progress in real-time on your driver dashboard.'
            }
          ].map((item, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl bg-[#16191F] border border-white/10 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-sans font-bold text-sm text-white flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-[#FFB800]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs font-sans text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 9. VIP NEWSLETTER / CREW INVITE & FINAL CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1A1D24] via-[#14161B] to-black border border-[#FFB800]/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
          
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FFB800] uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>Ready to Tune?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-sans">
            YOUR HOIST BAY IS WAITING.
          </h2>

          <p className="text-sm text-gray-300 font-sans max-w-xl mx-auto leading-relaxed">
            Drive in now, select your dream vehicle, customize every component, and view your build in photorealistic 3D.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={onEnterWorkshop}
              className="px-8 py-4 rounded-2xl bg-[#FFB800] hover:bg-[#FFA000] text-black font-black text-sm uppercase font-sans tracking-wider flex items-center gap-2 shadow-xl shadow-[#FFB800]/25 transition-all cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
              <span>Enter Workshop Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/garage')}
              className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Browse 3D Showroom
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
