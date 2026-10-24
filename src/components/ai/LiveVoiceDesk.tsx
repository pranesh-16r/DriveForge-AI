import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mic, MicOff, Volume2, Radio, X, Cpu } from 'lucide-react';

interface LiveVoiceDeskProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoiceDesk: React.FC<LiveVoiceDeskProps> = ({ isOpen, onClose }) => {
  const { activeVehicle } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [aiResponseText, setAiResponseText] = useState<string>(
    `Hello, I am your Chief Engineer. I am monitoring the telemetry for your ${activeVehicle.make} ${activeVehicle.model}. Ask me anything about fitment, thermodynamics, or suspension damping.`
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!isOpen) return null;

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      setTranscript('Listening for engineering inquiry...');
      setTimeout(() => {
        setTranscript('“Will these 18-inch wheels require rolling the rear fenders?”');
        setTimeout(() => {
          setIsListening(false);
          setIsSpeaking(true);
          setAiResponseText(
            `With an 18x9.5 ET+45 setup on the ${activeVehicle.model}, fender clearance is approximately 4.8mm under full suspension compression. Rolling fenders is not required unless you run aggressive lower camber under -3.0 degrees.`
          );
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(
              `With an 18x9.5 ET plus 45 setup on the ${activeVehicle.model}, fender clearance is approximately 4.8 millimeters. Rolling fenders is not required.`
            );
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
          } else {
            setTimeout(() => setIsSpeaking(false), 3000);
          }
        }, 1200);
      }, 1500);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FAFAF7] text-[#171717] border border-[#292927]/15 shadow-2xl p-6 sm:p-8 space-y-6 text-center">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#292927]/10 pb-4">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#28483D] text-[#FAFAF7] uppercase">
              <Radio className="w-3.5 h-3.5 text-[#D6C09A] animate-pulse" />
              LIVE VOICE DESK (GEMINI LIVE API)
            </div>
            <h3 className="text-2xl font-black text-[#171717] uppercase tracking-tight font-sans">
              REAL-TIME VOICE CONVERSATION
            </h3>
            <p className="text-xs text-[#5A5955] font-sans">
              Model <code className="font-mono text-[#B47A52]">gemini-3.8-live</code> real-time audio interaction.
            </p>
          </div>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-2 rounded-xl text-[#5A5955] hover:text-[#171717] hover:bg-[#E8E2D8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Voice Pulse Circle */}
        <div className="relative py-4 flex items-center justify-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening
                ? 'bg-[#B47A52] text-white ring-8 ring-[#B47A52]/30 scale-110 animate-pulse'
                : isSpeaking
                ? 'bg-[#28483D] text-white ring-8 ring-[#28483D]/30 animate-pulse'
                : 'bg-[#171717] text-[#FAFAF7]'
            }`}
          >
            {isListening ? (
              <Mic className="w-10 h-10" />
            ) : isSpeaking ? (
              <Volume2 className="w-10 h-10 animate-bounce" />
            ) : (
              <Cpu className="w-10 h-10 text-[#D6C09A]" />
            )}
          </div>
        </div>

        {/* Response Area */}
        <div className="space-y-2 bg-[#E8E2D8]/50 p-4 rounded-2xl border border-[#292927]/10 text-left">
          {transcript && (
            <p className="text-xs font-mono text-[#B47A52] font-bold">
              USER VOICE: {transcript}
            </p>
          )}

          <p className="text-xs sm:text-sm text-[#171717] font-sans leading-relaxed">
            <strong className="font-bold text-[#28483D] block mb-1">CHIEF ENGINEER:</strong>
            {aiResponseText}
          </p>
        </div>

        {/* Action Toggle Button */}
        <button
          onClick={toggleMic}
          className={`w-full py-3.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
            isListening
              ? 'bg-[#B8644A] text-white'
              : 'bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7]'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>STOP LISTENING</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-[#D6C09A]" />
              <span>TAP TO SPEAK WITH CHIEF ENGINEER</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
