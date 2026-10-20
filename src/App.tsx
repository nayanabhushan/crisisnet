import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TabNavigation, ActiveTab } from './components/TabNavigation';
import { LiveDisasterFeed } from './components/LiveDisasterFeed';
import { ResourceShelterMap } from './components/ResourceShelterMap';
import { MutualAidMarketplace } from './components/MutualAidMarketplace';
import { MeshBeaconCenter } from './components/MeshBeaconCenter';
import { TinyFishExecutionModal } from './components/TinyFishExecutionModal';
import { FirstAidCoPilotModal } from './components/FirstAidCoPilotModal';
import { NewHazardModal } from './components/NewHazardModal';
import { OfferSupplyModal } from './components/OfferSupplyModal';
import { SOSActiveOverlay } from './components/SOSActiveOverlay';

import { INITIAL_HAZARDS } from './data/initialHazards';
import { INITIAL_SHELTERS } from './data/initialShelters';
import { INITIAL_AID_ITEMS } from './data/initialAidItems';
import { INITIAL_MESH_NODES } from './data/initialMeshNodes';

import { 
  HazardIncident, 
  ShelterResource, 
  MutualAidItem, 
  MeshNode, 
  SOSBeacon, 
  EmergencyType 
} from './types';
import { loadFromStorage, saveToStorage } from './utils/storage';
import { soundFX } from './utils/audio';

