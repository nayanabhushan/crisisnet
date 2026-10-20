import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Droplets, 
  Building2, 
  Zap, 
  Skull, 
  HeartHandshake, 
  ShieldCheck, 
  Radio, 
  MapPin, 
  Send, 
  PlusCircle, 
  RefreshCw, 
  Share2, 
  Filter,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { HazardIncident, SeverityLevel, IncidentType } from '../types';
import { soundFX } from '../utils/audio';

interface LiveDisasterFeedProps {
  hazards: HazardIncident[];
  onSelectHazardForMap: (hazard: HazardIncident) => void;
  onSimulateAlert: (type: 'flood' | 'collapse' | 'mesh_ping') => void;
  onOpenReportModal: () => void;
  onUpvoteHazard: (id: string) => void;
  soundEnabled: boolean;
}

export const LiveDisasterFeed: React.FC<LiveDisasterFeedProps> = ({
  hazards,
  onSelectHazardForMap,
  onSimulateAlert,
  onOpenReportModal,
  onUpvoteHazard,
  soundEnabled,
}) => {
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<IncidentType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/90 text-red-300 border border-red-600/70 text-xs font-black tracking-wide animate-emergency-pulse">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            CRITICAL EVAC
          </span>
        );
      case 'SEVERE':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-950/80 text-orange-300 border border-orange-500/60 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            ACTIVE DANGER
          </span>
        );
      case 'MODERATE':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-950/60 text-amber-300 border border-amber-500/50 text-xs font-semibold">
            CAUTION
          </span>
        );
      case 'WATCH':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs">
            ADVISORY
          </span>
        );
    }
  };

  const getTypeIcon = (type: IncidentType) => {
    switch (type) {
      case 'FLOOD':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'COLLAPSE':
        return <Building2 className="w-4 h-4 text-amber-400" />;
      case 'FIRE':
        return <Flame className="w-4 h-4 text-red-400" />;
      case 'GRID':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'CHEMICAL':
        return <Skull className="w-4 h-4 text-purple-400" />;
      case 'MEDICAL':
        return <HeartHandshake className="w-4 h-4 text-emerald-400" />;
    }
  };

  // Filter list
  const filteredHazards = hazards.filter((h) => {
    const matchesSeverity = severityFilter === 'ALL' || h.severity === severityFilter;
    const matchesType = typeFilter === 'ALL' || h.type === typeFilter;
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesType && matchesSearch;
  });

  const triggerSimulation = (type: 'flood' | 'collapse' | 'mesh_ping') => {
    setIsSimulating(true);
    if (soundEnabled) soundFX.playEmergencyAlert();
    onSimulateAlert(type);
    setTimeout(() => setIsSimulating(false), 800);
  };

  return (
    <div className="space-y-4">
      {/* Top Emergency Flash Banner */}
      <div className="bg-gradient-to-r from-red-950/90 via-[#1f1115] to-amber-950/80 border-2 border-red-600/80 rounded-2xl p-4 sm:p-5 shadow-xl shadow-red-950/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600/30 border border-red-500 rounded-xl text-red-400 animate-emergency-pulse">
              <AlertTriangle className="w-6 h-6 text-red-500 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-red-400 uppercase bg-red-900/60 px-2 py-0.5 rounded">
                  PRIORITY LEVEL 1 BROADCAST
                </span>
                <span className="text-xs text-slate-400 font-mono">Synced across local mesh</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                Citywide Flash Flood &amp; Infrastructure Emergency
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Cell towers down in Sectors 2, 4, and 7. Avoid low-lying river crossings. TinyFish AI active on municipal radio crawlers.
              </p>
            </div>
          </div>

          {/* Action buttons on banner */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenReportModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/30 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Hazard</span>
            </button>
          </div>
        </div>

        {/* Live Simulation Control Strip */}
        <div className="mt-4 pt-3 border-t border-red-900/50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="font-semibold">Simulate Incoming Disaster Alerts:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              disabled={isSimulating}
              onClick={() => triggerSimulation('flood')}
              className="px-2.5 py-1 rounded-lg bg-[#25151c] hover:bg-red-950/80 border border-red-700/60 text-red-200 text-xs font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>+ Flood Surge Alert</span>
            </button>

            <button
              disabled={isSimulating}
              onClick={() => triggerSimulation('collapse')}
              className="px-2.5 py-1 rounded-lg bg-[#251b14] hover:bg-amber-950/80 border border-amber-700/60 text-amber-200 text-xs font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Bridge Collapse Alert</span>
            </button>

            <button
              disabled={isSimulating}
              onClick={() => triggerSimulation('mesh_ping')}
              className="px-2.5 py-1 rounded-lg bg-[#141b25] hover:bg-blue-950/80 border border-blue-700/60 text-blue-200 text-xs font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
            >
              <Radio className="w-3.5 h-3.5 text-blue-400" />
              <span>+ Crowdsourced P2P Ping</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#11141d] border border-[#1e2538] rounded-xl p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hazards by sector, street, or keyword (e.g. Bridge, Sector 4)..."
            className="w-full bg-[#0a0c12] border border-[#232b40] focus:border-red-500 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-mono text-slate-400 uppercase hidden xl:inline">Severity:</span>
          {(['ALL', 'CRITICAL', 'SEVERE', 'MODERATE'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                severityFilter === sev
                  ? sev === 'CRITICAL'
                    ? 'bg-red-600 text-white shadow-sm shadow-red-600/40'
                    : sev === 'SEVERE'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-200 text-slate-900'
                  : 'bg-[#181d2a] text-slate-400 hover:text-slate-200 border border-[#242c42]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Hazard Cards Stream */}
      <div className="space-y-3">
        {filteredHazards.length === 0 ? (
          <div className="bg-[#10131c] border border-[#1e2436] rounded-xl p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h3 className="text-base font-bold text-white">No Hazards Matching Filter</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or severity level filters.
            </p>
          </div>
        ) : (
          filteredHazards.map((hazard) => (
            <div
              key={hazard.id}
              className={`relative bg-[#10131d] border rounded-xl p-4 sm:p-5 transition-all hover:border-[#384568] ${
                hazard.severity === 'CRITICAL'
                  ? 'border-red-700/60 bg-gradient-to-r from-red-950/20 via-[#10131d] to-[#10131d]'
                  : hazard.severity === 'SEVERE'
                  ? 'border-amber-700/50'
                  : 'border-[#1e2436]'
              }`}
            >
              {/* Header: Type icon, Title, Severity Badge */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#171b29] border border-[#28324a] shrink-0 mt-0.5">
                    {getTypeIcon(hazard.type)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-red-400">
                        {hazard.sector}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {hazard.reportedAt}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                      {hazard.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start">
                  {getSeverityBadge(hazard.severity)}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed pl-12">
                {hazard.description}
              </p>

              {/* Blocked Routes notice if any */}
              {hazard.blockedRoutes && hazard.blockedRoutes.length > 0 && (
                <div className="mt-3 ml-12 p-2.5 rounded-lg bg-red-950/30 border border-red-800/40 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-red-400 uppercase tracking-wide flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    Blocked Reroute Zones:
                  </span>
                  {hazard.blockedRoutes.map((route, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-red-900/60 text-red-200 text-xs font-mono font-medium border border-red-700/50"
                    >
                      ⛔ {route}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer: Verification Badge & Actions */}
              <div className="mt-4 pt-3 border-t border-[#1a2133] flex flex-wrap items-center justify-between gap-3">
                {/* Trust Verification Badge */}
                <div>
                  {hazard.verifiedByTinyFish ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-950/70 border border-blue-500/60 text-blue-300 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
                      <span className="font-bold">Verified Live via TinyFish</span>
                      <span className="text-[10px] text-blue-400/80 font-mono">
                        ({hazard.tinyFishTimestamp})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-600/50 text-amber-300 text-xs font-medium">
                      <Radio className="w-3.5 h-3.5 text-amber-400" />
                      <span>Crowdsourced BLE Mesh Ping</span>
                      <span className="text-[10px] text-amber-400 font-mono">
                        ({hazard.upvotes} nodes verified)
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2">
                  {/* Upvote / Re-broadcast */}
                  <button
                    onClick={() => {
                      if (soundEnabled) soundFX.playChirp(600, 0.05);
                      onUpvoteHazard(hazard.id);
                    }}
                    title="Confirm hazard status to extend range across mesh network"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151926] hover:bg-[#1e2436] border border-[#2a344d] text-slate-300 hover:text-white text-xs font-semibold transition-all active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Relay Hop</span>
                    <span className="font-mono text-cyan-300 font-bold ml-0.5">
                      {hazard.upvotes}
                    </span>
                  </button>

                  {/* View on Map & Calculate Safe Route */}
                  <button
                    onClick={() => onSelectHazardForMap(hazard)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900/80 border border-red-600/60 text-red-200 text-xs font-bold transition-all hover:scale-102 active:scale-95"
                  >
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>Avoid on Map</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
