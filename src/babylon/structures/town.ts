import {
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
  Color3,
  StandardMaterial,
  ShadowGenerator,
  TransformNode,
} from '@babylonjs/core';
import { MaterialManager } from '../materials';
import { TerrainManager } from '../terrain';

export class TownManager {
  private scene: Scene;
  private materials: MaterialManager;
  private terrain: TerrainManager;
  public rootNode: TransformNode;

  constructor(scene: Scene, materials: MaterialManager, terrain: TerrainManager) {
    this.scene = scene;
    this.materials = materials;
    this.terrain = terrain;
    this.rootNode = new TransformNode('townRoot', this.scene);
    this.buildTown();
  }

  private buildTown(): void {
    // 1. Central Town Square & Civic Hall
    this.createTownHall(42, 95);
    this.createTownSquare(42, 80);

    // 2. Residential Houses along 2 streets
    // North Street houses
    const northHouses = [
      { x: 22, z: 108, rot: 0, style: 'white' },
      { x: 33, z: 109, rot: 0.1, style: 'wood' },
      { x: 52, z: 108, rot: -0.1, style: 'brick' },
      { x: 63, z: 106, rot: -0.15, style: 'white' },
    ];

    // South Street houses
    const southHouses = [
      { x: 18, z: 66, rot: 0.2, style: 'brick' },
      { x: 30, z: 65, rot: 0, style: 'white' },
      { x: 55, z: 66, rot: -0.1, style: 'wood' },
      { x: 68, z: 68, rot: -0.2, style: 'white' },
    ];

    // East residential lane
    const eastHouses = [
      { x: 74, z: 82, rot: Math.PI / 2, style: 'white' },
      { x: 73, z: 96, rot: Math.PI / 2, style: 'wood' },
    ];

    // West residential lane
    const westHouses = [
      { x: 12, z: 82, rot: -Math.PI / 2, style: 'wood' },
      { x: 13, z: 95, rot: -Math.PI / 2, style: 'brick' },
    ];

    [...northHouses, ...southHouses, ...eastHouses, ...westHouses].forEach((h, idx) => {
      this.createHouse(h.x, h.z, h.rot, h.style, `house_${idx}`);
    });

    // 3. EV Charging Station with parked electric vehicles
    this.createEVChargingStation(56, 80);

    // 4. Streetlights along the avenue
    this.createStreetlights();

    // 5. Trees and Green Parks
    this.createFoliage();
  }

  private createTownHall(x: number, z: number): void {
    const groundY = this.terrain.getHeightAt(x, z);
    const hallRoot = new TransformNode('townHall', this.scene);
    hallRoot.position = new Vector3(x, groundY, z);
    hallRoot.parent = this.rootNode;

    // Foundation steps
    const steps = MeshBuilder.CreateBox('thSteps', { width: 14, height: 0.6, depth: 12 }, this.scene);
    steps.position.y = 0.3;
    steps.material = this.materials.concreteMat;
    steps.checkCollisions = true;
    steps.parent = hallRoot;

    // Main 2-story building body
    const body = MeshBuilder.CreateBox('thBody', { width: 12, height: 7.5, depth: 10 }, this.scene);
    body.position.y = 4.35;
    body.material = this.materials.houseWallWhiteMat;
    body.checkCollisions = true;
    body.parent = hallRoot;

    // Classical entrance portico with 4 columns
    for (let c = -1.5; c <= 1.5; c += 1.0) {
      const col = MeshBuilder.CreateCylinder(`thCol_${c}`, { diameter: 0.45, height: 5.5 }, this.scene);
      col.position = new Vector3(c * 2.2, 3.35, -5.6);
      col.material = this.materials.concreteMat;
      col.parent = hallRoot;
    }

    // Portico pediment roof
    const pediment = MeshBuilder.CreateCylinder(
      'thPediment',
      { diameter: 8.5, height: 2.5, tessellation: 3 },
      this.scene
    );
    pediment.rotation.z = Math.PI / 2;
    pediment.rotation.x = Math.PI / 2;
    pediment.position = new Vector3(0, 6.7, -5.6);
    pediment.material = this.materials.roofSlateMat;
    pediment.parent = hallRoot;

    // Clock tower / cupola
    const cupola = MeshBuilder.CreateBox('thCupola', { width: 3.2, height: 4.5, depth: 3.2 }, this.scene);
    cupola.position = new Vector3(0, 9.8, 0);
    cupola.material = this.materials.houseWallWhiteMat;
    cupola.parent = hallRoot;

    // Cupola spire pyramid
    const spire = MeshBuilder.CreateCylinder(
      'thSpire',
      { diameterBottom: 3.6, diameterTop: 0.1, height: 3.5, tessellation: 4 },
      this.scene
    );
    spire.position = new Vector3(0, 13.5, 0);
    spire.rotation.y = Math.PI / 4;
    spire.material = this.materials.roofSlateMat;
    spire.parent = hallRoot;

    // Lit windows
    for (let w = -1; w <= 1; w++) {
      const winUpper = MeshBuilder.CreateBox(`thWinU_${w}`, { width: 1.4, height: 2.0, depth: 0.2 }, this.scene);
      winUpper.position = new Vector3(w * 3.4, 5.8, -5.1);
      winUpper.material = this.materials.windowLitMat;
      winUpper.parent = hallRoot;

      const winLower = MeshBuilder.CreateBox(`thWinL_${w}`, { width: 1.4, height: 1.8, depth: 0.2 }, this.scene);
      winLower.position = new Vector3(w * 3.4, 2.5, -5.1);
      winLower.material = this.materials.windowLitMat;
      winLower.parent = hallRoot;
    }
  }

