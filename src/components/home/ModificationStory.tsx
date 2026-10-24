import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FeatureSection } from './FeatureSection';
import { NeoCard } from '../ui/NeoCard';
import { NeoButton } from '../ui/NeoButton';
import { COMPONENTS } from '../../data/componentsData';
import { CategoryType } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  Gauge,
  Weight,
  Clock,
  ShieldCheck,
  Plus,
  Check,
  Cpu
} from 'lucide-react';

const CATEGORIES: { id: CategoryType | 'all'; label: string }[] = [
  { id: 'all', label: 'All Systems' },
  { id: 'exhaust', label: 'Exhaust Systems' },
  { id: 'brakes', label: 'Braking Kits' },
  { id: 'suspension', label: 'Suspension & Coilovers' },
  { id: 'powertrain', label: 'Powertrain & Cooling' },
];

export const ModificationStory: React.FC = () => {
  const { selectedComponents, toggleComponentInBuild } = useApp();
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'all'>('all');

  const filtered = activeCategory === 'all'
    ? COMPONENTS.slice(0, 6)
    : COMPONENTS.filter(c => c.category === activeCategory);

  return (
    <FeatureSection
      id="modifications"
      stepNumber="03"
      category="AUTHENTIC AFTERMARKET CATALOG"
      title="EXPLORE REAL MODIFICATIONS"
      subtitle="Explore exterior, wheels, brakes, suspension, performance and interior components."
      description="Every component in DriveForge AI exists in the real physical market with genuine manufacturer part numbers, verified installation requirements, and dyno-tested specifications."
    >
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`
              px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all duration-200 cursor-pointer select-none
              ${activeCategory === cat.id
                ? 'bg-[#171717] text-[#FAFAF7] shadow-sm border border-[#171717]'
                : 'bg-[#FAFAF7] text-[#171717] hover:bg-white border border-[#292927]/15'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Component Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((component) => {
            const isAdded = selectedComponents.some(c => c.id === component.id);

            return (
              <motion.div
                key={component.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <NeoCard
                  variant="raised"
                  radius="24"
                  className="p-5 flex flex-col justify-between h-full space-y-4 border border-[#292927]/12 bg-[#FAFAF7] hover:bg-white hover:border-[#171717]/30 shadow-xs transition-all group"
                >
                  {/* Card Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-black text-[#28483D] uppercase tracking-wider">
                        {component.brand}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#171717] bg-[#E8E2D8] px-2 py-0.5 rounded border border-[#292927]/15">
                        PN: {component.partNumber}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-[#171717] font-sans line-clamp-2 leading-snug group-hover:text-[#28483D] transition-colors">
                      {component.name}
                    </h3>

                    <p className="text-xs text-[#383835] font-sans font-medium line-clamp-2 leading-relaxed">
                      {component.description}
                    </p>
                  </div>

                  {/* Mechanical Telemetry Metrics */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#292927]/10 text-center">
                    <div className="p-2 rounded-xl bg-[#E8E2D8] border border-[#292927]/12">
                      <span className="text-[9px] font-mono text-[#55534E] font-bold uppercase block">Power</span>
                      <span className="text-xs font-mono font-black text-[#1C6E42]">
                        {component.powerGainHp > 0 ? `+${component.powerGainHp} HP` : '0 HP'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#E8E2D8] border border-[#292927]/12">
                      <span className="text-[9px] font-mono text-[#55534E] font-bold uppercase block">Weight</span>
                      <span className="text-xs font-mono font-black text-[#171717]">
                        {component.weightDeltaKg > 0 ? `+${component.weightDeltaKg}kg` : `${component.weightDeltaKg}kg`}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#E8E2D8] border border-[#292927]/12">
                      <span className="text-[9px] font-mono text-[#55534E] font-bold uppercase block">Install</span>
                      <span className="text-xs font-mono font-black text-[#171717]">
                        {component.installHours}h
                      </span>
                    </div>
                  </div>

                  {/* Pricing & Add to Test Build Button */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] font-mono text-[#55534E] font-bold block uppercase">Retail MSRP</span>
                      <span className="text-lg font-mono font-black text-[#171717]">
                        ${component.priceUSD.toLocaleString()}
                      </span>
                    </div>

                    <NeoButton
                      variant={isAdded ? 'inset' : 'primary'}
                      size="sm"
                      onClick={() => toggleComponentInBuild(component)}
                      icon={isAdded ? <Check className="w-3.5 h-3.5 text-[#28483D]" /> : <Plus className="w-3.5 h-3.5" />}
                    >
                      {isAdded ? 'Added' : 'Add to Plan'}
                    </NeoButton>
                  </div>

                </NeoCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </FeatureSection>
  );
};
