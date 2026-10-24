import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Cpu,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  MapPin,
  Sliders,
  X
} from 'lucide-react';

export type LoadingStepId = 'vehicle' | 'compatibility' | 'fitment' | 'cost';

export interface LoadingStepState {
  id: LoadingStepId;
  label: string;
  detail: string;
  status: 'pending' | 'active' | 'completed';
  metric: string;
}

export interface LoadingOverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  onComplete?: () => void;
  vehicleName?: string;
  componentCount?: number;
  autoStart?: boolean;
}

const INITIAL_STEPS: LoadingStepState[] = [
  {
    id: 'vehicle',
    label: 'Verifying Vehicle',
    detail: 'Scanning OEM chassis geometry, curb weight distribution, and bolt pattern tolerances.',
    status: 'pending',
    metric: 'PCD 5x114.3 / CB 64.1mm',
  },
  {
    id: 'compatibility',
    label: 'Component Compatibility',
    detail: 'Cross-referencing selected coilovers, wheels, and exhaust manifolds against supplier CAD.',
    status: 'pending',
    metric: '5/5 Components Match Spec',
  },
  {
    id: 'fitment',
    label: 'Fitment Data',
    detail: 'Calculating inner rim barrel offset, multi-piston brake caliper safety margin, and fender clearance.',
    status: 'pending',
    metric: '4.8mm Caliper Clearance',
  },
  {
    id: 'cost',
    label: 'Regional Cost',
    detail: 'Estimating regional labor hours, certified workshop rates, and required alignment expenses.',
    status: 'pending',
    metric: '3 Garages Available',
  },
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isOpen,
  onClose,
  onComplete,
  vehicleName = '2022 Honda Civic 1.5L Turbo',
  componentCount = 5,
  autoStart = true,
}) => {
  const [steps, setSteps] = useState<LoadingStepState[]>(INITIAL_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState<'scan' | 'matrix' | 'vector' | 'radar' | 'none'>('scan');

  useEffect(() => {
    if (!isOpen) {
      // Reset on close
      setSteps(INITIAL_STEPS);
      setCurrentStepIndex(0);
      setProgressPct(0);
      setIsFinished(false);
      setActiveAnimation('scan');
      return;
    }

    if (!autoStart) return;

    // Execute state machine step-by-step
    let isCancelled = false;
    const stepDurationMs = 1100;

    const runStateMachine = async () => {
      for (let i = 0; i < INITIAL_STEPS.length; i++) {
        if (isCancelled) break;

        setCurrentStepIndex(i);
        setSteps(prev =>
          prev.map((s, idx) => {
            if (idx === i) return { ...s, status: 'active' };
            if (idx < i) return { ...s, status: 'completed' };
            return { ...s, status: 'pending' };
          })
        );

        // Set state-specific subtle background animation
        if (i === 0) setActiveAnimation('scan');
        else if (i === 1) setActiveAnimation('matrix');
        else if (i === 2) setActiveAnimation('vector');
        else if (i === 3) setActiveAnimation('radar');

        // Increment progress over the step duration
        const startPct = i * 25;
        const targetPct = (i + 1) * 25;

        for (let p = startPct; p <= targetPct; p += 2) {
          if (isCancelled) break;
          setProgressPct(p);
          await new Promise(r => setTimeout(r, stepDurationMs / 13));
        }

        // Mark current step as completed
        setSteps(prev =>
          prev.map((s, idx) => (idx === i ? { ...s, status: 'completed' } : s))
        );
      }

      if (!isCancelled) {
        setProgressPct(100);
        setIsFinished(true);
        setActiveAnimation('none');
        if (onComplete) {
          setTimeout(onComplete, 400);
        }
      }
    };

    runStateMachine();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, autoStart, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity">
      
      {/* Main Analysis Modal Card */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#FAFAF7] text-[#171717] border border-[#292927]/15 shadow-[0_24px_60px_rgba(0,0,0,0.25)] overflow-hidden">
        
        {/* Subtle Background Animation Container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
          {activeAnimation === 'scan' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#28483D] to-transparent animate-pulse" style={{ animationDuration: '1.2s' }} />
          )}
          {activeAnimation === 'matrix' && (
            <div className="absolute inset-0 bg-[radial-gradient(#B47A52_1px,transparent_1px)] [background-size:16px_16px] animate-ping" style={{ animationDuration: '3s' }} />
          )}
          {activeAnimation === 'vector' && (
            <div className="absolute inset-0 border-4 border-[#28483D] rounded-full scale-150 animate-spin" style={{ animationDuration: '6s' }} />
          )}
          {activeAnimation === 'radar' && (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B8644A]/30 via-transparent to-transparent animate-pulse" />
          )}
        </div>

        {/* Top Progress Bar */}
        <div className="h-2 w-full bg-[#E8E2D8] relative">
          <div
            className="h-full bg-gradient-to-r from-[#28483D] via-[#B47A52] to-[#B8644A] transition-all duration-200 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 space-y-6 relative z-10">
          
          <div className="flex items-start justify-between gap-4 border-b border-[#292927]/10 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#28483D] text-[#FAFAF7] uppercase">
                  <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                  REAL-TIME TELEMETRY ENGINE
                </span>
                <span className="text-[11px] font-mono text-[#5A5955] uppercase">
                  SAE J2711 COMPLIANT
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-[-0.04em] uppercase font-sans">
                ANALYZING YOUR BUILD
              </h2>

              <p className="text-xs sm:text-sm text-[#4A4843] font-sans">
                Calculating tolerance matrices, fitment geometry, and regional labor costs for{' '}
                <strong className="text-[#171717] font-bold">{vehicleName}</strong> ({componentCount} items).
              </p>
            </div>

            {/* Right Progress Counter & Close */}
            <div className="flex flex-col items-end gap-2">
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-[#5A5955] hover:text-[#171717] hover:bg-[#E8E2D8] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <div className="flex items-baseline gap-1 font-mono font-black text-3xl sm:text-4xl text-[#171717]">
                <span>{progressPct}</span>
                <span className="text-base text-[#B47A52]">%</span>
              </div>
            </div>
          </div>

          {/* State Machine Steps List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#5A5955] uppercase px-1">
              <span>STATE MACHINE SEQUENCE</span>
              <span>VERIFICATION STATUS</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {steps.map((step, idx) => {
                const isActive = step.status === 'active';
                const isCompleted = step.status === 'completed';
                const isPending = step.status === 'pending';

                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex items-start justify-between gap-4 ${
                      isCompleted
                        ? 'bg-white border-[#28483D]/30 shadow-xs'
                        : isActive
                        ? 'bg-white border-[#B47A52] shadow-md ring-2 ring-[#B47A52]/20'
                        : 'bg-[#E8E2D8]/40 border-[#292927]/8 opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-full bg-[#28483D] text-white flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-full bg-[#B47A52] text-white flex items-center justify-center animate-spin">
                            <Cpu className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-[#292927]/30 flex items-center justify-center text-[10px] font-mono font-bold text-[#5A5955]">
                            0{idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-[#B47A52] uppercase">
                            STEP 0{idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-[#171717] font-sans">
                            {step.label}
                          </h4>
                        </div>
                        <p className="text-xs text-[#5A5955] font-sans">
                          {step.detail}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-mono font-bold ${
                          isCompleted
                            ? 'bg-[#28483D]/10 text-[#28483D] border border-[#28483D]/20'
                            : isActive
                            ? 'bg-[#B47A52]/15 text-[#B47A52] animate-pulse border border-[#B47A52]/30'
                            : 'bg-black/5 text-[#5A5955]'
                        }`}
                      >
                        {isCompleted ? `✓ ${step.metric}` : isActive ? 'SCANNING...' : 'QUEUED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action bar */}
          <div className="pt-4 flex items-center justify-between gap-4 border-t border-[#292927]/10">
            <span className="text-xs text-[#5A5955] font-sans">
              DriveForge AI provides verified mathematical analysis before physical purchase.
            </span>

            {isFinished && (
              <button
                onClick={() => {
                  if (onComplete) onComplete();
                  if (onClose) onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7] text-xs font-bold font-sans tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
              >
                <span>VIEW BUILD REPORT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
