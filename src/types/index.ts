export type SeverityLevel = 'CRITICAL' | 'SEVERE' | 'MODERATE' | 'WATCH';
export type IncidentStatus = 'ACTIVE' | 'CONTAINED' | 'VERIFYING';
export type IncidentType = 'FLOOD' | 'COLLAPSE' | 'FIRE' | 'GRID' | 'CHEMICAL' | 'MEDICAL';

export interface HazardIncident {
  id: string;
  title: string;
  sector: string;
  description: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  type: IncidentType;
  source: 'TINYFISH_AGENT' | 'CROWDSOURCED_MESH' | 'OFFICIAL_RADIO';
  verifiedByTinyFish: boolean;
  tinyFishTimestamp?: string;
  upvotes: number;
  reportedAt: string;
  lat: number;
  lng: number;
  blockedRoutes?: string[];
  affectedRadiusMeters: number;
}

export type ResourceType = 'SHELTER' | 'HOSPITAL' | 'WATER_STATION' | 'POWER_HUB' | 'BLOOD_BANK';

export interface ShelterResource {
  id: string;
  name: string;
  type: ResourceType;
  sector: string;
  address: string;
  capacityTotal: number;
  capacityOpen: number;
  occupancyRate: number;
  supplies: {
    beds: number;
    waterLiters: number;
    mealPacks: number;
    powerGenerator: boolean;
    medicalStaffOnDuty: boolean;
    bloodUnitsAvailable?: number;
  };
  contactRadio: string;
  verifiedLive: boolean;
  verifiedViaTinyFish: boolean;
  tinyFishTimestamp: string;
  tinyFishTargetUrl: string;
  tinyFishExtractionLog: string;
  portalHealthStatus: 'HEALTHY' | 'PORTAL_DOWN_FALLBACK' | 'SCRAPED_DYNAMIC';
  lat: number;
  lng: number;
  distanceKm: number;
}

export type AidCategory = 'WARMTH' | 'WATER' | 'FOOD' | 'MEDICAL' | 'POWER' | 'TOOLS';

export interface MutualAidItem {
  id: string;
  title: string;
  category: AidCategory;
  quantity: number;
  unit: string;
  offeredBy: string;
  nodeOriginId: string;
  sector: string;
  distanceKm: number;
  status: 'AVAILABLE' | 'CLAIMED' | 'RESERVED';
  claimedByNode?: string;
  claimTimestamp?: string;
  qrVerificationToken?: string;
  urgent: boolean;
  instructions: string;
}

export interface MeshNode {
  id: string;
  name: string;
  type: 'PHONE' | 'RADIO_RELAY' | 'SHELTER_HUB' | 'RESCUE_VEHICLE';
  protocol: 'BLE' | 'WIFI_DIRECT' | 'HYBRID_MESH';
  hops: number;
  rssiDbm: number;
  batteryPct: number;
  role: 'SUPER_NODE' | 'RELAY' | 'RECEIVE_ONLY';
  lastPingSec: number;
  status: 'ACTIVE' | 'RELAYING' | 'LOW_POWER';
  lat: number;
  lng: number;
}

export type EmergencyType = 'TRAPPED' | 'MEDICAL_CRITICAL' | 'FLASH_FLOOD' | 'FIRE_SURROUNDED' | 'GENERAL_SOS';

export interface SOSBeacon {
  id: string;
  senderId: string;
  senderName: string;
  emergencyType: EmergencyType;
  bloodType: string;
  personsCount: number;
  batteryPct: number;
  gpsCoords: { lat: number; lng: number };
  altitudeM: number;
  timestamp: string;
  meshPacketHex: string;
  status: 'TRANSMITTING' | 'RELAYED' | 'ACKNOWLEDGED';
  hopsCount: number;
  active: boolean;
}

export interface FirstAidStep {
  order: number;
  instruction: string;
  detail: string;
  warning?: string;
  metronomeActive?: boolean;
}

export interface FirstAidGuide {
  id: string;
  title: string;
  category: 'LIFE_SAVING' | 'TRAUMA' | 'ENVIRONMENTAL';
  durationSec: number;
  urgency: 'IMMEDIATE' | 'HIGH' | 'MODERATE';
  description: string;
  steps: FirstAidStep[];
}

export interface TinyFishAgentSession {
  agentId: string;
  name: string;
  targetSource: string;
  targetUrl: string;
  currentAction: string;
  logs: string[];
  extractedPayload: Record<string, any>;
  status: 'RUNNING' | 'COMPLETED' | 'FLAGGED_FALLBACK';
  responseTimeMs: number;
  timestamp: string;
}
