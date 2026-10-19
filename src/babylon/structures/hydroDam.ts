import {
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
  Color3,
  ShadowGenerator,
  TransformNode,
} from '@babylonjs/core';
import { MaterialManager } from '../materials';
import { TerrainManager } from '../terrain';

export class HydroDamManager {
  private scene: Scene;
  private materials: MaterialManager;
  private terrain: TerrainManager;
  public rootNode: TransformNode;

  // Key architectural elevations
  private baseToeY = 2.0;
  private crestY = 29.5;

  constructor(scene: Scene, materials: MaterialManager, terrain: TerrainManager) {
    this.scene = scene;
    this.materials = materials;
    this.terrain = terrain;
    this.rootNode = new TransformNode('hydroDamRoot', this.scene);
    this.buildDam();
  }

  private buildDam(): void {
    const totalHeight = this.crestY - this.baseToeY; // 27.5m

    // 1. Massive Concrete Gravity Dam Body
    this.buildDamMonolith(this.crestY, totalHeight);

    // 2. Crest Roadway, Railings, and Inspection Lighting
    this.buildCrestRoadway(this.crestY);

    // 3. Central 3-Bay Spillway Chute & Radial Gates
    this.buildSpillwaySystem(this.crestY);

    // 4. Powerhouse Generating Station Complex (Main Generator Hall & Control Wing)
    this.buildPowerhouseBuilding();

    // 5. High-Pressure Steel Penstocks with Saddle Blocks
    this.buildPenstocks();

    // 6. Upstream Reservoir Intake Towers & Safety Boom
    this.buildUpstreamIntakeStructures(this.crestY);

    // 7. Step-Up Transformer Switchyard Deck
    this.buildTransformerSwitchyard();
  }

  /**
   * 1. Massive Concrete Gravity Dam Monolith
   */
  private buildDamMonolith(crestY: number, totalHeight: number): void {
    const zSpan = 76;
    const centerZ = 100;

    // Upstream Vertical Core Block
    const upstreamCore = MeshBuilder.CreateBox(
      'damUpstreamCore',
      { width: 7.5, height: totalHeight, depth: zSpan },
      this.scene
    );
    upstreamCore.position = new Vector3(-64.25, this.baseToeY + totalHeight / 2, centerZ);
    upstreamCore.material = this.materials.concreteMat;
    upstreamCore.checkCollisions = true;
    upstreamCore.parent = this.rootNode;

    // Sloped Downstream Gravity Face
    // Structured stepped/sloped monolith tiers for authentic mass concrete appearance
    const numTiers = 7;
    const tierHeight = totalHeight / numTiers;

    for (let t = 0; t < numTiers; t++) {
      const progress = t / (numTiers - 1); // 0 at top, 1 at bottom
      const tierY = crestY - (t + 0.5) * tierHeight;
      const tierWidth = 7.5 + progress * 14.5; // Widens from 7.5m at crest to 22m at toe
      const tierCenterX = -64.25 + (progress * 14.5) / 2;

      const tierMesh = MeshBuilder.CreateBox(
        `damTier_${t}`,
        { width: tierWidth, height: tierHeight + 0.1, depth: zSpan },
        this.scene
      );
      tierMesh.position = new Vector3(tierCenterX, tierY, centerZ);
      tierMesh.material = this.materials.concreteMat;
      tierMesh.parent = this.rootNode;
    }

    // Canyon Abutment Rock Anchor Wing Walls (North & South)
    [-1, 1].forEach((dir) => {
      const wingZ = centerZ + (dir * (zSpan + 8)) / 2;
      const wingWall = MeshBuilder.CreateBox(
        `damWingWall_${dir}`,
        { width: 26, height: totalHeight + 4, depth: 12 },
        this.scene
      );
      wingWall.position = new Vector3(-58, this.baseToeY + totalHeight / 2 + 2, wingZ);
      wingWall.rotation.y = dir * 0.15;
      wingWall.material = this.materials.concreteMat;
      wingWall.parent = this.rootNode;
    });
  }

