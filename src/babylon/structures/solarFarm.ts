import {
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
  ShadowGenerator,
  TransformNode,
} from '@babylonjs/core';
import { MaterialManager } from '../materials';
import { TerrainManager } from '../terrain';
import { SolarTrackingStatus } from '../types';

interface TrackingRackItem {
  rackRoot: TransformNode;
  tiltPivot: TransformNode;
  stanchionCollider: Mesh;
}

export class SolarFarmManager {
  private scene: Scene;
  private materials: MaterialManager;
  private terrain: TerrainManager;
  public rootNode: TransformNode;
  private trackingRacks: TrackingRackItem[] = [];
  public currentTrackingStatus: SolarTrackingStatus = {
    azimuthDeg: 0,
    tiltDeg: 0,
    isStowed: false,
    efficiencyPercent: 95,
  };

  constructor(scene: Scene, materials: MaterialManager, terrain: TerrainManager) {
    this.scene = scene;
    this.materials = materials;
    this.terrain = terrain;
    this.rootNode = new TransformNode('solarFarmRoot', this.scene);
    this.buildSolarFarm();
  }

  private buildSolarFarm(): void {
    // Array layout: 5 rows x 8 columns = 40 single-axis tracking tables
    // North-South aligned torque tubes with East-West single-axis tracking
    const rows = 5;
    const cols = 8;
    const rowSpacing = 9.2;
    const colSpacing = 8.8;
    const startX = 64;
    const startZ = -22;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * colSpacing;
        const z = startZ + r * rowSpacing;
        this.createDetailedSolarRack(x, z, `rack_${r}_${c}`);
      }
    }

    // Inverter Station and Central Step-up Substation
    this.createInverterStation(99, 2);
    this.createSubstation(134, 10);
    this.createPerimeterFence(
      startX - 5,
      startZ - 6,
      cols * colSpacing + 14,
      rows * rowSpacing + 12
    );
  }

  /**
   * Engineered utility Horizontal Single-Axis Tracking (HSAT) solar rack.
   * Single-axis tracking along the continuous North-South torque tube.
   * Includes structural piles, bearing stanchions, torque tube, slew drive actuator,
   * purlins, and an organized grid of distinct monocrystalline PV modules with frames.
   */
  private createDetailedSolarRack(x: number, z: number, id: string): void {
    const groundY = this.terrain.getHeightAt(x, z);
    const rackRoot = new TransformNode(id, this.scene);
    rackRoot.position = new Vector3(x, groundY, z);
    rackRoot.parent = this.rootNode;

    const stanchionHeight = 1.7;
    const stanchionSpread = 2.2;

    // 1. Structural Ground Piles & Mounting Stanchions (Galvanized Steel along North-South Z-axis)
    [-stanchionSpread, stanchionSpread].forEach((offsetZ, idx) => {
      // Concrete pile cap footing
      const footing = MeshBuilder.CreateCylinder(
        `${id}_footing_${idx}`,
        { diameter: 0.55, height: 0.35, tessellation: 8 },
        this.scene
      );
      footing.position = new Vector3(0, 0.175, offsetZ);
      footing.material = this.materials.concreteMat;
      footing.parent = rackRoot;

      // Heavy vertical I-beam / cylinder stanchion
      const stanchion = MeshBuilder.CreateCylinder(
        `${id}_post_${idx}`,
        { diameter: 0.22, height: stanchionHeight, tessellation: 8 },
        this.scene
      );
      stanchion.position = new Vector3(0, stanchionHeight / 2, offsetZ);
      stanchion.material = this.materials.solarFrameMat;
      stanchion.parent = rackRoot;

      // Cast-iron bearing pillow block housing
      const bearing = MeshBuilder.CreateBox(
        `${id}_bearing_${idx}`,
        { width: 0.38, height: 0.3, depth: 0.38 },
        this.scene
      );
      bearing.position = new Vector3(0, stanchionHeight, offsetZ);
      bearing.material = this.materials.pylonSteelMat;
      bearing.parent = rackRoot;
    });

    // Invisible physical collider for player camera around rack base
    const stanchionCollider = MeshBuilder.CreateBox(
      `${id}_collider`,
      { width: 1.2, height: 2.2, depth: 5.6 },
      this.scene
    );
    stanchionCollider.position = new Vector3(0, 1.1, 0);
    stanchionCollider.isVisible = false;
    stanchionCollider.checkCollisions = true;
    stanchionCollider.parent = rackRoot;

    // 2. Continuous Central Galvanized Steel Torque Tube (Single Rotational Axle along North-South Z-axis)
    const torqueTube = MeshBuilder.CreateCylinder(
      `${id}_torqueTube`,
      { diameter: 0.18, height: 7.2, tessellation: 8 },
      this.scene
    );
    // Cylinder is aligned along Y by default. Rotate 90° about X so it lies along Z
    torqueTube.rotation.x = Math.PI / 2;
    torqueTube.position = new Vector3(0, stanchionHeight, 0);
    torqueTube.material = this.materials.solarFrameMat;
    torqueTube.parent = rackRoot;

    // Center Slew Drive / Motor Actuator Gearbox
    const slewDrive = MeshBuilder.CreateBox(
      `${id}_slewDrive`,
      { width: 0.55, height: 0.45, depth: 0.55 },
      this.scene
    );
    slewDrive.position = new Vector3(0, stanchionHeight, 0);
    slewDrive.material = this.materials.powerPlantSteelMat;
    slewDrive.parent = rackRoot;

    const motorHousing = MeshBuilder.CreateCylinder(
      `${id}_motor`,
      { diameter: 0.22, height: 0.4, tessellation: 8 },
      this.scene
    );
    motorHousing.position = new Vector3(-0.25, stanchionHeight - 0.22, 0);
    motorHousing.material = this.materials.safetyYellowMat;
    motorHousing.parent = rackRoot;

    // 3. Single-Axis Articulated Tracking Node (Rotates ONLY around Z torque tube axis)
    const tiltPivot = new TransformNode(`${id}_tiltPivot`, this.scene);
    tiltPivot.position = new Vector3(0, stanchionHeight, 0);
    tiltPivot.rotation.x = 0; // Strictly 0 (fixed single axis)
    tiltPivot.rotation.y = 0; // Strictly 0
    tiltPivot.rotation.z = 0; // Single tracking axis (East-West roll)
    tiltPivot.parent = rackRoot;

    // 4. Mounting Purlin Rails (4 steel hat channels perpendicular to torque tube, running along X)
    const purlinZPositions = [-2.6, -0.9, 0.9, 2.6];
    purlinZPositions.forEach((pz, pIdx) => {
      const purlin = MeshBuilder.CreateBox(
        `${id}_purlin_${pIdx}`,
        { width: 3.6, height: 0.08, depth: 0.1 },
        this.scene
      );
      purlin.position = new Vector3(0, 0.08, pz);
      purlin.material = this.materials.solarFrameMat;
      purlin.parent = tiltPivot;
    });

    // 5. Grid of 8 Monocrystalline Solar PV Modules (2 columns along X x 4 rows along Z)
    const modCols = 2; // East-West width (1.72m each, total width ~3.5m)
    const modRows = 4; // North-South length (1.65m each, total length ~7.0m)
    const modWidth = 1.72;
    const modDepth = 1.65;
    const modGap = 0.06;

    for (let r = 0; r < modRows; r++) {
      for (let c = 0; c < modCols; c++) {
        const mx = (c - 0.5) * (modWidth + modGap);
        const mz = (r - 1.5) * (modDepth + modGap);

        // Aluminum module frame (outer casing)
        const frame = MeshBuilder.CreateBox(
          `${id}_frame_${r}_${c}`,
          { width: modWidth, height: 0.05, depth: modDepth },
          this.scene
        );
        frame.position = new Vector3(mx, 0.14, mz);
        frame.material = this.materials.solarFrameMat;
        frame.parent = tiltPivot;

        // Active Photovoltaic Face (top dark blue crystalline wafer surface)
        const pvFace = MeshBuilder.CreateBox(
          `${id}_pvFace_${r}_${c}`,
          { width: modWidth - 0.04, height: 0.02, depth: modDepth - 0.04 },
          this.scene
        );
        pvFace.position = new Vector3(mx, 0.165, mz);
        pvFace.material = this.materials.solarPanelMat;
        pvFace.parent = tiltPivot;

        // Underside Weatherproof Backsheet
        const backsheet = MeshBuilder.CreateBox(
          `${id}_backsheet_${r}_${c}`,
          { width: modWidth - 0.06, height: 0.015, depth: modDepth - 0.06 },
          this.scene
        );
        backsheet.position = new Vector3(mx, 0.115, mz);
        backsheet.material = this.materials.solarBacksheetMat;
        backsheet.parent = tiltPivot;

        // Small junction box & cabling conduit underneath
        const jbox = MeshBuilder.CreateBox(
          `${id}_jbox_${r}_${c}`,
          { width: 0.14, height: 0.06, depth: 0.14 },
          this.scene
        );
        jbox.position = new Vector3(mx, 0.07, mz);
        jbox.material = this.materials.powerPlantSteelMat;
        jbox.parent = tiltPivot;
      }
    }

    this.trackingRacks.push({
      rackRoot,
      tiltPivot,
      stanchionCollider,
    });
  }

  private createInverterStation(x: number, z: number): void {
    const groundY = this.terrain.getHeightAt(x, z);
    const invRoot = new TransformNode('inverterStation', this.scene);
    invRoot.position = new Vector3(x, groundY, z);
    invRoot.parent = this.rootNode;

    // Concrete Pad (with collider)
    const pad = MeshBuilder.CreateBox('invPad', { width: 6.2, height: 0.4, depth: 4.0 }, this.scene);
    pad.position.y = 0.2;
    pad.material = this.materials.concreteMat;
    pad.checkCollisions = true;
    pad.parent = invRoot;

    // Central Inverter Cabinet Enclosure (with collider)
    const cabinet = MeshBuilder.CreateBox('invCabinet', { width: 4.4, height: 2.6, depth: 2.4 }, this.scene);
    cabinet.position = new Vector3(0, 1.5, 0);
    cabinet.material = this.materials.powerPlantSteelMat;
    cabinet.checkCollisions = true;
    cabinet.parent = invRoot;

    // Safety yellow disconnect switches and louvers
    const switchBox = MeshBuilder.CreateBox('invSwitch', { width: 0.6, height: 0.8, depth: 0.25 }, this.scene);
    switchBox.position = new Vector3(1.6, 1.6, 1.25);
    switchBox.material = this.materials.safetyYellowMat;
    switchBox.parent = invRoot;

    // Transformer Coils
    const tx = MeshBuilder.CreateCylinder('invTx', { diameter: 1.4, height: 1.9 }, this.scene);
    tx.position = new Vector3(-1.4, 2.7, 0);
    tx.material = this.materials.powerPlantSteelMat;
    tx.checkCollisions = true;
    tx.parent = invRoot;
  }

  private createSubstation(x: number, z: number): void {
    const groundY = this.terrain.getHeightAt(x, z);
    const subRoot = new TransformNode('solarSubstation', this.scene);
    subRoot.position = new Vector3(x, groundY, z);
    subRoot.parent = this.rootNode;

    // Gravel/Concrete Yard Foundation
    const yard = MeshBuilder.CreateBox('subYard', { width: 16, height: 0.35, depth: 14 }, this.scene);
    yard.position.y = 0.175;
    yard.material = this.materials.concreteMat;
    yard.checkCollisions = true;
    yard.parent = subRoot;

    // Main Step-Up Power Transformer
    const mainTx = MeshBuilder.CreateBox('mainTx', { width: 4.2, height: 3.5, depth: 3.6 }, this.scene);
    mainTx.position = new Vector3(0, 1.9, 0);
    mainTx.material = this.materials.powerPlantSteelMat;
    mainTx.checkCollisions = true;
    mainTx.parent = subRoot;

    // Oil Conservator Tank on top
    const oilTank = MeshBuilder.CreateCylinder('subOilTank', { diameter: 0.9, height: 3.2 }, this.scene);
    oilTank.rotation.z = Math.PI / 2;
    oilTank.position = new Vector3(0, 4.0, -1.2);
    oilTank.material = this.materials.powerPlantSteelMat;
    oilTank.parent = subRoot;

    // High Voltage Bushings & Insulators
    for (let i = -1; i <= 1; i++) {
      const bushing = MeshBuilder.CreateCylinder(
        `bushing_${i}`,
        { diameterBottom: 0.35, diameterTop: 0.12, height: 1.8 },
        this.scene
      );
      bushing.position = new Vector3(i * 1.2, 4.4, 0.4);
      bushing.material = this.materials.houseWallBrickMat;
      bushing.parent = subRoot;
    }

    // High Voltage Steel Take-off Gantry Structure (direct connection corridor to grid pylon 7)
    const gantry = MeshBuilder.CreateBox('subGantry', { width: 6.0, height: 6.5, depth: 0.5 }, this.scene);
    gantry.position = new Vector3(5.5, 3.25, 1.0);
    gantry.material = this.materials.pylonSteelMat;
    gantry.checkCollisions = true;
    gantry.parent = subRoot;

    // Switchgear Control House
    const ctrlHouse = MeshBuilder.CreateBox('subCtrlHouse', { width: 5.0, height: 3.0, depth: 3.5 }, this.scene);
    ctrlHouse.position = new Vector3(-4.5, 1.65, -3.0);
    ctrlHouse.material = this.materials.houseWallWhiteMat;
    ctrlHouse.checkCollisions = true;
    ctrlHouse.parent = subRoot;
  }

  private createPerimeterFence(x: number, z: number, width: number, depth: number): void {
    const corners = [
      { x: x, z: z },
      { x: x + width, z: z },
      { x: x + width, z: z + depth },
      { x: x, z: z + depth },
    ];

    corners.forEach((c, idx) => {
      const gy = this.terrain.getHeightAt(c.x, c.z);
      const post = MeshBuilder.CreateCylinder(`fencePost_${idx}`, { diameter: 0.35, height: 2.8 }, this.scene);
      post.position = new Vector3(c.x, gy + 1.4, c.z);
      post.material = this.materials.solarFrameMat;
      post.checkCollisions = true;
      post.parent = this.rootNode;
    });
  }

  /**
   * Single-Axis Solar Tracking (Horizontal Single-Axis Tracker - HSAT):
   * Rotates STRICTLY along ONE axis (the North-South torque tube Z-axis)
   * to follow the sun's East-to-West transit across the sky.
   * Other rotational axes are strictly fixed at 0.
   * Automatically handles evening/night horizontal flat stow mode (0°).
   */
  public updateSunTracking(sunDirection: Vector3): SolarTrackingStatus {
    // sunDirection points down from sun towards ground
    const toSun = sunDirection.scale(-1).normalize();
    const isDaytime = toSun.y > 0.04;

    let singleAxisRollRad = 0;
    let isStowed = false;
    let efficiency = 0;

    if (isDaytime) {
      // Single-Axis Tracking:
      // Computes rotation strictly about the North-South torque tube axis (Z-axis).
      // toSun.x > 0 means sun is in the East; toSun.x < 0 means sun is in the West
      const eastWestAngle = Math.atan2(toSun.x, Math.max(0.08, toSun.y));
      // Standard commercial single-axis tracking rotation limits: ±50 degrees (~0.88 rad)
      singleAxisRollRad = Math.max(-0.88, Math.min(0.88, eastWestAngle));

      // Panel normal vector with single roll axis: N = (sin(roll), cos(roll), 0)
      const normalX = Math.sin(singleAxisRollRad);
      const normalY = Math.cos(singleAxisRollRad);
      const dot = Math.max(0, normalX * toSun.x + normalY * toSun.y);
      efficiency = Math.max(0.35, Math.min(1.0, dot));
    } else {
      // Night / High-Wind Safe Stow Protocol: 0° flat horizontal position
      isStowed = true;
      singleAxisRollRad = 0;
      efficiency = 0;
    }

    // Apply rotation ONLY along the single rotational axis!
    for (const rack of this.trackingRacks) {
      rack.tiltPivot.rotation.x = 0; // Strictly 0 (single-axis tracking only)
      rack.tiltPivot.rotation.y = 0; // Strictly 0
      rack.tiltPivot.rotation.z = -singleAxisRollRad; // The SINGLE rotating axis
    }

    const rollDeg = Math.round((singleAxisRollRad * 180) / Math.PI);
    this.currentTrackingStatus = {
      azimuthDeg: rollDeg,
      tiltDeg: Math.abs(rollDeg),
      isStowed,
      efficiencyPercent: Math.round(efficiency * 100),
    };

    return this.currentTrackingStatus;
  }

  public registerShadows(shadowGenerator: ShadowGenerator): void {
    this.scene.meshes.forEach((mesh) => {
      if (
        mesh.name.includes('_pvFace_') ||
        mesh.name.includes('_frame_') ||
        mesh.name.includes('invCabinet') ||
        mesh.name.includes('mainTx') ||
        mesh.name.includes('subCtrlHouse')
      ) {
        shadowGenerator.addShadowCaster(mesh);
        mesh.receiveShadows = true;
      }
    });
  }
}
