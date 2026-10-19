import {
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
  Color4,
  ParticleSystem,
  DynamicTexture,
  ShadowGenerator,
  TransformNode,
} from '@babylonjs/core';
import { MaterialManager } from '../materials';
import { TerrainManager } from '../terrain';

export class PowerPlantManager {
  private scene: Scene;
  private materials: MaterialManager;
  private terrain: TerrainManager;
  public rootNode: TransformNode;
  private particleSystems: ParticleSystem[] = [];

  constructor(scene: Scene, materials: MaterialManager, terrain: TerrainManager) {
    this.scene = scene;
    this.materials = materials;
    this.terrain = terrain;
    this.rootNode = new TransformNode('powerPlantRoot', this.scene);
    this.buildPowerPlant();
  }

  private buildPowerPlant(): void {
    // Plant center location: x: 128, z: -78 on flat industrial riverbank terrace
    const plantOrigin = new Vector3(128, 4.0, -78);

    // 1. Concrete Foundation Plinth
    const plinth = MeshBuilder.CreateBox(
      'plantPlinth',
      { width: 64, height: 0.8, depth: 58 },
      this.scene
    );
    plinth.position = new Vector3(plantOrigin.x, plantOrigin.y + 0.4, plantOrigin.z);
    plinth.material = this.materials.concreteMat;
    plinth.parent = this.rootNode;

    // 2. Twin Hyperbolic Cooling Towers
    // Constructed via tiered cylinders to produce the iconic hyperbolic pinched profile
    this.createCoolingTower(plantOrigin.x - 16, plantOrigin.z - 14, 'coolingTower_1', plantOrigin.y);
    this.createCoolingTower(plantOrigin.x + 16, plantOrigin.z - 14, 'coolingTower_2', plantOrigin.y);

    // 3. Main Boiler Building & Turbine Hall
    const boilerHouse = MeshBuilder.CreateBox(
      'boilerHouse',
      { width: 28, height: 22, depth: 22 },
      this.scene
    );
    boilerHouse.position = new Vector3(plantOrigin.x, plantOrigin.y + 11.4, plantOrigin.z + 12);
    boilerHouse.material = this.materials.powerPlantConcreteMat;
    boilerHouse.checkCollisions = true;
    boilerHouse.parent = this.rootNode;

    // Turbine Hall Annex
    const turbineHall = MeshBuilder.CreateBox(
      'turbineHall',
      { width: 34, height: 11, depth: 14 },
      this.scene
    );
    turbineHall.position = new Vector3(plantOrigin.x, plantOrigin.y + 5.9, plantOrigin.z + 26);
    turbineHall.material = this.materials.powerPlantSteelMat;
    turbineHall.checkCollisions = true;
    turbineHall.parent = this.rootNode;

    // Turbine Hall industrial windows
    for (let i = -3; i <= 3; i++) {
      const windowPanel = MeshBuilder.CreateBox(
        `thWin_${i}`,
        { width: 3.2, height: 6.5, depth: 0.2 },
        this.scene
      );
      windowPanel.position = new Vector3(plantOrigin.x + i * 4.4, plantOrigin.y + 6.5, plantOrigin.z + 33.1);
      windowPanel.material = this.materials.windowGlassMat;
      windowPanel.parent = this.rootNode;
    }

    // 4. Two Tall Industrial Smokestacks (Height 38m) with warning bands
    this.createSmokestack(plantOrigin.x - 8, plantOrigin.z + 1, 'smokestack_1', plantOrigin.y);
    this.createSmokestack(plantOrigin.x + 8, plantOrigin.z + 1, 'smokestack_2', plantOrigin.y);

    // 5. Fuel Storage Tanks (Cylindrical oil/gas tanks)
    for (let t = 0; t < 3; t++) {
      const tank = MeshBuilder.CreateCylinder(
        `fuelTank_${t}`,
        { diameter: 9.5, height: 7.5, tessellation: 20 },
        this.scene
      );
      tank.position = new Vector3(plantOrigin.x - 22 + t * 11, plantOrigin.y + 4.15, plantOrigin.z - 22);
      tank.material = this.materials.powerPlantSteelMat;
      tank.checkCollisions = true;
      tank.parent = this.rootNode;

      // Domed top
      const dome = MeshBuilder.CreateSphere(
        `tankDome_${t}`,
        { diameterX: 9.5, diameterY: 2.2, diameterZ: 9.5, segments: 16 },
        this.scene
      );
      dome.position = new Vector3(plantOrigin.x - 22 + t * 11, plantOrigin.y + 7.9, plantOrigin.z - 22);
      dome.material = this.materials.powerPlantSteelMat;
      dome.parent = this.rootNode;
    }

    // 6. Overhead Industrial Pipe Racks
    const pipeRack = MeshBuilder.CreateCylinder(
      'mainSteamPipe',
      { diameter: 1.2, height: 26 },
      this.scene
    );
    pipeRack.rotation.z = Math.PI / 2;
    pipeRack.position = new Vector3(plantOrigin.x, plantOrigin.y + 8.5, plantOrigin.z - 6);
    pipeRack.material = this.materials.powerPlantSteelMat;
    pipeRack.parent = this.rootNode;

    // 7. High-Voltage Substation Yard
    const plantSub = MeshBuilder.CreateBox('plantSubYard', { width: 18, height: 0.3, depth: 16 }, this.scene);
    plantSub.position = new Vector3(plantOrigin.x + 24, plantOrigin.y + 0.55, plantOrigin.z + 18);
    plantSub.material = this.materials.concreteMat;
    plantSub.parent = this.rootNode;

    for (let tx = 0; tx < 2; tx++) {
      const transformer = MeshBuilder.CreateBox(`plTx_${tx}`, { width: 3.5, height: 3.4, depth: 3.5 }, this.scene);
      transformer.position = new Vector3(plantOrigin.x + 24, plantOrigin.y + 2.25, plantOrigin.z + 13 + tx * 8);
      transformer.material = this.materials.powerPlantSteelMat;
      transformer.parent = this.rootNode;
    }

    // 8. Cooling water intake channel connecting plant plinth to the riverbank
    const canal = MeshBuilder.CreateBox('dischargeCanal', { width: 34, height: 1.2, depth: 7 }, this.scene);
    canal.position = new Vector3(plantOrigin.x - 49, plantOrigin.y - 0.2, plantOrigin.z + 8);
    canal.material = this.materials.concreteMat;
    canal.parent = this.rootNode;

    const canalWater = MeshBuilder.CreateBox('dischargeCanalWater', { width: 33, height: 0.4, depth: 5.8 }, this.scene);
    canalWater.position = new Vector3(plantOrigin.x - 49, plantOrigin.y + 0.1, plantOrigin.z + 8);
    canalWater.material = this.materials.riverWaterMat;
    canalWater.parent = this.rootNode;
  }