  /**
   * 2. Crest Roadway, Railings, and Lighting
   */
  private buildCrestRoadway(crestY: number): void {
    const zSpan = 84;
    const centerZ = 100;

    // Asphalt 2-lane Roadway Surface
    const road = MeshBuilder.CreateBox(
      'damCrestRoadSurface',
      { width: 8.0, height: 0.6, depth: zSpan },
      this.scene
    );
    road.position = new Vector3(-64.0, crestY + 0.3, centerZ);
    road.material = this.materials.roadMat;
    road.checkCollisions = true;
    road.parent = this.rootNode;

    // Upstream & Downstream Parapet Curbs & Safety Railings
    [-3.8, 3.8].forEach((xOffset, sideIdx) => {
      // Concrete barrier curb
      const curb = MeshBuilder.CreateBox(
        `damCurb_${sideIdx}`,
        { width: 0.45, height: 1.1, depth: zSpan },
        this.scene
      );
      curb.position = new Vector3(-64.0 + xOffset, crestY + 0.7, centerZ);
      curb.material = this.materials.concreteMat;
      curb.parent = this.rootNode;

      // Tubular handrail along the top
      const handrail = MeshBuilder.CreateCylinder(
        `damHandrail_${sideIdx}`,
        { diameter: 0.12, height: zSpan },
        this.scene
      );
      handrail.rotation.x = Math.PI / 2;
      handrail.position = new Vector3(-64.0 + xOffset, crestY + 1.45, centerZ);
      handrail.material = this.materials.powerPlantSteelMat;
      handrail.parent = this.rootNode;
    });

    // Street Lamps along crest road
    for (let z = 66; z <= 134; z += 11) {
      const lampPost = MeshBuilder.CreateCylinder(
        `damStreetLamp_${z}`,
        { diameter: 0.22, height: 4.8 },
        this.scene
      );
      lampPost.position = new Vector3(-60.4, crestY + 2.4, z);
      lampPost.material = this.materials.pylonSteelMat;
      lampPost.parent = this.rootNode;

      // Overhanging curved lamp arm
      const lampArm = MeshBuilder.CreateBox(
        `damLampArm_${z}`,
        { width: 1.2, height: 0.12, depth: 0.12 },
        this.scene
      );
      lampArm.position = new Vector3(-61.0, crestY + 4.8, z);
      lampArm.material = this.materials.pylonSteelMat;
      lampArm.parent = this.rootNode;

      const luminaire = MeshBuilder.CreateSphere(
        `damLuminaire_${z}`,
        { diameter: 0.5 },
        this.scene
      );
      luminaire.position = new Vector3(-61.6, crestY + 4.65, z);
      luminaire.material = this.materials.windowLitMat;
      luminaire.parent = this.rootNode;
    }

    // Crest Service Gantry Crane (hoists intake gates & trash racks)
    const craneRoot = new TransformNode('damCrestCrane', this.scene);
    craneRoot.position = new Vector3(-64.0, crestY + 0.6, 82);
    craneRoot.parent = this.rootNode;

    // Crane Gantry Legs
    [-3.2, 3.2].forEach((cx, legIdx) => {
      const leg = MeshBuilder.CreateBox(
        `craneLeg_${legIdx}`,
        { width: 0.7, height: 5.5, depth: 0.9 },
        this.scene
      );
      leg.position = new Vector3(cx, 2.75, 0);
      leg.material = this.materials.safetyYellowMat;
      leg.parent = craneRoot;
    });

    // Crane Overhead Crossbeam & Trolley
    const craneBeam = MeshBuilder.CreateBox(
      'craneCrossbeam',
      { width: 7.8, height: 0.8, depth: 1.4 },
      this.scene
    );
    craneBeam.position = new Vector3(0, 5.6, 0);
    craneBeam.material = this.materials.safetyYellowMat;
    craneBeam.parent = craneRoot;

    const craneTrolley = MeshBuilder.CreateBox(
      'craneTrolley',
      { width: 1.8, height: 1.1, depth: 1.8 },
      this.scene
    );
    craneTrolley.position = new Vector3(0, 4.8, 0);
    craneTrolley.material = this.materials.powerPlantSteelMat;
    craneTrolley.parent = craneRoot;
  }

  /**
   * 3. Central Spillway System with Radial Gates & Chute
   */
  private buildSpillwaySystem(crestY: number): void {
    const spillwayZStart = 92;
    const spillwayWidth = 20; // 3 bays
    const centerZ = spillwayZStart + spillwayWidth / 2; // 102

    // Spillway Ogee Chute descending downstream
    const chute = MeshBuilder.CreateBox(
      'spillwayChute',
      { width: 22, height: 1.8, depth: spillwayWidth },
      this.scene
    );
    chute.rotation.z = -0.68; // Smooth ~39° descent angle
    chute.position = new Vector3(-55.5, 15.5, centerZ);
    chute.material = this.materials.concreteMat;
    chute.parent = this.rootNode;

    // Aerated Frothy Water Flowing Down Chute
    const chuteWater = MeshBuilder.CreateBox(
      'spillwayWaterFlow',
      { width: 21.6, height: 0.4, depth: spillwayWidth - 0.8 },
      this.scene
    );
    chuteWater.rotation.z = -0.68;
    chuteWater.position = new Vector3(-55.5, 16.5, centerZ);
    chuteWater.material = this.materials.foamWaterMat;
    chuteWater.parent = this.rootNode;

    // 4 Concrete Pier Dividers separating 3 overflow bays
    for (let p = 0; p < 4; p++) {
      const pZ = spillwayZStart + p * (spillwayWidth / 3);
      const pier = MeshBuilder.CreateBox(
        `spillwayPier_${p}`,
        { width: 10.5, height: 7.2, depth: 1.2 },
        this.scene
      );
      pier.position = new Vector3(-63.5, crestY + 2.0, pZ);
      pier.material = this.materials.concreteMat;
      pier.parent = this.rootNode;

      // Radial Gate Pivot Arms (between piers)
      if (p < 3) {
        const gateZ = pZ + spillwayWidth / 6;
        const radialGate = MeshBuilder.CreateCylinder(
          `radialGate_${p}`,
          { diameter: 5.5, height: 5.0, tessellation: 12 },
          this.scene
        );
        radialGate.rotation.x = Math.PI / 2;
        radialGate.position = new Vector3(-66.2, crestY - 1.2, gateZ);
        radialGate.material = this.materials.powerPlantSteelMat;
        radialGate.parent = this.rootNode;
      }
    }

    // Heavy Concrete Spillway Training Walls (North & South)
    [-1, 1].forEach((dir) => {
      const wallZ = centerZ + (dir * spillwayWidth) / 2;
      const trainingWall = MeshBuilder.CreateBox(
        `trainingWall_${dir}`,
        { width: 22, height: 16, depth: 1.2 },
        this.scene
      );
      trainingWall.position = new Vector3(-53.0, 14.0, wallZ);
      trainingWall.material = this.materials.concreteMat;
      trainingWall.parent = this.rootNode;
    });

    // Flip Bucket / Stilling Basin at Chute Toe
    const flipBucket = MeshBuilder.CreateBox(
      'stillingBasinBucket',
      { width: 8.5, height: 3.2, depth: spillwayWidth + 2 },
      this.scene
    );
    flipBucket.position = new Vector3(-43.5, 3.6, centerZ);
    flipBucket.material = this.materials.concreteMat;
    flipBucket.parent = this.rootNode;

    // Churning Foam in Stilling Basin
    const basinWater = MeshBuilder.CreateBox(
      'stillingBasinFoam',
      { width: 8.0, height: 1.2, depth: spillwayWidth },
      this.scene
    );
    basinWater.position = new Vector3(-43.5, 4.4, centerZ);
    basinWater.material = this.materials.foamWaterMat;
    basinWater.parent = this.rootNode;
  }

