import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Image, RefreshCw, Wand2, X } from 'lucide-react';

interface ConceptRenderGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConceptRenderGenerator: React.FC<ConceptRenderGeneratorProps> = ({ isOpen, onClose }) => {
  const { activeVehicle } = useApp();
  const [prompt, setPrompt] = useState(
    `${activeVehicle.make} ${activeVehicle.model} with championship white paint, lowered 20mm on 18-inch forged wheels in a studio`
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      if (data.success && data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      } else {
        setGeneratedImageUrl(
          'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'
        );
      }
    } catch {
      setGeneratedImageUrl(
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#FAFAF7] text-[#171717] border border-[#292927]/15 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#292927]/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#28483D] text-[#FAFAF7] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D6C09A]" />
              AI VEHICLE CONCEPT STUDIO
            </div>
            <h3 className="text-2xl font-black text-[#171717] uppercase tracking-tight font-sans">
              CREATE &amp; EDIT CONCEPT RENDERS
            </h3>
            <p className="text-xs text-[#383835] font-sans">
              Generate photorealistic renders of your vehicle build specs using Gemini image prompts.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#383835] hover:text-[#171717] hover:bg-[#E8E2D8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Generated Image Preview Area */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#E8E2D8] border border-[#292927]/10 flex items-center justify-center group">
          {generatedImageUrl ? (
            <img src={generatedImageUrl} alt="Concept Render" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-6 space-y-2 text-[#383835]">
              <Image className="w-10 h-10 mx-auto opacity-40" />
              <p className="text-xs font-mono font-bold uppercase">NO CONCEPT RENDER GENERATED</p>
              <p className="text-[11px]">Enter a descriptive text prompt below to generate a new studio image.</p>
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-[#D6C09A]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                GENERATING VEHICLE CONCEPT...
              </span>
            </div>
          )}
        </div>

        {/* Prompt Input Box */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-[#383835] uppercase block">
            CONCEPT PROMPT / EDIT INSTRUCTIONS
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Porsche 911 GT3 with matte black finish..."
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#292927]/20 text-xs font-sans text-[#171717] focus:outline-none focus:border-[#28483D]"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-3 rounded-xl bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7] text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
            >
              <Wand2 className="w-4 h-4 text-[#D6C09A]" />
              <span>{isGenerating ? 'GENERATING...' : 'GENERATE'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