  private createCoolingTower(x: number, z: number, id: string, groundY: number = 4.0): void {
    const baseDiameter = 18;
    const waistDiameter = 12.5;
    const rimDiameter = 14.5;
    const towerHeight = 26;

    // Multi-segment hyperbolic profile
    // Lower taper (wide base to narrow waist)
    const lowerSection = MeshBuilder.CreateCylinder(
      `${id}_lower`,
      {
        diameterBottom: baseDiameter,
        diameterTop: waistDiameter,
        height: towerHeight * 0.65,
        tessellation: 28,
      },
      this.scene
    );
    lowerSection.position = new Vector3(x, groundY + (towerHeight * 0.65) / 2 + 0.8, z);
    lowerSection.material = this.materials.powerPlantConcreteMat;
    lowerSection.checkCollisions = true;
    lowerSection.parent = this.rootNode;

    // Upper flare (narrow waist to rim)
    const upperSection = MeshBuilder.CreateCylinder(
      `${id}_upper`,
      {
        diameterBottom: waistDiameter,
        diameterTop: rimDiameter,
        height: towerHeight * 0.35,
        tessellation: 28,
      },
      this.scene
    );
    upperSection.position = new Vector3(
      x,
      groundY + towerHeight * 0.65 + (towerHeight * 0.35) / 2 + 0.8,
      z
    );
    upperSection.material = this.materials.powerPlantConcreteMat;
    upperSection.parent = this.rootNode;

    // Top rim ring
    const rim = MeshBuilder.CreateTorus(
      `${id}_rim`,
      { diameter: rimDiameter, thickness: 0.6, tessellation: 24 },
      this.scene
    );
    rim.position = new Vector3(x, groundY + towerHeight + 0.8, z);
    rim.material = this.materials.powerPlantConcreteMat;
    rim.parent = this.rootNode;

    // Add rising steam particle system
    this.createSteamParticles(x, groundY + towerHeight + 1.2, z, `${id}_steam`);
  }