  /**
   * 4. Powerhouse Generating Station Complex
   * Fully architectured hydroelectric powerhouse building with generator hall,
   * proper standing-seam gabled roof & clerestory monitor, cathedral window bays,
   * intake thrust collars for penstocks, tailrace discharge arches, and SCADA control wing.
   */
  private buildPowerhouseBuilding(): void {
    // Powerhouse origin anchor at toe of dam south of spillway:
    // Center at x: -37.5, z: 78.5, y: baseToeY (2.0m)
    const hallWidth = 15.0; // X axis (-45.0 to -30.0)
    const hallLength = 26.0; // Z axis (65.5 to 91.5)
    const hallHeight = 11.5; // Main generator hall wall height

    const phRoot = new TransformNode('powerhouseRoot', this.scene);
    phRoot.position = new Vector3(-37.5, this.baseToeY, 78.5);
    phRoot.parent = this.rootNode;

    // ------------------------------------------------------------------------
    // 1. Heavy Reinforced Concrete Foundation Substructure
    // ------------------------------------------------------------------------
    const subHeight = 3.2;
    const substructure = MeshBuilder.CreateBox(
      'phSubstructure',
      { width: hallWidth + 3.0, height: subHeight, depth: hallLength + 3.0 },
      this.scene
    );
    substructure.position = new Vector3(0, subHeight / 2, 0);
    substructure.material = this.materials.concreteMat;
    substructure.checkCollisions = true;
    substructure.parent = phRoot;

    // ------------------------------------------------------------------------
    // 2. Main Generator Hall Superstructure Body
    // ------------------------------------------------------------------------
    const mainHall = MeshBuilder.CreateBox(
      'phMainHallBody',
      { width: hallWidth, height: hallHeight, depth: hallLength },
      this.scene
    );
    mainHall.position = new Vector3(0, subHeight + hallHeight / 2, 0);
    mainHall.material = this.materials.powerPlantConcreteMat;
    mainHall.checkCollisions = true;
    mainHall.parent = phRoot;

    // ------------------------------------------------------------------------
    // 3. Structural Architectural Pilasters / Buttresses (River & End Walls)
    // ------------------------------------------------------------------------
    // River-facing (+X) wall vertical columns dividing into 5 architectural window bays
    const numColumns = 6;
    for (let c = 0; c < numColumns; c++) {
      const zCol = -hallLength / 2 + (c * hallLength) / (numColumns - 1);
      const pilaster = MeshBuilder.CreateBox(
        `phPilaster_${c}`,
        { width: 0.7, height: hallHeight + 0.4, depth: 1.1 },
        this.scene
      );
      pilaster.position = new Vector3(hallWidth / 2 + 0.35, subHeight + hallHeight / 2, zCol);
      pilaster.material = this.materials.concreteMat;
      pilaster.parent = phRoot;
    }

    // End-wall (North & South) structural corner pillars
    [-hallLength / 2, hallLength / 2].forEach((endZ, eIdx) => {
      [-hallWidth / 2, hallWidth / 2].forEach((cornerX, cIdx) => {
        const cornerPillar = MeshBuilder.CreateBox(
          `phCornerPillar_${eIdx}_${cIdx}`,
          { width: 1.2, height: hallHeight + 0.4, depth: 1.2 },
          this.scene
        );
        cornerPillar.position = new Vector3(cornerX, subHeight + hallHeight / 2, endZ);
        cornerPillar.material = this.materials.concreteMat;
        cornerPillar.parent = phRoot;
      });
    });

    // ------------------------------------------------------------------------
    // 4. Large Cathedral Window Bays on Riverfront Face (+X)
    // ------------------------------------------------------------------------
    for (let w = 0; w < 5; w++) {
      const zBay = -hallLength / 2 + ((w + 0.5) * hallLength) / 5;

      // Dark steel recessed window frame
      const frame = MeshBuilder.CreateBox(
        `phWindowFrame_${w}`,
        { width: 0.3, height: 7.6, depth: 3.4 },
        this.scene
      );
      frame.position = new Vector3(hallWidth / 2 + 0.05, subHeight + hallHeight / 2 + 0.6, zBay);
      frame.material = this.materials.powerPlantSteelMat;
      frame.parent = phRoot;

      // Blue architectural reflective glass pane
      const glass = MeshBuilder.CreateBox(
        `phWindowGlass_${w}`,
        { width: 0.15, height: 7.2, depth: 3.1 },
        this.scene
      );
      glass.position = new Vector3(hallWidth / 2 + 0.15, subHeight + hallHeight / 2 + 0.6, zBay);
      glass.material = this.materials.windowGlassMat;
      glass.parent = phRoot;

      // Warm interior glowing generator room backplate
      const interiorGlow = MeshBuilder.CreateBox(
        `phInteriorGlow_${w}`,
        { width: 0.1, height: 6.8, depth: 2.8 },
        this.scene
      );
      interiorGlow.position = new Vector3(hallWidth / 2 - 0.25, subHeight + hallHeight / 2 + 0.6, zBay);
      interiorGlow.material = this.materials.windowLitMat;
      interiorGlow.parent = phRoot;

      // Window mullions (cross bars)
      const horizontalMullion = MeshBuilder.CreateBox(
        `phMullionH_${w}`,
        { width: 0.25, height: 0.15, depth: 3.2 },
        this.scene
      );
      horizontalMullion.position = new Vector3(hallWidth / 2 + 0.16, subHeight + hallHeight / 2 + 0.6, zBay);
      horizontalMullion.material = this.materials.powerPlantSteelMat;
      horizontalMullion.parent = phRoot;
    }

    // ------------------------------------------------------------------------
    // 5. Western Upstream Penstock Inlet Thrust Collars (-X Face)
    // ------------------------------------------------------------------------
    // 4 intake portals at Z coordinates matching penstocks [72.5, 77.0, 81.5, 86.0]
    // In local powerhouse space (z origin 78.5): z = [-6.0, -1.5, +3.0, +7.5]
    const penstockLocalZ = [-6.0, -1.5, 3.0, 7.5];
    penstockLocalZ.forEach((zVal, pIdx) => {
      // Concrete thrust block protruding from west wall
      const thrustBlock = MeshBuilder.CreateBox(
        `phThrustBlock_${pIdx}`,
        { width: 1.8, height: 4.8, depth: 3.6 },
        this.scene
      );
      thrustBlock.position = new Vector3(-hallWidth / 2 - 0.9, subHeight + 2.4, zVal);
      thrustBlock.material = this.materials.concreteMat;
      thrustBlock.parent = phRoot;

      // Circular steel manifold intake ring
      const inletRing = MeshBuilder.CreateCylinder(
        `phInletRing_${pIdx}`,
        { diameter: 3.2, height: 1.2, tessellation: 20 },
        this.scene
      );
      inletRing.rotation.z = Math.PI / 2;
      inletRing.position = new Vector3(-hallWidth / 2 - 1.6, subHeight + 2.4, zVal);
      inletRing.material = this.materials.powerPlantSteelMat;
      inletRing.parent = phRoot;

      // Inner dark steel intake portal
      const innerPortal = MeshBuilder.CreateCylinder(
        `phInnerPortal_${pIdx}`,
        { diameter: 2.45, height: 0.4, tessellation: 20 },
        this.scene
      );
      innerPortal.rotation.z = Math.PI / 2;
      innerPortal.position = new Vector3(-hallWidth / 2 - 2.1, subHeight + 2.4, zVal);
      innerPortal.material = this.materials.pylonSteelMat;
      innerPortal.parent = phRoot;
    });

    // ------------------------------------------------------------------------
    // 6. Architecturally Accurate Gabled Industrial Roof & Clerestory Monitor
    // ------------------------------------------------------------------------
    const roofBaseY = subHeight + hallHeight; // Y = 14.7

    // A. Concrete Perimeter Roof Parapet & Coping Stone
    const parapetHeight = 0.9;
    const parapet = MeshBuilder.CreateBox(
      'phRoofParapet',
      { width: hallWidth + 0.8, height: parapetHeight, depth: hallLength + 0.8 },
      this.scene
    );
    parapet.position = new Vector3(0, roofBaseY + parapetHeight / 2, 0);
    parapet.material = this.materials.concreteMat;
    parapet.parent = phRoot;

    // Interior roof deck platform
    const roofDeck = MeshBuilder.CreateBox(
      'phRoofDeck',
      { width: hallWidth - 0.2, height: 0.4, depth: hallLength - 0.2 },
      this.scene
    );
    roofDeck.position = new Vector3(0, roofBaseY + 0.2, 0);
    roofDeck.material = this.materials.powerPlantConcreteMat;
    roofDeck.parent = phRoot;

    // B. Pitched Gabled Metal Industrial Roof (2 sloped roof planes along Z)
    const pitchSlopeWidth = (hallWidth / 2) + 0.6; // 8.1m
    const pitchThickness = 0.35;
    const roofRise = 2.4;
    const roofAngle = Math.atan2(roofRise, hallWidth / 2); // ~17.7 degrees

    // West Sloped Roof Plane (pitches downward toward -X)
    const westRoofPlane = MeshBuilder.CreateBox(
      'phWestRoofPlane',
      { width: pitchSlopeWidth, height: pitchThickness, depth: hallLength + 0.6 },
      this.scene
    );
    westRoofPlane.rotation.z = roofAngle;
    westRoofPlane.position = new Vector3(-hallWidth / 4, roofBaseY + 0.4 + roofRise / 2, 0);
    westRoofPlane.material = this.materials.powerPlantSteelMat;
    westRoofPlane.parent = phRoot;

    // East Sloped Roof Plane (pitches downward toward +X)
    const eastRoofPlane = MeshBuilder.CreateBox(
      'phEastRoofPlane',
      { width: pitchSlopeWidth, height: pitchThickness, depth: hallLength + 0.6 },
      this.scene
    );
    eastRoofPlane.rotation.z = -roofAngle;
    eastRoofPlane.position = new Vector3(hallWidth / 4, roofBaseY + 0.4 + roofRise / 2, 0);
    eastRoofPlane.material = this.materials.powerPlantSteelMat;
    eastRoofPlane.parent = phRoot;

    // North & South Triangular Gable End Pediment Walls
    [-hallLength / 2, hallLength / 2].forEach((gz, gIdx) => {
      // Solid gable infill block
      const gableWall = MeshBuilder.CreateBox(
        `phGableWall_${gIdx}`,
        { width: hallWidth - 0.2, height: roofRise, depth: 0.6 },
        this.scene
      );
      gableWall.position = new Vector3(0, roofBaseY + roofRise / 2 + 0.3, gz);
      gableWall.material = this.materials.powerPlantConcreteMat;
      gableWall.parent = phRoot;
    });

    // Central Longitudinal Roof Ridge Cap
    const ridgeCap = MeshBuilder.CreateBox(
      'phRoofRidgeCap',
      { width: 0.8, height: 0.3, depth: hallLength + 0.8 },
      this.scene
    );
    ridgeCap.position = new Vector3(0, roofBaseY + roofRise + 0.55, 0);
    ridgeCap.material = this.materials.powerPlantSteelMat;
    ridgeCap.parent = phRoot;

    // C. Raised Clerestory Ventilation Monitor along Roof Peak
    const monitorWidth = 4.6;
    const monitorHeight = 1.6;
    const monitorLength = hallLength - 4.0;
    const monitor = MeshBuilder.CreateBox(
      'phClerestoryMonitor',
      { width: monitorWidth, height: monitorHeight, depth: monitorLength },
      this.scene
    );
    monitor.position = new Vector3(0, roofBaseY + roofRise + monitorHeight / 2 + 0.5, 0);
    monitor.material = this.materials.powerPlantSteelMat;
    monitor.parent = phRoot;

    // Clerestory Louvers & Glass Ribbon along sides of monitor
    [-1, 1].forEach((side) => {
      const monitorGlass = MeshBuilder.CreateBox(
        `phMonitorGlass_${side}`,
        { width: 0.1, height: monitorHeight - 0.4, depth: monitorLength - 0.8 },
        this.scene
      );
      monitorGlass.position = new Vector3(
        (side * (monitorWidth + 0.05)) / 2,
        roofBaseY + roofRise + monitorHeight / 2 + 0.5,
        0
      );
      monitorGlass.material = this.materials.windowGlassMat;
      monitorGlass.parent = phRoot;
    });

    // Monitor Sloped Cap
    const monitorCap = MeshBuilder.CreateBox(
      'phMonitorCap',
      { width: monitorWidth + 0.8, height: 0.25, depth: monitorLength + 0.8 },
      this.scene
    );
    monitorCap.position = new Vector3(0, roofBaseY + roofRise + monitorHeight + 0.65, 0);
    monitorCap.material = this.materials.powerPlantSteelMat;
    monitorCap.parent = phRoot;

    // ------------------------------------------------------------------------
    // 7. Heavy Overhead Traveling Gantry Crane Rails & Hoist Carriage
    // ------------------------------------------------------------------------
    const craneY = roofBaseY + roofRise + monitorHeight + 1.2;

    // Twin Steel Crane Runway Rails running along Z
    [-3.8, 3.8].forEach((rx, rIdx) => {
      const rail = MeshBuilder.CreateBox(
        `phCraneRail_${rIdx}`,
        { width: 0.35, height: 0.5, depth: hallLength - 2.0 },
        this.scene
      );
      rail.position = new Vector3(rx, craneY, 0);
      rail.material = this.materials.powerPlantSteelMat;
      rail.parent = phRoot;

      // Rail support stanchions
      for (let s = -2; s <= 2; s++) {
        const stanchion = MeshBuilder.CreateCylinder(
          `phCraneStanchion_${rIdx}_${s}`,
          { diameter: 0.25, height: 0.8 },
          this.scene
        );
        stanchion.position = new Vector3(rx, craneY - 0.4, s * 5.0);
        stanchion.material = this.materials.powerPlantSteelMat;
        stanchion.parent = phRoot;
      }
    });

    // Gantry Crane Crossbridge & Trolley (parked in inspection position)
    const gantryBridge = MeshBuilder.CreateBox(
      'phGantryBridge',
      { width: 8.6, height: 1.1, depth: 1.8 },
      this.scene
    );
    gantryBridge.position = new Vector3(0, craneY + 0.7, -4.5);
    gantryBridge.material = this.materials.safetyYellowMat;
    gantryBridge.parent = phRoot;

    const hoistTrolley = MeshBuilder.CreateBox(
      'phHoistTrolley',
      { width: 2.2, height: 1.2, depth: 2.0 },
      this.scene
    );
    hoistTrolley.position = new Vector3(0, craneY + 1.4, -4.5);
    hoistTrolley.material = this.materials.powerPlantSteelMat;
    hoistTrolley.parent = phRoot;

    // Yellow Safety Guardrail around roof maintenance deck
    [-1, 1].forEach((dir) => {
      const railZ = MeshBuilder.CreateCylinder(
        `phRoofGuardrail_${dir}`,
        { diameter: 0.1, height: hallLength - 1 },
        this.scene
      );
      railZ.rotation.x = Math.PI / 2;
      railZ.position = new Vector3(dir * (hallWidth / 2 - 0.4), roofBaseY + parapetHeight + 0.5, 0);
      railZ.material = this.materials.powerPlantSteelMat;
      railZ.parent = phRoot;
    });

    // ------------------------------------------------------------------------
    // 8. Two-Story Administration & SCADA Control Annex Wing
    // Cleanly adjoining south facade: z from -hallLength/2 (-13.0) to -19.5
    // ------------------------------------------------------------------------
    const annexLength = 6.8;
    const annexWidth = 11.2;
    const annexHeight = 7.8;
    const annexZ = -hallLength / 2 - annexLength / 2; // -16.4

    const controlAnnex = MeshBuilder.CreateBox(
      'phControlAnnex',
      { width: annexWidth, height: annexHeight, depth: annexLength },
      this.scene
    );
    controlAnnex.position = new Vector3(0.5, subHeight + annexHeight / 2, annexZ);
    controlAnnex.material = this.materials.concreteMat;
    controlAnnex.parent = phRoot;

    // Cantilevered Observation Gallery on 2nd Floor (River & Tailrace View)
    const gallery = MeshBuilder.CreateBox(
      'phGalleryWrap',
      { width: annexWidth + 0.8, height: 2.5, depth: annexLength + 0.4 },
      this.scene
    );
    gallery.position = new Vector3(0.5, subHeight + 5.2, annexZ);
    gallery.material = this.materials.windowGlassMat;
    gallery.parent = phRoot;

    // Interior Warm Lit Observation Command Console
    const galleryLit = MeshBuilder.CreateBox(
      'phGalleryLit',
      { width: annexWidth, height: 2.1, depth: annexLength - 0.4 },
      this.scene
    );
    galleryLit.position = new Vector3(0.5, subHeight + 5.2, annexZ);
    galleryLit.material = this.materials.windowLitMat;
    galleryLit.parent = phRoot;

    // Annex Flat Roof Deck & Safety Parapet
    const annexRoof = MeshBuilder.CreateBox(
      'phAnnexRoof',
      { width: annexWidth + 0.6, height: 0.5, depth: annexLength + 0.6 },
      this.scene
    );
    annexRoof.position = new Vector3(0.5, subHeight + annexHeight + 0.25, annexZ);
    annexRoof.material = this.materials.powerPlantSteelMat;
    annexRoof.parent = phRoot;

    // Communication Antenna Mast on Control Wing
    const antennaMast = MeshBuilder.CreateCylinder(
      'phAntennaMast',
      { diameterBottom: 0.25, diameterTop: 0.08, height: 7.5 },
      this.scene
    );
    antennaMast.position = new Vector3(annexWidth / 2 - 1.2, subHeight + annexHeight + 3.8, annexZ);
    antennaMast.material = this.materials.pylonSteelMat;
    antennaMast.parent = phRoot;

    const beaconSphere = MeshBuilder.CreateSphere(
      'phBeaconSphere',
      { diameter: 0.45 },
      this.scene
    );
    beaconSphere.position = new Vector3(annexWidth / 2 - 1.2, subHeight + annexHeight + 7.6, annexZ);
    beaconSphere.material = this.materials.beaconGlowMat;
    beaconSphere.parent = phRoot;

    // Modern Station Entrance & Canopy
    const canopy = MeshBuilder.CreateBox(
      'phEntranceCanopy',
      { width: 4.2, height: 0.35, depth: 2.4 },
      this.scene
    );
    canopy.position = new Vector3(0.5, subHeight + 3.2, annexZ - annexLength / 2 - 1.0);
    canopy.material = this.materials.powerPlantSteelMat;
    canopy.parent = phRoot;

    // Double Entry Doors
    const door = MeshBuilder.CreateBox(
      'phPersonnelDoor',
      { width: 2.8, height: 2.6, depth: 0.15 },
      this.scene
    );
    door.position = new Vector3(0.5, subHeight + 1.3, annexZ - annexLength / 2 - 0.08);
    door.material = this.materials.windowGlassMat;
    door.parent = phRoot;

    // Station Nameplate Plaque above Canopy
    const plaque = MeshBuilder.CreateBox(
      'phStationPlaque',
      { width: 6.5, height: 0.8, depth: 0.2 },
      this.scene
    );
    plaque.position = new Vector3(0.5, subHeight + 3.9, annexZ - annexLength / 2 - 0.05);
    plaque.material = this.materials.safetyYellowMat;
    plaque.parent = phRoot;

    // ------------------------------------------------------------------------
    // 9. Equipment Staging Roll-Up Shutter Bay Door (North End)
    // ------------------------------------------------------------------------
    const rollUpDoor = MeshBuilder.CreateBox(
      'phRollUpDoor',
      { width: 5.5, height: 6.2, depth: 0.25 },
      this.scene
    );
    rollUpDoor.position = new Vector3(0, subHeight + 3.1, hallLength / 2 + 0.1);
    rollUpDoor.material = this.materials.powerPlantSteelMat;
    rollUpDoor.parent = phRoot;

    // Roll-up door yellow/black warning lintel
    const doorLintel = MeshBuilder.CreateBox(
      'phDoorLintel',
      { width: 6.2, height: 0.6, depth: 0.5 },
      this.scene
    );
    doorLintel.position = new Vector3(0, subHeight + 6.4, hallLength / 2 + 0.2);
    doorLintel.material = this.materials.safetyYellowMat;
    doorLintel.parent = phRoot;

    // ------------------------------------------------------------------------
    // 10. Submerged Turbine Tailrace Discharge Portals & Foaming Apron (+X)
    // ------------------------------------------------------------------------
    // 4 submerged draft tube portals exiting into river
    for (let d = 0; d < 4; d++) {
      const dZ = -8.0 + d * 5.4;

      // Heavy arched concrete headwall portal
      const draftTube = MeshBuilder.CreateCylinder(
        `phDraftTube_${d}`,
        { diameter: 3.4, height: 2.4, tessellation: 16 },
        this.scene
      );
      draftTube.rotation.z = Math.PI / 2;
      draftTube.position = new Vector3(hallWidth / 2 + 1.2, subHeight / 2, dZ);
      draftTube.material = this.materials.concreteMat;
      draftTube.parent = phRoot;

      // Vortex exit cavity
      const draftCavity = MeshBuilder.CreateCylinder(
        `phDraftCavity_${d}`,
        { diameter: 2.7, height: 0.4, tessellation: 16 },
        this.scene
      );
      draftCavity.rotation.z = Math.PI / 2;
      draftCavity.position = new Vector3(hallWidth / 2 + 2.3, subHeight / 2, dZ);
      draftCavity.material = this.materials.powerPlantSteelMat;
      draftCavity.parent = phRoot;
    }

    // Foaming Aerated Water in Tailrace Apron Channel
    const tailraceWater = MeshBuilder.CreateBox(
      'phTailraceWater',
      { width: 8.5, height: 0.6, depth: hallLength + 4.0 },
      this.scene
    );
    tailraceWater.position = new Vector3(hallWidth / 2 + 4.5, 0.4, 0);
    tailraceWater.material = this.materials.foamWaterMat;
    tailraceWater.parent = phRoot;

    // Tailrace Guide Retaining Wall
    const tailraceWall = MeshBuilder.CreateBox(
      'phTailraceRetainingWall',
      { width: 0.8, height: 2.6, depth: hallLength + 5.0 },
      this.scene
    );
    tailraceWall.position = new Vector3(hallWidth / 2 + 8.9, 1.3, 0);
    tailraceWall.material = this.materials.concreteMat;
    tailraceWall.parent = phRoot;

    // ------------------------------------------------------------------------
    // 11. High-Voltage Isolated Phase Bus (IPB) Duct to Switchyard
    // Bridges from South wall of generator hall directly to Transformer switchyard
    // ------------------------------------------------------------------------
    for (let b = 0; b < 3; b++) {
      const bX = -2.5 + b * 2.5;
      const busDuct = MeshBuilder.CreateCylinder(
        `phBusDuct_${b}`,
        { diameter: 0.65, height: 12.0 },
        this.scene
      );
      busDuct.rotation.x = Math.PI / 2;
      busDuct.position = new Vector3(bX, subHeight + 4.2, -hallLength / 2 - 6.0);
      busDuct.material = this.materials.powerPlantSteelMat;
      busDuct.parent = phRoot;
    }
  }

