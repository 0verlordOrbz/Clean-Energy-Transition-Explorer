import React, { useState } from 'react';
import {
  Compass,
  Sun,
  Sunset,
  Moon,
  Eye,
  Plane,
  Crosshair,
  Info,
  Zap,
  MapPin,
  Flame,
  Home,
  Layers,
  Sparkles,
  BarChart3,
  Droplets,
  ArrowRight,
  Play,
  Pause,
  Clock,
  RotateCw,
  Glasses,
} from 'lucide-react';
import { CameraMode, SectorInfo, TimeOfDay, SolarTrackingStatus } from '../babylon/types';
import { LANDMARKS } from '../babylon/sceneManager';

interface ExplorerHUDProps {
  currentSector: SectorInfo;
  cameraMode: CameraMode;
  timeOfDay: TimeOfDay;
  timeHours: number;
  isTimeCycling: boolean;
  trackingStatus?: SolarTrackingStatus;
  fps: number;
  isPointerLocked: boolean;
  shadowsEnabled: boolean;
  investmentBudgetMillion: number;
  renewableSharePercent: number;
  isXRSupported: boolean;
  isInXR: boolean;
  onToggleVR: () => void;
  onOpenVRGuide: () => void;
  onOpenTitleScreen: () => void;
  onSelectLandmark: (id: string) => void;
  onSetCameraMode: (mode: CameraMode) => void;
  onSetTimeOfDay: (time: TimeOfDay) => void;
  onSetTimeHours: (hours: number) => void;
  onToggleTimeCycle: () => void;
  onToggleShadows: () => void;
  onRequestPointerLock: () => void;
  onOpenHelp: () => void;
  onOpenFacility: (facilityId: string) => void;
  onOpenMissionControl: () => void;
}

