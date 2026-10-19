import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Info, Zap } from 'lucide-react';
import { FacilityDetail, GenerationStep } from '../data/facilityLearningData';

interface AnimatedEnergyFlowProps {
  facility: FacilityDetail;
}

export const AnimatedEnergyFlow: React.FC<AnimatedEnergyFlowProps> = ({ facility }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [tick, setTick] = useState<number>(0);

  const steps = facility.generationSteps;
  const activeStep: GenerationStep = steps[currentStepIndex] || steps[0];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Step cycling when playing
  useEffect(() => {
    if (!isPlaying) return;
    const stepTimer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(stepTimer);
  }, [isPlaying, steps.length]);

  return (
    <div className="flex flex-col gap-4">
      {/* Schematic Interactive Canvas / SVG Area */}
      <div className="relative w-full h-64 sm:h-72 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex flex-col justify-between p-4">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top Header inside schematic */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              Energy Generation Schematic • Step {activeStep.step} of {steps.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-slate-300 hover:text-white p-1 rounded transition-colors"
              title={isPlaying ? 'Pause Auto-cycle' : 'Play Auto-cycle'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsPlaying(true);
              }}
              className="text-slate-300 hover:text-white p-1 rounded transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive Schematic Diagram based on facility */}
        <div className="relative z-10 w-full h-full my-auto flex items-center justify-center">
          {facility.id === 'solar' && <SolarSchematic step={activeStep.step} tick={tick} />}
          {facility.id === 'wind' && <WindSchematic step={activeStep.step} tick={tick} />}
          {facility.id === 'hydro' && <HydroSchematic step={activeStep.step} tick={tick} />}
          {facility.id === 'plant' && <PlantSchematic step={activeStep.step} tick={tick} />}
          {facility.id === 'town' && <TownSchematic step={activeStep.step} tick={tick} />}
        </div>

        {/* Bottom Schematic Badge */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800/80">
          <span className="text-slate-300 font-semibold">{activeStep.title}</span>
          <span className="text-emerald-400">{activeStep.keyMetric}</span>
        </div>
      </div>

      {/* Step Progress Pills & Manual Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {steps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStepIndex(idx);
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentStepIndex === idx
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-900/60 flex items-center justify-center text-[10px] font-mono">
                {s.step}
              </span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setCurrentStepIndex((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
              setIsPlaying(false);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentStepIndex((prev) => (prev + 1) % steps.length);
              setIsPlaying(false);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Step Detailed Explanation Card */}
      <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-200 font-semibold">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white">{activeStep.title}</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {activeStep.physicsConcept}
          </span>
        </div>
        <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
          {activeStep.description}
        </p>
      </div>
    </div>
  );
};

/* -------------------- SVG Schematics -------------------- */

// 1. Solar Photovoltaic Schematic
const SolarSchematic: React.FC<{ step: number; tick: number }> = ({ step, tick }) => {
  const sunPulse = Math.sin(tick * 0.1) * 3;
  const electronShift = (tick * 4) % 120;

  return (
    <svg viewBox="0 0 600 200" className="w-full h-full max-h-52">
      <defs>
        <linearGradient id="solarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
          <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sun */}
      <circle cx="70" cy="50" r={26 + sunPulse} fill="url(#sunGlow)" />
      <circle cx="70" cy="50" r="16" fill="#fef08a" />

      {/* Photons moving from Sun to PV panel */}
      {[0, 1, 2, 3].map((i) => {
        const offset = ((tick * 3 + i * 40) % 140);
        const x = 85 + offset * 0.8;
        const y = 60 + offset * 0.55;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="3" fill="#fef08a" />
            <line
              x1={x - 6}
              y1={y - 4}
              x2={x + 6}
              y2={y + 4}
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="2,2"
            />
          </g>
        );
      })}

      {/* PV Solar Cell Cross Section */}
      <g transform="translate(180, 50)">
        {/* Anti-reflective glass */}
        <rect x="0" y="0" width="160" height="14" rx="3" fill="#38bdf8" fillOpacity="0.4" stroke="#0284c7" />
        <text x="80" y="10" fill="#bae6fd" fontSize="9" textAnchor="middle" fontFamily="monospace">
          Anti-reflective Glass
        </text>

        {/* N-Type Layer */}
        <rect x="0" y="18" width="160" height="26" fill="#3b82f6" stroke="#1d4ed8" />
        <text x="80" y="34" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
          N-Type Silicon (Phosphorus)
        </text>

        {/* Depletion Region (P-N Junction) */}
        <rect x="0" y="47" width="160" height="14" fill="#6366f1" fillOpacity="0.8" stroke="#4f46e5" />
        <text x="80" y="57" fill="#e0e7ff" fontSize="8" textAnchor="middle" fontFamily="monospace">
          P-N Junction Field (1.12 eV)
        </text>

        {/* P-Type Layer */}
        <rect x="0" y="64" width="160" height="34" fill="#1e293b" stroke="#334155" />
        <text x="80" y="84" fill="#cbd5e1" fontSize="10" textAnchor="middle">
          P-Type Silicon (Boron)
        </text>

        {/* Animated Mobile Electrons (e-) */}
        {[20, 50, 80, 110, 140].map((x, idx) => (
          <g key={idx} transform={`translate(${x}, ${54 - Math.sin((tick + idx) * 0.4) * 16})`}>
            <circle r="4" fill="#38bdf8" />
            <text y="3" fontSize="8" fill="#0c121e" fontWeight="bold" textAnchor="middle">
              e⁻
            </text>
          </g>
        ))}
      </g>

      {/* DC Conductor Path to Inverter */}
      <path
        d="M 345 68 L 410 68 L 410 95"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="3"
        strokeDasharray="6,4"
        strokeDashoffset={-electronShift}
      />
      <text x="380" y="60" fill="#38bdf8" fontSize="9" fontFamily="monospace">
        DC Power
      </text>

      {/* Central Inverter Box */}
      <g transform="translate(390, 80)">
        <rect x="0" y="0" width="80" height="60" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
        <text x="40" y="24" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">
          INVERTER
        </text>
        <text x="40" y="38" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
          DC ➔ 3Φ AC
        </text>
        {/* Animated sine wave inside inverter */}
        <path
          d={`M 15 48 Q 25 ${48 - Math.sin(tick * 0.2) * 6} 35 48 T 55 48 T 65 48`}
          fill="none"
          stroke="#4ade80"
          strokeWidth="2"
        />
      </g>

      {/* AC Power Line to Grid */}
      <path
        d="M 470 110 L 530 110"
        fill="none"
        stroke="#4ade80"
        strokeWidth="3"
        strokeDasharray="6,4"
        strokeDashoffset={-electronShift}
      />

      {/* Transmission Pylon */}
      <g transform="translate(530, 85)">
        <path d="M 15 0 L 0 50 L 30 50 Z" fill="none" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="-5" y1="18" x2="35" y2="18" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="0" y1="32" x2="30" y2="32" stroke="#cbd5e1" strokeWidth="2" />
        <text x="15" y="64" fill="#4ade80" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          GRID 69kV
        </text>
      </g>
    </svg>
  );
};

