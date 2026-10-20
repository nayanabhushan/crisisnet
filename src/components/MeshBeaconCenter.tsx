import React, { useState } from 'react';
import { 
  Radio, 
  Wifi, 
  Bluetooth, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  Activity, 
  Battery, 
  BatteryCharging, 
  BatteryLow, 
  Signal, 
  Send, 
  RefreshCw, 
  Sliders, 
  Volume2, 
  Compass, 
  CheckCircle2,
  Lock,
  HeartCrack
} from 'lucide-react';
import { MeshNode, SOSBeacon, EmergencyType } from '../types';
import { soundFX } from '../utils/audio';

interface MeshBeaconCenterProps {
  meshNodes: MeshNode[];
  batteryPct: number;
  setBatteryPct: (pct: number) => void;
  activeSOS: SOSBeacon | null;
  onTriggerSOS: (type: EmergencyType, details: { bloodType: string; count: number }) => void;
  onCancelSOS: () => void;
  soundEnabled: boolean;
}

export const MeshBeaconCenter: React.FC<MeshBeaconCenterProps> = ({
  meshNodes,
  batteryPct,
  setBatteryPct,
  activeSOS,
  onTriggerSOS,
  onCancelSOS,
  soundEnabled,
}) => {
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<EmergencyType>('TRAPPED');
  const [bloodType, setBloodType] = useState('O+');
  const [personCount, setPersonCount] = useState(1);
  const [isBeaconPinging, setIsBeaconPinging] = useState(false);

  // Determine Battery Role
  const getMeshRole = (pct: number) => {
    if (pct <= 15) {
      return {
        role: 'RECEIVE_ONLY',
        title: 'Low-Power Receive Mode',
        description: 'Below 15%: Disables active relay transmission to preserve battery for survival beacon.',
        color: 'text-amber-400 bg-amber-950/80 border-amber-600/60',
      };
    }
    if (pct >= 50) {
      return {
        role: 'SUPER_NODE',
        title: 'Mesh Relay Super-Node',
        description: 'Above 50%: Acts as high-power bridge forwarding packets across multiple city sectors.',
        color: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/60',
      };
    }
    return {
      role: 'RELAY',
      title: 'Standard Mesh Relay',
      description: '15%-50%: Participates in peer-to-peer single hop message relays.',
      color: 'text-blue-300 bg-blue-950/80 border-blue-600/60',
    };
  };

  const currentRole = getMeshRole(batteryPct);

  const handleSOSClick = () => {
    if (activeSOS) {
      onCancelSOS();
      soundFX.stopSiren();
    } else {
      if (soundEnabled) soundFX.startSiren();
      onTriggerSOS(selectedEmergencyType, {
        bloodType,
        count: personCount,
      });
    }
  };

  const pingBeacon = () => {
    setIsBeaconPinging(true);
    if (soundEnabled) soundFX.playChirp(1200, 0.05);
    setTimeout(() => setIsBeaconPinging(false), 600);
  };

  return (
    <div className="space-y-4">
      {/* Mesh Status Overview Banner */}
      <div className="bg-gradient-to-r from-[#0d1322] via-[#101728] to-[#121c33] border border-[#233150] rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-950/90 border border-cyan-500/60 rounded-xl text-cyan-400">
              <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  BLE / Wi-Fi Direct Protocol
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Zero Infrastructure Required
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                Offline P2P Mesh &amp; Digital Beacon Center
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Connected directly to {meshNodes.length} active peer nodes. Messages and SOS packets hop phone-to-phone without cellular signal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={pingBeacon}
              disabled={isBeaconPinging}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1b253d] hover:bg-[#253354] border border-[#30426d] text-cyan-300 text-xs font-bold uppercase tracking-wider transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBeaconPinging ? 'animate-spin' : ''}`} />
              <span>Ping Mesh Nodes</span>
            </button>
          </div>
        </div>

        {/* Battery-Aware Mesh Optimization Slider Bar (Feature #6) */}
        <div className="mt-4 pt-3 border-t border-[#1d273f] bg-[#090d16]/70 p-3.5 rounded-xl border border-[#182033]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-slate-300" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Battery-Aware Mesh Optimization:
              </span>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${currentRole.color}`}>
                {currentRole.title} ({batteryPct}%)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Drag slider to test auto role switching
            </span>
          </div>

          <p className="text-xs text-slate-300 mb-2">
            {currentRole.description}
          </p>

          <input
            type="range"
            min="5"
            max="100"
            value={batteryPct}
            onChange={(e) => setBatteryPct(Number(e.target.value))}
            className="w-full accent-cyan-400 h-2 bg-[#172033] rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span className="text-red-400">&lt;15% (Receive Only)</span>
            <span className="text-slate-400">15%-50% (Standard Relay)</span>
            <span className="text-cyan-400">&gt;50% (Super-Node Range Extender)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Visual Topology & Node List, Right = SOS Beacon Trigger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Mesh Topology & Nodes List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Visual Mesh Topology Card */}
          <div className="bg-[#0f131d] border border-[#1f273b] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1b2234]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live P2P Mesh Topology Graph
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-300">
                Frequency: 2.4 GHz BLE / 5 GHz Wi-Fi Direct
              </span>
            </div>

            {/* SVG Mesh Topology Visualization */}
            <div className="relative w-full h-[220px] rounded-xl bg-[#080a11] border border-[#171d2c] overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Connecting animated mesh links */}
                <line x1="50%" y1="50%" x2="20%" y2="28%" stroke="#06b6d4" strokeWidth="1.8" strokeDasharray="4 2" />
                <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="#06b6d4" strokeWidth="1.8" strokeDasharray="4 2" />
                <line x1="50%" y1="50%" x2="25%" y2="78%" stroke="#06b6d4" strokeWidth="1.8" strokeDasharray="4 2" />
                <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="#06b6d4" strokeWidth="1.8" strokeDasharray="4 2" />
                <line x1="80%" y1="30%" x2="92%" y2="60%" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="2 2" />
                <line x1="25%" y1="78%" x2="10%" y2="85%" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 2" />

                {/* Central Host Node (YOU) */}
                <circle cx="50%" cy="50%" r="22" fill="#082f49" stroke="#06b6d4" strokeWidth="2.5" />
                <circle cx="50%" cy="50%" r="30" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" className="animate-mesh-ping" />

                {/* Peer 1: Shelter Alpha Super-Relay */}
                <circle cx="20%" cy="28%" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                {/* Peer 2: EMT Rapid Response */}
                <circle cx="80%" cy="30%" r="16" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
                {/* Peer 3: Citizen Pixel */}
                <circle cx="25%" cy="78%" r="14" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                {/* Peer 4: Valley Ridge Gateway */}
                <circle cx="75%" cy="75%" r="15" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
                {/* Peer 5: Low battery Downed Citizen */}
                <circle cx="10%" cy="85%" r="12" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
              </svg>

              {/* Node Labels Overlay */}
              <div className="absolute inset-0 pointer-events-none text-[9px] font-mono">
                <span className="absolute top-[46%] left-[45%] text-cyan-200 font-bold">
                  HOST (You)
                </span>
                <span className="absolute top-[18%] left-[12%] text-emerald-300">
                  Shelter Alpha (1 Hop)
                </span>
                <span className="absolute top-[20%] right-[10%] text-rose-300">
                  EMT Unit 7 (1 Hop)
                </span>
                <span className="absolute bottom-[28%] left-[15%] text-slate-300">
                  Citizen Pixel (1 Hop)
                </span>
                <span className="absolute bottom-[28%] right-[15%] text-indigo-300">
                  LoRa Gateway (2 Hops)
                </span>
                <span className="absolute bottom-[4%] left-[4%] text-amber-300">
                  Beacon (Low Batt)
                </span>
              </div>
            </div>
          </div>

          {/* Connected Peer Device Cards */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Active Peer Nodes in Range ({meshNodes.length})</span>
              <span className="font-mono text-[11px] text-slate-500">Auto-Refreshed via BLE Scan</span>
            </div>

            {meshNodes.map((node) => (
              <div
                key={node.id}
                className="p-3 rounded-xl bg-[#10131d] border border-[#1d2436] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#161c2b] border border-[#242e45] text-cyan-400">
                    {node.protocol === 'BLE' ? (
                      <Bluetooth className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Wifi className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{node.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">({node.id})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-cyan-300">{node.protocol}</span>
                      <span>•</span>
                      <span>{node.hops} {node.hops === 1 ? 'hop' : 'hops'} away</span>
                      <span>•</span>
                      <span className="text-slate-500">Ping: {node.lastPingSec}s ago</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-300 block">
                      {node.rssiDbm} dBm
                    </span>
                    <span className={`text-[10px] font-mono ${
                      node.batteryPct <= 15 ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      🔋 {node.batteryPct}%
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    node.role === 'SUPER_NODE'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-600/50'
                      : node.role === 'RECEIVE_ONLY'
                      ? 'bg-red-950 text-red-300 border-red-600/50'
                      : 'bg-[#181f30] text-slate-300 border-[#2b3754]'
                  }`}>
                    {node.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Emergency SOS Broadcast & Digital Breadcrumbs (5 cols) */}
        <div className="lg:col-span-5 bg-[#10131e] border-2 border-red-700/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xl">
          <div>
            {/* SOS Title */}
            <div className="flex items-center justify-between pb-3 border-b border-[#231b25]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-black text-white tracking-tight uppercase">
                  Digital Breadcrumbs SOS
                </h3>
              </div>
              <span className="text-[10px] font-mono text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                AES-128 Mesh Encrypted
              </span>
            </div>

            {/* Emergency Type Selector */}
            <div className="mt-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Select Crisis Urgency:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'TRAPPED', label: 'Trapped Under Debris' },
                    { id: 'MEDICAL_CRITICAL', label: 'Critical Medical' },
                    { id: 'FLASH_FLOOD', label: 'Flood Surrounded' },
                    { id: 'FIRE_SURROUNDED', label: 'Fire Approaching' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedEmergencyType(t.id)}
                    className={`p-2 rounded-xl text-xs font-bold text-left transition-all ${
                      selectedEmergencyType === t.id
                        ? 'bg-red-600 text-white shadow-md shadow-red-950'
                        : 'bg-[#141824] text-slate-400 hover:text-white border border-[#232b40]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vital Signs / Details */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Blood Group:
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full bg-[#0a0c12] border border-[#263048] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="O+">O+ (Positive)</option>
                  <option value="O-">O- (Universal)</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Persons in Danger:
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={personCount}
                  onChange={(e) => setPersonCount(Number(e.target.value))}
                  className="w-full bg-[#0a0c12] border border-[#263048] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Encrypted Digital Breadcrumbs Payload Preview (Feature #1) */}
            <div className="mt-4 p-3 rounded-xl bg-[#090b12] border border-[#1c2234] text-xs font-mono">
              <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-cyan-400" />
                  Encoded Mesh Broadcast Packet:
                </span>
                <span className="text-cyan-400 font-bold">128-bit payload</span>
              </div>
              <div className="mt-2 text-slate-300 space-y-0.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">GPS Coordinates:</span>
                  <span className="text-emerald-400">37.7749° N, 122.4194° W</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Altitude:</span>
                  <span>14 meters (Ground Tier)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Triage Tag:</span>
                  <span className="text-red-400 font-bold">{selectedEmergencyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Packet Hex:</span>
                  <span className="text-cyan-400 text-[10px]">0x7F41A990B2...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Big Tactile SOS Broadcast Button */}
          <div className="mt-4">
            <button
              onClick={handleSOSClick}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl transition-all active:scale-95 ${
                activeSOS
                  ? 'bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-600'
                  : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white border-2 border-red-400 animate-emergency-pulse shadow-red-600/50'
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-white" />
              <span>
                {activeSOS ? 'Stop / Cancel SOS Beacon' : 'BROADCAST EMERGENCY SOS BEACON'}
              </span>
            </button>

            {activeSOS && (
              <p className="text-center text-xs text-red-400 font-bold mt-2 animate-pulse">
                🚨 SOS Signal actively beaming to all nearby phones &amp; rescue relays!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
