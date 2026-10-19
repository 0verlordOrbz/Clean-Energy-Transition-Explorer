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

export class WindTurbinesManager {
  private scene: Scene;
  private materials: MaterialManager;
  private terrain: TerrainManager;
  private rotorNodes: TransformNode[] = [];
  public rootNode: TransformNode;

  constructor(scene: Scene, materials: MaterialManager, terrain: TerrainManager) {
    this.scene = scene;
    this.materials = materials;
    this.terrain = terrain;
    this.rootNode = new TransformNode('windTurbinesRoot', this.scene);
    this.buildTurbines();
  }

  private buildTurbines(): void {
    // Array of ridge coordinates for 6 turbines
    const turbineLocations = [
      { x: -140, z: -48, rotY: 0.1 },
      { x: -135, z: -30, rotY: -0.15 },
      { x: -142, z: -10, rotY: 0.05 },
      { x: -138, z: 10, rotY: -0.1 },
      { x: -145, z: 28, rotY: 0.2 },
      { x: -130, z: 42, rotY: -0.25 },
    ];

    turbineLocations.forEach((loc, index) => {
      this.createSingleTurbine(loc.x, loc.z, loc.rotY, index);
    });
  }

  private createSingleTurbine(
    x: number,
    z: number,
    rotY: number,
    index: number
  ): void {
    const groundY = this.terrain.getHeightAt(x, z);
    const turbineRoot = new TransformNode(`turbine_${index}`, this.scene);
    turbineRoot.position = new Vector3(x, groundY, z);
    turbineRoot.rotation.y = rotY;
    turbineRoot.parent = this.rootNode;

    // 1. Concrete Foundation Octagon
    const foundation = MeshBuilder.CreateCylinder(
      `foundation_${index}`,
      { diameter: 9.5, height: 1.2, tessellation: 12 },
      this.scene
    );
    foundation.position.y = 0.6;
    foundation.material = this.materials.concreteMat;
    foundation.checkCollisions = true;
    foundation.parent = turbineRoot;

    // 2. Tapered Tubular Steel Tower (Height 36m)
    const tower = MeshBuilder.CreateCylinder(
      `tower_${index}`,
      {
        diameterBottom: 4.2,
        diameterTop: 2.4,
        height: 36,
        tessellation: 24,
      },
      this.scene
    );
    tower.position.y = 18.6;
    tower.material = this.materials.turbineBodyMat;
    tower.checkCollisions = true;
    tower.parent = turbineRoot;

    // 3. Nacelle Housing on top
    const nacelle = MeshBuilder.CreateBox(
      `nacelle_${index}`,
      { width: 3.2, height: 3.2, depth: 8.5 },
      this.scene
    );
    nacelle.position = new Vector3(0, 37.2, 1.2);
    nacelle.material = this.materials.turbineBodyMat;
    nacelle.parent = turbineRoot;

    // Rear radiator/cooling vents detail
    const nacelleRear = MeshBuilder.CreateCylinder(
      `nacelleRear_${index}`,
      { diameter: 2.8, height: 3.0, tessellation: 16 },
      this.scene
    );
    nacelleRear.rotation.x = Math.PI / 2;
    nacelleRear.position = new Vector3(0, 37.2, -3.2);
    nacelleRear.material = this.materials.turbineBodyMat;
    nacelleRear.parent = turbineRoot;

    // Aviation Red Warning Beacon on top of nacelle
    const beacon = MeshBuilder.CreateSphere(
      `beacon_${index}`,
      { diameter: 0.65, segments: 10 },
      this.scene
    );
    beacon.position = new Vector3(0, 39.2, -1.0);
    beacon.material = this.materials.beaconGlowMat;
    beacon.parent = turbineRoot;

    // Small Transformer pad near base
    const transformerBox = MeshBuilder.CreateBox(
      `txBox_${index}`,
      { width: 2.4, height: 2.0, depth: 2.2 },
      this.scene
    );
    transformerBox.position = new Vector3(4.5, 1.0, 0);
    transformerBox.material = this.materials.powerPlantSteelMat;
    transformerBox.parent = turbineRoot;

    // 4. Rotor Hub & Node for rotation
    const rotorNode = new TransformNode(`rotorNode_${index}`, this.scene);
    rotorNode.position = new Vector3(0, 37.2, 5.2);
    // Slight upward tilt (standard 5-degree tilt in real wind turbines)
    rotorNode.rotation.x = -0.08;
    rotorNode.parent = turbineRoot;
    this.rotorNodes.push(rotorNode);

    // Aerodynamic Spinner Hub Dome
    const hub = MeshBuilder.CreateSphere(
      `hub_${index}`,
      { diameterX: 2.6, diameterY: 2.6, diameterZ: 3.2, segments: 16 },
      this.scene
    );
    hub.position.z = 0.8;
    hub.material = this.materials.turbineBodyMat;
    hub.parent = rotorNode;

    // 5. Three Rotor Blades (120 degrees apart, 19m length each)
    const bladeLength = 19;
    const bladeAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];

    bladeAngles.forEach((angle, bladeIdx) => {
      const bladeHolder = new TransformNode(`bladeHolder_${index}_${bladeIdx}`, this.scene);
      bladeHolder.rotation.z = angle;
      bladeHolder.parent = rotorNode;

      // Aerodynamic tapered blade
      const blade = MeshBuilder.CreateCylinder(
        `blade_${index}_${bladeIdx}`,
        {
          diameterBottom: 1.5,
          diameterTop: 0.25,
          height: bladeLength,
          tessellation: 12,
        },
        this.scene
      );
      // Center of cylinder is at midpoint
      blade.position.y = bladeLength / 2 + 1.0;
      // Flatten into an aerodynamic airfoil profile
      blade.scaling = new Vector3(0.2, 1, 1);
      // Slight pitch angle
      blade.rotation.y = 0.22;
      blade.material = this.materials.turbineBladeMat;
      blade.parent = bladeHolder;

      // Red tip safety stripe near tip (outer 2.5m)
      const tipStripe = MeshBuilder.CreateCylinder(
        `tipStripe_${index}_${bladeIdx}`,
        {
          diameterBottom: 0.45,
          diameterTop: 0.25,
          height: 2.8,
          tessellation: 12,
        },
        this.scene
      );
      tipStripe.position.y = bladeLength - 0.4;
      tipStripe.scaling = new Vector3(0.22, 1, 1);
      tipStripe.rotation.y = 0.22;
      tipStripe.material = this.materials.turbineStripeMat;
      tipStripe.parent = bladeHolder;
    });
  }

  public updateAnimation(deltaSeconds: number): void {
    // Spin rotors smoothly (approx 12 - 16 rpm)
    const baseSpeed = 1.35;
    this.rotorNodes.forEach((node, i) => {
      // Subtle speed variations per turbine for realistic organic feel
      const turbineSpeed = baseSpeed + (i % 3) * 0.12;
      node.rotation.z += turbineSpeed * deltaSeconds;
    });
  }

  public registerShadows(shadowGenerator: ShadowGenerator): void {
    this.scene.meshes.forEach((mesh) => {
      if (
        mesh.name.startsWith('tower_') ||
        mesh.name.startsWith('nacelle_') ||
        mesh.name.startsWith('blade_') ||
        mesh.name.startsWith('hub_')
      ) {
        shadowGenerator.addShadowCaster(mesh);
        mesh.receiveShadows = true;
      }
    });
  }
}
