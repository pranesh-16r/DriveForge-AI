import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, ChevronRight } from 'lucide-react';

export type BuildStepKey = 'location' | 'experience' | 'brand' | 'type' | 'model' | 'vehicle';

interface BuildStep {
  id: BuildStepKey;
  stepNumber: string;
  label: string;
  path: string;
}

const STEPS: BuildStep[] = [
  { id: 'location', stepNumber: '01', label: 'LOCATION', path: '/location' },
  { id: 'experience', stepNumber: '02', label: 'EXPERIENCE', path: '/experience' },
  { id: 'brand', stepNumber: '03', label: 'BRAND', path: '/brands' },
  { id: 'type', stepNumber: '04', label: 'TYPE', path: '/vehicles/type' },
  { id: 'model', stepNumber: '05', label: 'MODEL', path: '/vehicles' },
  { id: 'vehicle', stepNumber: '06', label: 'OVERVIEW', path: '/vehicles/porsche-911-gt3-rs' }
];

interface BuildFlowProgressProps {
  currentStep: BuildStepKey;
}

export const BuildFlowProgress: React.FC<BuildFlowProgressProps> = ({ currentStep }) => {
  const {
    navigateTo,
    selectedCountry,
    selectedRegion,
    experienceMode,
    selectedBrand,
    selectedVehicleType,
    activeVehicle
  } = useApp();

  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full mb-8 select-none">
      {/* Mobile Compact Progress Header */}
      <div className="md:hidden space-y-3 p-3.5 rounded-2xl bg-[#EFECE6] border border-[#292927]/12 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#28483D] animate-pulse" />
            <span className="text-xs font-mono font-bold text-[#171717] tracking-wider uppercase">
              STEP {STEPS[currentIndex]?.stepNumber} OF {STEPS.length}: {STEPS[currentIndex]?.label}
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#28483D] font-bold">
            {Math.round(((currentIndex + 1) / STEPS.length) * 100)}%
          </span>
        </div>

        {/* Segmented bar */}
        <div className="grid grid-cols-6 gap-1.5 h-2 w-full bg-[#E0DDD5] p-0.5 rounded-full">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={step.id}
                className={`h-full rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#171717] shadow-sm'
                    : isCompleted
                    ? 'bg-[#28483D]'
                    : 'bg-[#C8C4BA]'
                }`}
              />
            );
          })}
        </div>

        {/* Contextual chip on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-[#55534E] pt-1">
          {selectedCountry && (
            <span className="px-2.5 py-0.5 rounded-md bg-[#FAFAF7] text-[#171717] border border-[#292927]/12 font-medium shrink-0">
              {selectedCountry.flag} {selectedRegion ? selectedRegion.name : selectedCountry.name}
            </span>
          )}
          {experienceMode && (
            <span className="px-2.5 py-0.5 rounded-md bg-[#FAFAF7] text-[#28483D] border border-[#28483D]/25 font-bold shrink-0">
              {experienceMode.toUpperCase()}
            </span>
          )}
          {selectedBrand && (
            <span className="px-2.5 py-0.5 rounded-md bg-[#FAFAF7] text-[#171717] border border-[#292927]/12 font-medium shrink-0">
              {selectedBrand.name}
            </span>
          )}
        </div>
      </div>

      {/* Desktop Elegant High-Contrast Stepper */}
      <div className="hidden md:block">
        <div className="bg-[#EAE6DD] p-1.5 rounded-2xl border border-[#292927]/15 flex items-center justify-between gap-1 shadow-sm">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isPending = idx > currentIndex;

            // Target path: for vehicle step, use activeVehicle id
            const targetPath = step.id === 'vehicle' 
              ? `/vehicles/${activeVehicle?.id || 'porsche-911-gt3-rs'}` 
              : step.path;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (isCompleted) {
                      navigateTo(targetPath);
                    }
                  }}
                  disabled={isPending}
                  className={`
                    flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-200
                    ${isCurrent
                      ? 'bg-[#171717] text-[#FAFAF7] shadow-md border border-[#171717]'
                      : isCompleted
                      ? 'bg-[#FAFAF7] text-[#171717] border border-[#292927]/12 hover:border-[#171717] hover:bg-white cursor-pointer shadow-xs'
                      : 'text-[#6B6963] cursor-not-allowed hover:text-[#4A4843]'
                    }
                  `}
                >
                  <div
                    className={`
                      w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors
                      ${isCurrent
                        ? 'bg-[#28483D] text-[#FAFAF7] shadow-xs'
                        : isCompleted
                        ? 'bg-[#28483D]/15 text-[#28483D] border border-[#28483D]/30'
                        : 'bg-[#DCD6CA] text-[#4A4843]'
                      }
                    `}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.stepNumber}
                  </div>

                  <div className="truncate">
                    <span className={`text-[11px] font-mono font-bold tracking-wider block leading-tight ${isCurrent ? 'text-[#FAFAF7]' : isCompleted ? 'text-[#171717]' : 'text-[#383835]'}`}>
                      {step.label}
                    </span>
                    <span className={`text-[10px] font-sans block truncate leading-tight mt-0.5 font-medium ${isCurrent ? 'text-[#D0CBBF]' : isCompleted ? 'text-[#55534E]' : 'text-[#737067]'}`}>
                      {step.id === 'location' && (selectedCountry ? `${selectedCountry.code}${selectedRegion ? ` • ${selectedRegion.name}` : ''}` : 'Region')}
                      {step.id === 'experience' && (experienceMode ? experienceMode.toUpperCase() : 'Mode')}
                      {step.id === 'brand' && (selectedBrand ? selectedBrand.name : 'Manufacturer')}
                      {step.id === 'type' && (selectedVehicleType ? selectedVehicleType.name : 'Category')}
                      {step.id === 'model' && (activeVehicle ? `${activeVehicle.make} ${activeVehicle.model}` : 'Select')}
                      {step.id === 'vehicle' && 'Overview'}
                    </span>
                  </div>
                </button>

                {idx < STEPS.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#9B978F] shrink-0 mx-0.5" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
