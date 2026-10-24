import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoButton } from '../components/ui/NeoButton';
import { LearningService } from '../lib/learning/learningService';
import { LearningArticle, LearningCategory, LearningDifficulty } from '../types/learning';
import { LearningCard } from '../components/learning/LearningCard';
import { ArticleReaderModal } from '../components/learning/ArticleReaderModal';
import {
  Search,
  BookOpen,
  Sparkles,
  Bot,
  ShoppingBag,
  SlidersHorizontal,
  Car,
  Layers,
  CheckCircle2,
  Wrench
} from 'lucide-react';

export const LearningPage: React.FC = () => {
  const {
    activeVehicle,
    experienceMode,
    setExperienceMode,
    buildComponents,
    navigateTo,
    askEngineerAboutComponent
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LearningCategory | 'ALL'>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<LearningDifficulty | 'ALL'>('ALL');

  // Active Article Reader
  const [activeArticle, setActiveArticle] = useState<LearningArticle | null>(null);

  // Recommended Articles for Active Build
  const recommendedArticles = useMemo(() => {
    return LearningService.getRecommendedArticlesForBuild(buildComponents);
  }, [buildComponents]);

  // All Filtered Articles
  const filteredArticles = useMemo(() => {
    return LearningService.filterArticles({
      query: searchQuery,
      category: selectedCategory,
      difficulty: selectedDifficulty
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const categories: (LearningCategory | 'ALL')[] = [
    'ALL',
    'FUNDAMENTALS',
    'SUSPENSION',
    'BRAKES',
    'WHEELS & TYRES',
    'ENGINE',
    'PERFORMANCE',
    'TUNING',
    'SAFETY'
  ];

  const handleAskAI = (article: LearningArticle) => {
    navigateTo('/ai-engineer');
  };

  const handleExploreMarketplace = (cat?: string) => {
    navigateTo('/marketplace');
  };

  return (
    <PageContainer
      eyebrow="AUTOMOTIVE MAGAZINE & ENGINEERING HUB"
      title="UNDERSTAND THE MACHINE."
      subtitle="Editorial deep dives into automotive kinematics, wheel offsets, unsprung weight, and forced induction physics."
      action={
        <div className="flex flex-wrap items-center gap-2">
          <NeoButton
            variant="outline"
            size="sm"
            onClick={() => navigateTo('/marketplace')}
            icon={<ShoppingBag className="w-4 h-4 text-[#B47A52]" />}
          >
            Marketplace
          </NeoButton>
          <NeoButton
            variant="primary"
            size="sm"
            onClick={() => navigateTo('/ai-engineer')}
            icon={<Bot className="w-4 h-4" />}
          >
            Ask Chief Engineer
          </NeoButton>
        </div>
      }
    >
      <div className="space-y-8">
        
        {/* Large Editorial Magazine Hero Visual */}
        <div className="relative aspect-[21/9] w-full rounded-[28px] overflow-hidden bg-[#171717] border border-[#292927]/10 shadow-lg group">
          <img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=80"
            alt="Understand the Machine"
            className="w-full h-full object-cover filter contrast-[1.08] brightness-[0.75] group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent opacity-85" />
          
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 max-w-2xl space-y-2 text-[#FAFAF7]">
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#D6C09A] uppercase">
              DRIVEFORGE EDITORIAL • VOLUME IV
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight leading-none text-white">
              UNDERSTAND THE MACHINE.
            </h2>
            <p className="text-xs sm:text-sm text-[#E8E2D8] font-sans leading-relaxed">
              Before you spend hard-earned money on aftermarket hardware, decode the fundamental engineering principles that govern grip, cooling, and chassis balance.
            </p>
          </div>
        </div>
        
        {/* Top Context & Experience Mode Switcher */}
        <div className="p-4 sm:p-5 rounded-[22px] neo-panel border border-white/10 bg-[#12141A] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0070F3]/15 text-[#0070F3] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-gray-400 uppercase block">
                LEARNING PLATFORM CONTEXT
              </span>
              <h2 className="text-base font-black text-white font-sans">
                {activeVehicle ? `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}` : 'Generic Performance Chassis'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#0D0F13] p-1 rounded-xl neo-inset border border-white/5 text-xs font-mono">
              <span className="text-gray-400 px-2 font-bold uppercase hidden sm:inline text-[10px]">
                MODE:
              </span>
              <button
                onClick={() => setExperienceMode('beginner')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  experienceMode === 'beginner'
                    ? 'bg-[#0070F3] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                BEGINNER
              </button>
              <button
                onClick={() => setExperienceMode('enthusiast')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  experienceMode === 'enthusiast'
                    ? 'bg-[#0070F3] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ENTHUSIAST
              </button>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Header */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search whitepapers by topic, scrub radius, downforce, backpressure, DFV..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#12141A] neo-inset border border-white/10 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#0070F3]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-mono"
                >
                  CLEAR
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value as any)}
                className="py-3 px-3 rounded-2xl bg-[#12141A] neo-inset border border-white/10 text-xs font-mono text-gray-200 focus:outline-none focus:border-[#0070F3]"
              >
                <option value="ALL">All Technical Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Enthusiast">Enthusiast</option>
                <option value="Professional">Professional</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0070F3] text-white shadow-md shadow-[#0070F3]/30'
                    : 'bg-[#12141A] neo-inset text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: Recommended for Your Active Build (if parts exist) */}
        {buildComponents.length > 0 && selectedCategory === 'ALL' && !searchQuery && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  RECOMMENDED FOR YOUR PHYSICAL BUILD
                </h3>
              </div>
              <span className="text-[11px] font-mono text-gray-400">
                Matched to {buildComponents.length} Selected Components
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedArticles.map(art => (
                <LearningCard
                  key={`rec-${art.id}`}
                  article={art}
                  isRecommended={true}
                  onRead={a => setActiveArticle(a)}
                  onAskAI={a => handleAskAI(a)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Full Knowledge Base Library */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {selectedCategory === 'ALL' ? 'ALL TECHNICAL GUIDES' : `${selectedCategory} ARTICLES`} ({filteredArticles.length})
            </h3>
            <span className="text-[11px] font-mono text-gray-400">
              Deterministic Engineering Principles
            </span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="p-12 rounded-3xl neo-panel border border-white/10 bg-[#12141A] text-center space-y-4 max-w-xl mx-auto my-8">
              <BookOpen className="w-10 h-10 text-gray-500 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white font-mono uppercase">
                  NO ARTICLES FOUND
                </h3>
                <p className="text-xs text-gray-400 font-sans">
                  No technical whitepapers match your current search query or filter criteria.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setSelectedDifficulty('ALL');
                }}
                className="px-4 py-2 rounded-xl neo-button text-xs font-mono text-[#0070F3] hover:text-white border border-[#0070F3]/30"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(art => (
                <LearningCard
                  key={art.id}
                  article={art}
                  onRead={a => setActiveArticle(a)}
                  onAskAI={a => handleAskAI(a)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Deep Article Reader Modal */}
      {activeArticle && (
        <ArticleReaderModal
          article={activeArticle}
          experienceMode={experienceMode}
          onClose={() => setActiveArticle(null)}
          onAskEngineer={topic => {
            setActiveArticle(null);
            navigateTo('/ai-engineer');
          }}
          onExploreMarketplace={cat => {
            setActiveArticle(null);
            handleExploreMarketplace(cat);
          }}
        />
      )}
    </PageContainer>
  );
};
