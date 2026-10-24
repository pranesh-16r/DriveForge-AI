import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Layers, Sparkles, MapPin, Wrench } from 'lucide-react';
import { isPrefersReducedMotion } from '../../lib/3d/helpers';

export type TransitionType = 
  | 'garageToBuild'
  | 'garageToPerformance'
  | 'buildToAnalysis'
  | 'analysisToAI'
  | 'garageToWorkshops'
  | 'none';

interface GarageTransitionControllerProps {
  type: TransitionType;
  onComplete: () => void;
}

export const GarageTransitionController: React.FC<GarageTransitionControllerProps> = ({
  type,
  onComplete
}) => {
  const [active, setActive] = useState(type !== 'none');

  useEffect(() => {
    if (type === 'none') {
      setActive(false);
      return;
    }

    if (isPrefersReducedMotion()) {
      onComplete();
      setActive(false);
      return;
    }

    setActive(true);
    const timer = setTimeout(() => {
      setActive(false);
      onComplete();
    }, 750);

    return () => clearTimeout(timer);
  }, [type, onComplete]);

  if (!active || type === 'none') return null;

  const getContent = () => {
    switch (type) {
      case 'garageToBuild':
        return {
          title: 'SUMMARIZING PHYSICAL BUILD BLUEPRINT',
          subtitle: 'Consolidating component specifications, labor hours, and regional acquisition totals...',
          icon: <Layers className="w-8 h-8 text-[#28483D]" />
        };
      case 'garageToPerformance':
      case 'buildToAnalysis':
        return {
          title: 'CALCULATING POWERTRAIN & CHASSIS TELEMETRY',
          subtitle: 'Simulating brake mean effective pressure, wheel torque, and suspension kinematic roll centers...',
          icon: <Cpu className="w-8 h-8 text-[#B47A52]" />
        };
      case 'analysisToAI':
        return {
          title: 'INITIALIZING AI CHIEF ENGINEER CONSULTATION',
          subtitle: 'Loading vehicle CAD geometry, clearance matrices, and regional workshop data into AI context...',
          icon: <Sparkles className="w-8 h-8 text-[#28483D]" />
        };
      case 'garageToWorkshops':
        return {
          title: 'MATCHING REGIONAL CERTIFIED WORKSHOPS',
          subtitle: 'Locating specialized alignment, dyno tuning, and suspension installation facilities in your territory...',
          icon: <MapPin className="w-8 h-8 text-[#B47A52]" />
        };
      default:
        return {
          title: 'TRANSITIONING STUDIO VIEW',
          subtitle: 'Updating DriveForge planning parameters...',
          icon: <Wrench className="w-8 h-8 text-[#28483D]" />
        };
    }
  };

  const info = getContent();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0E1015]/90 backdrop-blur-lg text-[#FAFAF7] select-none"
      >
        <div className="max-w-md w-full bg-[#181B20] p-8 rounded-3xl border border-white/12 shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#28483D]/20 border border-[#28483D]/40 flex items-center justify-center mx-auto shadow-md">
            {info.icon}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black font-mono text-white tracking-tight uppercase">
              {info.title}
            </h3>
            <p className="text-xs font-mono text-gray-300 leading-relaxed">
              {info.subtitle}
            </p>
          </div>
          <div className="w-32 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              className="w-1/2 h-full bg-[#28483D]"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
