import React, { useState } from 'react';
import { 
  MapPin, 
  Bed, 
  HeartHandshake, 
  Droplets, 
  Zap, 
  Sparkles, 
  Navigation, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  Layers, 
  ShieldCheck, 
  Database,
  ExternalLink,
  Flame
} from 'lucide-react';
import { ShelterResource, ResourceType, HazardIncident } from '../types';
import { soundFX } from '../utils/audio';

interface ResourceShelterMapProps {
  shelters: ShelterResource[];
  hazards: HazardIncident[];
  selectedHazard?: HazardIncident | null;
  onSelectShelter?: (shelter: ShelterResource) => void;
  soundEnabled: boolean;
}

export const ResourceShelterMap: React.FC<ResourceShelterMapProps> = ({
  shelters,
  hazards,
  selectedHazard,
  onSelectShelter,
  soundEnabled,
}) => {
  const [selectedResourceType, setSelectedResourceType] = useState<ResourceType | 'ALL'>('ALL');
  const [activeShelterId, setActiveShelterId] = useState<string>(shelters[0]?.id || '');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [showRerouteDetails, setShowRerouteDetails] = useState<boolean>(true);
  const [radarActive, setRadarActive] = useState<boolean>(true);

  // Filter shelters
  const filteredShelters = shelters.filter(
    (s) => selectedResourceType === 'ALL' || s.type === selectedResourceType
  );

  const activeShelter = shelters.find((s) => s.id === activeShelterId) || shelters[0];

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'SHELTER':
        return <Bed className="w-4 h-4 text-emerald-400" />;
      case 'HOSPITAL':
        return <HeartHandshake className="w-4 h-4 text-red-400" />;
      case 'WATER_STATION':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'POWER_HUB':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'BLOOD_BANK':
        return <Flame className="w-4 h-4 text-rose-400" />;
    }
  };

  const selectShelterWithRoute = (shelter: ShelterResource) => {
    setActiveShelterId(shelter.id);
    setShowRerouteDetails(true);
    if (soundEnabled) soundFX.playChirp(750, 0.08);
    if (onSelectShelter) onSelectShelter(shelter);
  };

  return (
    <div className="space-y-4">
      {/* Offline Vector Cache Status & Map Controls Bar */}
      <div className="bg-[#10131d] border border-[#1e2538] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-bold text-white tracking-wide">
            Tactical Vector Map
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-600/50 text-emerald-300">
            100% Cached Offline
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Radar sweep toggle */}
          <button
            onClick={() => setRadarActive(!radarActive)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
              radarActive
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                : 'bg-[#151926] text-slate-400 border-[#242c42]'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${radarActive ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>Radar Sweep: {radarActive ? 'ON' : 'PAUSED'}</span>
          </button>

          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            GPS: 37.7749° N, 122.4194° W
          </span>
        </div>
      </div>

      {/* Main Grid: Left = Interactive Tactical Radar Map, Right = Shelter list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Tactical Interactive Map Canvas (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-[#0b0d14] border border-[#1f2638] rounded-2xl p-4 flex flex-col justify-between overflow-hidden relative shadow-2xl">
          {/* Map Header with active navigation status */}
          <div className="flex items-center justify-between pb-2 border-b border-[#1b2132] z-10">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Hazard-Aware Offline Reroute Engine
              </span>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-600/40">
              Safe Path: ACTIVE
            </div>
          </div>

          {/* SVG Tactical Radar & Route Map */}
          <div className="relative w-full h-[320px] sm:h-[400px] my-2 rounded-xl bg-[#07090e] border border-[#171d2b] overflow-hidden select-none">
            {/* Grid Lines */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#161b29" strokeWidth="0.8" />
                </pattern>
                {/* Radar beam gradient */}
                <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(6, 182, 212, 0.25)" />
                  <stop offset="60%" stopColor="rgba(6, 182, 212, 0.08)" />
                  <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
                </radialGradient>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Radar Rings */}
              <circle cx="50%" cy="50%" r="40" fill="none" stroke="#1e273a" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="50%" cy="50%" r="90" fill="none" stroke="#1e273a" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="50%" cy="50%" r="140" fill="none" stroke="#1e273a" strokeWidth="1" strokeDasharray="4 4" />

              {/* Radar Sweep Line */}
              {radarActive && (
                <line
                  x1="50%"
                  y1="50%"
                  x2="90%"
                  y2="15%"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                  className="animate-radar opacity-60"
                />
              )}

              {/* BLOCKED DIRECT ROAD (Red Dashed Line crossing hazard) */}
              <path
                d="M 190 200 L 260 170 L 330 110"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="opacity-70"
              />

              {/* HAZARD COLLAPSE ZONE (Pulsing Red Zone) */}
              <circle
                cx="260"
                cy="170"
                r="35"
                fill="rgba(239, 68, 68, 0.18)"
                stroke="#ef4444"
                strokeWidth="1.8"
                strokeDasharray="4 2"
                className="animate-mesh-ping"
              />

              {/* DYNAMIC SAFE DETOUR ROUTE (Cyan / Green Bold Path) */}
              <path
                d="M 190 200 C 180 260, 290 270, 340 220 S 370 140, 330 110"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]"
              />

              {/* Hazard 2 (Flash flood basin) */}
              <circle
                cx="120"
                cy="280"
                r="45"
                fill="rgba(245, 158, 11, 0.15)"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </svg>

            {/* User Position Beacon (Center-Left) */}
            <div 
              style={{ left: '190px', top: '200px' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20"
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-white shadow-lg shadow-cyan-500/50"></span>
              </div>
              <span className="mt-1 px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-300 font-mono font-bold text-[9px] border border-cyan-500/40">
                YOU (Node-001)
              </span>
            </div>

            {/* Blocked Hazard Badge on Map */}
            <div 
              style={{ left: '260px', top: '170px' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-15"
            >
              <div className="px-2 py-1 rounded bg-red-950/90 border border-red-500 text-red-300 text-[10px] font-black uppercase flex items-center gap-1 shadow-md">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                <span>Sector 4 Bridge Collapse (BLOCKED)</span>
              </div>
            </div>

            {/* Flood Hazard Badge on Map */}
            <div 
              style={{ left: '120px', top: '280px' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
            >
              <div className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-600 text-amber-300 text-[9px] font-bold">
                ⚠️ Flood Surge Zone
              </div>
            </div>

            {/* Shelter 1 Pin: Civic Arena (Target of Route) */}
            <button
              onClick={() => selectShelterWithRoute(shelters[0])}
              style={{ left: '330px', top: '110px' }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-25 group transition-transform ${
                activeShelterId === shelters[0]?.id ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className="relative p-2 rounded-xl bg-emerald-950 border-2 border-emerald-400 text-emerald-300 shadow-xl shadow-emerald-900/50">
                <Bed className="w-4 h-4 text-emerald-400" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div className="mt-1 px-2 py-0.5 rounded bg-emerald-950/95 border border-emerald-500/70 text-emerald-200 text-[10px] font-bold whitespace-nowrap shadow-md">
                Arena Shelter (168 Beds Open)
              </div>
            </button>

            {/* Shelter 2 Pin: Metro General Hospital */}
            <button
              onClick={() => selectShelterWithRoute(shelters[1])}
              style={{ left: '110px', top: '120px' }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 group transition-transform ${
                activeShelterId === shelters[1]?.id ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className="p-2 rounded-xl bg-red-950 border-2 border-red-500 text-red-300 shadow-xl shadow-red-900/40">
                <HeartHandshake className="w-4 h-4 text-red-400" />
              </div>
              <div className="mt-1 px-1.5 py-0.5 rounded bg-[#10131d]/90 border border-[#2b354e] text-slate-200 text-[9px] font-bold whitespace-nowrap">
                Trauma ER (19 Beds)
              </div>
            </button>

            {/* Shelter 3 Pin: Red Cross Water Distribution */}
            <button
              onClick={() => selectShelterWithRoute(shelters[2])}
              style={{ left: '270px', top: '310px' }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 group transition-transform ${
                activeShelterId === shelters[2]?.id ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className="p-2 rounded-xl bg-cyan-950 border-2 border-cyan-400 text-cyan-300 shadow-xl shadow-cyan-900/40">
                <Droplets className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-1 px-1.5 py-0.5 rounded bg-[#10131d]/90 border border-[#2b354e] text-slate-200 text-[9px] font-bold whitespace-nowrap">
                Water Hub (7,850L)
              </div>
            </button>

            {/* Shelter 5 Pin: Linwood High School (Broken Web Portal flag) */}
            <button
              onClick={() => selectShelterWithRoute(shelters[4])}
              style={{ left: '420px', top: '260px' }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 group transition-transform ${
                activeShelterId === shelters[4]?.id ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className="p-2 rounded-xl bg-amber-950 border-2 border-amber-500 text-amber-300">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-1 px-1.5 py-0.5 rounded bg-amber-950/90 border border-amber-600 text-amber-200 text-[9px] font-bold whitespace-nowrap">
                Linwood School (Radio Only)
              </div>
            </button>
          </div>

          {/* Dynamic Reroute Step-by-Step Info Box */}
          {showRerouteDetails && activeShelter && (
            <div className="mt-2 p-3 rounded-xl bg-[#121622] border border-[#222b40] text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">
                    Navigating to: {activeShelter.name}
                  </span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">
                  {activeShelter.distanceKm} km • Safe Detour (+4 mins)
                </span>
              </div>
              <div className="mt-2 text-slate-300 text-[11px] grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-1.5 rounded bg-[#0a0d14] border border-[#1d2436]">
                  <span className="text-slate-500 block text-[10px]">Hazard Avoided:</span>
                  <span className="text-red-400 font-semibold">Sector 4 Bridge Collapse</span>
                </div>
                <div className="p-1.5 rounded bg-[#0a0d14] border border-[#1d2436]">
                  <span className="text-slate-500 block text-[10px]">Detour Path:</span>
                  <span className="text-cyan-300 font-semibold">North Ridge High Ground</span>
                </div>
                <div className="p-1.5 rounded bg-[#0a0d14] border border-[#1d2436]">
                  <span className="text-slate-500 block text-[10px]">Capacity Status:</span>
                  <span className="text-emerald-400 font-semibold">
                    {activeShelter.capacityOpen} open / {activeShelter.capacityTotal} total
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shelter & Resource List (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Resource Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {(
              [
                { id: 'ALL', label: 'All' },
                { id: 'SHELTER', label: 'Shelters' },
                { id: 'HOSPITAL', label: 'Medical' },
                { id: 'WATER_STATION', label: 'Water' },
                { id: 'POWER_HUB', label: 'Power' },
                { id: 'BLOOD_BANK', label: 'Blood' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedResourceType(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedResourceType === cat.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                    : 'bg-[#121622] text-slate-400 hover:text-white border border-[#20273a]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* List of Shelters */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredShelters.map((shelter) => {
              const isSelected = activeShelterId === shelter.id;
              const isLogExpanded = expandedLogId === shelter.id;

              return (
                <div
                  key={shelter.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#141824] border-emerald-500/80 shadow-lg shadow-emerald-950/20'
                      : 'bg-[#10131d] border-[#1d2334] hover:border-[#2b354e]'
                  }`}
                >
                  {/* Title & Type Icon */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-lg bg-[#181d2c] border border-[#263048] shrink-0 mt-0.5">
                        {getResourceIcon(shelter.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-emerald-400 font-bold">
                            {shelter.sector}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-400 font-mono">
                            {shelter.distanceKm} km away
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">
                          {shelter.name}
                        </h4>
                        <p className="text-xs text-slate-400">{shelter.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bed Capacity Bar if shelter or hospital */}
                  {shelter.capacityTotal > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Available Beds / Space:</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {shelter.capacityOpen} open / {shelter.capacityTotal} total
                        </span>
                      </div>
                      <div className="w-full bg-[#1b2234] rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            shelter.capacityOpen < 25
                              ? 'bg-red-500'
                              : shelter.capacityOpen < 80
                              ? 'bg-amber-400'
                              : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                ((shelter.capacityTotal - shelter.capacityOpen) /
                                  shelter.capacityTotal) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Supplies Tag Cloud */}
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                    {shelter.supplies.beds > 0 && (
                      <span className="px-2 py-0.5 rounded bg-[#171d2c] text-emerald-300 border border-emerald-900/60 font-mono">
                        🛏️ {shelter.supplies.beds} cots
                      </span>
                    )}
                    {shelter.supplies.waterLiters > 0 && (
                      <span className="px-2 py-0.5 rounded bg-[#171d2c] text-cyan-300 border border-cyan-900/60 font-mono">
                        💧 {shelter.supplies.waterLiters}L water
                      </span>
                    )}
                    {shelter.supplies.powerGenerator && (
                      <span className="px-2 py-0.5 rounded bg-[#171d2c] text-amber-300 border border-amber-900/60">
                        ⚡ Diesel Gen Active
                      </span>
                    )}
                    {shelter.supplies.medicalStaffOnDuty && (
                      <span className="px-2 py-0.5 rounded bg-[#171d2c] text-red-300 border border-red-900/60">
                        🩺 EMT Staff on Duty
                      </span>
                    )}
                    {shelter.supplies.bloodUnitsAvailable !== undefined && shelter.supplies.bloodUnitsAvailable > 0 && (
                      <span className="px-2 py-0.5 rounded bg-[#171d2c] text-rose-300 border border-rose-900/60 font-mono">
                        🩸 {shelter.supplies.bloodUnitsAvailable} Blood Units
                      </span>
                    )}
                  </div>

                  {/* Radio Channel info */}
                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#1a2133]">
                    <div className="flex items-center gap-1 font-mono">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Radio: {shelter.contactRadio}</span>
                    </div>

                    <button
                      onClick={() => selectShelterWithRoute(shelter)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Reroute &amp; Map</span>
                    </button>
                  </div>

                  {/* TinyFish Trust & Verification Badge */}
                  <div className="mt-3 pt-2 border-t border-[#1a2133] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      {shelter.verifiedViaTinyFish ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-950/70 border border-blue-500/60 text-blue-300 text-xs font-semibold">
                          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
                          <span className="font-bold">Verified Live via TinyFish</span>
                          <span className="text-[10px] text-blue-400/80 font-mono">
                            [{shelter.tinyFishTimestamp}]
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/80 border border-amber-600/70 text-amber-300 text-xs font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Needs Radio/Phone Verification</span>
                        </div>
                      )}

                      {/* Expander to inspect TinyFish Web Execution Log */}
                      <button
                        onClick={() =>
                          setExpandedLogId(isLogExpanded ? null : shelter.id)
                        }
                        className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 underline underline-offset-2"
                      >
                        <span>{isLogExpanded ? 'Hide Agent Log' : 'Inspect TinyFish Log'}</span>
                        {isLogExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Collapsible TinyFish Live Crawl Log Drawer */}
                    {isLogExpanded && (
                      <div className="mt-2 p-2.5 rounded-lg bg-[#07090f] border border-blue-900/50 text-[11px] font-mono text-slate-300 space-y-1">
                        <div className="text-blue-400 flex items-center gap-1 font-bold">
                          <ExternalLink className="w-3 h-3" />
                          <span>Target: {shelter.tinyFishTargetUrl}</span>
                        </div>
                        <p className="text-slate-300 leading-normal">
                          {shelter.tinyFishExtractionLog}
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-500">
                          <span>Autonomous Headless Session: tf-sess-9942</span>
                          <span className="text-emerald-400">Status: 200 OK (Clean JSON parsed)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
