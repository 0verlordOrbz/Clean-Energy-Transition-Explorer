import React, { useEffect, useRef, useState } from 'react';
import { BabylonSceneManager, LANDMARKS } from './babylon/sceneManager';
import { CameraMode, SectorInfo, TimeOfDay, SolarTrackingStatus } from './babylon/types';
import { ExplorerHUD } from './components/ExplorerHUD';
import { InstructionsModal } from './components/InstructionsModal';
import { FacilityModal } from './components/FacilityModal';
import { MissionControlModal } from './components/MissionControlModal';
import { TitleScreenModal } from './components/TitleScreenModal';
import { VRGuideModal } from './components/VRGuideModal';
import {
  GridState,
  INITIAL_TRANSITION_PROJECTS,
  TransitionProject,
  calculateMissionMetrics,
} from './data/missionControlData';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const managerRef = useRef<BabylonSceneManager | null>(null);

  const [currentSector, setCurrentSector] = useState<SectorInfo>({
    landmark: null,
    distance: 999,
  });
  const [cameraMode, setCameraMode] = useState<CameraMode>('first_person');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [timeHours, setTimeHours] = useState<number>(12.0);
  const [isAutoTimeCycling, setIsAutoTimeCycling] = useState<boolean>(false);
  const [solarTrackingStatus, setSolarTrackingStatus] = useState<SolarTrackingStatus>({
    azimuthDeg: 0,
    tiltDeg: 30,
    isStowed: false,
    efficiencyPercent: 95,
  });

  const [fps, setFps] = useState<number>(60);
  const [isPointerLocked, setIsPointerLocked] = useState<boolean>(false);
  const [shadowsEnabled, setShadowsEnabled] = useState<boolean>(true);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Title Screen with Features & WebXR State
  const [isTitleScreenOpen, setIsTitleScreenOpen] = useState<boolean>(true);
  const [isVRGuideOpen, setIsVRGuideOpen] = useState<boolean>(false);
  const [isXRSupported, setIsXRSupported] = useState<boolean>(false);
  const [isInXR, setIsInXR] = useState<boolean>(false);
  const [xrErrorMessage, setXrErrorMessage] = useState<string | undefined>(undefined);

  // Facility Interaction & Mission Control State
  const [activeFacilityId, setActiveFacilityId] = useState<string | null>(null);
  const [isMissionControlOpen, setIsMissionControlOpen] = useState<boolean>(false);

  const [gridState, setGridState] = useState<GridState>({
    solarMW: 15.0,
    windMW: 15.0,
    hydroMW: 48.0,
    thermalMW: 120.0,
    townMW: 0.8,
    batteryMW: 0.0,
    regionalDemandMW: 150.0,
  });

  const [investmentBudgetMillion, setInvestmentBudgetMillion] = useState<number>(45.0);
  const [projects, setProjects] = useState<TransitionProject[]>(INITIAL_TRANSITION_PROJECTS);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  const [stabilityBonusTotal, setStabilityBonusTotal] = useState<number>(0);

  // Compute live mission metrics
  const metrics = calculateMissionMetrics(gridState, stabilityBonusTotal);

  // Ref to hold currentSector for event handlers without triggering re-initialization
  const currentSectorRef = useRef<SectorInfo>(currentSector);
  useEffect(() => {
    currentSectorRef.current = currentSector;
  }, [currentSector]);

  // Unlock mouse look whenever a facility is inspected or any modal is opened
  useEffect(() => {
    if (activeFacilityId || isMissionControlOpen || isHelpOpen || isTitleScreenOpen || isVRGuideOpen) {
      if (document.pointerLockElement) {
        document.exitPointerLock?.();
      }
      if (managerRef.current) {
        managerRef.current.exitPointerLock();
      }
    }
  }, [activeFacilityId, isMissionControlOpen, isHelpOpen, isTitleScreenOpen, isVRGuideOpen]);

  // Automated time-of-day cycling loop
  useEffect(() => {
    if (!isAutoTimeCycling) return;
    const interval = setInterval(() => {
      setTimeHours((prev) => {
        let next = prev + 0.12;
        if (next > 22.0) next = 5.5;
        const rounded = parseFloat(next.toFixed(2));
        if (managerRef.current) {
          managerRef.current.setTimeHours(rounded);
          setTimeOfDay(managerRef.current.currentTimeOfDay);
        }
        return rounded;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isAutoTimeCycling]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const manager = new BabylonSceneManager(canvasRef.current);
    managerRef.current = manager;

    // Check WebXR device compatibility
    manager.checkXRSupport().then((status) => {
      setIsXRSupported(status.supported);
      if (!status.supported && status.reason) {
        setXrErrorMessage(status.reason);
      }
    });

    manager.onXRStateChange = (inXR) => {
      setIsInXR(inXR);
      if (inXR) {
        setIsTitleScreenOpen(false);
        setIsVRGuideOpen(false);
        setActiveFacilityId(null);
        setIsMissionControlOpen(false);
        setIsHelpOpen(false);
      }
    };

    manager.onXRError = (errMsg) => {
      setXrErrorMessage(errMsg);
      setIsVRGuideOpen(true);
    };

    manager.onSectorChange = (info) => {
      setCurrentSector(info);
      // Auto-dismiss facility information modal when leaving proximity
      setActiveFacilityId((current) => {
        if (!current) return null;
        if (!info.landmark || info.landmark.id !== current) {
          return null;
        }
        return current;
      });
    };

    manager.onFpsUpdate = (currentFps) => {
      setFps(currentFps);
    };

    manager.onPointerLockChange = (locked) => {
      setIsPointerLocked(locked);
    };

    manager.onTrackingUpdate = (status) => {
      setSolarTrackingStatus(status);
    };

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Quick landmark teleport (1-6)
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= LANDMARKS.length) {
        const landmark = LANDMARKS[keyNum - 1];
        if (landmark) {
          manager.teleportToLandmark(landmark.id);
        }
      }

      // [T] or [t]: Toggle Title Screen & Features Showcase
      if (e.key === 't' || e.key === 'T') {
        if (document.pointerLockElement) document.exitPointerLock?.();
        manager.exitPointerLock();
        setIsTitleScreenOpen((prev) => !prev);
      }

      // [V] or [v]: Enter WebXR VR or open VR Guide
      if (e.key === 'v' || e.key === 'V') {
        if (document.pointerLockElement) document.exitPointerLock?.();
        manager.exitPointerLock();
        if (manager.isXRActive) {
          manager.exitVR();
        } else {
          manager.enterVR().catch(() => {
            setIsVRGuideOpen(true);
          });
        }
      }

      // [E] or [e]: Inspect nearby facility (unlocks mouse look for interaction)
      if (e.key === 'e' || e.key === 'E') {
        const sector = currentSectorRef.current;
        if (sector.landmark && sector.landmark.id !== 'overview') {
          if (document.pointerLockElement) {
            document.exitPointerLock?.();
          }
          manager.exitPointerLock();
          setActiveFacilityId((prev) => (prev ? null : sector.landmark!.id));
        }
      }

      // [M] or [m]: Toggle Mission Control Dashboard
      if (e.key === 'm' || e.key === 'M') {
        if (document.pointerLockElement) {
          document.exitPointerLock?.();
        }
        manager.exitPointerLock();
        setIsMissionControlOpen((prev) => !prev);
      }

      // [H] or [?]: Toggle Help
      if (e.key === 'h' || e.key === 'H' || e.key === '?') {
        if (document.pointerLockElement) {
          document.exitPointerLock?.();
        }
        manager.exitPointerLock();
        setIsHelpOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      manager.dispose();
      managerRef.current = null;
    };
  }, []);

  const handleSelectLandmark = (id: string) => {
    if (managerRef.current) {
      managerRef.current.teleportToLandmark(id);
    }
  };

  const handleSetCameraMode = (mode: CameraMode) => {
    setCameraMode(mode);
    if (managerRef.current) {
      managerRef.current.setCameraMode(mode);
    }
  };

  const handleSetTimeHours = (hours: number) => {
    setTimeHours(hours);
    if (managerRef.current) {
      managerRef.current.setTimeHours(hours);
      setTimeOfDay(managerRef.current.currentTimeOfDay);
    }
  };

  const handleSetTimeOfDay = (time: TimeOfDay) => {
    setTimeOfDay(time);
    if (managerRef.current) {
      managerRef.current.setTimeOfDay(time);
      setTimeHours(managerRef.current.timeHours);
    }
  };

  const handleToggleShadows = () => {
    if (managerRef.current) {
      const active = managerRef.current.toggleShadows();
      setShadowsEnabled(active);
    }
  };

  const handleRequestPointerLock = () => {
    if (managerRef.current) {
      managerRef.current.requestPointerLock();
    }
  };

  // Open facility inspector and ensure mouse is unlocked
  const handleOpenFacility = (facId: string) => {
    if (document.pointerLockElement) {
      document.exitPointerLock?.();
    }
    if (managerRef.current) {
      managerRef.current.exitPointerLock();
    }
    setActiveFacilityId(facId);
  };

  // Award research grant on passing facility quiz
  const handleGrantEarned = (facilityId: string, amountMillion: number) => {
    if (!completedQuizzes.includes(facilityId)) {
      setCompletedQuizzes((prev) => [...prev, facilityId]);
      setInvestmentBudgetMillion((prev) => prev + amountMillion);
    }
  };

  // Implement transition project in Mission Control
  const handleImplementProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project || project.implemented || investmentBudgetMillion < project.costMillion) {
      return;
    }

    setInvestmentBudgetMillion((prev) => Math.max(0, parseFloat((prev - project.costMillion).toFixed(1))));

    // Mark implemented
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, implemented: true } : p))
    );

    // Apply grid capacity deltas
    setGridState((prev) => ({
      ...prev,
      solarMW: Math.max(0, prev.solarMW + project.solarMWDelta),
      windMW: Math.max(0, prev.windMW + project.windMWDelta),
      hydroMW: Math.max(0, prev.hydroMW + project.hydroMWDelta),
      thermalMW: Math.max(0, prev.thermalMW + project.thermalMWDelta),
      batteryMW: Math.max(0, prev.batteryMW + project.batteryMWDelta),
      townMW: Math.max(0, prev.townMW + project.townMWDelta),
    }));

    // Apply stability bonus
    if (project.stabilityBonus) {
      setStabilityBonusTotal((prev) => prev + project.stabilityBonus);
    }
  };

  const handleToggleVR = () => {
    if (!managerRef.current) return;
    if (document.pointerLockElement) document.exitPointerLock?.();
    managerRef.current.exitPointerLock();

    if (managerRef.current.isXRActive) {
      managerRef.current.exitVR();
    } else if (isXRSupported) {
      managerRef.current.enterVR().catch((err: any) => {
        setXrErrorMessage(err?.message || 'Could not launch WebXR immersive VR session.');
        setIsVRGuideOpen(true);
      });
    } else {
      setIsVRGuideOpen(true);
    }
  };

  const handleEnterVRDirect = () => {
    if (!managerRef.current) return;
    if (document.pointerLockElement) document.exitPointerLock?.();
    managerRef.current.exitPointerLock();
    managerRef.current.enterVR().catch((err: any) => {
      setXrErrorMessage(err?.message || 'Could not launch WebXR immersive VR session.');
      setIsVRGuideOpen(true);
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* Babylon 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair outline-none"
        tabIndex={0}
      />

      {/* Interactive HUD Overlay */}
      <ExplorerHUD
        currentSector={currentSector}
        cameraMode={cameraMode}
        timeOfDay={timeOfDay}
        timeHours={timeHours}
        isTimeCycling={isAutoTimeCycling}
        trackingStatus={solarTrackingStatus}
        fps={fps}
        isPointerLocked={isPointerLocked}
        shadowsEnabled={shadowsEnabled}
        investmentBudgetMillion={investmentBudgetMillion}
        renewableSharePercent={metrics.renewableSharePercent}
        isXRSupported={isXRSupported}
        isInXR={isInXR}
        onToggleVR={handleToggleVR}
        onOpenVRGuide={() => {
          if (document.pointerLockElement) document.exitPointerLock?.();
          managerRef.current?.exitPointerLock();
          setIsVRGuideOpen(true);
        }}
        onOpenTitleScreen={() => {
          if (document.pointerLockElement) document.exitPointerLock?.();
          managerRef.current?.exitPointerLock();
          setIsTitleScreenOpen(true);
        }}
        onSelectLandmark={handleSelectLandmark}
        onSetCameraMode={handleSetCameraMode}
        onSetTimeOfDay={handleSetTimeOfDay}
        onSetTimeHours={handleSetTimeHours}
        onToggleTimeCycle={() => setIsAutoTimeCycling((prev) => !prev)}
        onToggleShadows={handleToggleShadows}
        onRequestPointerLock={handleRequestPointerLock}
        onOpenHelp={() => {
          if (document.pointerLockElement) document.exitPointerLock?.();
          managerRef.current?.exitPointerLock();
          setIsHelpOpen(true);
        }}
        onOpenFacility={handleOpenFacility}
        onOpenMissionControl={() => {
          if (document.pointerLockElement) document.exitPointerLock?.();
          managerRef.current?.exitPointerLock();
          setIsMissionControlOpen(true);
        }}
      />

      {/* Title Screen with Interactive Features Showcase */}
      <TitleScreenModal
        isOpen={isTitleScreenOpen}
        onClose={() => setIsTitleScreenOpen(false)}
        onEnterVR={handleEnterVRDirect}
        onOpenVRGuide={() => setIsVRGuideOpen(true)}
        isXRSupported={isXRSupported}
        onSelectLandmark={handleSelectLandmark}
      />

      {/* WebXR VR Setup & Headset Guide Modal */}
      <VRGuideModal
        isOpen={isVRGuideOpen}
        onClose={() => setIsVRGuideOpen(false)}
        onEnterVR={handleEnterVRDirect}
        isXRSupported={isXRSupported}
        xrErrorMessage={xrErrorMessage}
      />

      {/* Interactive Facility Information & Quiz Modal */}
      {activeFacilityId && (
        <FacilityModal
          facilityId={activeFacilityId}
          onClose={() => setActiveFacilityId(null)}
          onGrantEarned={handleGrantEarned}
          completedQuizzes={completedQuizzes}
        />
      )}

      {/* Central Mission Control Dashboard Modal */}
      <MissionControlModal
        isOpen={isMissionControlOpen}
        onClose={() => setIsMissionControlOpen(false)}
        gridState={gridState}
        investmentBudgetMillion={investmentBudgetMillion}
        projects={projects}
        stabilityBonusTotal={stabilityBonusTotal}
        onImplementProject={handleImplementProject}
      />

      {/* Instructions & Documentation Modal */}
      <InstructionsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
