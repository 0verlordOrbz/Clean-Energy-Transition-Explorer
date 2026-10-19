import React from 'react';
import {
  X,
  Zap,
  Activity,
  DollarSign,
  Flame,
  Shield,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Lock,
  Sun,
  Wind,
  Droplets,
  Home,
  BatteryCharging,
  Gauge,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import {
  GridState,
  MissionMetrics,
  TransitionProject,
  calculateMissionMetrics,
} from '../data/missionControlData';

interface MissionControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  gridState: GridState;
  investmentBudgetMillion: number;
  projects: TransitionProject[];
  stabilityBonusTotal: number;
  onImplementProject: (projectId: string) => void;
}

export const MissionControlModal: React.FC<MissionControlModalProps> = ({
  isOpen,
  onClose,
  gridState,
  investmentBudgetMillion,
  projects,
  stabilityBonusTotal,
  onImplementProject,
}) => {
  if (!isOpen) return null;

  const metrics: MissionMetrics = calculateMissionMetrics(gridState, stabilityBonusTotal);

  const getStabilityColor = (status: MissionMetrics['stabilityStatus']) => {
    switch (status) {
      case 'Optimal':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Stable':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Gauge className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-mono uppercase">
                  Central Mission Control Dashboard
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Regional Grid Model
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live energy mix balance, greenhouse emissions tracking, and transition capital allocation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 4 Core Pillars KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Energy Mix */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Zap className="w-4 h-4 text-amber-400" /> Renewable Share
                </span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {metrics.renewableSharePercent}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className="bg-emerald-500 transition-all duration-500"
                  style={{ width: `${metrics.renewableSharePercent}%` }}
                />
                <div
                  className="bg-rose-500 transition-all duration-500"
                  style={{ width: `${metrics.fossilSharePercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span className="text-emerald-400">{metrics.renewableSharePercent}% Clean</span>
                <span className="text-rose-400">{metrics.fossilSharePercent}% Fossil</span>
              </div>
            </div>

            {/* 2. Emissions */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Flame className="w-4 h-4 text-rose-400" /> CO₂ Emissions
                </span>
                <span className="font-mono text-rose-300 font-bold text-sm">
                  {metrics.co2EmissionsTonsPerHour} t/hr
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xl font-bold font-mono text-white">
                  {metrics.carbonIntensityGramsPerKWh}
                  <span className="text-xs text-slate-400 font-normal ml-1">g/kWh</span>
                </div>
                {metrics.emissionsReductionPercent > 0 && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" /> -{metrics.emissionsReductionPercent}%
                  </span>
                )}
              </div>

              <span className="text-[11px] text-slate-400 block">
                Target: &lt;100 gCO₂/kWh international standard
              </span>
            </div>

            {/* 3. Reliability & Grid Stability */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Shield className="w-4 h-4 text-cyan-400" /> Grid Reliability
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getStabilityColor(metrics.stabilityStatus)}`}>
                  {metrics.stabilityStatus}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-white">
                  {metrics.gridReliabilityScore}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 100 Stability Index</span>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Reserve Margin: <span className="text-slate-200 font-bold">+{metrics.reserveMarginPercent}%</span>
              </div>
            </div>

            {/* 4. Investment Budget */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center font-mono">₱</span> Transition Capital (PHP)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Available</span>
              </div>

              <div className="text-2xl font-bold font-mono text-emerald-400">
                ₱{investmentBudgetMillion.toFixed(1)}M
              </div>

              <span className="text-[11px] text-slate-400 block">
                Earn research grants by completing facility quizzes!
              </span>
            </div>
          </div>

          {/* Real-time Generation Sources Breakdown */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Current Generation Mix vs Regional Demand
                </h3>
                <p className="text-xs text-slate-400">
                  Regional Base Demand: <span className="text-white font-mono font-bold">{gridState.regionalDemandMW} MW</span> •
                  Total Supply: <span className="text-emerald-400 font-mono font-bold">{metrics.totalGenerationMW} MW</span>
                </p>
              </div>

              {metrics.totalGenerationMW >= gridState.regionalDemandMW ? (
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Demand Fully Met
                </span>
              ) : (
                <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/30 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Generation Deficit
                </span>
              )}
            </div>

            {/* Horizontal Segment Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Solar */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                  <Sun className="w-3.5 h-3.5" /> Solar
                </div>
                <div className="text-lg font-bold font-mono text-white">{gridState.solarMW.toFixed(1)} MW</div>
                <span className="text-[10px] text-slate-500 block">Photovoltaic Array</span>
              </div>

              {/* Wind */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium">
                  <Wind className="w-3.5 h-3.5" /> Wind
                </div>
                <div className="text-lg font-bold font-mono text-white">{gridState.windMW.toFixed(1)} MW</div>
                <span className="text-[10px] text-slate-500 block">Ridge Turbines</span>
              </div>

              {/* Hydro */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                  <Droplets className="w-3.5 h-3.5" /> Hydro
                </div>
                <div className="text-lg font-bold font-mono text-white">{gridState.hydroMW.toFixed(1)} MW</div>
                <span className="text-[10px] text-slate-500 block">Storage Dam</span>
              </div>

              {/* Town */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <Home className="w-3.5 h-3.5" /> Microgrid
                </div>
                <div className="text-lg font-bold font-mono text-white">{gridState.townMW.toFixed(1)} MW</div>
                <span className="text-[10px] text-slate-500 block">Rooftop & V2G</span>
              </div>

              {/* Battery Storage */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                  <BatteryCharging className="w-3.5 h-3.5" /> Battery
                </div>
                <div className="text-lg font-bold font-mono text-white">{gridState.batteryMW.toFixed(1)} MW</div>
                <span className="text-[10px] text-slate-500 block">BESS Storage</span>
              </div>

              {/* Conventional Thermal */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                  <Flame className="w-3.5 h-3.5" /> Thermal
                </div>
                <div className="text-lg font-bold font-mono text-white">{gridState.thermalMW.toFixed(1)} MW</div>
                <span className="text-[10px] text-slate-500 block">Fossil Steam</span>
              </div>
            </div>
          </div>

          {/* Strategic Transition Projects / Investment Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Capital Transition Investments
              </h3>
              <span className="text-xs text-slate-400">
                Click project to allocate capital and transform regional grid infrastructure
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.map((project) => {
                const canAfford = investmentBudgetMillion >= project.costMillion;
                const prerequisitesMet =
                  !project.requiredProjectIds ||
                  project.requiredProjectIds.every((reqId) => {
                    const req = projects.find((p) => p.id === reqId);
                    return req?.implemented;
                  });

                return (
                  <div
                    key={project.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      project.implemented
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                        : prerequisitesMet
                        ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/30 border-slate-900 opacity-50'
                    }`}
                  >
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {project.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          ₱{project.costMillion.toFixed(1)}M
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{project.name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{project.description}</p>

                      <div className="text-[11px] font-mono text-cyan-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
                        {project.effectDescription}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-800/60">
                      {project.implemented ? (
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 font-mono">
                          <CheckCircle2 className="w-4 h-4" /> Implemented & Active
                        </span>
                      ) : !prerequisitesMet ? (
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 font-mono">
                          <Lock className="w-3.5 h-3.5" /> Requires Previous Phase
                        </span>
                      ) : (
                        <button
                          onClick={() => onImplementProject(project.id)}
                          disabled={!canAfford}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                        >
                          <span className="font-mono font-bold text-xs">₱</span>
                          <span>Invest ₱{project.costMillion.toFixed(1)}M</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
