# 🚨 CrisisNet (RescuNet)
### The Autonomous, Offline-First Emergency Mesh & AI Verification Platform
> **Hackathon:** Kritical Hacks 2026 (24-Hour Build)  
> **Core Sponsor Technology:** TinyFish (Autonomous Web Execution & AI Agent Infrastructure)  
> **Mission:** Eliminate information blackouts during disasters by pairing dynamic live web execution (TinyFish) with device-to-device offline mesh networking (BLE / Wi-Fi Direct).

---

## 💥 The Real-World Disaster Problem Solved
During severe weather events, flash floods, seismic events, or power grid failures:
1. **The API & Verification Gap:** Vital crisis data (open shelter beds, blood bank availability, hazard closures) is scattered across legacy municipal ASP.NET portals, weather boards, and hospital intake forms. They lack APIs and break traditional web scrapers due to dynamic JavaScript, anti-bot challenges, and multi-step dropdown forms.
2. **The Connectivity Blackout:** Cellular towers and internet backbones frequently collapse. First responders and citizens are stranded without connectivity to access live maps, report hazards, or coordinate aid.

---

## 🛡️ The 4 Core Screens & Capabilities

### 1. 📡 Live Disaster & Hazard Feed
- **Real-Time Critical Warnings:** Urgent warnings (e.g., *"XYZ Bridge Structural Collapse in Sector 4"*, *"Flash Flood Surge & Culvert Failure"*).
- **Incident Severity Levels:** `CRITICAL EVAC`, `ACTIVE DANGER`, `CAUTION`, and `ADVISORY`.
- **Live Incident Simulator:** Instant simulation buttons to trigger incoming Flash Flood surges, Structural Collapses, or Crowdsourced P2P mesh pings.
- **Relay Hop & Verification:** Upvote / confirm hazards over BLE mesh hops to boost confidence score across city sectors.
- **Direct Hazard Avoidance:** One-click *"Avoid on Map"* dynamically plots the hazard and triggers automatic rerouting.

### 2. 🗺️ Verified Resource & Shelter Map
- **Tactical High-Contrast Vector Radar Map:** 100% cached offline with a real-time radar sweep, user location beacon, and danger zone radius indicators.
- **Dynamic Offline Hazard-Aware Rerouting (Blueprint Feature #4):**
  - Reroutes around collapsed bridges or flooded underpasses automatically.
  - Visibly displays the blocked direct road (red dashed line) vs. the computed safe detour path (glowing green/cyan solid line) with detour timing (+4 mins).
- **"Verified Live via TinyFish" Badges:** Every shelter displays a distinct trust badge with timestamp.
- **Inspectable TinyFish Live Crawl Logs:** Expandable drawer reveals the exact headless browser execution, form dropdown selectors, and raw extracted JSON data.
- **Proactive Health-Check Flags (Blueprint Feature #2):** Automatically detects 504 timeouts on broken municipal portals and flags them as *"Needs Radio/Phone Verification"*.

### 3. 📦 Community Mutual Aid Marketplace (Offer & Claim)
- **Decentralized Surplus Exchange:** Shelters, volunteers, and citizens can list supplies (Blankets, 50L Water, Trauma First Aid Kits, MRE Ration Packs, Solar Phone Charging, Pediatric Formula, Insulin Cold Storage).
- **Relief Package Trust & QR Verification (Blueprint Feature #5):**
  - Claiming generates an offline **21x21 QR Code** with cryptographic verification token (`CN-XXXX-XXXX`) and recipient node ID.
  - Decrements local inventory across the BLE mesh network to prevent double-claiming without requiring an internet connection.
- **"Offer Surplus Supplies" Modal:** Citizens can post surplus aid into the mesh inventory in seconds.

### 4. 📶 Offline Mesh Status & SOS Beacon Center
- **Simulated BLE / Wi-Fi Direct Mesh:** Displays connected peer devices with protocol type (BLE / Wi-Fi Direct), RSSI signal strength (-24 dBm to -92 dBm), peer hops, and ping frequencies.
- **Interactive Mesh Topology Visualization:** Visual P2P graph showing node links, hops, and packet forwarding paths.
- **"Digital Breadcrumbs" SOS Broadcast (Blueprint Feature #1):**
  - Sends 128-bit encrypted digital breadcrumb location packets containing GPS coordinates, altitude, triage urgency, blood type, and emergency status.
  - High-intensity audio SOS siren (Web Audio API) and visual emergency strobe.
- **Battery-Aware Mesh Optimization (Blueprint Feature #6):**
  - Dynamic battery slider (5% to 100%).
  - Below 15%: Automatically shifts to low-power **"Receive-Only Mode"** to conserve survival battery.
  - Above 50%: Auto-promoted to **"Mesh Relay Super-Node"** to extend transmission range across city sectors.

---

## 🚀 High-Impact Hackathon Differentiators

| Feature | Description |
| :--- | :--- |
| **🤖 TinyFish Web Execution Terminal** | Live interactive terminal simulating autonomous agents interacting with dynamic forms, selecting dropdowns, and testing broken portals without APIs. |
| **🔊 Offline First Aid AI Co-Pilot** | Step-by-step CPR triage with a precision **110 BPM audio metronome** and beating heart cadence, plus Web Speech API voice guidance for hands-free rescue. |
| **📴 Zero-Internet Airplane Mode Toggle** | Instant top-bar toggle demonstrating seamless offline persistence with LocalStorage state saving. |
| **🔊 Tactical Web Audio Synthesizer** | Realistic emergency sirens, CPR clicks, alert chimes, and radio chirps using the native HTML5 Web Audio API. |

---

## 🛠️ Tech Stack & Architecture
- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 (Emergency High-Contrast Tactical Dark Mode)
- **Icons:** Lucide React
- **Audio Engine:** HTML5 Web Audio API Synthesizer (No external MP3 dependencies)
- **QR Engine:** Pure Deterministic SVG QR Matrix Generator
- **Storage:** LocalStorage Offline State Persistence Engine

---

## 🏃 Getting Started & Running Locally

1. **Navigate to the project folder:**
   ```powershell
   cd "C:\Users\hp\.gemini\antigravity\scratch\crisisnet"
   ```

2. **Start the local development server:**
   ```powershell
   npm run dev
   ```

3. **Open the web application:**
   Navigate to [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in any browser.

---

## 🎯 24-Hour Hackathon Demo Flow
1. **Show Airplane Mode:** Click the *"Airplane Mode: Mesh Only"* toggle in the header. The app operates 100% offline.
2. **Simulate Live Disaster Feed:** Click *"+ Flood Surge Alert"* or *"+ Bridge Collapse Alert"* to watch real-time warnings appear with TinyFish verification badges.
3. **Inspect the Shelter Map:** Switch to the Map tab. Select *"Sector 4 Arena"* to see the dynamic reroute engine calculate a safe detour around the collapsed bridge. Click *"Inspect TinyFish Log"* to see live DOM scraping details.
4. **Claim Mutual Aid with QR:** Switch to the Market tab, click *"Claim / Request Nav"* on the Thermal Blankets, and inspect the generated offline QR verification token.
5. **Demonstrate Battery-Aware Mesh & SOS:** Switch to the Mesh tab, drag the battery slider under 15% to trigger *"Receive-Only Mode"*, then click *"Broadcast Emergency SOS"* to activate the emergency beacon and audio siren.