  /**
   * 5. High-Pressure Steel Penstocks with Concrete Saddle Blocks
   */
  private buildPenstocks(): void {
    // 4 penstocks feeding 4 Francis turbines inside the powerhouse
    // Penstock start: Dam downstream face at x: -59.8, y: 19.8
    // Penstock end: Powerhouse generator hall inlet at x: -45.0, y: 5.2
    const penstockZCoords = [72.5, 77.0, 81.5, 86.0];
    const penstockDiameter = 2.4;
    const penstockLength = 20.8;

    penstockZCoords.forEach((z, idx) => {
      // Cylindrical Conduit
      const penstock = MeshBuilder.CreateCylinder(
        `hydroPenstock_${idx}`,
        { diameter: penstockDiameter, height: penstockLength, tessellation: 20 },
        this.scene
      );
      // Sloped downward along X axis (dx ~ 14.8m, dy ~ -14.6m = ~44.6 degree angle)
      penstock.rotation.z = 0.785; // Math.PI / 4 = 45°
      penstock.position = new Vector3(-52.4, 12.5, z);
      penstock.material = this.materials.powerPlantSteelMat;
      penstock.parent = this.rootNode;

      // Stiffener Ring Girders along the tube
      for (let r = -2; r <= 2; r++) {
        const ring = MeshBuilder.CreateTorus(
          `penstockRing_${idx}_${r}`,
          { diameter: penstockDiameter + 0.35, thickness: 0.18, tessellation: 16 },
          this.scene
        );
        ring.rotation.z = 0.785;
        const ringOffset = r * 3.6;
        ring.position = new Vector3(
          -52.4 + ringOffset * 0.707,
          12.5 - ringOffset * 0.707,
          z
        );
        ring.material = this.materials.powerPlantSteelMat;
        ring.parent = this.rootNode;
      }

      // Reinforced Concrete Saddle Anchor Blocks Supporting Penstock
      [-1, 1].forEach((saddlePos, sIdx) => {
        const sX = -52.4 + saddlePos * 4.2;
        const sY = 12.5 - saddlePos * 4.2 - 1.4;
        const saddle = MeshBuilder.CreateBox(
          `penstockSaddle_${idx}_${sIdx}`,
          { width: 2.2, height: 3.2, depth: 3.2 },
          this.scene
        );
        saddle.position = new Vector3(sX, sY, z);
        saddle.material = this.materials.concreteMat;
        saddle.parent = this.rootNode;
      });

      // Intake Collar Portals on Dam Face
      const intakeCollar = MeshBuilder.CreateCylinder(
        `penstockCollar_${idx}`,
        { diameter: penstockDiameter + 1.2, height: 1.8, tessellation: 16 },
        this.scene
      );
      intakeCollar.rotation.z = 0.785;
      intakeCollar.position = new Vector3(-59.8, 19.8, z);
      intakeCollar.material = this.materials.concreteMat;
      intakeCollar.parent = this.rootNode;
    });
  }

