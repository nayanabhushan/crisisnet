import React from 'react';
import { 
  Radio, 
  Wifi, 
  WifiOff, 
  Battery, 
  BatteryCharging, 
  BatteryLow, 
  Sparkles, 
  HeartPulse, 
  AlertTriangle,
  Activity,
  Volume2,
  VolumeX
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface NavbarProps {
  isOfflineMode: boolean;
  setIsOfflineMode: (val: boolean) => void;
  batteryPct: number;
  meshNodesCount: number;
  activeHazardsCount: number;
  onOpenSOS: () => void;
  onOpenTinyFish: () => void;
  onOpenFirstAid: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isOfflineMode,
  setIsOfflineMode,
  batteryPct,
  meshNodesCount,
  activeHazardsCount,
  onOpenSOS,
  onOpenTinyFish,
  onOpenFirstAid,
  soundEnabled,
  setSoundEnabled,
}) => {
  const getBatteryIcon = () => {
    if (batteryPct <= 20) return <BatteryLow className="w-4 h-4 text-red-400 animate-pulse" />;
    if (batteryPct >= 80) return <BatteryCharging className="w-4 h-4 text-emerald-400" />;
    return <Battery className="w-4 h-4 text-amber-400" />;
  };

  const getMeshRole = () => {
    if (batteryPct <= 15) return { role: 'Receive-Only', color: 'text-amber-400' };
    if (batteryPct >= 50) return { role: 'Relay Super-Node', color: 'text-cyan-400' };
    return { role: 'Mesh Relay', color: 'text-blue-400' };
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) soundFX.playChirp(700, 0.1);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0e15]/95 backdrop-blur-md border-b border-[#1c2233] px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-amber-500 shadow-lg shadow-red-500/20 border border-red-400/40">
            <Radio className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg sm:text-xl text-white">
                Crisis<span className="text-red-500">Net</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60">
                P2P Mesh
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Autonomous Offline Mesh &amp; TinyFish AI Verification
            </p>
          </div>
        </div>

        {/* Center Indicators: Offline / P2P Mesh status */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Offline Simulation Toggle Button */}
          <button
            onClick={() => {
              setIsOfflineMode(!isOfflineMode);
              if (soundEnabled) soundFX.playChirp(isOfflineMode ? 900 : 500);
            }}
            title="Click to simulate offline / airplane mode"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isOfflineMode
                ? 'bg-amber-950/70 border-amber-500/60 text-amber-300 shadow-sm shadow-amber-900/40'
                : 'bg-emerald-950/50 border-emerald-600/50 text-emerald-300'
            }`}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Airplane Mode:</span>
                <span className="font-mono font-bold">Mesh Only</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Live Net:</span>
                <span className="font-mono font-bold">Online + Mesh</span>
              </>
            )}
          </button>

          {/* Active Nodes counter pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141824] border border-[#232b40] text-xs text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>P2P Nodes:</span>
            <span className="font-mono font-bold text-cyan-300">{meshNodesCount} active</span>
          </div>

          {/* Battery Status with dynamic Role */}
          <div 
            title={`Battery ${batteryPct}% — Configured as ${getMeshRole().role}`}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#141824] border border-[#232b40] text-xs"
          >
            {getBatteryIcon()}
            <span className="font-mono font-semibold text-slate-200">{batteryPct}%</span>
            <span className={`text-[10px] hidden xl:inline font-mono ${getMeshRole().color}`}>
              ({getMeshRole().role})
            </span>
          </div>
        </div>

        {/* Action Buttons: Sound, TinyFish Live, First Aid, SOS */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute emergency audio' : 'Enable audio alerts'}
            className="p-2 rounded-lg bg-[#141824] hover:bg-[#1c2235] border border-[#232b40] text-slate-400 hover:text-white transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* TinyFish Agent Terminal Trigger */}
          <button
            onClick={onOpenTinyFish}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-600/50 text-blue-300 text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>TinyFish Agent</span>
          </button>

          {/* First Aid Co-Pilot Trigger */}
          <button
            onClick={onOpenFirstAid}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-500/50 text-emerald-300 text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">First Aid AI</span>
          </button>

          {/* Red Emergency SOS Trigger */}
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/40 border border-red-400/60 animate-emergency-pulse transition-transform active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-white" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
