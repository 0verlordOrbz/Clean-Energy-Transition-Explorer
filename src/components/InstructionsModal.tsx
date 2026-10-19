import React from 'react';
import { X, Navigation, Sun, Wind, Droplets, Flame, Home, Zap, Shield, Eye, Layers, Sparkles, BarChart3, HelpCircle } from 'lucide-react';
import { LANDMARKS } from '../babylon/sceneManager';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Clean Energy Transition Explorer
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 3D Facilities • Animated Energy Schematics • Mission Control
            </p>
          </div>
        </div>

        {/* Instructions Content */}
        <div className="space-y-6 text-sm">
          {/* 1. Quick Navigation & Desktop Controls */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2 font-mono">
              <Navigation className="w-4 h-4" /> Desktop Controls & Hotkeys
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-300 font-bold">[E]</span>
                <span className="text-slate-300">Inspect nearby Facility (Flow, Tradeoffs, Quiz)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-300 font-bold">[M]</span>
                <span className="text-slate-300">Open Central Mission Control Dashboard</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-300 font-bold">W, A, S, D</span>
                <span className="text-slate-300">Walk forward, left, backward, right</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-300 font-bold">Mouse Look</span>
                <span className="text-slate-300">Click canvas to lock pointer (ESC to release)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-300 font-bold">Shift</span>
                <span className="text-slate-300">Sprint boost (2.5x speed)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-300 font-bold">Space / C</span>
                <span className="text-slate-300">Jump (Walk mode) / Ascend & Descend (Drone mode)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-300 font-bold">Keys 1 - 6</span>
                <span className="text-slate-300">Instantly teleport to energy landmarks</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-300 font-bold">Camera Switch</span>
                <span className="text-slate-300">Walk mode, Drone fly mode, or 360° Orbit inspection</span>
              </div>
            </div>
          </div>

          {/* 2. Interactive Facilities & Quizzes */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4" /> Interactive Facilities & Grant Rewards
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Approach any facility in the 3D landscape or press <strong className="text-emerald-400">[E]</strong> to trigger its learning module:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-semibold text-white block">1. Animated Generation Flow</span>
                <span className="text-slate-400 text-[11px]">Dynamic schematics showing physics conversions from photons, wind airfoils, water head, and Rankine steam cycles.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-semibold text-white block">2. Pros & Limitations</span>
                <span className="text-slate-400 text-[11px]">Balanced engineering assessment of dispatchability, LCOE, capacity factor, land use, and emissions.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-semibold text-white block">3. Facility Knowledge Quiz</span>
                <span className="text-slate-400 text-[11px]">3-question challenge with scientific explanations. Passing awards +₱3M-₱5M transition grants!</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-semibold text-white block">4. Capital Transition Projects</span>
                <span className="text-slate-400 text-[11px]">Reinvest earned grants in Mission Control to decommission fossil units and expand renewables.</span>
              </div>
            </div>
          </div>

          {/* 3. Central Mission Control Overview */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
              <BarChart3 className="w-4 h-4" /> Mission Control Dashboard
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Press <strong className="text-emerald-400">[M]</strong> or click the top toolbar button anytime to view the live regional grid:
            </p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li><strong className="text-slate-200">Energy Mix:</strong> Real-time proportion of Clean vs Fossil generation compared to 150 MW demand.</li>
              <li><strong className="text-slate-200">Emissions:</strong> Hourly CO₂ metric tons and carbon intensity (gCO₂/kWh).</li>
              <li><strong className="text-slate-200">Reliability Score:</strong> Grid stability index tracking spinning reserves and firm capacity.</li>
              <li><strong className="text-slate-200">Investment Budget:</strong> Allocate funds to battery storage, wind repowering, and fossil phaseout.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wide transition-colors"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
