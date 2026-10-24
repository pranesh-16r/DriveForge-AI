import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MarkdownViewer } from '../ui/MarkdownViewer';
import { buildAIContext, DriveForgeAIContext } from '../../lib/ai/aiContext';
import {
  askChiefEngineer,
  getSuggestedQuestions,
  AIMessage,
  AIResponse
} from '../../lib/ai/aiService';
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
  Sliders,
  HelpCircle,
  Lightbulb,
  Maximize2,
  Minimize2
} from 'lucide-react';

export type ChiefEngineerTab = 'advice' | 'compatibility' | 'performance';

interface ChiefEngineerChatProps {
  initialTab?: ChiefEngineerTab;
  onClose?: () => void;
  isCompact?: boolean;
  className?: string;
}

export const ChiefEngineerChat: React.FC<ChiefEngineerChatProps> = ({
  initialTab = 'advice',
  onClose,
  isCompact = false,
  className = ''
}) => {
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

  const [activeTab, setActiveTab] = useState<ChiefEngineerTab>(initialTab);

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

  // Initial greeting grounded in active vehicle
  const initialGreetingMessage: AIMessage & { responseObj?: AIResponse } = useMemo(() => {
    const { vehicle, build, cost, performance, location } = aiContext;
    const compCount = build.componentCount;

    let text = `Greetings. I am the **DriveForge AI Chief Engineer**, your build-aware automotive engineering advisor.

I have loaded geometry, CAD clearances, and dyno parameters for your **${vehicle.year} ${vehicle.brand} ${vehicle.model} (${vehicle.variant || vehicle.chassisCode})**.

**CURRENT BUILD TELEMETRY:**
• **Active Blueprint:** ${build.name} (${compCount} ${compCount === 1 ? 'component' : 'components'})
• **Estimated Investment:** ${cost.totalFormatted} in ${location.region}
• **Projected Power:** ${performance.projectedHpMin}–${performance.projectedHpMax} HP (Stock: ${vehicle.powerHp} HP)
• **Homologation & Health:** ${build.healthStatus} (${build.healthHeadline})

Select a category below or ask me any question about **modification advice**, **compatibility checks**, or **performance upgrades**.`;

    return {
      id: 'greeting-0',
      role: 'assistant',
      content: text,
      timestamp: 'Session Active'
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  // Reset chat if vehicle changes
  useEffect(() => {
    setMessages([initialGreetingMessage]);
  }, [initialGreetingMessage]);

  // Context-specific quick suggestion questions organized by the 3 requested categories
  const categoryQuestions = useMemo(() => {
    const vMake = activeVehicle.make;
    const vModel = activeVehicle.model;
    const vEngine = activeVehicle.engine || 'engine';
    const compCount = buildComponents.length;

    return {
      advice: [
        `What are the best first modifications for my ${vMake} ${vModel}?`,
        `Should I prioritize coilovers or sport lowering springs for daily road driving?`,
        `What exhaust configuration provides an aggressive tone without drone?`,
        `What supporting cooling upgrades should I install before track days?`,
        `Recommend a staged upgrade roadmap (Stage 1 to Stage 2) for this chassis.`
      ],
      compatibility: [
        `Check all ${compCount} components in my active build for mechanical conflicts.`,
        `Will upgrading to wider wheels cause fender rubbing or strut clearance issues?`,
        `Do my intake and exhaust modifications require a custom ECU remap?`,
        `Verify clearance between front big brake calipers and wheel barrels.`,
        `Are there any physical installation verifications needed before workshop delivery?`
      ],
      performance: [
        `What is the projected horsepower and torque gain with my current components?`,
        `Estimate the 0-60 mph acceleration improvement over stock factory time.`,
        `How does my build affect the vehicle's power-to-weight ratio and unsprung mass?`,
        `What are the thermal stress and transmission torque load ratings for this setup?`,
        `What modifications offer the highest horsepower gain per dollar spent?`
      ]
    };
  }, [activeVehicle, buildComponents]);

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
      console.error('[ChiefEngineerChat Error]:', err);
      const errorMessage: AIMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `**SYSTEM NOTICE**: Unable to complete engineering analysis for "${query}". The system has verified your vehicle parameters; please retry or inspect local CAD compatibility matrices.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
      setStatusLabel('READY');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Copy message text to clipboard
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
    <div
      className={`flex flex-col bg-[#14161C] neo-panel border border-white/10 rounded-[24px] shadow-2xl overflow-hidden ${
        isCompact ? 'h-[620px] max-w-xl w-full' : 'h-full min-h-[640px] w-full'
      } ${className}`}
    >
      {/* Top Header Strip */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-[#101217] flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-[#0070F3]/20 border border-[#0070F3]/40 flex items-center justify-center text-[#0070F3] shadow-lg">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#101217] ${
                statusLabel === 'ANALYZING'
                  ? 'bg-amber-400 animate-ping'
                  : statusLabel === 'ONLINE'
                  ? 'bg-[#10B981]'
                  : 'bg-[#0070F3]'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black font-sans text-white tracking-tight">
                AI Chief Engineer
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#0070F3]/15 text-[#38BDF8] border border-[#0070F3]/30">
                {statusLabel === 'ANALYZING' ? 'COMPUTING...' : activeProviderName.includes('Gemini') ? 'GEMINI 3.8 FLASH' : 'DETERMINISTIC CAD'}
              </span>
            </div>
            <p className="text-xs font-mono text-gray-400">
              {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} • {buildComponents.length} Parts in Build
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Experience Mode Toggle */}
          <div className="flex items-center rounded-xl neo-inset p-1 border border-white/10 text-[11px] font-mono">
            <button
              onClick={() => setExperienceMode('beginner')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                experienceMode === 'beginner'
                  ? 'bg-[#0070F3] text-white font-bold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Accessible, everyday driveability advice"
            >
              Beginner
            </button>
            <button
              onClick={() => setExperienceMode('enthusiast')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                experienceMode === 'enthusiast'
                  ? 'bg-[#0070F3] text-white font-bold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Motorsport telemetry & deep kinematic physics"
            >
              Enthusiast
            </button>
          </div>

          <button
            onClick={handleResetChat}
            className="p-2 rounded-xl bg-white/10 text-gray-300 hover:text-white border border-white/15 transition-colors cursor-pointer"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 text-gray-300 hover:text-white border border-white/15 transition-colors cursor-pointer"
              title="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3 Core Inquiry Categories Tab Bar */}
      <div className="px-4 py-2.5 bg-[#12141A] border-b border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mr-1">
          FOCUS:
        </span>
        <button
          onClick={() => setActiveTab('advice')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'advice'
              ? 'bg-[#28483D] text-white shadow-[0_0_12px_rgba(40,72,61,0.5)] border border-[#28483D]'
              : 'bg-white/10 text-gray-200 hover:text-white border border-white/15'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-[#D6C09A]" />
          <span>Modification Advice</span>
        </button>

        <button
          onClick={() => setActiveTab('compatibility')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'compatibility'
              ? 'bg-[#28483D] text-white shadow-[0_0_12px_rgba(40,72,61,0.5)] border border-[#28483D]'
              : 'bg-white/10 text-gray-200 hover:text-white border border-white/15'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
          <span>Compatibility Checks</span>
        </button>

        <button
          onClick={() => setActiveTab('performance')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'performance'
              ? 'bg-[#B47A52] text-white shadow-[0_0_12px_rgba(180,122,82,0.5)] border border-[#B47A52]'
              : 'bg-white/10 text-gray-200 hover:text-white border border-white/15'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Performance Upgrades</span>
        </button>
      </div>

      {/* Dynamic Suggested Question Chips for Active Category */}
      <div className="px-4 py-2 bg-[#0E1015] border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex-shrink-0">
          Suggested:
        </span>
        <div className="flex items-center gap-1.5">
          {categoryQuestions[activeTab].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isAnalyzing}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-gray-300 bg-white/5 hover:bg-[#0070F3]/20 hover:text-[#38BDF8] border border-white/10 hover:border-[#0070F3]/40 transition-all whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Message History Thread */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold shadow ${
                  isUser
                    ? 'bg-[#0070F3] text-white'
                    : 'bg-[#181B22] border border-[#0070F3]/40 text-[#38BDF8]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm font-sans ${
                  isUser
                    ? 'bg-[#0070F3] text-white font-medium shadow-lg rounded-tr-sm'
                    : 'bg-[#181B22] neo-inset border border-white/10 text-gray-200 shadow-xl rounded-tl-sm'
                }`}
              >
                {/* Assistant Telemetry Header */}
                {!isUser && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-1.5 text-[#38BDF8]">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Chief Engineer Advisory
                    </span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#10B981]" />
                          <span className="text-[#10B981]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Body Text / Markdown Viewer */}
                <div className="leading-relaxed">
                  <MarkdownViewer content={msg.content} />
                </div>

                {/* Timestamp */}
                <div
                  className={`mt-2 text-[10px] font-mono text-right ${
                    isUser ? 'text-white/70' : 'text-gray-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator when analyzing */}
        {isAnalyzing && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#181B22] border border-[#0070F3]/40 flex items-center justify-center flex-shrink-0 text-[#38BDF8]">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-sm bg-[#181B22] neo-inset border border-white/10 text-xs font-mono text-[#38BDF8] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0070F3] animate-ping" />
              <span>Analyzing CAD tolerances, dyno projections & compatibility rules...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="p-4 border-t border-white/10 bg-[#101217] flex-shrink-0 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                activeTab === 'advice'
                  ? 'Ask for modification advice or staged upgrade paths...'
                  : activeTab === 'compatibility'
                  ? 'Ask about component fitment, brake clearances, or conflicts...'
                  : 'Ask for horsepower gains, acceleration, or thermal recommendations...'
              }
              disabled={isAnalyzing}
              className="w-full py-3 pl-4 pr-10 rounded-xl bg-[#16181F] neo-inset border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0070F3] transition-colors disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={!inputQuery.trim() || isAnalyzing}
            className="p-3 rounded-xl neo-button bg-[#0070F3] text-white hover:bg-[#0060DF] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex-shrink-0 shadow-lg shadow-[#0070F3]/25"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 px-1">
          <span>Targeting: {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} ({activeVehicle.engine})</span>
          <span>Press Enter to consult</span>
        </div>
      </div>
    </div>
  );
};