  private createTownSquare(x: number, z: number): void {
    const groundY = this.terrain.getHeightAt(x, z);
    const plaza = MeshBuilder.CreateBox('plazaPaving', { width: 22, height: 0.2, depth: 16 }, this.scene);
    plaza.position = new Vector3(x, groundY + 0.1, z);
    plaza.material = this.materials.houseWallBrickMat;
    plaza.parent = this.rootNode;

    // Central eco fountain / globe monument
    const fountainBase = MeshBuilder.CreateCylinder('fountainBase', { diameter: 4.8, height: 0.8 }, this.scene);
    fountainBase.position = new Vector3(x, groundY + 0.5, z);
    fountainBase.material = this.materials.concreteMat;
    fountainBase.parent = this.rootNode;

    const fountainWater = MeshBuilder.CreateCylinder('fountainWater', { diameter: 4.2, height: 0.7 }, this.scene);
    fountainWater.position = new Vector3(x, groundY + 0.6, z);
    fountainWater.material = this.materials.lakeWaterMat;
    fountainWater.parent = this.rootNode;

    const globe = MeshBuilder.CreateSphere('plazaGlobe', { diameter: 1.6 }, this.scene);
    globe.position = new Vector3(x, groundY + 2.0, z);
    globe.material = this.materials.solarPanelMat;
    globe.parent = this.rootNode;
  }

  private createHouse(
    x: number,
    z: number,
    rotY: number,
    style: string,
    id: string
  ): void {
    const groundY = this.terrain.getHeightAt(x, z);
    const houseRoot = new TransformNode(id, this.scene);
    houseRoot.position = new Vector3(x, groundY, z);
    houseRoot.rotation.y = rotY;
    houseRoot.parent = this.rootNode;

    // House Body
    const width = 6.4;
    const depth = 5.2;
    const height = 3.6;

    const body = MeshBuilder.CreateBox(`${id}_body`, { width, height, depth }, this.scene);
    body.position.y = height / 2;

    if (style === 'wood') {
      body.material = this.materials.houseWallWoodMat;
    } else if (style === 'brick') {
      body.material = this.materials.houseWallBrickMat;
    } else {
      body.material = this.materials.houseWallWhiteMat;
    }
    body.checkCollisions = true;
    body.parent = houseRoot;

    // Sloped Roof (Prism)
    const roof = MeshBuilder.CreateCylinder(
      `${id}_roof`,
      { diameter: 6.8, height: width + 0.6, tessellation: 3 },
      this.scene
    );
    roof.rotation.z = Math.PI / 2;
    roof.position = new Vector3(0, height + 1.6, 0);
    roof.scaling = new Vector3(1, depth / 5.2, 1);
    roof.material = style === 'wood' ? this.materials.roofSlateMat : this.materials.roofTileMat;
    roof.parent = houseRoot;

    // Rooftop Solar Panel array on the south face of the roof!
    const solarRoof = MeshBuilder.CreateBox(
      `${id}_solarRoof`,
      { width: 3.6, height: 0.08, depth: 2.2 },
      this.scene
    );
    solarRoof.position = new Vector3(0, height + 2.1, -1.2);
    solarRoof.rotation.x = -0.55;
    solarRoof.material = this.materials.solarPanelMat;
    solarRoof.parent = houseRoot;

    // Front Door & Porch
    const door = MeshBuilder.CreateBox(`${id}_door`, { width: 1.1, height: 2.1, depth: 0.1 }, this.scene);
    door.position = new Vector3(0, 1.05, -depth / 2 - 0.05);
    door.material = this.materials.houseWallWoodMat;
    door.parent = houseRoot;

    // Windows
    const win1 = MeshBuilder.CreateBox(`${id}_win1`, { width: 1.2, height: 1.2, depth: 0.1 }, this.scene);
    win1.position = new Vector3(-1.8, 1.8, -depth / 2 - 0.05);
    win1.material = this.materials.windowLitMat;
    win1.parent = houseRoot;

    const win2 = MeshBuilder.CreateBox(`${id}_win2`, { width: 1.2, height: 1.2, depth: 0.1 }, this.scene);
    win2.position = new Vector3(1.8, 1.8, -depth / 2 - 0.05);
    win2.material = this.materials.windowLitMat;
    win2.parent = houseRoot;

    // Chimney
    const chimney = MeshBuilder.CreateBox(`${id}_chimney`, { width: 0.8, height: 2.8, depth: 0.8 }, this.scene);
    chimney.position = new Vector3(1.8, height + 2.0, 0.8);
    chimney.material = this.materials.houseWallBrickMat;
    chimney.parent = houseRoot;
  }

