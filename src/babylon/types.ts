import { Vector3 } from '@babylonjs/core';

export type CameraMode = 'first_person' | 'drone' | 'orbit';
export type TimeOfDay = 'day' | 'sunset' | 'night';

export interface SolarTrackingStatus {
  azimuthDeg: number;
  tiltDeg: number;
  isStowed: boolean;
  efficiencyPercent: number;
}

export interface XRStatus {
  isSupported: boolean;
  isInXR: boolean;
  errorMessage?: string;
}

export interface Landmark {
  id: string;
  name: string;
  category: 'Overview' | 'Settlement' | 'Renewable' | 'Hydro' | 'Fossil';
  position: Vector3;
  target: Vector3;
  description: string;
  specs: {
    type: string;
    generationMW: string;
    footprint: string;
    keyFeature: string;
  };
  color: string;
}

export interface SectorInfo {
  landmark: Landmark | null;
  distance: number;
}
