export interface TransitionProject {
  id: string;
  name: string;
  category: 'Renewables' | 'Storage' | 'Fossil Phase-Out' | 'Grid Modernization';
  description: string;
  costMillion: number;
  effectDescription: string;
  solarMWDelta: number;
  windMWDelta: number;
  hydroMWDelta: number;
  thermalMWDelta: number;
  batteryMWDelta: number;
  townMWDelta: number;
  stabilityBonus: number;
  unlocked: boolean;
  implemented: boolean;
  requiredProjectIds?: string[];
}

export interface GridState {
  solarMW: number;
  windMW: number;
  hydroMW: number;
  thermalMW: number;
  townMW: number;
  batteryMW: number;
  regionalDemandMW: number;
}

export const INITIAL_TRANSITION_PROJECTS: TransitionProject[] = [
  {
    id: 'solar_phase2',
    name: 'Suncrest Solar Phase II Expansion',
    category: 'Renewables',
    description: 'Install 40 additional bifacial PV racks with single-axis tracking and upgraded central inverters.',
    costMillion: 14.0,
    effectDescription: '+15.0 MW Solar capacity • -12.5 MT CO₂/hr',
    solarMWDelta: 15.0,
    windMWDelta: 0,
    hydroMWDelta: 0,
    thermalMWDelta: 0,
    batteryMWDelta: 0,
    townMWDelta: 0,
    stabilityBonus: 0,
    unlocked: true,
    implemented: false,
  },
  {
    id: 'wind_repower',
    name: 'Whispering Ridge Wind Repowering',
    category: 'Renewables',
    description: 'Add 4 high-capacity 3.8 MW next-generation carbon-fiber wind turbines along the north mountain crest.',
    costMillion: 16.5,
    effectDescription: '+15.2 MW Wind capacity • -13.0 MT CO₂/hr',
    solarMWDelta: 0,
    windMWDelta: 15.2,
    hydroMWDelta: 0,
    thermalMWDelta: 0,
    batteryMWDelta: 0,
    townMWDelta: 0,
    stabilityBonus: 0,
    unlocked: true,
    implemented: false,
  },
  {
    id: 'bess_storage',
    name: 'Regional Battery Energy Storage System (BESS)',
    category: 'Storage',
    description: 'Deploy a 20 MW / 80 MWh lithium iron phosphate (LFP) grid battery bank with synthetic inertia inverters.',
    costMillion: 15.0,
    effectDescription: '+20.0 MW Fast Frequency Storage • +14% Grid Reliability Score',
    solarMWDelta: 0,
    windMWDelta: 0,
    hydroMWDelta: 0,
    thermalMWDelta: 0,
    batteryMWDelta: 20.0,
    townMWDelta: 0,
    stabilityBonus: 14,
    unlocked: true,
    implemented: false,
  },
  {
    id: 'hydro_pumped',
    name: 'Cascade Gorge Pumped Hydro Upgrade',
    category: 'Storage',
    description: 'Install reversible pump-turbines connecting lower river basin to upper reservoir for flexible energy storage.',
    costMillion: 22.0,
    effectDescription: '+12.0 MW Dispatchable Hydro • +10% Grid Stability & Black-start',
    solarMWDelta: 0,
    windMWDelta: 0,
    hydroMWDelta: 12.0,
    thermalMWDelta: 0,
    batteryMWDelta: 0,
    townMWDelta: 0,
    stabilityBonus: 10,
    unlocked: true,
    implemented: false,
  },
  {
    id: 'town_microgrid',
    name: 'Greenwood Haven V2G & Virtual Power Plant',
    category: 'Grid Modernization',
    description: 'Equip town EV chargers with bidirectional Vehicle-to-Grid inverters and deploy automated demand response.',
    costMillion: 7.5,
    effectDescription: '+4.0 MW Virtual Storage Peak Shaving • +6% Reliability',
    solarMWDelta: 0,
    windMWDelta: 0,
    hydroMWDelta: 0,
    thermalMWDelta: 0,
    batteryMWDelta: 0,
    townMWDelta: 4.0,
    stabilityBonus: 6,
    unlocked: true,
    implemented: false,
  },
  {
    id: 'retire_thermal_1',
    name: 'Decommission Ironwood Thermal Unit 1',
    category: 'Fossil Phase-Out',
    description: 'Retire the first 40 MW subcritical coal/gas steam boiler, drastically cutting regional carbon and particulate emissions.',
    costMillion: 5.0,
    effectDescription: '-40.0 MW Fossil generation • -34 MT CO₂/hr (-38% Emissions)',
    solarMWDelta: 0,
    windMWDelta: 0,
    hydroMWDelta: 0,
    thermalMWDelta: -40.0,
    batteryMWDelta: 0,
    townMWDelta: 0,
    stabilityBonus: -4,
    unlocked: true,
    implemented: false,
  },
  {
    id: 'retire_thermal_2',
    name: 'Full Decommissioning of Ironwood Thermal Station',
    category: 'Fossil Phase-Out',
    description: 'Permanently shut down the remaining 80 MW thermal capacity, transforming the plant site into a clean grid synchronous condenser.',
    costMillion: 8.5,
    effectDescription: '-80.0 MW Fossil generation • 100% Zero-Carbon Grid Achieved',
    solarMWDelta: 0,
    windMWDelta: 0,
    hydroMWDelta: 0,
    thermalMWDelta: -80.0,
    batteryMWDelta: 0,
    townMWDelta: 0,
    stabilityBonus: -6,
    unlocked: true,
    implemented: false,
    requiredProjectIds: ['retire_thermal_1'],
  },
];