// 2. Wind Turbine Schematic
const WindSchematic: React.FC<{ step: number; tick: number }> = ({ step, tick }) => {
  const rotorAngle = (tick * 8) % 360;
  const windOffset = (tick * 6) % 150;

  return (
    <svg viewBox="0 0 600 200" className="w-full h-full max-h-52">
      {/* Wind Flow Streamlines */}
      {[30, 60, 90, 120, 150].map((y, idx) => (
        <path
          key={idx}
          d={`M 20 ${y} Q 100 ${y + 5} 170 ${y}`}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeOpacity="0.7"
          strokeDasharray="8,6"
          strokeDashoffset={-windOffset - idx * 15}
        />
      ))}
      <text x="50" y="24" fill="#38bdf8" fontSize="10" fontFamily="monospace">
        Atmospheric Wind (Kinetic Energy)
      </text>

      {/* Nacelle & Tower Schematic (Cross-section) */}
      <g transform="translate(180, 40)">
        {/* Tower Base */}
        <path d="M 95 65 L 85 155 L 115 155 L 105 65 Z" fill="#334155" stroke="#475569" />

        {/* Nacelle enclosure */}
        <rect x="70" y="40" width="165" height="42" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
        <text x="150" y="32" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
          Nacelle Drive Train
        </text>

        {/* Spinner Hub */}
        <circle cx="65" cy="61" r="14" fill="#e2e8f0" stroke="#94a3b8" />

        {/* Rotating 3-Blade Silhouette */}
        <g transform={`translate(65, 61) rotate(${rotorAngle})`}>
          {[0, 120, 240].map((ang) => (
            <g key={ang} transform={`rotate(${ang})`}>
              <path d="M 0 0 L -4 -65 Q 0 -70 4 -65 Z" fill="#f8fafc" stroke="#cbd5e1" />
              {/* Red tip stripe */}
              <path d="M -3 -52 L -4 -65 Q 0 -70 4 -65 L 3 -52 Z" fill="#ef4444" />
            </g>
          ))}
        </g>

        {/* Low-speed shaft */}
        <rect x="75" y="57" width="28" height="8" fill="#94a3b8" />
        <text x="89" y="54" fill="#cbd5e1" fontSize="7" textAnchor="middle">
          16 RPM
        </text>

        {/* Planetary Gearbox */}
        <rect x="103" y="50" width="36" height="22" rx="3" fill="#475569" stroke="#64748b" />
        <text x="121" y="64" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
          1:90 GEAR
        </text>

        {/* High-speed shaft */}
        <rect x="139" y="59" width="22" height="4" fill="#cbd5e1" />
        <text x="150" y="54" fill="#38bdf8" fontSize="7" textAnchor="middle">
          1,500 RPM
        </text>

        {/* Electromagnetic Generator */}
        <rect x="161" y="47" width="46" height="28" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="184" y="62" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
          GEN
        </text>
        <text x="184" y="71" fill="#4ade80" fontSize="7" textAnchor="middle">
          690V AC
        </text>
      </g>

      {/* Down-tower cables & Transformer */}
      <path
        d="M 370 102 L 370 155 L 430 155"
        fill="none"
        stroke="#4ade80"
        strokeWidth="3"
        strokeDasharray="5,4"
        strokeDashoffset={-tick * 3}
      />

      <g transform="translate(430, 130)">
        <rect x="0" y="0" width="55" height="45" rx="5" fill="#1e293b" stroke="#475569" />
        <text x="27" y="22" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
          STEP-UP TX
        </text>
        <text x="27" y="34" fill="#4ade80" fontSize="8" textAnchor="middle" fontFamily="monospace">
          34.5 kV
        </text>
      </g>

      {/* Grid Connection */}
      <path
        d="M 485 152 L 540 152"
        fill="none"
        stroke="#4ade80"
        strokeWidth="3"
        strokeDasharray="5,4"
        strokeDashoffset={-tick * 3}
      />
      <circle cx="545" cy="152" r="5" fill="#4ade80" />
      <text x="545" y="172" fill="#4ade80" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        TO GRID
      </text>
    </svg>
  );
};

