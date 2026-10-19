export interface GenerationStep {
  step: number;
  title: string;
  description: string;
  physicsConcept: string;
  keyMetric: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FacilityDetail {
  id: string;
  name: string;
  tagline: string;
  type: string;
  capacityMW: string;
  capacityFactor: string;
  levelizedCost: string; // ₱/MWh
  lifespan: string;
  primaryEnergySource: string;
  conversionPrinciple: string;
  generationSteps: GenerationStep[];
  advantages: {
    title: string;
    description: string;
    icon: string;
  }[];
  limitations: {
    title: string;
    description: string;
    icon: string;
  }[];
  quiz: QuizQuestion[];
  grantRewardMillion: number;
}

export const FACILITY_DETAILS: Record<string, FacilityDetail> = {
  solar: {
    id: 'solar',
    name: 'Suncrest Photovoltaic Array',
    tagline: 'Direct photon-to-electron solid-state energy conversion',
    type: 'Utility-Scale Solar Photovoltaic (PV)',
    capacityMW: '15.0 MW Peak',
    capacityFactor: '22 - 28%',
    levelizedCost: '₱1,750 - ₱2,450 / MWh',
    lifespan: '25 - 30 Years',
    primaryEnergySource: 'Solar Irradiance (Photons)',
    conversionPrinciple: 'Photovoltaic Effect in doped silicon p-n junctions',
    generationSteps: [
      {
        step: 1,
        title: 'Solar Absorption',
        description: 'Sunlight photons penetrate the anti-reflective glass and strike the P-N junction of monocrystalline silicon wafers.',
        physicsConcept: 'Planck-Einstein relation (E = hf)',
        keyMetric: '1,000 W/m² standard peak irradiance',
      },
      {
        step: 2,
        title: 'Electron-Hole Excitation',
        description: 'Photons with energy greater than silicon bandgap (1.12 eV) knock valence electrons free, creating mobile electron-hole pairs.',
        physicsConcept: 'Photoelectric effect & semiconductor bandgap excitation',
        keyMetric: '1.12 eV Silicon Bandgap',
      },
      {
        step: 3,
        title: 'Direct Current (DC) Collection',
        description: 'The internal electrostatic field sweeps electrons toward the negative N-layer fingers and silver busbars, driving Direct Current.',
        physicsConcept: 'Electrostatic drift current along P-N junction',
        keyMetric: '~40V DC per module string',
      },
      {
        step: 4,
        title: 'Inverter & Grid Integration',
        description: 'Central inverter bridges convert DC to 3-phase AC at 60 Hz with Maximum Power Point Tracking (MPPT), stepped up to 69 kV.',
        physicsConcept: 'Pulse Width Modulation (PWM) inversion & transformer electromagnetic induction',
        keyMetric: '98.5% Inverter efficiency',
      },
    ],
    advantages: [
      {
        title: 'Zero Direct Operational Emissions',
        description: 'Produces zero greenhouse gases, NOx, or particulate matter during electricity generation.',
        icon: 'Leaf',
      },
      {
        title: 'Lowest Levelized Cost of Energy (LCOE)',
        description: 'Modern solar PV has the lowest unsubsidized marginal cost of any new generation resource globally.',
        icon: 'TrendingDown',
      },
      {
        title: 'Modular & Rapid Deployment',
        description: 'Scales easily from residential kilowatts to gigawatt utility arrays without mechanical wear or cooling water.',
        icon: 'Layers',
      },
      {
        title: 'Minimal Water Consumption',
        description: 'Unlike thermal power plants, PV panels require almost zero operational water (only periodic dust washing).',
        icon: 'Droplet',
      },
    ],
    limitations: [
      {
        title: 'Intermittency & Diurnal Cycle',
        description: 'Output drops to zero at night and fluctuates under cloud cover, creating the steep "duck curve" ramp-up.',
        icon: 'CloudSun',
      },
      {
        title: 'Land Area Footprint',
        description: 'Requires roughly 5 to 8 acres per megawatt of capacity due to natural solar insolation limits.',
        icon: 'Maximize',
      },
      {
        title: 'Lack of Rotational Grid Inertia',
        description: 'Solid-state inverters provide no physical spinning mass to damp sudden grid frequency deviations.',
        icon: 'Activity',
      },
      {
        title: 'Critical Materials & Recycling',
        description: 'Manufacture requires purified polysilicon, silver, and rare metals requiring end-of-life recycling pathways.',
        icon: 'Recycle',
      },
    ],
    quiz: [
      {
        id: 'solar_q1',
        question: 'What physical phenomenon allows solar PV cells to convert sunlight directly into electricity?',
        options: [
          'Photovoltaic effect across a semiconductor p-n junction',
          'Thermoelectric Peltier effect from heated glass',
          'Electromagnetic induction from moving light waves',
          'Fluid expansion through micro-turbines',
        ],
        correctIndex: 0,
        explanation: 'The photovoltaic effect occurs when incoming photons excite valence electrons across the silicon semiconductor bandgap (1.12 eV), creating a voltage and electric current.',
      },
      {
        id: 'solar_q2',
        question: 'Why do utility solar farms require central inverters before delivering power to the regional grid?',
        options: [
          'To increase the physical temperature of the electricity',
          'To convert raw Direct Current (DC) into synchronized 3-phase Alternating Current (AC)',
          'To filter out excess electrons and convert them into hydrogen',
          'To store electricity chemically inside liquid electrolytes',
        ],
        correctIndex: 1,
        explanation: 'Solar panels generate Direct Current (DC), but modern power transmission grids operate on high-voltage Alternating Current (AC) at a synchronized 50/60 Hz frequency.',
      },
      {
        id: 'solar_q3',
        question: 'What is the "Duck Curve" phenomenon associated with high solar grid penetration?',
        options: [
          'A bird migration pattern caused by glistening solar panels',
          'The shape of net grid demand that dips during sunny middays and spikes steeply at sunset',
          'The curvature of parabolic solar concentrator mirrors',
          'The decline in solar panel efficiency when ambient humidity rises above 80%',
        ],
        correctIndex: 1,
        explanation: 'The Duck Curve illustrates how massive midday solar output depresses net load on conventional generators, followed by a steep evening demand ramp right as solar generation drops off.',
      },
    ],
    grantRewardMillion: 3.5,
  },

  wind: {
    id: 'wind',
    name: 'Whispering Ridge Wind Farm',
    tagline: 'Aerodynamic lift driving electromagnetic induction',
    type: 'Utility-Scale Horizontal Axis Wind Turbines (HAWT)',
    capacityMW: '15.0 MW (6x 2.5 MW Turbines)',
    capacityFactor: '34 - 45%',
    levelizedCost: '₱1,850 - ₱2,650 / MWh',
    lifespan: '20 - 25 Years',
    primaryEnergySource: 'Atmospheric Kinetic Energy (Wind)',
    conversionPrinciple: "Aerodynamic lift & Faraday's Law of Electromagnetic Induction",
    generationSteps: [
      {
        step: 1,
        title: 'Kinetic Airflow & Airfoil Lift',
        description: 'Wind flowing over the asymmetrical airfoil blades creates low pressure on top, generating aerodynamic lift perpendicular to relative wind.',
        physicsConcept: "Bernoulli's principle & Betz Limit (Max 59.3% kinetic extraction)",
        keyMetric: 'Cut-in speed: 3.0 m/s, Rated: 12 m/s',
      },
      {
        step: 2,
        title: 'Rotor Hub & Low-Speed Shaft',
        description: 'The 3 blades rotate the central hub and main low-speed shaft at approximately 10 to 16 RPM with high mechanical torque.',
        physicsConcept: 'Angular momentum & mechanical torque transmission',
        keyMetric: '12 - 16 RPM shaft rotation',
      },
      {
        step: 3,
        title: 'Gearbox Step-Up (or Direct Drive)',
        description: 'A multi-stage planetary gearbox multiplies the rotational speed roughly 90x, driving the high-speed shaft at ~1,500 RPM.',
        physicsConcept: 'Mechanical gear ratios & velocity amplification',
        keyMetric: '1:90 Gear ratio (up to 1,500 RPM)',
      },
      {
        step: 4,
        title: 'Electromagnetic Generation & Pitch Control',
        description: 'The high-speed rotor spins copper windings through intense magnetic stator fields, inducing 3-phase AC power while active pitch governs aerodynamic braking.',
        physicsConcept: "Faraday's Law of Induction & Lorentz force",
        keyMetric: '690V generated AC stepped up to 34.5 kV',
      },
    ],
    advantages: [
      {
        title: 'High Capacity Factor on Ridges',
        description: 'Elevated topography provides steady, higher-velocity wind streams that generate round-the-clock power, including night hours.',
        icon: 'Wind',
      },
      {
        title: 'Small Physical Ground Footprint',
        description: 'The tower bases occupy less than 1% of the total land area, allowing farming and wildlife corridors to coexist underneath.',
        icon: 'CheckCircle',
      },
      {
        title: 'Zero Operational Carbon & Water Free',
        description: 'Requires zero cooling water and consumes no fossil fuel, avoiding atmospheric pollutant emissions.',
        icon: 'Leaf',
      },
      {
        title: 'Fast Energy Payback Period',
        description: 'A modern wind turbine generates all the energy required to manufacture, install, and recycle it in under 6 to 8 months of operation.',
        icon: 'Zap',
      },
    ],
    limitations: [
      {
        title: 'Wind Variability & Forecasting',
        description: 'Generation depends on atmospheric weather patterns, requiring spinning reserves or battery buffering for wind lulls.',
        icon: 'CloudRain',
      },
      {
        title: 'Mechanical Fatigue & Maintenance',
        description: 'Dynamic turbulence and continuous cyclic stress require scheduled lubrication, gearbox overhauls, and blade inspections.',
        icon: 'Wrench',
      },
      {
        title: 'Transmission Distance to Load',
        description: 'The best wind resources are frequently located on remote ridges or offshore waters far from urban consumer centers.',
        icon: 'Network',
      },
      {
        title: 'Aviation & Wildlife Considerations',
        description: 'Requires radar-triggered warning lighting for aircraft and sonic/radar mitigation systems for migrating bird and bat species.',
        icon: 'Shield',
      },
    ],
    quiz: [
      {
        id: 'wind_q1',
        question: 'What theoretical limit defines the maximum possible kinetic energy a wind turbine can extract from the airflow?',
        options: [
          'The Betz Limit (59.3%)',
          'The Carnot Efficiency (38.2%)',
          'The Einstein Photoelectric Threshold',
          'The Newton-Laplace Sound Constant',
        ],
        correctIndex: 0,
        explanation: 'Formulated by Albert Betz in 1919, the Betz Limit dictates that no wind turbine can capture more than 16/27 (59.3%) of the kinetic energy in wind because air must retain velocity to exit behind the rotor.',
      },
      {
        id: 'wind_q2',
        question: 'How do modern utility wind turbines generate rotational force from moving air?',
        options: [
          'By using parachute drag to pull the blades backward',
          'By generating aerodynamic lift across asymmetrical airfoil blade sections, similar to airplane wings',
          'By using solar heating to create hot air vortices around the hub',
          'By burning fuel inside the nacelle to spin the spinner hub',
        ],
        correctIndex: 1,
        explanation: 'Wind turbine blades are shaped like airplane airfoils. As wind moves over the blade, the pressure difference between the upper and lower surfaces creates aerodynamic lift, which rotates the hub.',
      },
      {
        id: 'wind_q3',
        question: 'If the wind speed doubles (e.g. from 5 m/s to 10 m/s), by what factor does the theoretical power in the wind increase?',
        options: [
          '2x (Linear)',
          '4x (Quadratic - square of velocity)',
          '8x (Cubic - cube of velocity)',
          '16x (Quartic - fourth power of velocity)',
        ],
        correctIndex: 2,
        explanation: 'Wind power density is proportional to the cube of wind velocity (P = 0.5 × ρ × A × v³). Doubling the wind speed (2³) increases available energy by eightfold (8x).',
      },
    ],
    grantRewardMillion: 4.0,
  },

  hydro: {
    id: 'hydro',
    name: 'Cascade Gorge Hydroelectric Dam',
    tagline: 'Gravitational potential energy driving synchronous baseload hydro turbines',
    type: 'Impoundment Storage Hydroelectric Facility',
    capacityMW: '48.0 MW (4x 12 MW Francis Turbines)',
    capacityFactor: '50 - 65%',
    levelizedCost: '₱1,450 - ₱2,200 / MWh (Long-term amortized)',
    lifespan: '75 - 100+ Years',
    primaryEnergySource: 'Gravitational Potential Energy of Stored Water',
    conversionPrinciple: "Bernoulli's Hydraulic Head to Turbomachinery Shaft Work to Electricity",
    generationSteps: [
      {
        step: 1,
        title: 'Hydraulic Head Accumulation',
        description: 'The concrete dam impounds a 24-meter deep water reservoir, building gravitational potential energy (E = mgh) proportional to hydraulic head height.',
        physicsConcept: 'Hydrostatic pressure & potential energy (P = ρgh)',
        keyMetric: '24m Gross head height',
      },
      {
        step: 2,
        title: 'Penstock Pressurization',
        description: 'Intake gates open, channeling massive water volumes down pressurized steel penstocks, converting static pressure into high-velocity kinetic fluid momentum.',
        physicsConcept: "Conservation of Energy & Bernoulli's equation",
        keyMetric: 'Flow rate: 210 m³/sec at peak',
      },
      {
        step: 3,
        title: 'Francis Turbine Rotor Torque',
        description: 'High-pressure water passes through adjustable wicket gates into a spiral scroll casing, striking inward-flow curved runner blades to produce rotational torque.',
        physicsConcept: "Euler's Turbomachine equation & impulse-reaction torque",
        keyMetric: '92% Turbine mechanical efficiency',
      },
      {
        step: 4,
        title: 'Synchronous Generation & Tailrace Return',
        description: 'The vertical shaft spins a massive synchronous rotor with electromagnetic poles inside the stator, generating AC power before discharging water safely to the river.',
        physicsConcept: 'Synchronous electromagnetic induction & grid frequency locking',
        keyMetric: 'Black-start capability in <10 minutes',
      },
    ],
    advantages: [
      {
        title: 'Fully Dispatchable Baseload & Peaking',
        description: 'Output can ramp from 0 to 100% in minutes, balancing fluctuating solar and wind generation on the regional grid.',
        icon: 'Zap',
      },
      {
        title: 'Massive Physical Grid Inertia',
        description: 'Heavy spinning steel rotors and synchronous generators provide critical frequency stabilization during sudden grid shocks.',
        icon: 'Shield',
      },
      {
        title: 'Black-Start & Energy Storage Capabilities',
        description: 'Can restart an entire collapsed regional grid without external power, and can function as pumped storage.',
        icon: 'BatteryCharging',
      },
      {
        title: 'Multi-Century Infrastructure Lifespan',
        description: 'Concrete dam structures routinely operate for over a century with minimal recurring operational expenditure.',
        icon: 'Clock',
      },
    ],
    limitations: [
      {
        title: 'Ecosystem & River Ecology Impacts',
        description: 'Dams alter river hydrology, block upstream fish migration, and change sediment transport dynamics downstream.',
        icon: 'AlertTriangle',
      },
      {
        title: 'Geographic & Topographic Constraints',
        description: 'Can only be constructed where natural topography, canyon geology, and high hydrological rainfall intersect.',
        icon: 'MapPin',
      },
      {
        title: 'Vulnerability to Severe Droughts',
        description: 'Climate shifts and prolonged multi-year droughts can significantly reduce reservoir water levels and generation capacity.',
        icon: 'Sun',
      },
      {
        title: 'High Initial Capital Cost (CAPEX)',
        description: 'Requires enormous upfront civil engineering investments and complex environmental permitting.',
        icon: 'DollarSign',
      },
    ],
    quiz: [
      {
        id: 'hydro_q1',
        question: 'What is "hydraulic head" in a hydroelectric dam?',
        options: [
          'The vertical distance between the reservoir water level and the turbine discharge level',
          'The physical diameter of the intake penstock pipe',
          'The number of engineers managing the dam control room',
          'The chemical purity of water entering the turbines',
        ],
        correctIndex: 0,
        explanation: 'Hydraulic head is the vertical elevation difference between upstream water surface and downstream discharge, directly dictating water pressure and potential energy (P = ρgh).',
      },
      {
        id: 'hydro_q2',
        question: 'Why is hydroelectric power crucial for integrating high percentages of intermittent solar and wind?',
        options: [
          'Because hydro turbines can only run when wind turbines are operating',
          'Because its water flow can be throttled on-demand within minutes, acting as flexible dispatchable backup and frequency reserve',
          'Because water creates magnetic clouds that deflect lightning away from solar panels',
          'Because hydro generation generates zero friction in transmission lines',
        ],
        correctIndex: 1,
        explanation: 'Hydro dams have adjustable wicket gates that can ramp generation up or down within minutes, providing vital spinning reserves, dispatchable balancing, and grid inertia for variable renewables.',
      },
      {
        id: 'hydro_q3',
        question: 'What is "black-start capability" in power grid engineering?',
        options: [
          'Starting the power plant only at midnight when electricity tariffs are lowest',
          'The ability of a power plant to start generating electricity without relying on an external energized transmission grid',
          'Painting the exterior of turbines black to absorb ambient heat',
          'Using coal dust to ignite a emergency auxiliary diesel generator',
        ],
        correctIndex: 1,
        explanation: 'A black-start unit (like a hydro station using gravity-fed water) can start up from a complete system-wide blackout using only internal battery banks, providing the initial voltage to restart the rest of the grid.',
      },
    ],
    grantRewardMillion: 5.0,
  },

  plant: {
    id: 'plant',
    name: 'Ironwood Thermal Power Station',
    tagline: 'Fossil combustion driving Rankine steam cycle turbines',
    type: 'Subcritical Fossil Thermal Steam Generation (Coal/Gas)',
    capacityMW: '120.0 MW (2x 60 MW Steam Units)',
    capacityFactor: '60 - 85%',
    levelizedCost: '₱3,750 - ₱6,400 / MWh (High fuel & carbon exposure)',
    lifespan: '35 - 50 Years',
    primaryEnergySource: 'Chemical Energy stored in Fossil Fuels (Hydrocarbons)',
    conversionPrinciple: 'Rankine Thermodynamic Steam Cycle to Mechanical Shaft Torque to AC',
    generationSteps: [
      {
        step: 1,
        title: 'Fuel Combustion & Exothermic Reaction',
        description: 'Pulverized fuel or natural gas is burned in the boiler furnace at ~1,400°C, releasing chemical bond energy and producing flue gases (CO₂, SOx, NOx).',
        physicsConcept: 'Hydrocarbon oxidation (CxHy + O₂ → CO₂ + H₂O + ΔH)',
        keyMetric: '820 - 950 kg CO₂ emitted per MWh',
      },
      {
        step: 2,
        title: 'Superheated Steam Generation',
        description: 'Intense heat boils high-purity water inside thousands of boiler water-wall tubes, superheating steam to 540°C at 165 atmospheres of pressure.',
        physicsConcept: 'Rankine cycle Phase change & thermal expansion',
        keyMetric: '540°C at 16.5 MPa pressure',
      },
      {
        step: 3,
        title: 'Multi-Stage Steam Turbine Expansion',
        description: 'Superheated steam expands through High, Intermediate, and Low-Pressure turbine blades, driving a high-speed synchronous rotor at 3,600 RPM.',
        physicsConcept: "Enthalpy drop & Carnot thermodynamic limits",
        keyMetric: '3,600 RPM grid synchronous rotation',
      },
      {
        step: 4,
        title: 'Cooling Tower Condensation & Water Recycle',
        description: 'Exhaust steam passes through condenser tubes chilled by cooling tower water, condensing back into liquid condensate to repeat the cycle while thermal steam vents.',
        physicsConcept: 'Latent heat of vaporization & hyperbolic evaporative draft',
        keyMetric: 'Twin natural-draft hyperbolic cooling towers',
      },
    ],
    advantages: [
      {
        title: 'Weather-Independent Baseload Reliability',
        description: 'Can run continuously 24 hours a day, 365 days a year, regardless of cloud cover, wind velocity, or seasonal drought.',
        icon: 'ShieldCheck',
      },
      {
        title: 'Enormous Rotational Grid Inertia',
        description: 'Multi-ton steel steam turbine rotors store substantial kinetic momentum, stabilizing grid frequency during sudden surges.',
        icon: 'Activity',
      },
      {
        title: 'High Power Density & Compact Footprint',
        description: 'Concentrates 120+ megawatts within a modest industrial compound without requiring large reservoirs or expansive land plots.',
        icon: 'Box',
      },
      {
        title: 'On-Demand Fuel Dispatchability',
        description: 'Fuel can be stockpiled on-site in fuel silos or gas pipelines to provide sustained generation during grid crises.',
        icon: 'Database',
      },
    ],
    limitations: [
      {
        title: 'Massive Greenhouse Gas Emissions',
        description: 'Responsible for over 85% of regional energy sector carbon dioxide emissions, driving climate change and local air pollution.',
        icon: 'Flame',
      },
      {
        title: 'High Fuel Costs & Market Volatility',
        description: 'Operating expenses fluctuate with international commodity prices for coal and natural gas, impacting consumer power bills.',
        icon: 'TrendingUp',
      },
      {
        title: 'Intense Freshwater Cooling Demand',
        description: 'Evaporative cooling towers withdraw millions of liters of river water daily, producing thermal discharge into local waterways.',
        icon: 'Droplets',
      },
      {
        title: 'High Stranded Asset & Decommissioning Risk',
        description: 'Carbon taxes and falling renewable LCOE make aging fossil thermal plants increasingly uneconomic to maintain.',
        icon: 'AlertOctagon',
      },
    ],
    quiz: [
      {
        id: 'plant_q1',
        question: 'Which thermodynamic cycle is utilized by thermal power plants to convert heat energy into electricity?',
        options: [
          'The Rankine cycle (using water/steam as working fluid)',
          'The Stirling cycle',
          'The Brayton open cycle with dry nitrogen',
          'The Otto 4-stroke cycle',
        ],
        correctIndex: 0,
        explanation: 'The Rankine cycle is the foundational thermodynamic cycle for steam turbine thermal power plants, utilizing pressurized liquid water, boiling, superheated expansion, and condensation.',
      },
      {
        id: 'plant_q2',
        question: 'What is the primary substance rising from the large hyperbolic cooling towers of a power plant?',
        options: [
          'Pure evaporative water vapor (condensed steam mist)',
          'Concentrated carbon monoxide and poisonous ash',
          'Chlorofluorocarbons (CFCs) from coolant loops',
          'Pure methane gas being burned off',
        ],
        correctIndex: 0,
        explanation: 'Hyperbolic cooling towers circulate clean cooling water across condenser heat exchangers. The large white plumes rising from them are simply harmless evaporated water vapor (condensed steam mist). Flue gases exit via the tall narrow smokestacks.',
      },
      {
        id: 'plant_q3',
        question: 'Why is retiring or replacing conventional thermal plants challenging during a clean energy transition?',
        options: [
          'Because thermal plants produce the majority of grid inertia, firm capacity, and frequency control that variable renewables must replace',
          'Because electricity from coal is legally required to make renewable electricity work',
          'Because solar panels cannot physically transmit through existing power lines without coal steam',
          'Because cooling towers cannot be turned off once built',
        ],
        correctIndex: 0,
        explanation: 'Thermal plants supply "firm capacity" and spinning inertia that maintain grid frequency at 60 Hz. Retiring them requires replacing not just their raw energy (MWh), but also their capacity, storage, and grid stability services.',
      },
    ],
    grantRewardMillion: 4.5,
  },

  town: {
    id: 'town',
    name: 'Greenwood Haven Eco-Town',
    tagline: 'Decentralized smart microgrid with bidirectional V2G and demand response',
    type: 'Smart Grid Community Microgrid & Distributed Generation',
    capacityMW: '0.8 MW (PV) + 1.2 MW Demand Flexibility',
    capacityFactor: 'Variable (Community Demand Profile)',
    levelizedCost: 'Net negative through avoided transmission losses & peak shaving',
    lifespan: 'Continuous Urban Lifecycle',
    primaryEnergySource: 'Distributed Solar, EV Storage & Smart Demand Control',
    conversionPrinciple: 'Bidirectional Vehicle-to-Grid (V2G) & Smart Inverter Microgrid',
    generationSteps: [
      {
        step: 1,
        title: 'Distributed Rooftop Harvesting',
        description: 'Monocrystalline rooftop solar panels on homes and civic buildings generate clean daytime power right at the point of consumption.',
        physicsConcept: 'Distributed generation minimizing transmission line I²R heat losses',
        keyMetric: '0.8 MW aggregate rooftop generation',
      },
      {
        step: 2,
        title: 'Smart Metering & IoT Energy Optimization',
        description: 'Advanced Metering Infrastructure (AMI) and home energy managers automatically schedule heat pumps, dishwashers, and water heaters during solar surplus.',
        physicsConcept: 'Dynamic demand-side management & load factor smoothing',
        keyMetric: '15-minute telemetry dispatch intervals',
      },
      {
        step: 3,
        title: 'Vehicle-to-Grid (V2G) Bi-Directional Charging',
        description: 'Parked electric vehicles at community charging hubs act as a distributed virtual battery (VPP), feeding stored power back to the town during evening peaks.',
        physicsConcept: 'Electrochemical lithium-ion storage & bidirectional DC-AC inverters',
        keyMetric: 'Bidirectional 22 kW DC fast chargers',
      },
      {
        step: 4,
        title: 'Microgrid Islanding & Resilience',
        description: 'In the event of an upstream regional grid disruption, automated static transfer switches island the town, sustaining hospitals and essential services.',
        physicsConcept: 'Grid-forming inverters & autonomous microgrid frequency synthesis',
        keyMetric: '<16 millisecond seamless islanding transfer',
      },
    ],
    advantages: [
      {
        title: 'Near-Zero Transmission Line Losses',
        description: 'Generating electricity where it is consumed bypasses the 5-10% heat loss typical of long-distance high-voltage transmission.',
        icon: 'Zap',
      },
      {
        title: 'High Grid Resilience & Islanding',
        description: 'Can detach from the main grid during natural disasters, storms, or blackouts to keep vital community services running.',
        icon: 'Shield',
      },
      {
        title: 'Dynamic Peak Shaving (Virtual Power Plant)',
        description: 'EV batteries and smart loads shave expensive evening peak demand spikes, reducing the need for dirty fossil peaking plants.',
        icon: 'TrendingDown',
      },
      {
        title: 'Empowered Energy Consumers (Prosumers)',
        description: 'Residents earn credits by feeding excess solar energy back to the community grid, lowering household utility bills.',
        icon: 'Users',
      },
    ],
    limitations: [
      {
        title: 'Complex Bidirectional Grid Synchronization',
        description: 'Requires sophisticated smart inverters and protection relays to prevent back-feeding into lines undergoing utility maintenance.',
        icon: 'Network',
      },
      {
        title: 'EV Battery Degradation Considerations',
        description: 'Frequent V2G charge/discharge cycles must be managed carefully by smart algorithms to prevent shortening EV battery lifespan.',
        icon: 'Battery',
      },
      {
        title: 'High Cyber & Software Coordination Needs',
        description: 'Relies heavily on secure wireless communications, smart meters, and edge computing vulnerable to cyber threats.',
        icon: 'Lock',
      },
      {
        title: 'Dependent on Consumer Participation',
        description: 'Demand flexibility relies on community members opting in to automated appliance scheduling and dynamic pricing.',
        icon: 'UserCheck',
      },
    ],
    quiz: [
      {
        id: 'town_q1',
        question: 'What does "Vehicle-to-Grid" (V2G) technology enable electric cars to do?',
        options: [
          'Feed electricity stored in their battery packs back into the local power grid during peak demand hours',
          'Drive on rails built into the highway using magnetic levitation',
          'Charge their batteries exclusively using radio signals broadcast by cellphone towers',
          'Clean smog particles from the road using specialized air exhaust filters',
        ],
        correctIndex: 0,
        explanation: 'V2G technology uses bidirectional inverters to allow parked electric vehicles to discharge power back into the grid during high-demand periods, effectively creating a giant distributed battery reserve.',
      },
      {
        id: 'town_q2',
        question: 'What is "microgrid islanding"?',
        options: [
          'Building a power plant exclusively on an offshore island',
          'The capability of a localized microgrid to disconnect from the main grid and operate autonomously during outages',
          'Isolating solar panels so they only power one specific lightbulb',
          'Surrounding transformers with a water moat to prevent fires',
        ],
        correctIndex: 1,
        explanation: 'Microgrid islanding allows a local district or facility with on-site generation and storage to disconnect from an unstable or damaged bulk power grid and continue providing power safely.',
      },
      {
        id: 'town_q3',
        question: 'Why does distributed rooftop generation reduce total energy waste compared to centralized remote power plants?',
        options: [
          'It eliminates resistance heating losses (I²R losses) that occur across hundreds of miles of high-voltage transmission lines',
          'Rooftop panels make sunlight 50% brighter than ground level',
          'Electricity travels faster when moving downhill from a roof',
          'It converts all unused electricity into bottled drinking water',
        ],
        correctIndex: 0,
        explanation: 'Because electricity is consumed right beneath where it is generated, distributed power avoids the 5% to 10% resistive line losses (I²R loss) incurred when transmitting electricity across long distances.',
      },
    ],
    grantRewardMillion: 3.0,
  },
};