export const ExplorerHUD: React.FC<ExplorerHUDProps> = ({
  currentSector,
  cameraMode,
  timeOfDay,
  timeHours,
  isTimeCycling,
  trackingStatus,
  fps,
  isPointerLocked,
  shadowsEnabled,
  investmentBudgetMillion,
  renewableSharePercent,
  isXRSupported,
  isInXR,
  onToggleVR,
  onOpenVRGuide,
  onOpenTitleScreen,
  onSelectLandmark,
  onSetCameraMode,
  onSetTimeOfDay,
  onSetTimeHours,
  onToggleTimeCycle,
  onToggleShadows,
  onRequestPointerLock,
  onOpenHelp,
  onOpenFacility,
  onOpenMissionControl,
}) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const formatClockTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const paddedMinute = m < 10 ? `0${m}` : `${m}`;
    return `${displayHour}:${paddedMinute} ${period}`;
  };

  const getLandmarkIcon = (category: string) => {
    switch (category) {
      case 'Settlement':
        return <Home className="w-4 h-4 text-emerald-400" />;
      case 'Renewable':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'Hydro':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'Fossil':
        return <Flame className="w-4 h-4 text-rose-400" />;
      default:
        return <Compass className="w-4 h-4 text-sky-400" />;
    }
  };

  const isNearFacility = Boolean(
    currentSector.landmark &&
      currentSector.landmark.id !== 'overview' &&
      currentSector.distance <= 45
  );

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 select-none">
      {/* Top Bar Header & Controls */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
          {/* App Title & Identity */}
          <button
            onClick={onOpenTitleScreen}
            className="flex items-center gap-3 bg-slate-900/85 hover:bg-slate-850 backdrop-blur-md border border-slate-700/60 hover:border-emerald-500/50 rounded-2xl px-4 py-2.5 shadow-xl transition-all group text-left cursor-pointer"
            title="Open Title Screen & Features Overview [T]"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-wider text-slate-100 uppercase font-mono group-hover:text-emerald-300 transition-colors">
                  Clean Energy Transition Explorer
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800 hidden sm:inline">
                  Features [T]
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Babylon.js 3D • Interactive Facilities • WebXR
              </p>
            </div>
          </button>

          {/* Center: Mission Control Quick Button */}
          <button
            onClick={onOpenMissionControl}
            className="flex items-center gap-2.5 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 hover:from-slate-800 hover:to-slate-800 border border-emerald-500/50 hover:border-emerald-400 rounded-2xl px-4 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-md transition-all hover:scale-105 group"
            title="Open Central Mission Control Dashboard (Press M)"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-mono uppercase tracking-wider text-emerald-300">Mission Control</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  [M]
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <span className="text-emerald-400 font-semibold">{renewableSharePercent}% Clean</span>
                <span>•</span>
                <span className="text-amber-400 font-semibold">₱{investmentBudgetMillion.toFixed(1)}M Budget</span>
              </div>
            </div>
          </button>

          {/* Landmark Quick-Travel Tabs */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-2xl p-1.5 shadow-xl">
            {LANDMARKS.map((lm, idx) => {
              const isActive = currentSector.landmark
                ? currentSector.landmark.id === lm.id
                : activeTab === lm.id;
              return (
                <button
                  key={lm.id}
                  onClick={() => {
                    setActiveTab(lm.id);
                    onSelectLandmark(lm.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-700/90 text-white shadow-sm border border-slate-600'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={`${lm.name} (Key: ${idx + 1})`}
                >
                  {getLandmarkIcon(lm.category)}
                  <span>{lm.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono text-slate-500">[{idx + 1}]</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Toolbar: VR, Features, Camera, Shadows, Help */}
          <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-2xl p-1.5 shadow-xl">
            {/* Features Modal Button */}
            <button
              onClick={onOpenTitleScreen}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/60 hover:text-white transition-all shadow-sm hover:scale-105"
              title="View Title Screen & All Features [T]"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono hidden sm:inline">Features</span>
            </button>

            {/* WebXR VR Button */}
            <button
              onClick={onToggleVR}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm hover:scale-105 ${
                isInXR
                  ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 shadow-rose-950/50'
                  : isXRSupported
                  ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white border-cyan-400/40 shadow-cyan-950/50'
                  : 'bg-slate-800 hover:bg-slate-750 text-cyan-300 border-cyan-800/50 hover:text-white'
              }`}
              title={
                isInXR
                  ? 'Exit Immersive VR Session [V]'
                  : isXRSupported
                  ? 'Enter WebXR 6-DoF Virtual Reality [V]'
                  : 'WebXR VR Guide & Testing Info [V]'
              }
            >
              <Glasses className="w-3.5 h-3.5" />
              <span className="font-mono">
                {isInXR ? 'Exit VR' : isXRSupported ? 'Enter VR' : 'VR Info'}
              </span>
            </button>

            <div className="h-5 w-[1px] bg-slate-700/60 mx-0.5" />

            {/* Camera Mode Selector */}
            <div className="flex bg-slate-950/60 rounded-xl p-0.5 border border-slate-800">
              <button
                onClick={() => onSetCameraMode('first_person')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  cameraMode === 'first_person'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="First-Person Walk (WASD + Mouse Look)"
              >
                <Crosshair className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSetCameraMode('drone')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  cameraMode === 'drone'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Drone Flight Mode (WASD + Space/C)"
              >
                <Plane className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSetCameraMode('orbit')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  cameraMode === 'orbit'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Inspection Orbit Camera"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <div className="h-5 w-[1px] bg-slate-700/60 mx-0.5" />

            {/* Shadows Toggle */}
            <button
              onClick={onToggleShadows}
              className={`p-1.5 rounded-xl text-xs transition-colors ${
                shadowsEnabled ? 'text-emerald-400' : 'text-slate-500'
              }`}
              title={shadowsEnabled ? 'Shadows: ON' : 'Shadows: OFF'}
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Help / Instructions Modal Button */}
            <button
              onClick={onOpenHelp}
              className="p-1.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Controls & Scene Documentation (H)"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Time of Day Interactive Slider & Solar Tracker Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-2xl px-4 py-2 shadow-xl pointer-events-auto">
          {/* Left: Clock & Time Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-xl">
              {timeOfDay === 'day' && <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />}
              {timeOfDay === 'sunset' && <Sunset className="w-3.5 h-3.5 text-orange-400" />}
              {timeOfDay === 'night' && <Moon className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{formatClockTime(timeHours)}</span>
            </div>

            {/* Auto Cycle Play/Pause */}
            <button
              onClick={onToggleTimeCycle}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                isTimeCycling
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Automatically advance time to watch dynamic solar tracking"
            >
              {isTimeCycling ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="hidden sm:inline font-mono text-[11px]">
                {isTimeCycling ? 'Cycling' : 'Auto-Track'}
              </span>
            </button>

            {/* Presets */}
            <div className="hidden md:flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-xl border border-slate-800">
              <button
                onClick={() => onSetTimeHours(6.5)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-colors ${
                  Math.abs(timeHours - 6.5) < 0.8 ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dawn
              </button>
              <button
                onClick={() => onSetTimeHours(12.0)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-colors ${
                  Math.abs(timeHours - 12.0) < 1.0 ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Noon
              </button>
              <button
                onClick={() => onSetTimeHours(18.0)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-colors ${
                  Math.abs(timeHours - 18.0) < 0.8 ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sunset
              </button>
              <button
                onClick={() => onSetTimeHours(21.5)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-colors ${
                  timeHours > 20 || timeHours < 5.5 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Night
              </button>
            </div>
          </div>

          {/* Center: Interactive Continuous Time Slider */}
          <div className="flex-1 max-w-md flex items-center gap-2.5 mx-2">
            <span className="text-[10px] font-mono text-slate-500">06:00</span>
            <input
              type="range"
              min="5.5"
              max="22.0"
              step="0.05"
              value={timeHours}
              onChange={(e) => onSetTimeHours(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
              title="Drag to change time of day and orient solar panels"
            />
            <span className="text-[10px] font-mono text-slate-500">22:00</span>
          </div>

          {/* Right: Live Solar Tracker Status Readout */}
          <div className="flex items-center gap-2">
            {trackingStatus && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-mono border backdrop-blur-sm transition-all ${
                  trackingStatus.isStowed
                    ? 'bg-indigo-950/50 text-indigo-300 border-indigo-700/40'
                    : 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40'
                }`}
                title="Single-axis solar tracking (HSAT) rotating along North-South torque tube axis relative to real-time sun position"
              >
                <RotateCw className="w-3 h-3 animate-spin-slow text-amber-400" />
                <span className="font-semibold">
                  {trackingStatus.isStowed ? (
                    'Single-Axis: Safe Stow (0° Flat Level)'
                  ) : (
                    <>
                      <span className="text-emerald-300">Single-Axis Track:</span>
                      <span className="text-cyan-300 ml-1">
                        {trackingStatus.azimuthDeg > 0
                          ? `+${trackingStatus.azimuthDeg}° W`
                          : trackingStatus.azimuthDeg < 0
                          ? `${trackingStatus.azimuthDeg}° E`
                          : '0° Level'}
                      </span>
                      <span className="text-slate-400 mx-1">•</span>
                      <span className="text-amber-300">{trackingStatus.efficiencyPercent}% Insolation</span>
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Screen: Interactive Contextual Inspection Prompt */}
      <div className="self-center flex flex-col items-center gap-2 pointer-events-none">
        {cameraMode === 'first_person' && (
          <div className="w-3 h-3 rounded-full border border-white/60 bg-white/20 flex items-center justify-center pointer-events-none">
            <div className="w-0.5 h-0.5 rounded-full bg-white" />
          </div>
        )}

        {/* Proximity Interaction Prompt - only visible when near a facility */}
        {isNearFacility && currentSector.landmark && (
          <div className="pointer-events-auto mt-2 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => onOpenFacility(currentSector.landmark!.id)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold tracking-wide shadow-2xl backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2.5 border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Inspect Facility & Generation Flow</span>
              <span className="px-2 py-0.5 rounded-lg bg-black/30 font-mono text-[10px] text-emerald-200 border border-white/20">
                Press [E]
              </span>
            </button>
          </div>
        )}

        {!isPointerLocked && cameraMode === 'first_person' && (
          <button
            onClick={onRequestPointerLock}
            className="pointer-events-auto mt-2 px-4 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/50 text-emerald-300 text-xs font-medium tracking-wide shadow-2xl backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
          >
            <Crosshair className="w-3.5 h-3.5" />
            Click 3D View to Lock Mouse Look <span className="text-[10px] text-slate-400 font-mono">(ESC to release)</span>
          </button>
        )}
      </div>

      {/* Bottom Area: Sector Information Card & Telemetry HUD */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-4 pointer-events-auto">
        {/* Sector Information Card - ONLY visible when near a facility */}
        {isNearFacility && currentSector.landmark ? (
          <div className="max-w-md w-full bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-3xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: currentSector.landmark.color }}
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {currentSector.landmark.category}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-mono text-emerald-400">
                  {currentSector.distance}m away
                </span>
              </div>
              <span className="text-[11px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {currentSector.landmark.specs.generationMW}
              </span>
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {currentSector.landmark.name}
              </h2>

              <button
                onClick={() => onOpenFacility(currentSector.landmark!.id)}
                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:scale-105"
              >
                <span>Inspect [E]</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {currentSector.landmark.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block">Type</span>
                <span className="text-slate-200 font-medium">
                  {currentSector.landmark.specs.type}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Key Feature</span>
                <span className="text-slate-200 font-medium">
                  {currentSector.landmark.specs.keyFeature}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="pointer-events-none" />
        )}

        {/* Telemetry & Keybindings pill */}
        <div className="flex flex-col items-end gap-2">
          {/* Keyboard helper */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl px-3.5 py-1.5 text-[11px] text-slate-300 font-mono shadow-md">
            <span className="text-emerald-400 font-bold">[T]</span> Features
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-bold">[V]</span> VR
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">[E]</span> Inspect
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">[M]</span> Mission Control
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-bold">[W,A,S,D]</span> Walk
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-bold">[1-6]</span> Teleport
          </div>

          {/* Engine FPS & Mode */}
          <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-2xl px-3.5 py-1.5 text-xs font-mono shadow-lg">
            <span className="text-slate-400">
              FPS: <span className="text-emerald-400 font-bold">{fps}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 capitalize">
              Mode: <span className="text-cyan-400">{cameraMode.replace('_', ' ')}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              Shadows: <span className={shadowsEnabled ? 'text-emerald-400' : 'text-slate-500'}>{shadowsEnabled ? 'ON' : 'OFF'}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
