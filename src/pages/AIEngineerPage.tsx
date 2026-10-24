import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { MarkdownViewer } from '../components/ui/MarkdownViewer';
import { ChiefEngineerChat } from '../components/ai/ChiefEngineerChat';
import { ConceptRenderGenerator } from '../components/ai/ConceptRenderGenerator';
import { VeoVideoGenerator } from '../components/ai/VeoVideoGenerator';
import { LiveVoiceDesk } from '../components/ai/LiveVoiceDesk';
import { buildAIContext, DriveForgeAIContext } from '../lib/ai/aiContext';
import {
  askChiefEngineer,
  getSuggestedQuestions,
  AIMessage,
  AIResponse
} from '../lib/ai/aiService';
import {
  Bot,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  Cpu,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  DollarSign,
  Layers,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Gauge,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  MapPin,
  X,
  Image,
  Film,
  Mic,
  Search
} from 'lucide-react';

export const AIEngineerPage: React.FC = () => {
  const {
    activeVehicle,
    buildState,
    buildComponents,
    selectedCountry,
    selectedRegion,
    experienceMode,
    setExperienceMode,
    activeEngineerComponentId,
    setActiveEngineerComponentId,
    activeEngineerWorkshopId,
    setActiveEngineerWorkshopId,
    navigateTo
  } = useApp();

  const [showImageGen, setShowImageGen] = useState(false);
  const [showVeoGen, setShowVeoGen] = useState(false);
  const [showLiveVoice, setShowLiveVoice] = useState(false);
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);
  const [modelTier, setModelTier] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');

  // 1. Build Normalized AI Context
  const aiContext: DriveForgeAIContext = useMemo(() => {
    return buildAIContext(
      activeVehicle,
      buildState,
      buildComponents,
      selectedCountry,
      selectedRegion,
      experienceMode,
      activeEngineerComponentId,
      activeEngineerWorkshopId
    );
  }, [
    activeVehicle,
    buildState,
    buildComponents,
    selectedCountry,
    selectedRegion,
    experienceMode,
    activeEngineerComponentId,
    activeEngineerWorkshopId
  ]);

  // Dynamic suggested questions based on actual build state
  const suggestedQuestions = useMemo(() => {
    return getSuggestedQuestions(aiContext);
  }, [aiContext]);

  // Initial welcome message grounded in current build
  const initialGreetingMessage: AIMessage & { responseObj?: AIResponse } = useMemo(() => {
    const { vehicle, build, cost, performance, location } = aiContext;
    const compCount = build.componentCount;

    let text = `Greetings. I am the **DriveForge AI Chief Engineer**, your build-aware automotive engineering assistant.

I have loaded telemetry and CAD parameters for your **${vehicle.year} ${vehicle.brand} ${vehicle.model} (${vehicle.variant || vehicle.chassisCode})**.

**CURRENT BUILD STATUS:**
• Active Blueprint: **${build.name}** (${compCount} ${compCount === 1 ? 'component' : 'components'})
• Regional Location: **${location.region}, ${location.country}**
• Estimated Project Range: **${cost.totalFormatted}** (Parts: ${cost.partsFormatted} | Labor: ${cost.laborFormatted})
• Projected Power: **${performance.projectedHpMin}–${performance.projectedHpMax} HP** (+${performance.deltaHpMin}–${performance.deltaHpMax} HP over stock ${vehicle.powerHp} HP)
• Health Status: **${build.healthStatus}** (${build.healthHeadline})`;

    if (aiContext.activeWorkshop) {
      text += `\n\nI have loaded workshop capabilities for **${aiContext.activeWorkshop.name}** in ${aiContext.activeWorkshop.city}. They are evaluated as **${aiContext.activeWorkshop.matchLevel}** for your current build. You can ask me what technical questions, torque specs, or alignment printouts to request before dropping off your car.`;
    } else if (aiContext.activeComponent) {
      text += `\n\nI noticed you were inspecting the **${aiContext.activeComponent.brand} ${aiContext.activeComponent.name}** (${aiContext.activeComponent.category}). I can answer specific questions regarding its fitment, installation difficulty, or dyno expectations.`;
    } else if (compCount === 0) {
      text += `\n\nYour vehicle is currently in stock OEM configuration. Ask me what modifications to prioritize for your driving goals.`;
    } else {
      text += `\n\nHow can I assist with your build parameters, mechanical clearances, or installation sequence?`;
    }

    return {
      id: 'greeting-0',
      role: 'assistant',
      content: text,
      timestamp: 'Active Session'
    };
  }, [activeVehicle.id, buildState.buildId]);

  // Chat message thread state
  const [messages, setMessages] = useState<(AIMessage & { responseObj?: AIResponse })[]>([
    initialGreetingMessage
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusLabel, setStatusLabel] = useState<'READY' | 'ANALYZING' | 'LOCAL' | 'ONLINE'>('READY');
  const [activeProviderName, setActiveProviderName] = useState<string>('Chief Engineer Engine');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showMobileContextDrawer, setShowMobileContextDrawer] = useState(false);
  const [activeTabMode, setActiveTabMode] = useState<'consultation' | 'audit'>('consultation');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  // Reset chat if vehicle or build changes drastically
  useEffect(() => {
    setMessages([initialGreetingMessage]);
  }, [initialGreetingMessage]);

  // Handle message submission
  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isAnalyzing) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    if (!textToSend) setInputQuery('');
    setIsAnalyzing(true);
    setStatusLabel('ANALYZING');

    try {
      const response = await askChiefEngineer(aiContext, updatedHistory);
      setActiveProviderName(response.provider);
      setStatusLabel(response.isFallback ? 'LOCAL' : 'ONLINE');

      const assistantMessage: AIMessage & { responseObj?: AIResponse } = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        responseObj: response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('[AIEngineerPage Error]:', err);
      const errorMessage: AIMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `**SYSTEM NOTICE**: Unable to complete engineering analysis for "${query}". Please verify connection or retry using local engineering mode.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
      setStatusLabel('READY');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Quick Action Handler
  const handleQuickAction = (actionType: string) => {
    switch (actionType) {
      case 'explain':
        handleSend('Can you explain my current build and summarize its primary characteristics?');
        break;
      case 'compatibility':
        handleSend('Is my current build completely compatible, and are there any clearance conflicts?');
        break;
      case 'performance':
        handleSend('What is the projected power gain, torque increase, and acceleration impact?');
        break;
      case 'risks':
        handleSend('What are the thermal stress and drivetrain reliability risks of this build?');
        break;
      case 'cost':
        handleSend('How much will this build cost in my region, including workshop labor?');
        break;
      case 'order':
        handleSend('What is the recommended installation order for these components?');
        break;
    }
  };

  // Copy message to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Reset Conversation
  const handleResetChat = () => {
    setMessages([initialGreetingMessage]);
    setActiveEngineerComponentId(null);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <PageContainer
      eyebrow="DRIVEFORGE AI • CHIEF ENGINEER"
      title="Chief Engineer AI Workspace"
      subtitle="Your build-aware automotive engineering assistant. Telemetry grounded in CAD tolerances, regional part pricing, and physical fitment analysis."
      action={
        <div className="flex items-center gap-2">
          {/* Experience Mode Toggle */}
          <div className="flex items-center rounded-xl neo-inset p-1 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setExperienceMode('beginner')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                experienceMode === 'beginner'
                  ? 'bg-[#0070F3] text-white font-bold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setExperienceMode('enthusiast')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                experienceMode === 'enthusiast'
                  ? 'bg-[#0070F3] text-white font-bold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Enthusiast
            </button>
          </div>

          <NeoButton
            variant="outline"
            size="sm"
            onClick={handleResetChat}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            New Build Chat
          </NeoButton>
        </div>
      }
    >
      {/* ================= CHAT HEADER & IDENTITY BAR ================= */}
      <div className="p-4 sm:p-5 rounded-[24px] neo-panel border border-white/10 bg-[#12141A] space-y-4">
        
        {/* Top AI Action Tools Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowImageGen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            >
              <Image className="w-3.5 h-3.5 text-[#0070F3]" />
              <span>Concept Renders</span>
            </button>

            <button
              onClick={() => setShowVeoGen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            >
              <Film className="w-3.5 h-3.5 text-[#D6C09A]" />
              <span>Veo 3 Video</span>
            </button>

            <button
              onClick={() => setShowLiveVoice(true)}
              className="px-3 py-1.5 rounded-xl bg-[#28483D] hover:bg-[#28483D]/80 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Live Voice Desk</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Grounding Toggle */}
            <button
              onClick={() => setUseSearchGrounding(!useSearchGrounding)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                useSearchGrounding
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                  : 'bg-white/5 text-gray-400 border-white/10'
              }`}
            >
              <Search className="w-3 h-3" />
              <span>Google Search Grounding: {useSearchGrounding ? 'ON' : 'OFF'}</span>
            </button>

            {/* Model Tier Selector */}
            <select
              value={modelTier}
              onChange={e => setModelTier(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg bg-[#111316] text-white text-xs font-mono border border-white/10 focus:outline-none"
            >
              <option value="gemini-3.5-flash">Gemini 3.5 Flash (General)</option>
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Complex)</option>
              <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite (Fast)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0070F3] text-white flex items-center justify-center shadow-lg shadow-[#0070F3]/25 shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-sans text-white tracking-tight">
                  DRIVEFORGE AI • CHIEF ENGINEER
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 border border-white/10 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  {statusLabel === 'ANALYZING' ? 'PROCESSING' : 'ACTIVE CONTEXT'}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans">
                "Your build-aware automotive engineering assistant."
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1 rounded-xl neo-inset border border-white/5 flex items-center gap-1.5 text-gray-300">
              <span className="text-gray-500">PLATFORM:</span>
              <span className="text-white font-bold">{aiContext.vehicle.year} {aiContext.vehicle.brand} {aiContext.vehicle.model}</span>
            </div>

            <div className="px-3 py-1 rounded-xl neo-inset border border-white/5 flex items-center gap-1.5 text-gray-300">
              <span className="text-gray-500">PARTS:</span>
              <span className="text-white font-bold">{aiContext.build.componentCount}</span>
            </div>

            <div className={`px-2.5 py-1 rounded-xl border text-[11px] font-mono font-bold uppercase ${
              aiContext.build.healthStatus === 'GOOD'
                ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                : aiContext.build.healthStatus === 'REVIEW'
                ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30'
                : 'bg-red-500/15 text-red-400 border-red-500/30'
            }`}>
              BUILD HEALTH: {aiContext.build.healthStatus}
            </div>
          </div>
        </div>

        {/* Telemetry Checklist Bar */}
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-gray-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-[#10B981]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Vehicle Telemetry
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1 text-[#10B981]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Compatibility Engine
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1 text-[#10B981]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Performance Kinematics
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1 text-[#10B981]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Regional Pricing ({aiContext.location.regionCode})
            </span>
          </div>

          <button
            onClick={() => setShowMobileContextDrawer(!showMobileContextDrawer)}
            className="lg:hidden flex items-center gap-1 text-xs text-[#0070F3] font-bold cursor-pointer"
          >
            <span>{showMobileContextDrawer ? 'Hide Context' : 'View Build Context'}</span>
            {showMobileContextDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ================= WORKSPACE GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT / MAIN: CONVERSATION (8 cols on lg) ================= */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Mode Switcher: AI Consultation Chat vs Diagnostics & Quick Audit */}
          <div className="flex items-center justify-between p-1.5 rounded-2xl neo-panel border border-white/10 bg-[#12141A]">
            <div className="flex items-center gap-1.5 p-1 rounded-xl neo-inset border border-white/10">
              <button
                onClick={() => setActiveTabMode('consultation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTabMode === 'consultation'
                    ? 'bg-[#0070F3] text-white shadow-lg shadow-[#0070F3]/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Chief Engineer Chat</span>
              </button>
              <button
                onClick={() => setActiveTabMode('audit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTabMode === 'audit'
                    ? 'bg-[#0070F3] text-white shadow-lg shadow-[#0070F3]/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Diagnostics & Quick Audit</span>
              </button>
            </div>
            <div className="text-[11px] font-mono text-gray-400 hidden sm:block pr-2">
              {activeTabMode === 'consultation'
                ? 'Advice, compatibility checks & upgrade roadmap'
                : 'Raw diagnostic queries & parameter inspect'}
            </div>
          </div>

          {activeTabMode === 'consultation' ? (
            <div className="h-[640px]">
              <ChiefEngineerChat />
            </div>
          ) : (
            <>
              {/* Active Workshop Context Banner */}
              {aiContext.activeWorkshop && (
                <div className="p-3.5 rounded-2xl neo-inset border border-[#0070F3]/30 bg-[#0070F3]/5 flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-[#0070F3]/15 border border-[#0070F3]/30 flex items-center justify-center text-[#0070F3] shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-[10px] tracking-wider uppercase">Active Workshop Focus</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#0070F3]/20 text-[#0070F3] border border-[#0070F3]/30">
                          {aiContext.activeWorkshop.matchLevel}
                        </span>
                      </div>
                      <div className="text-white font-bold truncate">
                        {aiContext.activeWorkshop.name} <span className="text-gray-400 font-normal">({aiContext.activeWorkshop.city}, {aiContext.activeWorkshop.region})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigateTo('/workshops')}
                      className="px-2.5 py-1 rounded-lg neo-button text-[11px] text-[#0070F3] hover:text-white border border-[#0070F3]/30 cursor-pointer"
                    >
                      Change
                    </button>
                    <button
                      onClick={() => setActiveEngineerWorkshopId(null)}
                      className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
                      title="Clear workshop focus"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

          {/* Quick Actions Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
              QUICK AUDIT:
            </span>
            <button
              onClick={() => handleQuickAction('explain')}
              className="px-3 py-1.5 rounded-xl neo-button text-xs font-mono text-gray-300 hover:text-white border border-white/10 shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-[#0070F3]" />
              <span>Explain Build</span>
            </button>
            <button
              onClick={() => handleQuickAction('compatibility')}
              className="px-3 py-1.5 rounded-xl neo-button text-xs font-mono text-gray-300 hover:text-white border border-white/10 shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Check Compatibility</span>
            </button>
            <button
              onClick={() => handleQuickAction('performance')}
              className="px-3 py-1.5 rounded-xl neo-button text-xs font-mono text-gray-300 hover:text-white border border-white/10 shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Analyze Performance</span>
            </button>
            <button
              onClick={() => handleQuickAction('risks')}
              className="px-3 py-1.5 rounded-xl neo-button text-xs font-mono text-gray-300 hover:text-white border border-white/10 shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Review Risks</span>
            </button>
            <button
              onClick={() => handleQuickAction('cost')}
              className="px-3 py-1.5 rounded-xl neo-button text-xs font-mono text-gray-300 hover:text-white border border-white/10 shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Check Cost</span>
            </button>
            <button
              onClick={() => handleQuickAction('order')}
              className="px-3 py-1.5 rounded-xl neo-button text-xs font-mono text-gray-300 hover:text-white border border-white/10 shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>Build Order</span>
            </button>
          </div>

          {/* Chat Stream Window */}
          <NeoCard variant="panel" radius="28" className="p-4 sm:p-6 h-[540px] flex flex-col justify-between bg-[#12141A]">
            
            {/* Scrollable Messages */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                const structured = msg.responseObj?.structured;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-[#0070F3] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-[#0070F3]/30">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`max-w-2xl space-y-2 ${isUser ? 'text-right' : 'text-left'}`}>
                      {/* Message Meta */}
                      <div className={`flex items-center gap-2 text-[10px] font-mono text-gray-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <span className="font-bold text-gray-300">
                          {isUser ? 'YOU' : 'DRIVEFORGE CHIEF ENGINEER'}
                        </span>
                        {!isUser && msg.responseObj && (
                          <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-[9px] text-gray-400">
                            {msg.responseObj.isFallback ? 'LOCAL ASSISTANT' : 'GEMINI 3.8'}
                          </span>
                        )}
                        <span>{msg.timestamp}</span>

                        {!isUser && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors ml-1 cursor-pointer"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-[#10B981]" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Message Bubble / Card */}
                      <div
                        className={`p-4 rounded-2xl ${
                          isUser
                            ? 'bg-[#0070F3] text-white rounded-tr-none shadow-lg shadow-[#0070F3]/20 font-medium text-xs sm:text-sm'
                            : 'neo-inset text-gray-200 rounded-tl-none border border-white/5 space-y-3'
                        }`}
                      >
                        {/* If Chief Engineer structured sections exist */}
                        {!isUser && structured && structured.hasStructuredSections ? (
                          <div className="space-y-3 font-sans text-xs sm:text-sm">
                            {/* Direct Answer */}
                            {structured.directAnswer && (
                              <div className="space-y-1">
                                <div className="text-[10px] font-mono font-bold text-[#0070F3] uppercase tracking-wider">
                                  DIRECT ANSWER
                                </div>
                                <MarkdownViewer content={structured.directAnswer} />
                              </div>
                            )}

                            {/* Why / Engineering Logic */}
                            {structured.why && (
                              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                                <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                                  ENGINEERING REASONING
                                </div>
                                <MarkdownViewer content={structured.why} className="text-gray-300" />
                              </div>
                            )}

                            {/* Current Data */}
                            {structured.currentData && (
                              <div className="p-3 rounded-xl bg-[#0070F3]/5 border border-[#0070F3]/20 space-y-1">
                                <div className="text-[10px] font-mono font-bold text-[#0070F3] uppercase tracking-wider">
                                  CURRENT TELEMETRY & SPECS
                                </div>
                                <MarkdownViewer content={structured.currentData} className="text-gray-200 font-mono text-xs" />
                              </div>
                            )}

                            {/* Recommendation */}
                            {structured.recommendation && (
                              <div className="p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/25 space-y-1">
                                <div className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-wider">
                                  RECOMMENDED ACTION
                                </div>
                                <MarkdownViewer content={structured.recommendation} className="text-gray-200" />
                              </div>
                            )}

                            {/* Verification Required */}
                            {structured.verificationRequired && (
                              <div className="p-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 space-y-1">
                                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#F59E0B] uppercase tracking-wider">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>PHYSICAL VERIFICATION REQUIRED</span>
                                </div>
                                <MarkdownViewer content={structured.verificationRequired} className="text-gray-200" />
                              </div>
                            )}
                          </div>
                        ) : (
                          // Standard Markdown text
                          <MarkdownViewer content={msg.content} />
                        )}
                      </div>
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-xl neo-inset flex items-center justify-center text-[#0070F3] shrink-0 mt-0.5 border border-white/5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Analyzing pulse state */}
              {isAnalyzing && (
                <div className="flex items-center gap-3 p-3 rounded-2xl neo-inset border border-white/5 text-xs font-mono text-gray-300 animate-pulse max-w-md">
                  <div className="w-6 h-6 rounded-lg bg-[#0070F3]/20 text-[#0070F3] flex items-center justify-center shrink-0">
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div>
                    <div className="text-white font-bold">ANALYZING BUILD TELEMETRY...</div>
                    <p className="text-[10px] text-gray-400">
                      Cross-referencing {aiContext.vehicle.model} CAD clearances, torque bounds, and regional rates.
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Chips (Context-Aware) */}
            <div className="pt-3 border-t border-white/5 space-y-2 shrink-0">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#0070F3]" />
                <span>CONTEXTUAL INQUIRIES FOR THIS BUILD:</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    disabled={isAnalyzing}
                    className="px-2.5 py-1.5 rounded-xl neo-inset hover:border-[#0070F3]/40 text-[11px] font-sans text-gray-300 hover:text-white transition-all cursor-pointer text-left border border-white/5 disabled:opacity-50"
                  >
                    "{q}"
                  </button>
                ))}
              </div>

              {/* Composer Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 pt-1"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={`Ask Chief Engineer about your ${aiContext.vehicle.model} build...`}
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    disabled={isAnalyzing}
                    className="w-full neo-inset px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 rounded-2xl focus:outline-none focus:border-[#0070F3]/50 font-sans border border-white/5 disabled:opacity-50"
                  />
                  {inputQuery && (
                    <button
                      type="button"
                      onClick={() => setInputQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400 hover:text-white cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <NeoButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isAnalyzing || !inputQuery.trim()}
                  icon={<Send className="w-4 h-4" />}
                >
                  Send
                </NeoButton>
              </form>
            </div>

          </NeoCard>
            </>
          )}
        </div>

        {/* ================= RIGHT COLUMN: BUILD CONTEXT PANEL (4 cols on lg) ================= */}
        <div className={`lg:col-span-4 space-y-4 ${showMobileContextDrawer ? 'block' : 'hidden lg:block'}`}>
          
          <NeoCard variant="panel" radius="28" className="p-5 space-y-5 bg-[#12141A] border border-white/10">
            
            {/* Context Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0070F3]" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  ACTIVE BUILD CONTEXT
                </h3>
              </div>
              <span className="text-[10px] font-mono text-gray-400">
                ID: {aiContext.build.id}
              </span>
            </div>

            {/* 1. Vehicle Snapshot */}
            <div className="p-3.5 rounded-2xl neo-inset border border-white/5 space-y-2">
              <div className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                VEHICLE PLATFORM
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white font-sans">
                    {aiContext.vehicle.year} {aiContext.vehicle.brand} {aiContext.vehicle.model}
                  </h4>
                  <p className="text-[11px] font-mono text-gray-400">
                    {aiContext.vehicle.variant} • {aiContext.vehicle.engine}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white font-bold">
                  {aiContext.vehicle.drivetrain}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] font-mono border-t border-white/5">
                <div>
                  <span className="text-gray-500 block">STOCK POWER</span>
                  <strong className="text-white">{aiContext.vehicle.powerHp} HP</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">STOCK TORQUE</span>
                  <strong className="text-white">{aiContext.vehicle.torqueLbFt} lb-ft</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">WEIGHT</span>
                  <strong className="text-white">{aiContext.vehicle.weightKg} kg</strong>
                </div>
              </div>
            </div>

            {/* 2. Projected Performance Metrics */}
            <div className="p-3.5 rounded-2xl neo-inset border border-white/5 space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-gray-400 uppercase">
                <span>PROJECTED POWER & MASS</span>
                <span className="text-[#0070F3]">{aiContext.performance.confidence}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-gray-400 block">DYNO OUTPUT</span>
                  <strong className="text-white text-sm">
                    {aiContext.performance.projectedHpMin}–{aiContext.performance.projectedHpMax} HP
                  </strong>
                  <span className="text-[10px] text-[#10B981] block">
                    (+{aiContext.performance.deltaHpMin}–{aiContext.performance.deltaHpMax} HP)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-gray-400 block">CHASSIS MASS</span>
                  <strong className="text-white text-sm">
                    {aiContext.performance.projectedWeightKg} kg
                  </strong>
                  <span className={`text-[10px] block ${aiContext.performance.weightDeltaKg <= 0 ? 'text-[#10B981]' : 'text-amber-400'}`}>
                    ({aiContext.performance.weightDeltaKg > 0 ? '+' : ''}{aiContext.performance.weightDeltaKg} kg)
                  </span>
                </div>
              </div>

              {aiContext.performance.acceleration0to100StockSec && (
                <div className="flex items-center justify-between text-xs font-mono pt-1 text-gray-300">
                  <span className="text-gray-400">0–100 km/h:</span>
                  <span>
                    {aiContext.performance.acceleration0to100StockSec.toFixed(1)}s (Stock) →{' '}
                    <strong className="text-white">
                      {aiContext.performance.acceleration0to100ProjMinSec?.toFixed(1)}–{aiContext.performance.acceleration0to100ProjMaxSec?.toFixed(1)}s
                    </strong>
                  </span>
                </div>
              )}
            </div>

            {/* 3. Regional Financials */}
            <div className="p-3.5 rounded-2xl neo-inset border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-gray-400 uppercase">
                <span>REGIONAL ESTIMATE ({aiContext.location.regionCode})</span>
                <span className="text-emerald-400">{aiContext.cost.confidence}</span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xs text-gray-300 font-sans">Total Estimated Cost:</span>
                <strong className="text-base font-mono text-white">
                  {aiContext.cost.totalFormatted}
                </strong>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-400 pt-1 border-t border-white/5">
                <div>
                  <span>HARDWARE:</span> <strong className="text-gray-200">{aiContext.cost.partsFormatted}</strong>
                </div>
                <div>
                  <span>WORKSHOP LABOR:</span> <strong className="text-gray-200">{aiContext.cost.laborFormatted}</strong>
                </div>
              </div>
            </div>

            {/* 4. Physical Build Components List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-gray-400 uppercase">
                <span>INSTALLED HARDWARE ({aiContext.build.components.length})</span>
                <button
                  onClick={() => navigateTo('/build')}
                  className="text-[#0070F3] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Edit Blueprint</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>

              {aiContext.build.components.length === 0 ? (
                <div className="p-4 rounded-xl neo-inset text-center text-xs font-mono text-gray-400">
                  No aftermarket components selected yet.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {aiContext.build.components.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => handleSend(`Tell me about the ${comp.brand} ${comp.name} (${comp.category}) in this build.`)}
                      className="w-full text-left p-2 rounded-xl neo-inset hover:border-[#0070F3]/40 border border-white/5 transition-all text-xs flex items-center justify-between cursor-pointer group"
                      title="Click to ask Chief Engineer about this component"
                    >
                      <div className="truncate pr-2">
                        <span className="font-bold text-white group-hover:text-[#0070F3] transition-colors block truncate">
                          {comp.brand} {comp.name}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">
                          {comp.category} • {comp.priceEstimate}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 group-hover:text-white shrink-0">
                        Ask →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Verification Requirements */}
            {aiContext.verificationRequirements.length > 0 && (
              <div className="p-3 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#F59E0B] uppercase">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>VERIFICATION REQUIRED ({aiContext.verificationRequirements.length})</span>
                </div>
                <div className="space-y-1 text-xs font-sans text-gray-200">
                  {aiContext.verificationRequirements.map((req) => (
                    <div key={req.id} className="flex items-start gap-1.5">
                      <span className="text-[#F59E0B] mt-0.5">•</span>
                      <div>
                        <strong className="text-white text-xs">{req.title}:</strong>{' '}
                        <span className="text-gray-300 text-[11px]">{req.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <NeoButton
                variant="primary"
                size="sm"
                onClick={() => navigateTo('/build/analysis')}
                className="w-full justify-center"
                icon={<Gauge className="w-4 h-4" />}
              >
                View Full Build Analysis
              </NeoButton>

              <NeoButton
                variant="outline"
                size="sm"
                onClick={() => navigateTo('/build')}
                className="w-full justify-center"
                icon={<Wrench className="w-4 h-4" />}
              >
                Physical Build Plan & Fitment
              </NeoButton>
            </div>

          </NeoCard>

        </div>

      </div>

      {/* Interactive AI Feature Modals */}
      <ConceptRenderGenerator
        isOpen={showImageGen}
        onClose={() => setShowImageGen(false)}
      />

      <VeoVideoGenerator
        isOpen={showVeoGen}
        onClose={() => setShowVeoGen(false)}
      />

      <LiveVoiceDesk
        isOpen={showLiveVoice}
        onClose={() => setShowLiveVoice(false)}
      />
    </PageContainer>
  );
};