  private createEVChargingStation(x: number, z: number): void {
    const groundY = this.terrain.getHeightAt(x, z);
    const stationRoot = new TransformNode('evStation', this.scene);
    stationRoot.position = new Vector3(x, groundY, z);
    stationRoot.parent = this.rootNode;

    // Asphalt Parking Pad
    const pad = MeshBuilder.CreateBox('evPad', { width: 9.0, height: 0.15, depth: 7.0 }, this.scene);
    pad.position.y = 0.08;
    pad.material = this.materials.roadMat;
    pad.parent = stationRoot;

    // Solar Canopy over parking bays
    const canopyPosts = [
      new Vector3(-3.8, 1.8, -2.8),
      new Vector3(-3.8, 1.8, 2.8),
      new Vector3(3.8, 1.8, -2.8),
      new Vector3(3.8, 1.8, 2.8),
    ];
    canopyPosts.forEach((p, idx) => {
      const post = MeshBuilder.CreateCylinder(`evPost_${idx}`, { diameter: 0.25, height: 3.6 }, this.scene);
      post.position = p;
      post.material = this.materials.pylonSteelMat;
      post.checkCollisions = true;
      post.parent = stationRoot;
    });

    const canopyRoof = MeshBuilder.CreateBox('evCanopy', { width: 9.6, height: 0.2, depth: 7.6 }, this.scene);
    canopyRoof.position = new Vector3(0, 3.7, 0);
    canopyRoof.material = this.materials.solarPanelMat;
    canopyRoof.parent = stationRoot;

    // Two EV Chargers
    for (let c = -1; c <= 1; c += 2) {
      const charger = MeshBuilder.CreateBox(`evCharger_${c}`, { width: 0.6, height: 1.6, depth: 0.5 }, this.scene);
      charger.position = new Vector3(c * 2.2, 0.8, 2.8);
      charger.material = this.materials.houseWallWhiteMat;
      charger.checkCollisions = true;
      charger.parent = stationRoot;

      const screen = MeshBuilder.CreateBox(`evScreen_${c}`, { width: 0.35, height: 0.35, depth: 0.05 }, this.scene);
      screen.position = new Vector3(c * 2.2, 1.2, 2.53);
      screen.material = this.materials.windowGlassMat;
      screen.parent = stationRoot;
    }

    // Stylized EV Cars parked in bay
    this.createStylizedCar(stationRoot, new Vector3(-2.2, 0.1, 0), '#2563eb');
    this.createStylizedCar(stationRoot, new Vector3(2.2, 0.1, 0), '#10b981');
  }

  private createStylizedCar(parent: TransformNode, pos: Vector3, colorHex: string): void {
    const carMat = new StandardMaterial(`carMat_${pos.x}`, this.scene);
    carMat.diffuseColor = colorHex === '#2563eb' ? new Color3(0.15, 0.38, 0.92) : new Color3(0.06, 0.72, 0.5);

    const carRoot = new TransformNode(`car_${pos.x}`, this.scene);
    carRoot.position = pos;
    carRoot.parent = parent;

    // Lower Chassis
    const chassis = MeshBuilder.CreateBox('chassis', { width: 2.1, height: 0.7, depth: 4.2 }, this.scene);
    chassis.position.y = 0.55;
    chassis.material = carMat;
    chassis.parent = carRoot;

    // Cabin Greenhouse
    const cabin = MeshBuilder.CreateBox('cabin', { width: 1.8, height: 0.65, depth: 2.3 }, this.scene);
    cabin.position = new Vector3(0, 1.15, -0.2);
    cabin.material = this.materials.windowGlassMat;
    cabin.parent = carRoot;

    // Wheels
    const wheelPositions = [
      new Vector3(-1.1, 0.35, 1.2),
      new Vector3(1.1, 0.35, 1.2),
      new Vector3(-1.1, 0.35, -1.2),
      new Vector3(1.1, 0.35, -1.2),
    ];
    wheelPositions.forEach((wp, wIdx) => {
      const wheel = MeshBuilder.CreateCylinder(`wheel_${wIdx}`, { diameter: 0.7, height: 0.35 }, this.scene);
      wheel.rotation.z = Math.PI / 2;
      wheel.position = wp;
      wheel.material = this.materials.roadMat;
      wheel.parent = carRoot;
    });
  }

