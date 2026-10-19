# Clean Energy Transition Explorer (Babylon.js 3D)

An interactive, high-performance 3D landscape built with **Babylon.js**, **React 19**, and **TypeScript** for exploring the physical infrastructure and strategic planning of clean energy transition.

---

## ⚡ New Features: Interactive Facilities & Mission Control

### 1. Interactive Energy Facility Modules
When approaching any energy facility (or pressing **[E]**), players access a 4-tab interactive panel:
- **Overview & Engineering Specs**: Nameplate capacity (MW), capacity factor, levelized cost (LCOE in $/MWh), lifespan, and fundamental thermodynamic conversion principle.
- **Animated Energy Generation Flow**: Custom interactive SVG schematics illustrating the step-by-step physics conversions:
  - *Solar Farm*: Photons striking doped silicon wafers, electron-hole excitation across P-N junctions, DC current collection, and MPPT inverters generating AC power.
  - *Wind Turbines*: Atmospheric wind stream, aerodynamic airfoil lift, planetary gearbox acceleration (1:90), and electromagnetic induction in the generator.
  - *Hydro Dam*: Hydraulic head accumulation (24m), gravity penstock pressurization, Francis turbine runner rotation, and synchronous alternator generation.
  - *Conventional Thermal Plant*: Hydrocarbon combustion, water-wall boiler tubes generating 540°C superheated steam, 3,600 RPM turbine expansion, and hyperbolic cooling tower condensation.
  - *Eco-Town Microgrid*: Distributed rooftop PV, IoT smart metering, bidirectional Vehicle-to-Grid (V2G) EV battery discharging, and autonomous microgrid islanding.
- **Advantages & Limitations**: In-depth, balanced trade-off analysis comparing dispatchability, carbon footprint, land use, grid inertia, and environmental impacts.
- **Interactive Knowledge Quiz**: 3 rigorous technical questions per facility with instant feedback and engineering explanations. Scoring 2/3 or better awards a **Clean Energy Research Grant** (+$3.0M to +$5.0M) directly deposited into your Mission Control transition budget!

### 2. Central Mission Control Dashboard (**[M]**)
Accessible at any time to monitor and direct regional clean energy transformation:
- **Energy Mix**: Live balance of Clean vs Fossil generation vs 150 MW regional demand.
- **Emissions Tracker**: Hourly metric tons of CO₂ and carbon intensity (gCO₂/kWh) with benchmark targets.
- **Grid Reliability Score (0 - 100)**: Real-time stability index calculated from spinning reserves, firm capacity ratio, and synthetic inertia buffers.
- **Investment Capital Budget**: Manage and deploy capital into strategic transition projects:
  - *Suncrest Solar Phase II Expansion* (+15.0 MW Solar)
  - *Whispering Ridge Wind Repowering* (+15.2 MW Wind)
  - *Regional Battery Energy Storage System (BESS)* (20 MW / 80 MWh, +14% Reliability)
  - *Cascade Gorge Pumped Hydro Upgrade* (+12.0 MW Flexible Storage)
  - *Greenwood Haven V2G & Virtual Power Plant* (+4.0 MW Peak Shaving)
  - *Decommission Ironwood Thermal Unit 1* (-40.0 MW Fossil, -38% Emissions)
  - *Full Decommissioning of Thermal Station* (100% Zero-Carbon Grid Goal)

---

## 🌍 World Features & 3D Assets

1. **Small Town (Greenwood Haven Eco-Town)**:
   - Civic Town Hall with entrance portico, classical columns, and clock cupola spire.
   - Central town plaza with paving, fountain, and eco-monument.
   - 12+ residential homes featuring rooftop monocrystalline solar panels, porches, chimneys, and brick/wood/white siding.
   - Dual-bay EV charging hub with stylized electric cars and solar canopy.
   - Streetlights and mixed deciduous/pine tree foliage.

2. **Solar Farm (Suncrest Photovoltaic Array)**:
   - 40 ground-mounted dual-table racking frames (320 PV modules) with realistic blue silicon wafer textures, busbars, and aluminum mounting frames angled at 30° south.
   - Central inverter station and step-up transformer pads.
   - Dedicated high-voltage collector substation with bushings and control building.
   - Perimeter fencing and maintenance access corridor.

3. **Wind Turbines (Whispering Ridge Wind Farm)**:
   - 6 utility-scale 36-meter tapered tubular steel wind turbines situated along the elevated western mountain ridge.
   - Detailed nacelles, aerodynamic spinner hubs, and 3-blade rotors with safety red warning stripes.
   - Real-time continuous rotation animation physics driven by the scene render loop.
   - Flashing red aviation safety hazard beacons on nacelles.

4. **Hydroelectric Dam (Cascade Gorge Dam & Reservoir)**:
   - 24-meter tall concrete gravity dam structure bridging the mountain canyon.
   - Upper reservoir lake basin with reflective water surface.
   - Roadway crest along the dam with concrete parapets and streetlights.
   - Central spillway chute with training piers.
   - 4 heavy industrial steel penstocks descending the downstream face.
   - Powerhouse generating station at the dam toe and water intake towers in the reservoir.

