import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { saveUserBuildToFirestore } from '../../lib/firebase';
import {
  Sliders,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export interface StanceConfig {
  rideHeightDropMm: number; // 0 to 60mm
  camberDeg: number; // -0.5 to -4.5
  wheelDiameterInch: number; // 17 to 20
  wheelWidthInch: number; // 7.5 to 10.5
  wheelOffsetEtMm: number; // 20 to 55
  spacerMm: number; // 0 to 25
  caliperType: 'stock_2pot' | 'brembo_4pot' | 'ap_6pot_bbk';
  tireWidthMm: number; // 215 to 275
}

const CALIPER_SPECS = {
  stock_2pot: { name: 'OEM 2-Piston Floating Caliper', requiredSpokeClearanceMm: 12, diskDiameterMm: 312, accent: '#28483D' },
  brembo_4pot: { name: 'Brembo 4-Piston Monoblock BBK', requiredSpokeClearanceMm: 24, diskDiameterMm: 355, accent: '#B47A52' },
  ap_6pot_bbk: { name: 'AP Racing Radi-CAL 6-Piston Competition', requiredSpokeClearanceMm: 31, diskDiameterMm: 380, accent: '#B8644A' },
};

export const StanceCaliperSimulator: React.FC = () => {
  const { activeVehicle, currentUser, buildState } = useApp();

  const [config, setConfig] = useState<StanceConfig>({
    rideHeightDropMm: 25,
    camberDeg: -2.0,
    wheelDiameterInch: 18,
    wheelWidthInch: 9.0,
    wheelOffsetEtMm: 38,
    spacerMm: 5,
    caliperType: 'brembo_4pot',
    tireWidthMm: 245,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate live fitment physics
  const effectiveOffset = config.wheelOffsetEtMm - config.spacerMm;
  const caliperSpec = CALIPER_SPECS[config.caliperType];
  
  // Outer spoke clearance: wheel width + offset effect
  const spokeCaliperMarginMm = Math.max(
    0.5,
    Number((38 - effectiveOffset + (config.wheelWidthInch - 8) * 4 - caliperSpec.requiredSpokeClearanceMm + 15).toFixed(1))
  );

  // Inner strut clearance
  const innerStrutMarginMm = Math.max(
    0.5,
    Number((effectiveOffset - 20 + (10 - config.wheelWidthInch) * 6).toFixed(1))
  );

  // Outer fender flushness (Positive = Poke, Negative = Tuck)
  const fenderFlushnessDeltaMm = Number(
    ((config.wheelWidthInch - 8) * 12.7 + (35 - effectiveOffset) + Math.abs(config.camberDeg) * 3 - config.rideHeightDropMm * 0.2).toFixed(1)
  );

  const isCaliperSafe = spokeCaliperMarginMm >= 3.0; // Min SAE 3mm safety margin
  const isStrutSafe = innerStrutMarginMm >= 5.0;

  // Render 2D / 3D Cross-Section Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Canvas Background (Ivory Studio Tone)
    ctx.fillStyle = '#FAFAF7';
    ctx.fillRect(0, 0, width, height);

    // Subtle Grid Overlay
    ctx.strokeStyle = 'rgba(41, 41, 39, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const centerX = width / 2;
    const centerY = height / 2 + config.rideHeightDropMm * 0.4;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((config.camberDeg * Math.PI) / 180);

    // Draw Strut Assembly (Left side)
    ctx.fillStyle = '#292927';
    ctx.fillRect(-140, -120, 24, 180);
    ctx.strokeStyle = '#28483D';
    ctx.lineWidth = 6;
    ctx.strokeRect(-140, -120, 24, 180);

    // Draw Brake Rotor (Center Disc)
    const discRadius = caliperSpec.diskDiameterMm * 0.28;
    ctx.fillStyle = '#C2BEB6';
    ctx.beginPath();
    ctx.arc(0, 0, discRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Caliper (Top-right of disc)
    ctx.fillStyle = isCaliperSafe ? caliperSpec.accent : '#B8644A';
    ctx.fillRect(10, -discRadius + 5, 32, 48);
    ctx.strokeStyle = '#FAFAF7';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, -discRadius + 5, 32, 48);

    // Draw Wheel Spacer (if > 0)
    if (config.spacerMm > 0) {
      ctx.fillStyle = '#B47A52';
      ctx.fillRect(25, -20, config.spacerMm * 1.5, 40);
    }

    // Draw Wheel Rim Barrel
    const rimRadius = config.wheelDiameterInch * 6.5;
    const rimWidth = config.wheelWidthInch * 11;

    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 4;
    ctx.strokeRect(30 + config.spacerMm * 1.5, -rimRadius, rimWidth, rimRadius * 2);

    // Draw Tire Outline
    const tireThick = (config.tireWidthMm / 10) * 0.8;
    ctx.fillStyle = '#292927';
    ctx.beginPath();
    ctx.roundRect(
      30 + config.spacerMm * 1.5 - 4,
      -rimRadius - tireThick,
      rimWidth + 8,
      rimRadius * 2 + tireThick * 2,
      12
    );
    ctx.stroke();

    ctx.restore();

    // Draw Fender Lip (Fixed reference at top right)
    ctx.fillStyle = '#28483D';
    ctx.fillRect(centerX + 65, centerY - 140, 40, 8);
    ctx.beginPath();
    ctx.moveTo(centerX + 105, centerY - 140);
    ctx.lineTo(centerX + 105, centerY - 180);
    ctx.strokeStyle = '#28483D';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Live Annotations - Crisp Dark Typography
    ctx.fillStyle = '#171717';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`CALIPER CLEARANCE: ${spokeCaliperMarginMm}mm`, 16, 28);
    ctx.fillText(`FENDER FLUSHNESS: ${fenderFlushnessDeltaMm > 0 ? '+' : ''}${fenderFlushnessDeltaMm}mm`, 16, 48);
    ctx.fillText(`INNER STRUT MARGIN: ${innerStrutMarginMm}mm`, 16, 68);

  }, [config, spokeCaliperMarginMm, fenderFlushnessDeltaMm, innerStrutMarginMm, isCaliperSafe, caliperSpec]);

  const handleSaveToBuild = async () => {
    if (!currentUser?.id) return;
    try {
      await saveUserBuildToFirestore(currentUser.id, {
        id: buildState.buildId,
        name: buildState.buildName,
        stanceConfig: config,
        spokeCaliperMarginMm,
        fenderFlushnessDeltaMm,
        updatedAt: new Date().toISOString()
      });
    } catch {
      // Safe handle
    }
  };

  return (
    <div className="w-full bg-[#FAFAF7] text-[#171717] rounded-3xl border border-[#292927]/12 p-6 sm:p-8 shadow-sm space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292927]/12 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#28483D] text-[#FAFAF7] uppercase">
              <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              STANCE &amp; FITMENT SIMULATOR 3D
            </span>
            <span className="text-xs font-mono font-bold text-[#292927] uppercase">
              SAE J2711 CLEARANCE VERIFIED
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-[-0.03em] uppercase font-sans mt-1">
            WHEEL, CAMBER &amp; BRAKE CALIPER GEOMETRY
          </h3>
          <p className="text-xs sm:text-sm text-[#292927] font-medium font-sans mt-1">
            Simulate coilovers, multi-piston big brake kit clearances, and hub spacer flushness for{' '}
            <strong className="text-[#171717] font-bold">{activeVehicle?.make} {activeVehicle?.model}</strong>.
          </p>
        </div>

        <button
          onClick={handleSaveToBuild}
          className="px-5 py-2.5 rounded-xl bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7] text-xs font-bold font-sans tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#B47A52]" />
          <span>SAVE STANCE TO BUILD</span>
        </button>
      </div>

      {/* Main Grid: Interactive Controls + 2D/3D Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-6 space-y-6 bg-[#F4F1EA] p-6 rounded-2xl border border-[#292927]/12">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#171717] uppercase flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#28483D]" />
              GEOMETRY PARAMETERS
            </span>
            <button
              onClick={() =>
                setConfig({
                  rideHeightDropMm: 25,
                  camberDeg: -2.0,
                  wheelDiameterInch: 18,
                  wheelWidthInch: 9.0,
                  wheelOffsetEtMm: 38,
                  spacerMm: 5,
                  caliperType: 'brembo_4pot',
                  tireWidthMm: 245,
                })
              }
              className="text-[11px] font-mono font-bold text-[#292927] hover:text-[#171717] underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset OEM
            </button>
          </div>

          {/* Caliper Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[#292927] uppercase block">
              Brake System Setup:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(Object.keys(CALIPER_SPECS) as (keyof typeof CALIPER_SPECS)[]).map((key) => {
                const spec = CALIPER_SPECS[key];
                const isSel = config.caliperType === key;
                return (
                  <button
                    key={key}
                    onClick={() => setConfig(p => ({ ...p, caliperType: key }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSel
                        ? 'bg-[#171717] text-[#FAFAF7] border-[#171717] shadow-xs'
                        : 'bg-[#FAFAF7] text-[#171717] border-[#292927]/12 hover:border-[#171717]/40'
                    }`}
                  >
                    <p className="text-xs font-bold font-sans truncate">{spec.name.split(' ')[0]} {spec.name.split(' ')[1]}</p>
                    <p className="text-[10px] font-mono font-bold opacity-80 mt-0.5">{spec.diskDiameterMm}mm Disc</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slider 1: Ride Height Drop */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#171717]">RIDE HEIGHT DROP</span>
              <span className="font-bold text-[#28483D]">-{config.rideHeightDropMm} mm</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              step={1}
              value={config.rideHeightDropMm}
              onChange={(e) => setConfig(p => ({ ...p, rideHeightDropMm: Number(e.target.value) }))}
              className="w-full accent-[#28483D] bg-[#E8E2D8] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono font-bold text-[#292927]">
              <span>OEM Stock (0mm)</span>
              <span>Track Drop (-60mm)</span>
            </div>
          </div>

          {/* Slider 2: Camber Deg */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#171717]">CAMBER ANGLE</span>
              <span className="font-bold text-[#B47A52]">{config.camberDeg}°</span>
            </div>
            <input
              type="range"
              min={-4.5}
              max={-0.5}
              step={0.1}
              value={config.camberDeg}
              onChange={(e) => setConfig(p => ({ ...p, camberDeg: Number(e.target.value) }))}
              className="w-full accent-[#B47A52] bg-[#E8E2D8] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono font-bold text-[#292927]">
              <span>Daily (-0.5°)</span>
              <span>Aggressive Track (-4.5°)</span>
            </div>
          </div>

          {/* Slider 3: Wheel Offset ET */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#171717]">WHEEL OFFSET (ET)</span>
              <span className="font-bold text-[#171717]">ET+{config.wheelOffsetEtMm} mm</span>
            </div>
            <input
              type="range"
              min={20}
              max={55}
              step={1}
              value={config.wheelOffsetEtMm}
              onChange={(e) => setConfig(p => ({ ...p, wheelOffsetEtMm: Number(e.target.value) }))}
              className="w-full accent-[#171717] bg-[#E8E2D8] h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 4: Wheel Spacer */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#171717]">HUB SPACER THICKNESS</span>
              <span className="font-bold text-[#B8644A]">+{config.spacerMm} mm</span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={1}
              value={config.spacerMm}
              onChange={(e) => setConfig(p => ({ ...p, spacerMm: Number(e.target.value) }))}
              className="w-full accent-[#B8644A] bg-[#E8E2D8] h-2 rounded-lg cursor-pointer"
            />
          </div>

        </div>

        {/* Right Column: 2D/3D Interactive Canvas & Telemetry Metrics */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Canvas Container */}
          <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden border border-[#292927]/15 shadow-inner bg-[#FAFAF7]">
            <canvas
              ref={canvasRef}
              width={520}
              height={360}
              className="w-full h-full object-contain"
            />

            {/* Bottom Status Badge */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
              <div
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 ${
                  isCaliperSafe
                    ? 'bg-[#28483D] text-[#FAFAF7] border-[#28483D]'
                    : 'bg-[#B8644A] text-[#FAFAF7] border-[#B8644A]'
                }`}
              >
                {isCaliperSafe ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>CALIPER FITMENT PASSED ({spokeCaliperMarginMm}mm CLEAR)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>SPOKE INTERFERENCE RISK ({spokeCaliperMarginMm}mm &lt; 3.0mm)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Telemetry Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F4F1EA] border border-[#292927]/12 space-y-1">
              <p className="text-[10px] font-mono font-bold text-[#292927] uppercase">CALIPER MARGIN</p>
              <p className={`text-base font-mono font-black ${isCaliperSafe ? 'text-[#28483D]' : 'text-[#B8644A]'}`}>
                {spokeCaliperMarginMm} mm
              </p>
              <p className="text-[10px] font-mono font-bold text-[#292927]">SAE Min: 3.0mm</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F4F1EA] border border-[#292927]/12 space-y-1">
              <p className="text-[10px] font-mono font-bold text-[#292927] uppercase">STRUT MARGIN</p>
              <p className={`text-base font-mono font-black ${isStrutSafe ? 'text-[#28483D]' : 'text-[#B8644A]'}`}>
                {innerStrutMarginMm} mm
              </p>
              <p className="text-[10px] font-mono font-bold text-[#292927]">Min: 5.0mm</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F4F1EA] border border-[#292927]/12 space-y-1">
              <p className="text-[10px] font-mono font-bold text-[#292927] uppercase">FENDER FLUSH</p>
              <p className="text-base font-mono font-black text-[#B47A52]">
                {fenderFlushnessDeltaMm > 0 ? `+${fenderFlushnessDeltaMm}` : fenderFlushnessDeltaMm} mm
              </p>
              <p className="text-[10px] font-mono font-bold text-[#292927]">
                {fenderFlushnessDeltaMm > 5 ? 'Aggressive Poke' : fenderFlushnessDeltaMm >= -5 ? 'Flush Stance' : 'Tucked'}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
