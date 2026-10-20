import React, { useState, useEffect } from 'react';
import { 
  X, 
  HeartPulse, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  Activity,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { FIRST_AID_GUIDES } from '../data/firstAidGuides';
import { FirstAidGuide, FirstAidStep } from '../types';
import { soundFX } from '../utils/audio';

interface FirstAidCoPilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

export const FirstAidCoPilotModal: React.FC<FirstAidCoPilotModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
}) => {
  const [activeGuideId, setActiveGuideId] = useState<string>(FIRST_AID_GUIDES[0].id);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [metronomeTickVisual, setMetronomeTickVisual] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const activeGuide =
    FIRST_AID_GUIDES.find((g) => g.id === activeGuideId) || FIRST_AID_GUIDES[0];
  const currentStep = activeGuide.steps[currentStepIdx] || activeGuide.steps[0];

  // Stop metronome on unmount or guide change
  useEffect(() => {
    return () => {
      soundFX.stopCPRMetronome();
    };
  }, []);

  const toggleMetronome = () => {
    if (isMetronomeActive) {
      soundFX.stopCPRMetronome();
      setIsMetronomeActive(false);
    } else {
      setIsMetronomeActive(true);
      soundFX.startCPRMetronome(110, () => {
        setMetronomeTickVisual((v) => !v);
      });
    }
  };

  const handleGuideChange = (id: string) => {
    soundFX.stopCPRMetronome();
    setIsMetronomeActive(false);
    setActiveGuideId(id);
    setCurrentStepIdx(0);
  };

  const speakInstruction = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c101a] border border-emerald-600/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#111726] border-b border-[#202a42] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-400">
              <HeartPulse className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Offline First Aid AI Co-Pilot
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  On-Device Triage
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Step-by-step audio &amp; visual guidance when paramedics are cut off
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.stopCPRMetronome();
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#1b2336] hover:bg-[#25304a] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protocol Selector Tabs */}
        <div className="bg-[#0e1320] px-4 py-2 border-b border-[#1c243a] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {FIRST_AID_GUIDES.map((g) => (
            <button
              key={g.id}
              onClick={() => handleGuideChange(g.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeGuideId === g.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'bg-[#151b2b] text-slate-400 hover:text-white border border-[#232d45]'
              }`}
            >
              {g.title.split('(')[0]}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Active Guide Overview */}
          <div className="p-3.5 rounded-xl bg-[#121828] border border-[#232f4c]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-emerald-400 font-bold uppercase">
                {activeGuide.category} • Urgency: {activeGuide.urgency}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                Step {currentStepIdx + 1} of {activeGuide.steps.length}
              </span>
            </div>
            <h4 className="text-base font-bold text-white tracking-tight">
              {activeGuide.title}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {activeGuide.description}
            </p>
          </div>

          {/* Interactive CPR Metronome Widget (if guide is CPR) */}
          {activeGuide.id === 'guide-cpr' && (
            <div className="p-4 rounded-xl bg-[#090d16] border-2 border-emerald-600/70 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-2xl transition-all duration-100 ${
                    metronomeTickVisual
                      ? 'bg-red-600 text-white scale-110 shadow-lg shadow-red-500/50'
                      : 'bg-[#151c2d] text-slate-400 scale-100'
                  }`}
                >
                  <Activity className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">
                      CPR Chest Compression Cadence
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 font-mono font-bold border border-red-800">
                      110 BPM
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Match chest compressions to the audio ticks and pulsing heart.
                  </p>
                </div>
              </div>

              <button
                onClick={toggleMetronome}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md ${
                  isMetronomeActive
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950 animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                }`}
              >
                {isMetronomeActive ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Metronome</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start CPR Cadence (110 BPM)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Current Step Focus Card */}
          <div className="p-4 rounded-xl bg-[#0e1424] border border-[#222e4d] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/60">
                STEP {currentStep.order}: {currentStep.instruction}
              </span>

              {/* Voice Readout Button */}
              <button
                onClick={() =>
                  speakInstruction(`${currentStep.instruction}. ${currentStep.detail}`)
                }
                title="Voice read instruction out loud"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#192238] hover:bg-[#233050] text-slate-300 hover:text-white text-xs font-semibold border border-[#2e3b5e]"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isSpeaking ? 'Stop Voice' : 'Voice Co-Pilot'}</span>
              </button>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {currentStep.detail}
            </p>

            {/* Critical Warning if any */}
            {currentStep.warning && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-700/60 text-xs text-red-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block uppercase tracking-wider text-[11px] text-red-400">
                    CRITICAL WARNING:
                  </span>
                  <p className="mt-0.5 leading-normal">{currentStep.warning}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step Navigation Controls Footer */}
        <div className="bg-[#101625] border-t border-[#1e273e] px-5 py-3.5 flex items-center justify-between gap-3">
          <button
            disabled={currentStepIdx === 0}
            onClick={() => setCurrentStepIdx((i) => Math.max(0, i - 1))}
            className="px-3.5 py-2 rounded-xl bg-[#1b2336] hover:bg-[#242f49] disabled:opacity-40 text-slate-300 text-xs font-semibold transition-colors"
          >
            Previous Step
          </button>

          <div className="flex gap-1.5">
            {activeGuide.steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIdx(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStepIdx === idx
                    ? 'bg-emerald-400 scale-125'
                    : 'bg-[#222c44] hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            disabled={currentStepIdx === activeGuide.steps.length - 1}
            onClick={() =>
              setCurrentStepIdx((i) => Math.min(activeGuide.steps.length - 1, i + 1))
            }
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
};