// 3. Hydroelectric Dam Schematic
const HydroSchematic: React.FC<{ step: number; tick: number }> = ({ step, tick }) => {
  const waterFlow = (tick * 5) % 100;

  return (
    <svg viewBox="0 0 600 200" className="w-full h-full max-h-52">
      {/* Upper Reservoir Water */}
      <rect x="20" y="30" width="130" height="135" fill="#0284c7" fillOpacity="0.45" />
      {/* Water Surface Waves */}
      <path
        d="M 20 30 Q 50 26 80 30 T 150 30 L 150 165 L 20 165 Z"
        fill="#0284c7"
        fillOpacity="0.5"
      />
      <text x="75" y="55" fill="#e0f2fe" fontSize="10" fontWeight="bold" textAnchor="middle">
        RESERVOIR
      </text>
      <text x="75" y="70" fill="#bae6fd" fontSize="8" textAnchor="middle" fontFamily="monospace">
        Head = 24m (P = ρgh)
      </text>

      {/* Concrete Dam Wall Section */}
      <path d="M 150 25 L 180 25 L 235 165 L 150 165 Z" fill="#475569" stroke="#64748b" />
      <text x="175" y="20" fill="#cbd5e1" fontSize="9" textAnchor="middle">
        Dam Crest Road
      </text>

      {/* Penstock Conduit (Slanted Pipe) */}
      <path
        d="M 140 105 L 245 130"
        stroke="#1e293b"
        strokeWidth="20"
        strokeLinecap="round"
      />
      <path
        d="M 140 105 L 245 130"
        stroke="#38bdf8"
        strokeWidth="12"
        strokeDasharray="8,6"
        strokeDashoffset={-waterFlow}
      />
      <text x="185" y="100" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        PENSTOCK
      </text>

      {/* Powerhouse at Toe */}
      <g transform="translate(250, 85)">
        <rect x="0" y="0" width="130" height="80" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        <text x="65" y="18" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
          POWERHOUSE
        </text>

        {/* Francis Turbine Spiral Casing & Runner */}
        <circle cx="45" cy="52" r="18" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
        <g transform={`translate(45, 52) rotate(${tick * 10})`}>
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#f8fafc" strokeWidth="3" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#f8fafc" strokeWidth="3" />
        </g>

        {/* Vertical Shaft to Generator */}
        <rect x="42" y="25" width="6" height="15" fill="#cbd5e1" />

        {/* Synchronous Generator */}
        <rect x="30" y="22" width="30" height="10" rx="2" fill="#0f172a" stroke="#4ade80" />
        <text x="45" y="30" fill="#4ade80" fontSize="7" fontWeight="bold" textAnchor="middle">
          12 MW
        </text>

        {/* Transformer inside powerhouse */}
        <rect x="85" y="32" width="32" height="36" rx="4" fill="#334155" stroke="#64748b" />
        <text x="101" y="52" fill="#f8fafc" fontSize="8" textAnchor="middle">
          STEP-UP
        </text>
      </g>

      {/* Tailrace discharge back to river */}
      <path
        d="M 295 152 L 380 152 Q 440 152 480 162"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="6"
        strokeDasharray="6,4"
        strokeDashoffset={-waterFlow}
      />
      <text x="430" y="145" fill="#38bdf8" fontSize="8" fontFamily="monospace">
        Tailrace to River
      </text>

      {/* Transmission Line */}
      <path
        d="M 380 115 L 530 115"
        fill="none"
        stroke="#4ade80"
        strokeWidth="3"
        strokeDasharray="5,4"
        strokeDashoffset={-tick * 3}
      />
      <text x="470" y="105" fill="#4ade80" fontSize="9" fontWeight="bold" fontFamily="monospace">
        CLEAN BASELOAD
      </text>
    </svg>
  );
};