export function App() {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(true);
  const [batteryPct, setBatteryPct] = useState<number>(82);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals State
  const [isTinyFishOpen, setIsTinyFishOpen] = useState<boolean>(false);
  const [isFirstAidOpen, setIsFirstAidOpen] = useState<boolean>(false);
  const [isNewHazardOpen, setIsNewHazardOpen] = useState<boolean>(false);
  const [isOfferSupplyOpen, setIsOfferSupplyOpen] = useState<boolean>(false);

  // Core Data State (Loaded from LocalStorage with fallback)
  const [hazards, setHazards] = useState<HazardIncident[]>(() =>
    loadFromStorage('hazards', INITIAL_HAZARDS)
  );
  const [shelters, setShelters] = useState<ShelterResource[]>(() =>
    loadFromStorage('shelters', INITIAL_SHELTERS)
  );
  const [aidItems, setAidItems] = useState<MutualAidItem[]>(() =>
    loadFromStorage('aid_items', INITIAL_AID_ITEMS)
  );
  const [meshNodes, setMeshNodes] = useState<MeshNode[]>(() =>
    loadFromStorage('mesh_nodes', INITIAL_MESH_NODES)
  );
  const [activeSOS, setActiveSOS] = useState<SOSBeacon | null>(() =>
    loadFromStorage('active_sos', null)
  );
  const [selectedHazardForMap, setSelectedHazardForMap] = useState<HazardIncident | null>(null);

  // Sync state changes to offline storage
  useEffect(() => {
    saveToStorage('hazards', hazards);
  }, [hazards]);

  useEffect(() => {
    saveToStorage('shelters', shelters);
  }, [shelters]);

  useEffect(() => {
    saveToStorage('aid_items', aidItems);
  }, [aidItems]);

  useEffect(() => {
    saveToStorage('mesh_nodes', meshNodes);
  }, [meshNodes]);

  useEffect(() => {
    saveToStorage('active_sos', activeSOS);
  }, [activeSOS]);

  // Handlers for Simulation
  const handleSimulateAlert = (type: 'flood' | 'collapse' | 'mesh_ping') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let newHazard: HazardIncident;

    if (type === 'flood') {
      newHazard = {
        id: `hz-${Date.now()}`,
        title: 'Flash Flood Culvert Breach (Water Rising 2ft/10min)',
        sector: 'Sector 7 (Valley Basin)',
        description: 'Runoff drainage culvert overwhelmed. Water level rising across Valley Parkway. Low vehicles stranded.',
        severity: 'CRITICAL',
        status: 'ACTIVE',
        type: 'FLOOD',
        source: 'TINYFISH_AGENT',
        verifiedByTinyFish: true,
        tinyFishTimestamp: `Verified ${timestamp}`,
        upvotes: 48,
        reportedAt: `${timestamp} Local`,
        lat: 37.768,
        lng: -122.428,
        blockedRoutes: ['Valley Parkway Underpass', 'Culvert Road South'],
        affectedRadiusMeters: 750,
      };
    } else if (type === 'collapse') {
      newHazard = {
        id: `hz-${Date.now()}`,
        title: 'Highway 101 Overpass Structural Fracture',
        sector: 'Sector 4 (Riverside)',
        description: 'Earth tremor caused 8-inch fracture in support pylon 3. Highway patrol radio closed both upper decks.',
        severity: 'CRITICAL',
        status: 'ACTIVE',
        type: 'COLLAPSE',
        source: 'TINYFISH_AGENT',
        verifiedByTinyFish: true,
        tinyFishTimestamp: `Verified ${timestamp}`,
        upvotes: 89,
        reportedAt: `${timestamp} Local`,
        lat: 37.776,
        lng: -122.417,
        blockedRoutes: ['101 Northbound Ramp', 'Lower Deck Connector'],
        affectedRadiusMeters: 800,
      };
    } else {
      newHazard = {
        id: `hz-${Date.now()}`,
        title: 'Downed High-Voltage Wire across Market St',
        sector: 'Sector 3 (Metro Core)',
        description: 'Live powerline buzzing on wet asphalt. Bystanders cleared 50 feet. Awaiting utility isolation crew.',
        severity: 'SEVERE',
        status: 'ACTIVE',
        type: 'GRID',
        source: 'CROWDSOURCED_MESH',
        verifiedByTinyFish: false,
        tinyFishTimestamp: 'Pending Verification',
        upvotes: 21,
        reportedAt: `${timestamp} Local`,
        lat: 37.771,
        lng: -122.413,
        blockedRoutes: ['Market St 4th-5th Block'],
        affectedRadiusMeters: 300,
      };
    }

    setHazards((prev) => [newHazard, ...prev]);
  };

  const handleUpvoteHazard = (id: string) => {
    setHazards((prev) =>
      prev.map((h) => (h.id === id ? { ...h, upvotes: h.upvotes + 1 } : h))
    );
  };

  const handleAddHazard = (hazardData: Omit<HazardIncident, 'id' | 'reportedAt' | 'upvotes'>) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newHazard: HazardIncident = {
      ...hazardData,
      id: `hz-${Date.now()}`,
      reportedAt: `${timestamp} Local`,
      upvotes: 1,
    };
    setHazards((prev) => [newHazard, ...prev]);
  };

  const handleSelectHazardForMap = (hazard: HazardIncident) => {
    setSelectedHazardForMap(hazard);
    setActiveTab('map');
    if (soundEnabled) soundFX.playChirp(750, 0.08);
  };

  const handleAddAidOffer = (
    offerData: Omit<MutualAidItem, 'id' | 'status' | 'nodeOriginId'>
  ) => {
    const newOffer: MutualAidItem = {
      ...offerData,
      id: `aid-${Date.now()}`,
      status: 'AVAILABLE',
      nodeOriginId: 'NODE-LOCAL-001',
    };
    setAidItems((prev) => [newOffer, ...prev]);
  };

  const handleClaimAidItem = (itemId: string, token: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAidItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: 'CLAIMED',
              claimedByNode: 'NODE-LOCAL-001',
              claimTimestamp: timestamp,
              qrVerificationToken: token,
            }
          : item
      )
    );
  };

  const handleTriggerSOS = (
    type: EmergencyType,
    details: { bloodType: string; count: number }
  ) => {
    const beacon: SOSBeacon = {
      id: `sos-${Date.now()}`,
      senderId: 'NODE-LOCAL-001',
      senderName: 'Your Device',
      emergencyType: type,
      bloodType: details.bloodType,
      personsCount: details.count,
      batteryPct: batteryPct,
      gpsCoords: { lat: 37.7749, lng: -122.4194 },
      altitudeM: 14.5,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      meshPacketHex: '0x7F41A990B28C9104',
      status: 'TRANSMITTING',
      hopsCount: meshNodes.length,
      active: true,
    };
    setActiveSOS(beacon);
  };

  const handleCancelSOS = () => {
    setActiveSOS(null);
  };

  const availableAidCount = aidItems.filter((i) => i.status === 'AVAILABLE').length;
  const activeHazardsCount = hazards.filter((h) => h.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col font-sans selection:bg-red-900 selection:text-white">
      {/* Top Main Navigation Bar */}
      <Navbar
        isOfflineMode={isOfflineMode}
        setIsOfflineMode={setIsOfflineMode}
        batteryPct={batteryPct}
        meshNodesCount={meshNodes.length}
        activeHazardsCount={activeHazardsCount}
        onOpenSOS={() => setActiveTab('mesh')}
        onOpenTinyFish={() => setIsTinyFishOpen(true)}
        onOpenFirstAid={() => setIsFirstAidOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* 4-Screen Tab Strip */}
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeHazardsCount={activeHazardsCount}
        availableAidCount={availableAidCount}
        meshNodesCount={meshNodes.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        {activeTab === 'feed' && (
          <LiveDisasterFeed
            hazards={hazards}
            onSelectHazardForMap={handleSelectHazardForMap}
            onSimulateAlert={handleSimulateAlert}
            onOpenReportModal={() => setIsNewHazardOpen(true)}
            onUpvoteHazard={handleUpvoteHazard}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'map' && (
          <ResourceShelterMap
            shelters={shelters}
            hazards={hazards}
            selectedHazard={selectedHazardForMap}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'market' && (
          <MutualAidMarketplace
            aidItems={aidItems}
            onClaimItem={handleClaimAidItem}
            onOpenOfferModal={() => setIsOfferSupplyOpen(true)}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'mesh' && (
          <MeshBeaconCenter
            meshNodes={meshNodes}
            batteryPct={batteryPct}
            setBatteryPct={setBatteryPct}
            activeSOS={activeSOS}
            onTriggerSOS={handleTriggerSOS}
            onCancelSOS={handleCancelSOS}
            soundEnabled={soundEnabled}
          />
        )}
      </main>

      {/* Floating Active SOS Notification Bar */}
      <SOSActiveOverlay
        beacon={activeSOS}
        onCancel={handleCancelSOS}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* High-Impact Modals */}
      <TinyFishExecutionModal
        isOpen={isTinyFishOpen}
        onClose={() => setIsTinyFishOpen(false)}
        soundEnabled={soundEnabled}
      />

      <FirstAidCoPilotModal
        isOpen={isFirstAidOpen}
        onClose={() => setIsFirstAidOpen(false)}
        soundEnabled={soundEnabled}
      />

      <NewHazardModal
        isOpen={isNewHazardOpen}
        onClose={() => setIsNewHazardOpen(false)}
        onSubmitHazard={handleAddHazard}
        soundEnabled={soundEnabled}
      />

      <OfferSupplyModal
        isOpen={isOfferSupplyOpen}
        onClose={() => setIsOfferSupplyOpen(false)}
        onSubmitOffer={handleAddAidOffer}
        soundEnabled={soundEnabled}
      />

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-[#191f2e] bg-[#090b10] px-4 py-3 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CrisisNet • Built for Kritical Hacks 2026 • Powered by TinyFish Web Agents</span>
          <span className="text-emerald-400 font-bold">● Offline Mesh Engine Active</span>
        </div>
      </footer>
    </div>
  );
}
export default App;
