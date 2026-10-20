import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Send, 
  MapPin, 
  Flame, 
  Droplets, 
  Building2, 
  Zap, 
  Skull, 
  HeartHandshake 
} from 'lucide-react';
import { HazardIncident, SeverityLevel, IncidentType } from '../types';
import { soundFX } from '../utils/audio';

interface NewHazardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitHazard: (hazard: Omit<HazardIncident, 'id' | 'reportedAt' | 'upvotes'>) => void;
  soundEnabled: boolean;
}

export const NewHazardModal: React.FC<NewHazardModalProps> = ({
  isOpen,
  onClose,
  onSubmitHazard,
  soundEnabled,
}) => {
  const [title, setTitle] = useState('');
  const [sector, setSector] = useState('Sector 4 (Riverside)');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('SEVERE');
  const [type, setType] = useState<IncidentType>('COLLAPSE');
  const [blockedRoute, setBlockedRoute] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (soundEnabled) soundFX.playEmergencyAlert();

    onSubmitHazard({
      title: title.trim(),
      sector,
      description: description.trim(),
      severity,
      status: 'ACTIVE',
      type,
      source: 'CROWDSOURCED_MESH',
      verifiedByTinyFish: false,
      tinyFishTimestamp: 'Submitted to BLE Mesh',
      lat: 37.7730,
      lng: -122.4180,
      blockedRoutes: blockedRoute ? [blockedRoute.trim()] : [],
      affectedRadiusMeters: 500,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e121c] border border-red-600/60 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#141824] border-b border-[#252c40] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-950 border border-red-600/60 text-red-400">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Report Hazard to Local Mesh
              </h3>
              <p className="text-xs text-slate-400">
                Instantly relays alert to all nearby peer devices
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1c2235] hover:bg-[#252e47] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Hazard Headline / Title:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Collapsed Power Pole on Oak St"
              className="w-full bg-[#0a0c14] border border-[#232b40] focus:border-red-500 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Sector Location:
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-[#0a0c14] border border-[#232b40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Sector 1 (Downtown)">Sector 1 (Downtown)</option>
                <option value="Sector 2 (Industrial)">Sector 2 (Industrial)</option>
                <option value="Sector 3 (Metro Core)">Sector 3 (Metro Core)</option>
                <option value="Sector 4 (Riverside)">Sector 4 (Riverside)</option>
                <option value="Sector 5 (Mission Ridge)">Sector 5 (Mission Ridge)</option>
                <option value="Sector 7 (Valley Basin)">Sector 7 (Valley Basin)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Severity Level:
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="w-full bg-[#0a0c14] border border-[#232b40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="CRITICAL">CRITICAL (Immediate Evac)</option>
                <option value="SEVERE">SEVERE (Active Danger)</option>
                <option value="MODERATE">MODERATE (Caution)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Hazard Type:
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as IncidentType)}
                className="w-full bg-[#0a0c14] border border-[#232b40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="COLLAPSE">Structural Collapse</option>
                <option value="FLOOD">Flash Flood Surge</option>
                <option value="FIRE">Wildfire / Explosion</option>
                <option value="GRID">Electrical / Grid Down</option>
                <option value="CHEMICAL">Toxic Chemical Leak</option>
                <option value="MEDICAL">Medical Surge</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Impassable Roadway:
              </label>
              <input
                type="text"
                value={blockedRoute}
                onChange={(e) => setBlockedRoute(e.target.value)}
                placeholder="e.g., Riverside Overpass"
                className="w-full bg-[#0a0c14] border border-[#232b40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Field Description &amp; Advice:
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened, any visible hazards, and safe perimeter..."
              className="w-full bg-[#0a0c14] border border-[#232b40] focus:border-red-500 rounded-lg p-3 text-xs sm:text-sm text-white focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1a2030] hover:bg-[#232b40] text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-950/50 hover:scale-102 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Over Mesh</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