// 4. Conventional Power Plant Schematic
const PlantSchematic: React.FC<{ step: number; tick: number }> = ({ step, tick }) => {
  const steamOffset = (tick * 4) % 100;
  const flamePulse = Math.sin(tick * 0.3) * 3;

  return (
    <svg viewBox="0 0 600 200" className="w-full h-full max-h-52">
      {/* Boiler & Furnace */}
      <g transform="translate(30, 45)">
        <rect x="0" y="0" width="105" height="110" rx="8" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
        <text x="52" y="20" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">
          BOILER FURNACE
        </text>

        {/* Flames at bottom */}
        <g transform="translate(25, 75)">
          <path
            d={`M 0 25 Q 15 ${10 + flamePulse} 25 0 Q 35 ${10 - flamePulse} 50 25 Z`}
            fill="#f97316"
          />
          <path
            d={`M 10 25 Q 25 ${15 + flamePulse} 25 5 Q 25 ${15 - flamePulse} 40 25 Z`}
            fill="#fef08a"
          />
        </g>
        <text x="52" y="65" fill="#fca5a5" fontSize="8" textAnchor="middle" fontFamily="monospace">
          1,400°C Firebox
        </text>

        {/* Water-wall tubes */}
        <path d="M 15 30 L 15 65 M 30 30 L 30 65 M 75 30 L 75 65 M 90 30 L 90 65" stroke="#94a3b8" strokeWidth="1.5" />
      </g>

      {/* Smokestack venting Flue Gas */}
      <g transform="translate(145, 20)">
        <path d="M 0 135 L 5 15 L 25 15 L 30 135 Z" fill="#334155" stroke="#64748b" />
        <rect x="5" y="25" width="20" height="15" fill="#ef4444" />
        <rect x="5" y="55" width="20" height="15" fill="#ef4444" />
        <text x="15" y="10" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle">
          CO₂ / Flue Gas
        </text>
      </g>

      {/* Superheated High-Pressure Steam Pipe */}
      <path
        d="M 135 60 L 220 60"
        fill="none"
        stroke="#f87171"
        strokeWidth="6"
        strokeDasharray="6,4"
        strokeDashoffset={-steamOffset}
      />
      <text x="175" y="52" fill="#fca5a5" fontSize="8" textAnchor="middle" fontFamily="monospace">
        540°C Steam
      </text>

      {/* Steam Turbines (HP / IP / LP stages) */}
      <g transform="translate(225, 45)">
        <rect x="0" y="0" width="100" height="55" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
        <text x="50" y="16" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
          STEAM TURBINE
        </text>

        {/* Turbine rotor blades */}
        <path d="M 20 22 L 35 45 M 35 22 L 20 45" stroke="#38bdf8" strokeWidth="2" />
        <path d="M 50 20 L 65 47 M 65 20 L 50 47" stroke="#38bdf8" strokeWidth="2.5" />
        <path d="M 78 18 L 93 49 M 93 18 L 78 49" stroke="#38bdf8" strokeWidth="3" />

        <text x="50" y="50" fill="#38bdf8" fontSize="7" textAnchor="middle" fontFamily="monospace">
          3,600 RPM
        </text>
      </g>

      {/* Generator */}
      <g transform="translate(335, 52)">
        <rect x="0" y="0" width="45" height="42" rx="4" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="22" y="24" fill="#fbbf24" fontSize="8" fontWeight="bold" textAnchor="middle">
          GEN
        </text>
        <text x="22" y="34" fill="#94a3b8" fontSize="7" textAnchor="middle">
          120 MW
        </text>
      </g>

      {/* Cooling Tower Loop */}
      <g transform="translate(420, 30)">
        {/* Hyperbolic Profile */}
        <path
          d="M 10 120 Q 30 65 25 25 L 65 25 Q 60 65 80 120 Z"
          fill="#334155"
          stroke="#64748b"
          strokeWidth="2"
        />
        <text x="45" y="135" fill="#94a3b8" fontSize="8" textAnchor="middle">
          Cooling Tower
        </text>

        {/* Billowing Steam Puff */}
        <ellipse
          cx="45"
          cy={18 - (tick % 20) * 0.8}
          rx={18 + (tick % 10)}
          ry="8"
          fill="#f8fafc"
          fillOpacity="0.35"
        />
        <text x="45" y="8" fill="#e2e8f0" fontSize="8" textAnchor="middle">
          Vapor Plume
        </text>
      </g>

      {/* Grid line */}
      <path
        d="M 380 73 L 530 73"
        fill="none"
        stroke="#f87171"
        strokeWidth="3"
        strokeDasharray="5,4"
        strokeDashoffset={-tick * 3}
      />
      <text x="455" y="66" fill="#f87171" fontSize="8" fontWeight="bold" fontFamily="monospace">
        HIGH EMISSIONS BASELOAD
      </text>
    </svg>
  );
};