  private createSmokestack(x: number, z: number, id: string, groundY: number = 4.0): void {
    const stackHeight = 38;
    const bandHeight = stackHeight / 8;

    // Alternate Red and White safety bands
    for (let b = 0; b < 8; b++) {
      const isRed = b % 2 === 0;
      const bHeight = bandHeight;
      const dBottom = 3.6 - b * 0.22;
      const dTop = 3.6 - (b + 1) * 0.22;

      const band = MeshBuilder.CreateCylinder(
        `${id}_band_${b}`,
        {
          diameterBottom: dBottom,
          diameterTop: dTop,
          height: bHeight,
          tessellation: 20,
        },
        this.scene
      );
      band.position = new Vector3(x, groundY + b * bHeight + bHeight / 2 + 0.8, z);
      band.material = isRed ? this.materials.chimneyRedMat : this.materials.chimneyWhiteMat;
      band.parent = this.rootNode;
    }

    // Top hazard beacon
    const beacon = MeshBuilder.CreateSphere(
      `${id}_beacon`,
      { diameter: 0.6 },
      this.scene
    );
    beacon.position = new Vector3(x, groundY + stackHeight + 1.2, z);
    beacon.material = this.materials.beaconGlowMat;
    beacon.parent = this.rootNode;
  }

  private createSteamParticles(x: number, y: number, z: number, name: string): void {
    // Dynamic soft puff texture
    const tex = new DynamicTexture(`${name}_tex`, 64, this.scene, false);
    const ctx = tex.getContext() as CanvasRenderingContext2D;
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(240, 245, 255, 0.8)');
    grad.addColorStop(0.5, 'rgba(220, 230, 245, 0.4)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    tex.update();

    const emitter = MeshBuilder.CreateBox(`${name}_emitter`, { size: 0.5 }, this.scene);
    emitter.position = new Vector3(x, y, z);
    emitter.isVisible = false;
    emitter.parent = this.rootNode;

    const ps = new ParticleSystem(name, 120, this.scene);
    ps.particleTexture = tex;
    ps.emitter = emitter;
    ps.minEmitBox = new Vector3(-3, 0, -3);
    ps.maxEmitBox = new Vector3(3, 0, 3);

    ps.color1 = new Color4(0.95, 0.96, 0.98, 0.35);
    ps.color2 = new Color4(0.9, 0.92, 0.95, 0.25);
    ps.colorDead = new Color4(1.0, 1.0, 1.0, 0.0);

    ps.minSize = 5.0;
    ps.maxSize = 14.0;
    ps.minLifeTime = 3.5;
    ps.maxLifeTime = 6.0;

    ps.emitRate = 18;
    ps.blendMode = ParticleSystem.BLENDMODE_STANDARD;

    ps.gravity = new Vector3(0.1, 1.8, 0.1);
    ps.direction1 = new Vector3(-0.4, 2.2, -0.4);
    ps.direction2 = new Vector3(0.4, 2.8, 0.4);

    ps.minAngularSpeed = -0.15;
    ps.maxAngularSpeed = 0.15;

    ps.start();
    this.particleSystems.push(ps);
  }

  public registerShadows(shadowGenerator: ShadowGenerator): void {
    this.scene.meshes.forEach((mesh) => {
      if (
        mesh.name.startsWith('coolingTower_') ||
        mesh.name.startsWith('boilerHouse') ||
        mesh.name.startsWith('turbineHall') ||
        mesh.name.startsWith('smokestack_') ||
        mesh.name.startsWith('fuelTank_')
      ) {
        shadowGenerator.addShadowCaster(mesh);
        mesh.receiveShadows = true;
      }
    });
  }
}