export interface MissionMetrics {
  totalCapacityMW: number;
  totalGenerationMW: number;
  renewableSharePercent: number;
  fossilSharePercent: number;
  co2EmissionsTonsPerHour: number;
  carbonIntensityGramsPerKWh: number;
  emissionsReductionPercent: number;
  gridReliabilityScore: number; // 0 - 100
  reserveMarginPercent: number;
  stabilityStatus: 'Critical' | 'Warning' | 'Stable' | 'Optimal';
}

export function calculateMissionMetrics(gridState: GridState, stabilityBonusTotal: number): MissionMetrics {
  const { solarMW, windMW, hydroMW, thermalMW, townMW, batteryMW, regionalDemandMW } = gridState;

  const totalCapacityMW = solarMW + windMW + hydroMW + thermalMW + townMW + batteryMW;
  const renewableMW = solarMW + windMW + hydroMW + townMW + batteryMW;
  const renewableSharePercent = totalCapacityMW > 0 ? Math.min(100, Math.round((renewableMW / totalCapacityMW) * 100)) : 0;
  const fossilSharePercent = 100 - renewableSharePercent;

  // Emissions:
  // Subcritical thermal coal/gas emits approx 0.86 metric tons CO2 per MWh generated.
  // Renewables emit 0 direct operational emissions.
  const co2EmissionsTonsPerHour = Math.max(0, parseFloat((thermalMW * 0.86).toFixed(1)));
  const initialBaseEmissions = 120.0 * 0.86; // 103.2 MT/hr
  const emissionsReductionPercent = Math.max(
    0,
    Math.min(100, Math.round(((initialBaseEmissions - co2EmissionsTonsPerHour) / initialBaseEmissions) * 100))
  );

  // Carbon intensity in grams CO2 / kWh:
  // (Emissions in tons/hr * 1,000,000 g) / (Total Demand in MWh * 1,000 kWh)
  const carbonIntensityGramsPerKWh =
    regionalDemandMW > 0 ? Math.round((co2EmissionsTonsPerHour * 1000) / regionalDemandMW) : 0;

  // Reliability & Grid Stability Calculation:
  // 1. Reserve Margin %: ((totalCapacity - demand) / demand) * 100
  const reserveMarginPercent = Math.round(((totalCapacityMW - regionalDemandMW) / regionalDemandMW) * 100);

  // 2. Firm / Dispatchable capacity (Hydro, Thermal, Battery, Town flexibility)
  const firmCapacityMW = hydroMW + thermalMW + batteryMW + townMW * 0.5;
  const firmRatio = Math.min(1.0, firmCapacityMW / (regionalDemandMW * 0.75));

  // Base stability score
  let reliability = 50 + firmRatio * 35 + (reserveMarginPercent > 15 ? 10 : reserveMarginPercent * 0.5) + stabilityBonusTotal;
  reliability = Math.max(15, Math.min(99, Math.round(reliability)));

  let stabilityStatus: 'Critical' | 'Warning' | 'Stable' | 'Optimal' = 'Stable';
  if (reliability < 50 || reserveMarginPercent < 0) {
    stabilityStatus = 'Critical';
  } else if (reliability < 75) {
    stabilityStatus = 'Warning';
  } else if (reliability >= 90) {
    stabilityStatus = 'Optimal';
  }

  return {
    totalCapacityMW: Math.round(totalCapacityMW * 10) / 10,
    totalGenerationMW: Math.round(totalCapacityMW * 10) / 10,
    renewableSharePercent,
    fossilSharePercent,
    co2EmissionsTonsPerHour,
    carbonIntensityGramsPerKWh,
    emissionsReductionPercent,
    gridReliabilityScore: reliability,
    reserveMarginPercent,
    stabilityStatus,
  };
}