// 5. Eco-Town Microgrid Schematic
const TownSchematic: React.FC<{ step: number; tick: number }> = ({ step, tick }) => {
  const v2gFlow = (tick * 4) % 100;

  return (
    <svg viewBox="0 0 600 200" className="w-full h-full max-h-52">
      {/* Home with Rooftop PV */}
      <g transform="translate(40, 45)">
        <polygon points="50,15 10,45 90,45" fill="#b91c1c" />
        <rect x="20" y="45" width="60" height="55" fill="#1e293b" stroke="#475569" />
        {/* Rooftop Solar Panels */}
        <rect x="25" y="24" width="22" height="14" rx="2" fill="#1d4ed8" stroke="#60a5fa" />
        <rect x="52" y="24" width="22" height="14" rx="2" fill="#1d4ed8" stroke="#60a5fa" />

        <text x="50" y="70" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
          PROSUMER
        </text>
        <text x="50" y="82" fill="#4ade80" fontSize="7" textAnchor="middle">
          Rooftop Solar
        </text>
      </g>

      {/* Smart Meter / IoT Gateway */}
      <g transform="translate(170, 70)">
        <circle cx="25" cy="25" r="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
        <text x="25" y="22" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
          SMART
        </text>
        <text x="25" y="32" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
          METER
        </text>
      </g>

      {/* Bidirectional EV Charging Hub */}
      <g transform="translate(265, 45)">
        <rect x="0" y="0" width="130" height="100" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
        <text x="65" y="20" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">
          COMMUNITY EV HUB
        </text>

        {/* Stylized Electric Car */}
        <rect x="20" y="45" width="55" height="20" rx="4" fill="#2563eb" />
        <rect x="30" y="34" width="30" height="14" rx="3" fill="#60a5fa" />
        <circle cx="32" cy="67" r="6" fill="#0f172a" />
        <circle cx="62" cy="67" r="6" fill="#0f172a" />

        {/* Bidirectional V2G Inverter symbol */}
        <g transform="translate(85, 45)">
          <rect x="0" y="0" width="35" height="30" rx="4" fill="#0f172a" stroke="#fbbf24" />
          <text x="17" y="16" fill="#fbbf24" fontSize="8" fontWeight="bold" textAnchor="middle">
            V2G
          </text>
          <text x="17" y="25" fill="#e2e8f0" fontSize="6" textAnchor="middle">
            ⇄ 22kW
          </text>
        </g>
      </g>

      {/* Bi-directional Power Flow Line */}
      <path
        d="M 100 80 L 170 80 M 220 80 L 265 80"
        stroke="#4ade80"
        strokeWidth="3"
        strokeDasharray="5,4"
        strokeDashoffset={-v2gFlow}
      />

      {/* Microgrid Islanding Switch */}
      <g transform="translate(440, 60)">
        <rect x="0" y="0" width="70" height="60" rx="6" fill="#1e293b" stroke="#64748b" />
        <text x="35" y="24" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
          ISLANDING
        </text>
        <text x="35" y="36" fill="#4ade80" fontSize="7" textAnchor="middle">
          Static Switch
        </text>
        <circle cx="35" cy="46" r="4" fill="#4ade80" />
      </g>

      <path
        d="M 395 80 L 440 80 M 510 80 L 560 80"
        stroke="#4ade80"
        strokeWidth="3"
        strokeDasharray="5,4"
        strokeDashoffset={-v2gFlow}
      />
      <text x="535" y="70" fill="#4ade80" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        GRID FEED
      </text>
    </svg>
  );
};