  private createStreetlights(): void {
    const lightCoords = [
      { x: 34, z: 92 },
      { x: 50, z: 92 },
      { x: 34, z: 76 },
      { x: 50, z: 76 },
      { x: 20, z: 86 },
      { x: 64, z: 86 },
    ];

    lightCoords.forEach((lc, idx) => {
      const gy = this.terrain.getHeightAt(lc.x, lc.z);
      const post = MeshBuilder.CreateCylinder(`slPost_${idx}`, { diameter: 0.18, height: 4.5 }, this.scene);
      post.position = new Vector3(lc.x, gy + 2.25, lc.z);
      post.material = this.materials.pylonSteelMat;
      post.parent = this.rootNode;

      const luminaire = MeshBuilder.CreateSphere(`slHead_${idx}`, { diameter: 0.45 }, this.scene);
      luminaire.position = new Vector3(lc.x, gy + 4.5, lc.z);
      luminaire.material = this.materials.windowLitMat;
      luminaire.parent = this.rootNode;
    });
  }

  private createFoliage(): void {
    // Clustered trees around park and residential lots
    const treeLocs = [
      { x: 26, z: 98, type: 'deciduous', s: 1.1 },
      { x: 28, z: 86, type: 'deciduous', s: 1.0 },
      { x: 58, z: 98, type: 'deciduous', s: 1.2 },
      { x: 60, z: 88, type: 'deciduous', s: 0.9 },
      { x: 42, z: 68, type: 'deciduous', s: 1.1 },
      { x: 38, z: 104, type: 'pine', s: 1.3 },
      { x: 46, z: 104, type: 'pine', s: 1.2 },
      { x: 10, z: 74, type: 'pine', s: 1.4 },
      { x: 72, z: 74, type: 'pine', s: 1.3 },
      { x: 8, z: 102, type: 'pine', s: 1.5 },
      { x: 76, z: 104, type: 'pine', s: 1.4 },
    ];

    treeLocs.forEach((t, idx) => {
      const gy = this.terrain.getHeightAt(t.x, t.z);
      const treeRoot = new TransformNode(`tree_${idx}`, this.scene);
      treeRoot.position = new Vector3(t.x, gy, t.z);
      treeRoot.scaling = new Vector3(t.s, t.s, t.s);
      treeRoot.parent = this.rootNode;

      // Trunk
      const trunk = MeshBuilder.CreateCylinder(`trunk_${idx}`, { diameter: 0.5, height: 3.5 }, this.scene);
      trunk.position.y = 1.75;
      trunk.material = this.materials.treeTrunkMat;
      trunk.parent = treeRoot;

      if (t.type === 'pine') {
        // Conical pine tree
        for (let tier = 0; tier < 3; tier++) {
          const cone = MeshBuilder.CreateCylinder(
            `pineTier_${idx}_${tier}`,
            {
              diameterBottom: 3.8 - tier * 0.9,
              diameterTop: 0.1,
              height: 2.8,
              tessellation: 8,
            },
            this.scene
          );
          cone.position.y = 3.2 + tier * 1.8;
          cone.material = this.materials.pineFoliageMat;
          cone.parent = treeRoot;
        }
      } else {
        // Deciduous round crown
        const crown = MeshBuilder.CreateSphere(
          `crown_${idx}`,
          { diameterX: 4.2, diameterY: 4.8, diameterZ: 4.2, segments: 10 },
          this.scene
        );
        crown.position.y = 4.8;
        crown.material = this.materials.treeFoliageMat;
        crown.parent = treeRoot;
      }
    });
  }

  public registerShadows(shadowGenerator: ShadowGenerator): void {
    this.scene.meshes.forEach((mesh) => {
      if (
        mesh.name.startsWith('thBody') ||
        mesh.name.startsWith('house_') ||
        mesh.name.startsWith('crown_') ||
        mesh.name.startsWith('pineTier_')
      ) {
        shadowGenerator.addShadowCaster(mesh);
        mesh.receiveShadows = true;
      }
    });
  }
}
