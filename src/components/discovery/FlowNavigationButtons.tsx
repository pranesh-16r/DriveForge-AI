import React from 'react';
import { NeoButton } from '../ui/NeoButton';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FlowNavigationButtonsProps {
  onBack: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
  backLabel?: string;
  contextText?: string;
}

export const FlowNavigationButtons: React.FC<FlowNavigationButtonsProps> = ({
  onBack,
  onContinue,
  continueDisabled = false,
  continueLabel = 'Continue',
  backLabel = 'Back',
  contextText
}) => {
  return (
    <div className="pt-8 border-t border-[#292927]/12 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <NeoButton
          variant="outline"
          size="md"
          onClick={onBack}
          icon={<ArrowLeft className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          {backLabel}
        </NeoButton>

        {contextText && (
          <span className="hidden md:inline-block text-xs font-mono font-bold text-[#171717] bg-[#E8E2D8] px-3.5 py-1.5 rounded-xl border border-[#292927]/15">
            {contextText}
          </span>
        )}
      </div>

      <div className="w-full sm:w-auto">
        <NeoButton
          variant="primary"
          size="md"
          onClick={onContinue}
          disabled={continueDisabled}
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
          className="w-full sm:w-auto min-w-[160px]"
        >
          {continueLabel}
        </NeoButton>
      </div>
    </div>
  );
};
