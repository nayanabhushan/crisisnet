import { FirstAidGuide } from '../types';

export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  {
    id: 'guide-cpr',
    title: 'Adult Hands-Only CPR (Cardiac Arrest)',
    category: 'LIFE_SAVING',
    durationSec: 120,
    urgency: 'IMMEDIATE',
    description: 'Provide continuous chest compressions at 100–120 beats per minute to keep oxygenated blood flowing to vital organs.',
    steps: [
      {
        order: 1,
        instruction: 'Check Responsiveness & Breathing',
        detail: 'Firmly tap shoulders and shout: "Are you okay?". Look at chest for normal breathing (no more than 10 seconds). If unresponsive or gasping, begin immediately.',
        warning: 'Do not waste time checking pulse if untrained. Agonal gasps are NOT breathing.',
      },
      {
        order: 2,
        instruction: 'Hand Placement on Sternum',
        detail: 'Place the heel of one hand in the center of the chest (between nipples). Place your other hand on top, interlocking fingers. Keep elbows straight.',
      },
      {
        order: 3,
        instruction: 'Push Hard and Fast (100–120 BPM)',
        detail: 'Compress chest at least 2 inches (5 cm) deep. Allow full chest recoil between compressions. Maintain rhythm using the metronome.',
        metronomeActive: true,
      },
      {
        order: 4,
        instruction: 'Switch Rescuer Every 2 Minutes',
        detail: 'Compressor fatigue degrades depth after 2 minutes. Swap with a bystander with minimal interruption (under 5 seconds).',
      },
    ],
  },
  {
    id: 'guide-bleeding',
    title: 'Severe Arterial Bleeding & Tourniquet Application',
    category: 'TRAUMA',
    durationSec: 90,
    urgency: 'IMMEDIATE',
    description: 'Control life-threatening limb hemorrhage using direct pressure or Combat Application Tourniquet (CAT).',
    steps: [
      {
        order: 1,
        instruction: 'Apply Direct Pressure with Hemostatic Dressing',
        detail: 'Firmly pack wound cavity with hemostatic or sterile gauze. Press with both hands using body weight continuously for at least 3 minutes.',
        warning: 'Do not lift dressing to check wound—this dislodges the forming clot.',
      },
      {
        order: 2,
        instruction: 'Apply Tourniquet High & Tight',
        detail: 'If bleeding from an arm or leg does not stop, place tourniquet 2–3 inches above the wound (never over a joint). If location unclear, place "High and Tight" at limb root.',
      },
      {
        order: 3,
        instruction: 'Twist Windlass Until Bleeding Ceases',
        detail: 'Tighten windlass rod until bright red pulsing bleeding halts and distal pulse disappears. Lock rod in clip.',
      },
      {
        order: 4,
        instruction: 'Record Exact Time on Forehead or Strap',
        detail: 'Write time of application (e.g., "T-23:45") on tourniquet strap or patient forehead with permanent marker.',
        warning: 'Never loosen or remove a tourniquet once secured; only trained surgical trauma staff may release it.',
      },
    ],
  },
  {
    id: 'guide-burns',
    title: 'Severe Flash Fire & Chemical Burns',
    category: 'ENVIRONMENTAL',
    durationSec: 120,
    urgency: 'HIGH',
    description: 'Prevent tissue damage, stop the burning process, and protect against rapid hypothermia.',
    steps: [
      {
        order: 1,
        instruction: 'Cool Burn with Clean Cool Water',
        detail: 'Irrigate thermal burn with clean, cool running water for 10–20 minutes. For chemicals, flush copiously with clean water for minimum 20 minutes.',
        warning: 'Never apply ice, iced water, butter, or ointments. Extreme cold induces tissue necrosis.',
      },
      {
        order: 2,
        instruction: 'Remove Constricting Jewelry & Loose Clothing',
        detail: 'Gently remove rings, watches, and belts before rapid edema/swelling sets in.',
        warning: 'Do NOT pull off clothing melted or adhered to burned skin. Cut around it.',
      },
      {
        order: 3,
        instruction: 'Cover with Sterile Loose Non-Adherent Dressing',
        detail: 'Loosely wrap with clean dry plastic wrap or sterile burn sheet. Do not pop burn blisters.',
      },
      {
        order: 4,
        instruction: 'Keep Patient Warm (Prevent Hypothermia)',
        detail: 'Large burns impair body temperature regulation. Cover unburned areas with emergency thermal blanket.',
      },
    ],
  },
  {
    id: 'guide-smoke',
    title: 'Toxic Smoke & Chemical Inhalation',
    category: 'TRAUMA',
    durationSec: 60,
    urgency: 'HIGH',
    description: 'Manage airway compromise from superheated toxic combustion fumes and particulate exposure.',
    steps: [
      {
        order: 1,
        instruction: 'Move Patient Upwind and to Fresh Air',
        detail: 'Immediately relocate victim away from smoke plume and low-lying gas pockets. Keep patient seated upright to ease breathing.',
      },
      {
        order: 2,
        instruction: 'Assess Airway & Signs of Inhalation Injury',
        detail: 'Look for singed nasal hairs, soot in sputum, hoarse voice, or stridor (high-pitched breathing). These indicate impending airway closure.',
      },
      {
        order: 3,
        instruction: 'Provide Moist Cloth Filter if Air Stagnant',
        detail: 'If moving through particulate zones, place moist cloth over nose and mouth until reaching clear atmosphere.',
      },
    ],
  },
];
