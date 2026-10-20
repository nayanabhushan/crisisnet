import React from 'react';
import { 
  Flame, 
  MapPin, 
  Package, 
  Radio, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export type ActiveTab = 'feed' | 'map' | 'market' | 'mesh';

interface TabNavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeHazardsCount: number;
  availableAidCount: number;
  meshNodesCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  activeHazardsCount,
  availableAidCount,
  meshNodesCount,
}) => {
  const tabs = [
    {
      id: 'feed' as ActiveTab,
      label: 'Live Disaster Feed',
      sublabel: 'Hazard Alerts & Warnings',
      icon: Flame,
      badge: activeHazardsCount > 0 ? activeHazardsCount : null,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'map' as ActiveTab,
      label: 'Verified Shelters & Map',
      sublabel: 'TinyFish Verified Beds & Route',
      icon: MapPin,
      badge: 'Verified Live',
      badgeColor: 'bg-emerald-950 text-emerald-400 border border-emerald-500/50',
    },
    {
      id: 'market' as ActiveTab,
      label: 'Mutual Aid Market',
      sublabel: 'Offer & Claim Supplies',
      icon: Package,
      badge: availableAidCount > 0 ? `${availableAidCount} Available` : null,
      badgeColor: 'bg-blue-950 text-blue-300 border border-blue-600/50',
    },
    {
      id: 'mesh' as ActiveTab,
      label: 'Offline Mesh & SOS',
      sublabel: 'BLE Topology & Beacon Center',
      icon: Radio,
      badge: `${meshNodesCount} Nodes`,
      badgeColor: 'bg-cyan-950 text-cyan-300 border border-cyan-500/50',
    },
  ];

  return (
    <div className="bg-[#0f121b] border-b border-[#1c2233] px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1 sm:gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-[#181f30] text-white shadow-md border border-[#2e3b5a] shadow-blue-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131722] border border-transparent'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive
                      ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                      : 'bg-[#141824] text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold tracking-tight">
                      {tab.label}
                    </span>
                    {tab.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${tab.badgeColor}`}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 hidden md:block">
                    {tab.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Status Pill on right side */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 px-3 py-1.5 rounded-lg bg-[#141824] border border-[#22293d]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Zero-Internet Ready</span>
        </div>
      </div>
    </div>
  );
};