5. **River System**:
   - Continuous winding river ribbon carved 4m into the terrain.
   - Originates at the hydro dam tailrace and flows southeast across the valley floor into an outlet basin.

6. **Conventional Thermal Power Plant (Ironwood Thermal Station)**:
   - Twin hyperbolic cooling towers with dynamic rising vapor/steam particle systems.
   - Industrial boiler hall and turbine hall with window bays.
   - Two 42m tall industrial smokestacks with alternating red-and-white aviation warning bands.
   - Cylindrical fuel storage tanks with domed roofs, steam pipe racks, and switchyard.

7. **Regional Transmission Power Grid**:
   - Steel lattice transmission pylons interconnecting all generation sites to the town distribution network.
   - Catenary suspended 3-phase power line conductors.

8. **Lighting, Atmosphere & Shadows**:
   - Dynamic directional sun light with Poisson soft shadow generator.
   - Hemispheric ambient sky fill light with terrain ground reflection.
   - Time-of-Day presets: Daylight Noon, Golden Hour Sunset, and Twilight Night.
   - Atmospheric distance fog.

---

## 🎮 Navigation & Desktop Controls

- **[E]**: Inspect nearby Energy Facility (Opens animated flow, trade-offs, and quiz).
- **[M]**: Toggle Central Mission Control Dashboard.
- **[W, A, S, D]** or **Arrow Keys**: Move forward, backward, left, right.
- **Mouse Look**: Click the 3D viewport to lock mouse pointer (press **[ESC]** to unlock).
- **[Shift]**: Hold to sprint boost (2.5x speed).
- **[Space]**: Jump in First-Person mode; Ascend in Drone flight mode.
- **[C]**: Descend in Drone flight mode.
- **[1 - 6]**: Quick-travel teleportation to key landmarks:
  - `[1]` Eagle Peak Lookout (Panoramic Overview)
  - `[2]` Greenwood Haven Eco-Town
  - `[3]` Suncrest Solar Farm
  - `[4]` Whispering Ridge Wind Farm
  - `[5]` Cascade Gorge Hydro Dam
  - `[6]` Ironwood Thermal Power Station
- **[H]** or **[?]**: Toggle Controls & Information Guide.
- **Camera Switcher**: First-Person Walk, Drone Flight, or 360° Orbit View.

---

## 🚀 Run Instructions

### 1. Development Mode
Run the local dev server on port 3000:
```bash
npm run dev
```

### 2. Building for Production
Create the optimized production build:
```bash
npm run build
```

### 3. Preview Production Build
```bash
npm run preview
```

---

## 📁 Source File Structure

```
├── src/
│   ├── babylon/
│   │   ├── types.ts                # TypeScript definitions for landmarks, cameras, and sectors
│   │   ├── materials.ts            # Babylon StandardMaterials & procedural dynamic textures
│   │   ├── terrain.ts              # Analytical terrain mesh, reservoir basin, river ribbon & roads
│   │   ├── sceneManager.ts         # Engine, Scene, Cameras, Shadows, Lighting, Render loop
│   │   └── structures/
│   │       ├── town.ts             # Town hall, plaza, houses with solar roofs, EV hub, trees
│   │       ├── solarFarm.ts        # PV module tables, inverters, substation & fence
│   │       ├── windTurbines.ts     # Towers, nacelles, rotors with rotation animation
│   │       ├── hydroDam.ts         # Concrete dam, penstocks, powerhouse & intake towers
│   │       ├── powerPlant.ts       # Hyperbolic cooling towers, steam particles, stacks & tanks
│   │       └── powerGrid.ts        # Transmission pylons and catenary cables
│   ├── data/
│   │   ├── facilityLearningData.ts # Scientific generation steps, pros/cons, and quizzes
│   │   └── missionControlData.ts   # Grid metrics, emissions formulas, and capital projects
│   ├── components/
│   │   ├── AnimatedEnergyFlow.tsx  # Dynamic interactive SVG energy generation schematics
│   │   ├── FacilityModal.tsx       # Comprehensive modal (Overview, Flow, Tradeoffs, Quiz)
│   │   ├── MissionControlModal.tsx # Central dashboard (Mix, Emissions, Reliability, Budget)
│   │   ├── ExplorerHUD.tsx         # Sleek UI overlay with telemetry, teleport, and triggers
│   │   └── InstructionsModal.tsx   # Controls and documentation dialog
│   ├── App.tsx                     # Main React container wiring 3D canvas, HUD, and modals
│   ├── main.tsx                    # React DOM entry point
│   └── index.css                   # Tailwind styles and canvas reset
├── index.html                      # HTML entry point with metadata and fonts
├── package.json
└── vite.config.ts
```
