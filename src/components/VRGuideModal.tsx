import React from 'react';
import {
  Glasses,
  X,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Laptop,
  Compass,
  Radio,
  Zap,
} from 'lucide-react';

interface VRGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterVR?: () => void;
  isXRSupported: boolean;
  xrErrorMessage?: string;
}

export const VRGuideModal: React.FC<VRGuideModalProps> = ({
  isOpen,
  onClose,
  onEnterVR,
  isXRSupported,
  xrErrorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Glasses className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                WebXR Immersive VR Guide
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Babylon.js WebXR
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Setup, testing instructions, and VR controller bindings
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
        <div className="overflow-y-auto p-6 space-y-5 text-sm">
          {/* WebXR Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              isXRSupported
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
            }`}
          >
            {isXRSupported ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="font-bold text-sm">
                {isXRSupported
                  ? 'WebXR Immersive VR is Available!'
                  : 'WebXR Headset / Session Notice'}
              </h3>
              <p className="text-xs mt-1 leading-relaxed text-slate-300">
                {isXRSupported
                  ? 'Your browser detects a compatible WebXR runtime. Click "Enter VR" to don your headset and experience the clean energy transition in full 6-DoF 3D scale!'
                  : xrErrorMessage ||
                    'WebXR requires a connected VR headset (or WebXR emulator extension) running on a secure HTTPS origin or localhost.'}
              </p>
            </div>
          </div>

          {/* Compatible Headsets & Testing Environments */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
              <Headphones className="w-4 h-4 text-cyan-400" />
              Supported Headsets & Testing Methods
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-1.5 font-semibold text-white text-xs">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Meta Quest 2 / 3 / Pro
                </div>
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  Open this application’s HTTPS URL in the built-in <strong>Meta Quest Browser</strong>. Click "Enter VR" to enter room-scale immersive 6-DoF.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-1.5 font-semibold text-white text-xs">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  Apple Vision Pro
                </div>
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  Supported via visionOS Safari. Enable <em>WebXR Related Features</em> in Safari Advanced Settings to launch Spatial WebXR sessions.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-1.5 font-semibold text-white text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  PC VR (Oculus / SteamVR / Vive / Index)
                </div>
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  Connect your headset via Link, AirLink, or SteamVR. Launch Google Chrome or MS Edge, open the URL, and click "Enter VR".
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-1.5 font-semibold text-white text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Desktop Browser Testing (No Headset)
                </div>
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  Install the free <strong>WebXR API Emulator</strong> extension for Chrome/Firefox/Edge. It simulates VR headsets and motion controllers in DevTools!
                </p>
              </div>
            </div>
          </div>

          {/* Security & Transport Requirements */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              HTTPS & Security Requirements
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The W3C WebXR Device API requires a <strong>Secure Context</strong>. It is strictly active on:
            </p>
            <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc list-inside">
              <li><strong>HTTPS domains</strong> (e.g. AI Studio development and production Cloud Run URLs).</li>
              <li><strong>http://localhost:3000</strong> or <strong>http://127.0.0.1:3000</strong> during local development.</li>
              <li>Plain HTTP over a local network IP will be blocked by modern browsers for WebXR privacy.</li>
            </ul>
          </div>

          {/* VR Controller Controls */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
              <Radio className="w-4 h-4 text-cyan-400" />
              In-VR Controller Inputs & Mechanics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-300">Thumbstick Push</span>
                <span className="font-mono text-cyan-400 font-semibold">Teleport Arc to Ground</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-300">Thumbstick Left / Right</span>
                <span className="font-mono text-cyan-400 font-semibold">Snap Turn 45°</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-300">Controller Laser Trigger</span>
                <span className="font-mono text-emerald-400 font-semibold">Select Beacon / Click 3D Panel</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-300">Grip / Squeeze</span>
                <span className="font-mono text-amber-400 font-semibold">Summon Holographic 3D Panel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 font-mono">
            Desktop keyboard and mouse controls always remain available as fallback.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            {onEnterVR && (
              <button
                onClick={() => {
                  onClose();
                  onEnterVR();
                }}
                disabled={!isXRSupported}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isXRSupported
                    ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-lg shadow-cyan-950/50 hover:scale-105'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Glasses className="w-4 h-4" />
                <span>Launch Immersive VR</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
