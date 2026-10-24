import React, { useState } from 'react';
import { LearningArticle } from '../../types/learning';
import {
  X,
  BookOpen,
  Bot,
  ShoppingBag,
  Sparkles,
  Gauge,
  Scale,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  HelpCircle,
  Activity
} from 'lucide-react';

interface ArticleReaderModalProps {
  article: LearningArticle | null;
  experienceMode: 'beginner' | 'enthusiast';
  onClose: () => void;
  onAskEngineer: (topic: string) => void;
  onExploreMarketplace: (category?: string) => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  experienceMode: initialMode,
  onClose,
  onAskEngineer,
  onExploreMarketplace
}) => {
  const [activeMode, setActiveMode] = useState<'beginner' | 'enthusiast'>(initialMode);

  if (!article) return null;

  const { beginnerContent, enthusiastContent } = article;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-4xl my-8 bg-[#14171E] border border-white/15 rounded-[28px] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Banner image with header */}
        <div className="relative h-60 sm:h-72 w-full bg-[#0D0F13] shrink-0 overflow-hidden">
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14171E] via-[#14171E]/50 to-black/70" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-gray-400 hover:text-white border border-white/10 transition-colors z-20 cursor-pointer"
            aria-label="Close article"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
            <span className="px-3 py-1 rounded-lg text-xs font-mono font-black uppercase bg-[#0070F3] text-white">
              {article.category}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono uppercase bg-black/70 border border-white/20 text-gray-300 font-bold">
              {article.readTime}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono uppercase bg-white/10 text-white font-bold">
              Level: {article.difficulty}
            </span>
          </div>

          {/* Title Header */}
          <div className="absolute bottom-4 left-6 right-6 space-y-1.5 z-10">
            <h2 className="text-xl sm:text-3xl font-black text-white font-sans tracking-tight">
              {article.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-sans line-clamp-2">
              {article.summary}
            </p>
          </div>
        </div>

        {/* Mode Toggle Switcher */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#101217] px-6 py-2.5 text-xs font-mono shrink-0">
          <span className="text-gray-400 font-bold uppercase hidden sm:inline">
            EXPLANATION DEPTH:
          </span>
          <div className="flex items-center gap-1 bg-[#0D0F13] p-1 rounded-xl neo-inset border border-white/5">
            <button
              onClick={() => setActiveMode('beginner')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeMode === 'beginner'
                  ? 'bg-[#0070F3] text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              PLAIN LANGUAGE (BEGINNER)
            </button>
            <button
              onClick={() => setActiveMode('enthusiast')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeMode === 'enthusiast'
                  ? 'bg-[#0070F3] text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              TECHNICAL DEEP DIVE (ENTHUSIAST)
            </button>
          </div>
        </div>

        {/* Article Content Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {activeMode === 'beginner' ? (
            <div className="space-y-6">
              {/* Plain English explanation */}
              <div className="p-5 rounded-2xl neo-panel border border-white/10 bg-[#12141A] space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#0070F3] uppercase tracking-wider block flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  WHAT THIS MEANS IN PLAIN LANGUAGE
                </span>
                <p className="text-sm sm:text-base text-gray-200 font-sans leading-relaxed">
                  {beginnerContent.plainLanguageExplanation}
                </p>
              </div>

              {/* The Analogy */}
              <div className="p-5 rounded-2xl bg-[#0070F3]/10 border border-[#0070F3]/30 space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#0070F3] uppercase tracking-wider block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  REAL-WORLD ANALOGY
                </span>
                <p className="text-sm text-gray-200 font-sans italic leading-relaxed">
                  "{beginnerContent.analogy}"
                </p>
              </div>

              {/* Why It Matters */}
              <div className="p-5 rounded-2xl neo-inset border border-white/5 space-y-3">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  WHY IT MATTERS FOR YOUR BUILD
                </span>
                <ul className="space-y-2 text-xs sm:text-sm font-sans text-gray-300">
                  {beginnerContent.whyItMatters.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-[#10B981] font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Things to Watch Out For */}
              <div className="p-5 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 space-y-3">
                <span className="text-xs font-mono font-bold text-[#F59E0B] uppercase tracking-wider block flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  CRITICAL PITFALLS TO AVOID
                </span>
                <ul className="space-y-2 text-xs sm:text-sm font-sans text-gray-300">
                  {beginnerContent.thingsToWatch.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-[#F59E0B] font-bold">⚠</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Engineering Dynamics */}
              <div className="p-5 rounded-2xl neo-panel border border-white/10 bg-[#12141A] space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#0070F3] uppercase tracking-wider block flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5" />
                  PHYSICAL & THERMODYNAMIC DYNAMICS
                </span>
                <p className="text-sm sm:text-base text-gray-200 font-sans leading-relaxed">
                  {enthusiastContent.engineeringDynamics}
                </p>
              </div>

              {/* Formulas & Dimensions */}
              <div className="p-5 rounded-2xl bg-[#0D0F13] neo-inset border border-white/5 space-y-2 text-xs font-mono">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#38BDF8]" />
                  GEOMETRY, FORMULAS & TOLERANCES
                </span>
                <p className="text-gray-200 leading-relaxed font-mono">
                  {enthusiastContent.geometryAndDimensions}
                </p>
              </div>

              {/* Thermal & Mechanical Stresses */}
              <div className="p-5 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 space-y-2 text-xs font-sans">
                <span className="text-[10px] font-mono font-bold text-[#EF4444] uppercase tracking-wider block flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  THERMAL & CYCLIC MECHANICAL STRESSES
                </span>
                <p className="text-gray-200 leading-relaxed">
                  {enthusiastContent.thermalAndMechanicalStresses}
                </p>
              </div>

              {/* Supporting Modifications & Tuning */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl neo-panel border border-white/10 space-y-2 text-xs font-mono">
                  <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider block">
                    RECOMMENDED SUPPORTING HARDWARE
                  </span>
                  <ul className="space-y-1.5 text-gray-300 list-disc pl-4 font-sans">
                    {enthusiastContent.supportingModifications.map((mod, i) => (
                      <li key={i}>{mod}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl neo-panel border border-white/10 space-y-2 text-xs font-mono">
                  <span className="text-[10px] font-bold text-[#0070F3] uppercase tracking-wider block">
                    CALIBRATION PARAMETERS
                  </span>
                  <ul className="space-y-1.5 text-gray-300 list-disc pl-4 font-sans">
                    {enthusiastContent.tuningParameters.map((param, i) => (
                      <li key={i}>{param}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Direct Integration Actions */}
        <div className="p-5 border-t border-white/10 bg-[#101217] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => onAskEngineer(`Explain in detail: ${article.title}. How does this relate to my current active build vehicle?`)}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl neo-button text-xs font-mono font-bold text-[#0070F3] hover:text-white border border-[#0070F3]/30 bg-[#0070F3]/10 hover:bg-[#0070F3]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>ASK CHIEF ENGINEER ABOUT THIS</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onExploreMarketplace(article.relatedMarketplaceCategory)}
              className="flex-1 sm:flex-initial py-2.5 px-5 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-[#0070F3]/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>EXPLORE COMPATIBLE PARTS</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl neo-button text-xs font-mono text-gray-400 hover:text-white border border-white/10 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
