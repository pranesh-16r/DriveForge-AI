import React from 'react';
import { LearningArticle } from '../../types/learning';
import { BookOpen, Clock, ArrowRight, Bot, Sparkles } from 'lucide-react';

interface LearningCardProps {
  article: LearningArticle;
  isRecommended?: boolean;
  onRead: (article: LearningArticle) => void;
  onAskAI: (article: LearningArticle) => void;
}

export const LearningCard: React.FC<LearningCardProps> = ({
  article,
  isRecommended = false,
  onRead,
  onAskAI
}) => {
  return (
    <div className="group rounded-[24px] neo-panel border border-white/10 bg-[#14161C] flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-[#0070F3]/40 hover:shadow-xl hover:shadow-[#0070F3]/5">
      {/* Visual Image Banner */}
      <div className="relative w-full h-44 bg-[#0D0F13] overflow-hidden">
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14161C] via-transparent to-black/50" />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/15">
            {article.category}
          </span>
          {isRecommended && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono uppercase bg-[#10B981] text-black font-black flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              MATCHES YOUR BUILD
            </span>
          )}
        </div>

        {/* Read Time & Level */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 backdrop-blur-sm border border-white/10 text-gray-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#0070F3]" />
            {article.readTime}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-base font-black text-white font-sans tracking-tight leading-snug line-clamp-2 group-hover:text-[#0070F3] transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-gray-400 font-sans line-clamp-3 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-white/5 flex items-center gap-2">
          <button
            onClick={() => onRead(article)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-[#0070F3]/20"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>READ GUIDE</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => onAskAI(article)}
            className="py-2.5 px-3 rounded-xl neo-button text-xs font-mono text-[#0070F3] hover:text-white border border-[#0070F3]/30 bg-[#0070F3]/10 hover:bg-[#0070F3]/20 transition-colors cursor-pointer"
            title="Ask Chief Engineer about this topic"
          >
            <Bot className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