  /**
   * 6. Upstream Reservoir Intake Towers & Safety Boom
   */
  private buildUpstreamIntakeStructures(crestY: number): void {
    const intakeZCoords = [76, 88];

    intakeZCoords.forEach((z, idx) => {
      // Hexagonal Concrete Water Intake Tower
      const towerHeight = 27;
      const tower = MeshBuilder.CreateCylinder(
        `intakeTower_${idx}`,
        {
          diameterBottom: 6.5,
          diameterTop: 5.2,
          height: towerHeight,
          tessellation: 6,
        },
        this.scene
      );
      tower.position = new Vector3(-78.5, this.baseToeY + towerHeight / 2, z);
      tower.material = this.materials.concreteMat;
      tower.parent = this.rootNode;

      // Trash Rack Louvers on Reservoir Side (-X)
      const trashRack = MeshBuilder.CreateBox(
        `trashRack_${idx}`,
        { width: 1.2, height: 14, depth: 4.8 },
        this.scene
      );
      trashRack.position = new Vector3(-81.5, this.baseToeY + 9, z);
      trashRack.material = this.materials.powerPlantSteelMat;
      trashRack.parent = this.rootNode;

      // Intake Gate Operating House atop tower
      const gateHouse = MeshBuilder.CreateBox(
        `intakeGateHouse_${idx}`,
        { width: 4.8, height: 3.6, depth: 4.8 },
        this.scene
      );
      gateHouse.position = new Vector3(-78.5, crestY + 2.0, z);
      gateHouse.material = this.materials.powerPlantConcreteMat;
      gateHouse.parent = this.rootNode;

      // Steel Truss Pedestrian Bridge from Dam Crest to Intake Tower
      const bridge = MeshBuilder.CreateBox(
        `intakeBridge_${idx}`,
        { width: 11.5, height: 1.4, depth: 2.2 },
        this.scene
      );
      bridge.position = new Vector3(-71.5, crestY + 0.6, z);
      bridge.material = this.materials.powerPlantSteelMat;
      bridge.parent = this.rootNode;
    });

    // Floating Reservoir Safety Boom Line (Yellow Warning Buoys)
    for (let b = 0; b < 16; b++) {
      const bZ = 68 + b * 4.4;
      const buoy = MeshBuilder.CreateSphere(
        `warningBuoy_${b}`,
        { diameter: 1.1, segments: 8 },
        this.scene
      );
      buoy.position = new Vector3(-92.0, 23.6, bZ);
      buoy.material = this.materials.safetyYellowMat;
      buoy.parent = this.rootNode;
    }
  }

