import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Gauge,
  Layers,
  Wrench
} from 'lucide-react';

export interface VerificationStep {
  id: string;
  code: string;
  title: string;
  detail: string;
  status: 'pending' | 'scanning' | 'verified' | 'conditional';
  metric?: string;
  delayMs: number;
}

export interface AnalyzingBuildLoadingProps {
  vehicleName?: string;
  componentCount?: number;
  onComplete?: () => void;
  autoProgress?: boolean;
  durationMs?: number;
  showDismiss?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const DEFAULT_STEPS: VerificationStep[] = [
  {
    id: 'step-platform',
    code: 'TEL-01',
    title: 'OEM Platform Geometry & Wheel Well Volume',
    detail: 'Verifying factory hub bolt pattern (PCD), center bore tolerances, and shock tower clearances.',
    status: 'pending',
    metric: 'PCD 5x114.3 / CB 64.1mm',
    delayMs: 600,
  },
  {
    id: 'step-fitment',
    code: 'TEL-02',
    title: 'Wheel Offset & Multi-Piston Brake Clearance',
    detail: 'Evaluating rotor diameter vs inner rim barrel with 4.5mm minimum caliper safety margin.',
    status: 'pending',
    metric: 'ET+45 / 4.8mm Clearance',
    delayMs: 1400,
  },
  {
    id: 'step-kinematics',
    code: 'TEL-03',
    title: 'Unsprung Mass Delta & Suspension Articulation',
    detail: 'Simulating full bump & rebound compression with coilovers and anti-roll bar geometry.',
    status: 'pending',
    metric: '-14.8 kg Unsprung Weight',
    delayMs: 2200,
  },
  {
    id: 'step-thermals',
    code: 'TEL-04',
    title: 'Thermal Dissipation & Aerodynamic Downforce',
    detail: 'Calculating intercooler charge density, exhaust backpressure, and brake fade threshold.',
    status: 'pending',
    metric: '+28% Vane Cooling Flow',
    delayMs: 3000,
  },
  {
    id: 'step-regional',
    code: 'TEL-05',
    title: 'Regional Labor & Installation Specialist Availability',
    detail: 'Cross-referencing certified automotive garages and alignment equipment in your selected region.',
    status: 'pending',
    metric: '3 Verified Garages Matched',
    delayMs: 3800,
  },
];

export const AnalyzingBuildLoading: React.FC<AnalyzingBuildLoadingProps> = ({
  vehicleName = '2022 Honda Civic 1.5L Turbo',
  componentCount = 5,
  onComplete,
  autoProgress = true,
  durationMs = 4500,
  showDismiss = false,
  onDismiss,
  className = '',
}) => {
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<VerificationStep[]>(DEFAULT_STEPS);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!autoProgress) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, Math.floor((elapsed / durationMs) * 100));
      setProgress(currentPct);

      // Update step statuses based on elapsed time
      setSteps(prev =>
        prev.map((step, idx) => {
          if (elapsed > step.delayMs + 600) {
            return { ...step, status: 'verified' };
          } else if (elapsed >= step.delayMs) {
            setActiveStepIndex(idx);
            return { ...step, status: 'scanning' };
          }
          return { ...step, status: 'pending' };
        })
      );

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setIsCompleted(true);
        if (onComplete) {
          setTimeout(onComplete, 400);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [autoProgress, durationMs, onComplete]);

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[#292927]/15 bg-[#FAFAF7] shadow-[0_24px_60px_rgba(23,23,23,0.08)] ${className}`}
    >
      {/* Visual Accent Top Bar with Contrast Colors */}
      <div className="h-1.5 w-full bg-[#E8E2D8] relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#28483D] via-[#B47A52] to-[#B8644A] transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-6 sm:p-10 space-y-8">
        
        {/* Header Block: High Contrast Typography */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#292927]/10 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#28483D] text-[#FAFAF7] tracking-wider uppercase">
                <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                REAL-TIME TELEMETRY ENGINE
              </span>
              <span className="text-[11px] font-mono text-[#5A5955] uppercase">
                ISO 9001 / SAE SPECS
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-[-0.04em] uppercase font-sans">
              ANALYZING YOUR BUILD
            </h2>

            <p className="text-xs sm:text-sm text-[#4A4843] font-sans font-medium">
              Verifying physical compatibility, unsprung weight tolerances, and thermal dynamics for{' '}
              <strong className="text-[#171717] font-bold">{vehicleName}</strong> ({componentCount} active components).
            </p>
          </div>

          {/* Big High-Contrast Progress Counter */}
          <div className="flex flex-col sm:items-end justify-center shrink-0">
            <div className="flex items-baseline gap-1 font-mono font-black text-4xl sm:text-5xl text-[#171717] tracking-tight">
              <span>{progress}</span>
              <span className="text-lg text-[#B47A52]">%</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5A5955] mt-0.5">
              {isCompleted ? 'ANALYSIS COMPLETE' : 'VERIFYING STACK...'}
            </span>
          </div>
        </div>

        {/* Center Blueprint Scan Section with Vehicle Visual & Laser Sweep */}
        <div className="relative rounded-2xl bg-[#E8E2D8]/50 border border-[#292927]/10 p-6 overflow-hidden">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#171717 1px, transparent 1px), linear-gradient(90deg, #171717 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Animated Laser Scan Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-[#B47A52] opacity-75 shadow-[0_0_15px_#B47A52] transition-all duration-100 ease-linear pointer-events-none"
            style={{ left: `${progress}%` }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#28483D]">
                PHYSICAL CHASSIS VERIFICATION
              </span>
              <p className="text-sm font-bold text-[#171717] font-sans">
                {vehicleName}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white text-[#171717] border border-[#292927]/10 font-bold">
                  WHEEL CLEARANCE: VERIFIED
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white text-[#171717] border border-[#292927]/10 font-bold">
                  BRAKE CALIPER: 4.8mm
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#28483D]/10 text-[#28483D] border border-[#28483D]/20 font-bold">
                  STATUS: GREEN
                </span>
              </div>
            </div>

            {/* Quick Metrics Badge */}
            <div className="shrink-0 p-3 rounded-xl bg-white/80 border border-[#292927]/10 shadow-sm flex items-center gap-4">
              <div className="text-center">
                <p className="text-[10px] font-mono text-[#5A5955] uppercase">EST. POWER</p>
                <p className="text-base font-black text-[#171717] font-sans">197 HP</p>
              </div>
              <div className="w-[1px] h-8 bg-[#292927]/10" />
              <div className="text-center">
                <p className="text-[10px] font-mono text-[#5A5955] uppercase">WEIGHT DELTA</p>
                <p className="text-base font-black text-[#28483D] font-sans">-14.8 KG</p>
              </div>
              <div className="w-[1px] h-8 bg-[#292927]/10" />
              <div className="text-center">
                <p className="text-[10px] font-mono text-[#5A5955] uppercase">BUILD HEALTH</p>
                <p className="text-base font-black text-[#B47A52] font-sans">REVIEW</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Sequence Items (Individual Steps Appearing as Verified) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#5A5955] uppercase px-1">
            <span>VERIFICATION PIPELINE</span>
            <span>STATUS TELEMETRY</span>
          </div>

          <div className="space-y-2.5">
            {steps.map((step, idx) => {
              const isVerifying = step.status === 'scanning';
              const isVerified = step.status === 'verified';
              const isPending = step.status === 'pending';

              return (
                <div
                  key={step.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 flex items-start justify-between gap-4 ${
                    isVerified
                      ? 'bg-white border-[#28483D]/25 shadow-sm'
                      : isVerifying
                      ? 'bg-white border-[#B47A52] shadow-md ring-2 ring-[#B47A52]/20'
                      : 'bg-[#E8E2D8]/30 border-[#292927]/8 opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isVerified ? (
                        <div className="w-5 h-5 rounded-full bg-[#28483D] text-white flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : isVerifying ? (
                        <div className="w-5 h-5 rounded-full bg-[#B47A52] text-white flex items-center justify-center animate-spin">
                          <Cpu className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-[#292927]/30 flex items-center justify-center text-[10px] font-mono font-bold text-[#5A5955]">
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#B47A52] uppercase">
                          {step.code}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-[#171717] font-sans">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#5A5955] font-sans leading-relaxed line-clamp-1 sm:line-clamp-none">
                        {step.detail}
                      </p>
                    </div>
                  </div>

                  {/* Status Metric Tag */}
                  <div className="shrink-0 text-right">
                    {step.metric && (
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-mono font-bold ${
                          isVerified
                            ? 'bg-[#28483D]/10 text-[#28483D] border border-[#28483D]/20'
                            : isVerifying
                            ? 'bg-[#B47A52]/15 text-[#B47A52] animate-pulse border border-[#B47A52]/30'
                            : 'bg-black/5 text-[#5A5955]'
                        }`}
                      >
                        {isVerified ? `✓ ${step.metric}` : isVerifying ? 'SCANNING...' : 'QUEUED'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#292927]/10">
          <div className="text-xs text-[#5A5955] font-sans">
            DriveForge AI calculations are mathematically grounded in OEM chassis geometry and supplier CAD tolerances.
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {showDismiss && onDismiss && (
              <button
                onClick={onDismiss}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A5955] hover:text-[#171717] bg-[#E8E2D8]/60 hover:bg-[#E8E2D8] transition-colors cursor-pointer"
              >
                Close View
              </button>
            )}

            {isCompleted && onComplete && (
              <button
                onClick={onComplete}
                className="px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7] text-xs font-bold font-sans tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>PROCEED TO BUILD REPORT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
