import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Eye, ShieldCheck, Cpu } from 'lucide-react';
import { isPrefersReducedMotion } from '../../lib/3d/helpers';

interface GarageIntroSequenceProps {
  vehicleName: string;
  vehicleBrand: string;
  onComplete: () => void;
}

export const GarageIntroSequence: React.FC<GarageIntroSequenceProps> = ({
  vehicleName,
  vehicleBrand,
  onComplete
}) => {
  const [step, setStageStep] = useState<number>(0);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    // If user prefers reduced motion, skip intro sequence instantly
    if (isPrefersReducedMotion()) {
      onComplete();
      setDismissed(true);
      return;
    }

    // Step 0 -> Step 1 (reveal silhouette & lights)
    const timer1 = setTimeout(() => setStageStep(1), 600);
    // Step 1 -> Step 2 (camera settles & HUD ready)
    const timer2 = setTimeout(() => setStageStep(2), 1800);
    // Step 2 -> Dismiss
    const timer3 = setTimeout(() => {
      setDismissed(true);
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setDismissed(true);
    onComplete();
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
        className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 bg-[#0C0E12] text-[#FAFAF7] select-none overflow-hidden"
      >
        {/* Subtle Background Lighting Scan */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: step >= 1 ? 0.35 : 0.05,
              scale: step >= 1 ? 1.1 : 0.8
            }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-radial from-[#28483D] via-[#B47A52]/20 to-transparent blur-3xl rounded-full"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1C2028_1px,transparent_1px),linear-gradient(to_bottom,#1C2028_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-15" />
        </div>

        {/* Top Header Identifier */}
        <div className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#28483D] text-[#FAFAF7] flex items-center justify-center font-mono font-bold text-xs">
              DF
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-[#B47A52] uppercase block">
                DRIVEFORGE 3D STUDIO
              </span>
              <span className="text-sm font-extrabold text-[#FAFAF7] tracking-tight">
                AUTOMOTIVE PLANNING GATEWAY
              </span>
            </div>
          </div>

          <button
            onClick={handleSkip}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span>SKIP REVEAL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center Reveal Typography & Telemetry */}
        <div className="relative z-10 w-full max-w-2xl mx-auto text-center space-y-4 my-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#28483D]/80 border border-[#28483D] text-xs font-mono font-bold text-[#FAFAF7] uppercase tracking-wider shadow-md"
          >
            <Cpu className="w-3.5 h-3.5 text-[#B47A52] animate-pulse" />
            <span>INITIALIZING DIGITAL STUDIO ENGINE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: step >= 1 ? 1 : 0.4, scale: step >= 1 ? 1 : 0.96 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl font-black text-white font-sans tracking-tight uppercase"
          >
            {vehicleBrand} <span className="text-[#28483D]">{vehicleName}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 1 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm font-mono text-gray-300 max-w-md mx-auto"
          >
            Calibrating 3D geometry, clearance tolerances, and regional workshop pricing...
          </motion.p>

          {/* Progress Bar Line */}
          <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: step === 0 ? '25%' : step === 1 ? '75%' : '100%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="h-full bg-[#28483D]"
            />
          </div>
        </div>

        {/* Bottom Status Footnote */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-gray-400 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#28483D]" />
            <span>OEM FACTORY KINEMATICS LOADED</span>
          </div>
          <span className="hidden sm:inline-block">SAE J2711 CLEARANCE SOLVER ACTIVE</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