  /**
   * 7. Step-Up Transformer Switchyard Deck
   */
  private buildTransformerSwitchyard(): void {
    // Switchyard deck south of powerhouse: x: -44 to -30, z: 54 to 65
    const yardRoot = new TransformNode('hydroSwitchyardRoot', this.scene);
    yardRoot.position = new Vector3(-37.0, this.baseToeY, 59.0);
    yardRoot.parent = this.rootNode;

    // Concrete Switchyard Pad
    const yardPad = MeshBuilder.CreateBox(
      'swYardPad',
      { width: 13.0, height: 0.8, depth: 13.0 },
      this.scene
    );
    yardPad.position.y = 0.4;
    yardPad.material = this.materials.concreteMat;
    yardPad.parent = yardRoot;

    // 3 Generator Step-Up Transformers
    for (let tx = 0; tx < 3; tx++) {
      const zOffset = -4.0 + tx * 4.0;

      // Transformer Tank Body
      const tank = MeshBuilder.CreateBox(
        `hydroTxTank_${tx}`,
        { width: 3.2, height: 3.4, depth: 2.8 },
        this.scene
      );
      tank.position = new Vector3(-2.0, 2.5, zOffset);
      tank.material = this.materials.powerPlantSteelMat;
      tank.parent = yardRoot;

      // Cooling Radiator Fins
      const radiator = MeshBuilder.CreateBox(
        `hydroTxRad_${tx}`,
        { width: 0.6, height: 2.8, depth: 2.4 },
        this.scene
      );
      radiator.position = new Vector3(-4.0, 2.4, zOffset);
      radiator.material = this.materials.pylonSteelMat;
      radiator.parent = yardRoot;

      // Ceramic High-Voltage Bushings on Top
      for (let b = -1; b <= 1; b++) {
        const bushing = MeshBuilder.CreateCylinder(
          `txBushing_${tx}_${b}`,
          { diameterBottom: 0.35, diameterTop: 0.12, height: 1.8 },
          this.scene
        );
        bushing.position = new Vector3(-2.0, 4.8, zOffset + b * 0.9);
        bushing.material = this.materials.houseWallBrickMat;
        bushing.parent = yardRoot;
      }
    }

    // Steel Lattice Takeoff Gantry
    const takeoffGantry = MeshBuilder.CreateBox(
      'swTakeoffGantry',
      { width: 0.8, height: 8.5, depth: 11.5 },
      this.scene
    );
    takeoffGantry.position = new Vector3(4.2, 5.0, 0);
    takeoffGantry.material = this.materials.pylonSteelMat;
    takeoffGantry.parent = yardRoot;
  }

  public registerShadows(shadowGenerator: ShadowGenerator): void {
    this.scene.meshes.forEach((mesh) => {
      if (
        mesh.name.startsWith('damUpstreamCore') ||
        mesh.name.startsWith('damTier_') ||
        mesh.name.startsWith('damWingWall_') ||
        mesh.name.startsWith('phMainHallBody') ||
        mesh.name.startsWith('phSubstructure') ||
        mesh.name.startsWith('phPilaster_') ||
        mesh.name.startsWith('phWestRoofPlane') ||
        mesh.name.startsWith('phEastRoofPlane') ||
        mesh.name.startsWith('phGableWall_') ||
        mesh.name.startsWith('phClerestoryMonitor') ||
        mesh.name.startsWith('phGantryBridge') ||
        mesh.name.startsWith('phControlAnnex') ||
        mesh.name.startsWith('phThrustBlock_') ||
        mesh.name.startsWith('hydroPenstock_') ||
        mesh.name.startsWith('intakeTower_') ||
        mesh.name.startsWith('spillwayPier_') ||
        mesh.name.startsWith('hydroTxTank_')
      ) {
        shadowGenerator.addShadowCaster(mesh);
        mesh.receiveShadows = true;
      }
    });
  }
}
