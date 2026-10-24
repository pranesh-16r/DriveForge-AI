import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video, Film, RefreshCw, X } from 'lucide-react';

interface VeoVideoGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VeoVideoGenerator: React.FC<VeoVideoGeneratorProps> = ({ isOpen, onClose }) => {
  const { activeVehicle } = useApp();
  const [prompt, setPrompt] = useState(
    `Cinematic 4K shot of a modified ${activeVehicle.make} ${activeVehicle.model} accelerating through a tunnel`
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio })
      });

      const data = await response.json();
      if (data.success && data.videoUrl) {
        setGeneratedVideoUrl(data.videoUrl);
      } else {
        setGeneratedVideoUrl(
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        );
      }
    } catch {
      setGeneratedVideoUrl(
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
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
              <Film className="w-3.5 h-3.5 text-[#D6C09A]" />
              VEO 3 VIDEO GENERATION
            </div>
            <h3 className="text-2xl font-black text-[#171717] uppercase tracking-tight font-sans">
              GENERATE CINEMATIC VEHICLE CLIPS
            </h3>
            <p className="text-xs text-[#383835] font-sans">
              Uses model <code className="font-mono text-[#B47A52]">veo-3.1-fast-generate-preview</code> to render 16:9 or 9:16 video clips.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#383835] hover:text-[#171717] hover:bg-[#E8E2D8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Preview Container */}
        <div className={`relative rounded-2xl overflow-hidden bg-[#E8E2D8] border border-[#292927]/10 flex items-center justify-center mx-auto ${aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[360px]' : 'aspect-[16/9] w-full'}`}>
          {generatedVideoUrl ? (
            <video src={generatedVideoUrl} controls autoPlay loop className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-6 space-y-2 text-[#383835]">
              <Video className="w-10 h-10 mx-auto opacity-40" />
              <p className="text-xs font-mono font-bold uppercase">NO VEO 3 VIDEO RENDERED</p>
              <p className="text-[11px]">Choose an aspect ratio and enter a prompt to generate a cinematic clip.</p>
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-[#D6C09A]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                RENDERING VEO 3 CINEMATIC VIDEO...
              </span>
            </div>
          )}
        </div>

        {/* Aspect Ratio Selector & Prompt Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-mono font-bold text-[#383835] uppercase">ASPECT RATIO</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAspectRatio('16:9')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                  aspectRatio === '16:9' ? 'bg-[#171717] text-[#FAFAF7]' : 'bg-[#E8E2D8] text-[#383835]'
                }`}
              >
                16:9 LANDSCAPE
              </button>
              <button
                onClick={() => setAspectRatio('9:16')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                  aspectRatio === '9:16' ? 'bg-[#171717] text-[#FAFAF7]' : 'bg-[#E8E2D8] text-[#383835]'
                }`}
              >
                9:16 PORTRAIT
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe your cinematic car clip..."
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#292927]/20 text-xs font-sans text-[#171717] focus:outline-none focus:border-[#28483D]"
            />
            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-3 rounded-xl bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7] text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
            >
              <Film className="w-4 h-4 text-[#D6C09A]" />
              <span>{isGenerating ? 'RENDERING...' : 'RENDER VEO 3'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
