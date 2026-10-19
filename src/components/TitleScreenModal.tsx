import React from 'react';
import {
  Zap,
  Glasses,
  Compass,
  Sun,
  Wind,
  Droplets,
  Flame,
  Home,
  BarChart3,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Play,
  RotateCw,
  X,
} from 'lucide-react';

interface TitleScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterVR: () => void;
  onOpenVRGuide: () => void;
  isXRSupported: boolean;
  onSelectLandmark?: (id: string) => void;
}

export const TitleScreenModal: React.FC<TitleScreenModalProps> = ({
  isOpen,
  onClose,
  onEnterVR,
  onOpenVRGuide,
  isXRSupported,
  onSelectLandmark,
}) => {
  if (!isOpen) return null;

  const features = [
    {
      icon: <Glasses className="w-5 h-5 text-cyan-400" />,
      title: 'WebXR Immersive VR',
      description:
        '6-DoF room-scale headset tracking, VR controller teleportation, laser pointer selection, and 3D in-world holographic panels on Meta Quest, Vision Pro, and SteamVR.',
      tag: 'New Feature',
      tagColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    },
    {
      icon: <RotateCw className="w-5 h-5 text-amber-400" />,
      title: 'Single-Axis Solar Tracking (HSAT)',
      description:
        '40 utility-scale tracker tables with North-South torque tubes physically rotating East-to-West to follow real-time sunlight with automated 0° night stow.',
      tag: 'Single-Axis',
      tagColor: 'bg-amber-950 text-amber-300 border-amber-800',
    },
    {
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      title: '5 Regional Energy Sectors',
      description:
        'Cascade Gorge Dam, Whispering Ridge Wind, Suncrest Solar Array, Greenwood Eco-Town microgrid, and Ironwood Thermal Power Station linked by transmission corridors.',
      tag: 'Simulation',
      tagColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    },
    {
      icon: <Clock className="w-5 h-5 text-orange-400" />,
      title: '24-Hour Time Slider & Auto-Cycle',
      description:
        'Real-time atmospheric lighting, golden dawn, high noon, crimson sunset, and starry night with active solar vector calculation and glowing night windows.',
      tag: 'Atmosphere',
      tagColor: 'bg-orange-950 text-orange-300 border-orange-800',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-indigo-400" />,
      title: 'Mission Control Dashboard',
      description:
        'Fund and deploy clean energy expansion projects, optimize regional grid dispatch, maintain frequency stability, and phase out fossil generation.',
      tag: 'Strategy',
      tagColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    },
    {
      icon: <Layers className="w-5 h-5 text-teal-400" />,
      title: 'Real-Time Physics & Mesh Colliders',
      description:
        'Walkable terrain with bounding colliders on hydro dam, transmission pylons, power plant cooling towers, houses, and EV charging stations preventing clipping.',
      tag: 'Physics',
      tagColor: 'bg-teal-950 text-teal-300 border-teal-800',
    },
    {
      icon: <Compass className="w-5 h-5 text-sky-400" />,
      title: 'Tri-Mode Exploration Cameras',
      description:
        'Seamlessly toggle between First-Person walking with gravity jump, 6-axis Drone flight with vertical climb, and 360° inspection Orbit view.',
      tag: 'Navigation',
      tagColor: 'bg-sky-950 text-sky-300 border-sky-800',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-rose-400" />,
      title: 'Interactive Facility Quizzes',
      description:
        'Deep educational breakdowns of hydropower penstocks, solar P-N junctions, wind aerodynamics, and smart microgrids with research grant rewards.',
      tag: 'Educational',
      tagColor: 'bg-rose-950 text-rose-300 border-rose-800',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Hero Banner Header */}
        <div className="relative px-6 py-7 sm:px-8 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/60 border-b border-slate-800">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close and Enter Experience"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-900/30">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              Babylon.js 3D & WebXR Simulation
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Clean Energy Transition Explorer
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Experience the future of decarbonized power systems across a realistic, interconnected 3D landscape. Explore in full first-person walking physics, free drone flight, or immersive 6-DoF WebXR Virtual Reality.
          </p>
        </div>

        {/* Feature Grid Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Core Architecture & Highlights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/80 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-105 transition-transform">
                        {feat.icon}
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${feat.tagColor}`}>
                        {feat.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white mb-1.5">{feat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Landmarks Jump */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/70">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              Exploration Sectors
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
              {[
                { name: 'Eagle Peak', id: 'overview', color: 'text-sky-400' },
                { name: 'Eco-Town', id: 'town', color: 'text-emerald-400' },
                { name: 'Solar Array', id: 'solar', color: 'text-amber-400' },
                { name: 'Wind Ridge', id: 'wind', color: 'text-purple-400' },
                { name: 'Cascade Dam', id: 'hydro', color: 'text-cyan-400' },
                { name: 'Thermal Plant', id: 'plant', color: 'text-rose-400' },
              ].map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    onClose();
                    onSelectLandmark?.(loc.id);
                  }}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all hover:scale-105"
                >
                  <span className={`block font-bold ${loc.color}`}>{loc.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Teleport</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Launch Buttons */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onOpenVRGuide}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <Glasses className="w-4 h-4" />
            <span>VR Headset Setup & Compatibility Guide</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onEnterVR();
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                isXRSupported
                  ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white border-cyan-400/30 shadow-lg shadow-cyan-950/50 hover:scale-105'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={
                isXRSupported
                  ? 'Launch WebXR Immersive Session'
                  : 'Requires a compatible WebXR browser/headset or WebXR Emulator'
              }
            >
              <Glasses className="w-4 h-4" />
              <span>{isXRSupported ? 'Enter WebXR VR' : 'Test VR Mode'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-950/40 hover:scale-105 flex items-center gap-2"
            >
              <span>Explore Landscape (3D Mode)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
