import React from 'react';
import { 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  X, 
  Radio, 
  ShieldAlert, 
  Compass, 
  Battery, 
  Heart, 
  CheckCircle2 
} from 'lucide-react';
import { SOSBeacon } from '../types';
import { soundFX } from '../utils/audio';

interface SOSActiveOverlayProps {
  beacon: SOSBeacon | null;
  onCancel: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const SOSActiveOverlay: React.FC<SOSActiveOverlayProps> = ({
  beacon,
  onCancel,
  soundEnabled,
  setSoundEnabled,
}) => {
  if (!beacon || !beacon.active) return null;

  const toggleSound = () => {
    if (soundEnabled) {
      soundFX.stopSiren();
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
      soundFX.startSiren();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="relative bg-gradient-to-br from-red-950 via-[#18090d] to-black border-2 border-red-500 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-red-600/50 overflow-hidden">
        {/* Pulsing red beacon glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl bg-red-600 text-white animate-emergency-pulse">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-black tracking-widest text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                  SOS BEACON ACTIVE
                </span>
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              </div>
              <h4 className="text-base font-black text-white tracking-tight mt-0.5">
                Broadcasting Emergency Location
              </h4>
            </div>
          </div>

          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Siren' : 'Enable Siren'}
            className="p-2 rounded-xl bg-[#2b1016] text-red-300 hover:text-white border border-red-700/60"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>

        {/* Beacon Telemetry */}
        <div className="mt-3 p-2.5 rounded-xl bg-black/60 border border-red-900/60 text-xs font-mono space-y-1">
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-500">Triage:</span>
            <span className="text-red-400 font-bold">{beacon.emergencyType}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-500">GPS Coords:</span>
            <span className="text-emerald-400 font-bold">
              {beacon.gpsCoords.lat.toFixed(4)}° N, {Math.abs(beacon.gpsCoords.lng).toFixed(4)}° W
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-500">Blood / Persons:</span>
            <span>{beacon.bloodType} • {beacon.personsCount} person(s)</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-500">Mesh Hops:</span>
            <span className="text-cyan-300">Relaying to {beacon.hopsCount} nearby nodes</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onCancel}
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Cancel SOS (I Am Safe)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
