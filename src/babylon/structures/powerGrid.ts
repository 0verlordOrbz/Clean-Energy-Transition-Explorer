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

export class PowerGridManager {
  private scene: Scene;
  private materials: MaterialManager;
  private terrain: TerrainManager;
  public rootNode: TransformNode;

  constructor(scene: Scene, materials: MaterialManager, terrain: TerrainManager) {
    this.scene = scene;
    this.materials = materials;
    this.terrain = terrain;
    this.rootNode = new TransformNode('powerGridRoot', this.scene);
    this.buildGrid();
  }

  private buildGrid(): void {
    // Array of pylon locations forming the regional grid backbone
    const pylonLocations = [
      // Line from Hydro Dam down the valley
      new Vector3(-45, 0, 105),
      new Vector3(-20, 0, 85),
      // Central Junction pylon
      new Vector3(5, 0, 60),
      // Line to Wind Ridge
      new Vector3(-55, 0, 35),
      new Vector3(-100, 0, 15),
      // Line to Solar Farm (cleared outside panel field along north perimeter to substation)
      new Vector3(45, 0, 42),
      new Vector3(92, 0, 42),
      new Vector3(145, 0, 12),
      // Line to Thermal Power Plant
      new Vector3(55, 0, -38),
      new Vector3(105, 0, -48),
      new Vector3(152, 0, -60),
      // Distribution feeder to Town
      new Vector3(25, 0, 75),
    ];

    const pylonNodes: TransformNode[] = [];

    pylonLocations.forEach((loc, idx) => {
      const node = this.createPylon(loc.x, loc.z, idx);
      pylonNodes.push(node);
    });

    // String catenary transmission lines between key transmission corridors
    const transmissionCorridors = [
      // Dam to Junction
      [0, 1],
      [1, 2],
      // Junction to Wind Ridge
      [2, 3],
      [3, 4],
      // Junction to Solar Farm
      [2, 5],
      [5, 6],
      [6, 7],
      // Junction to Conventional Plant
      [2, 8],
      [8, 9],
      [9, 10],
      // Junction to Town Feeder
      [2, 11],
    ];

    transmissionCorridors.forEach(([fromIdx, toIdx], cIdx) => {
      const p1 = pylonLocations[fromIdx];
      const p2 = pylonLocations[toIdx];
      this.createPowerCables(p1.x, p1.z, p2.x, p2.z, `line_${cIdx}`);
    });
  }

  private createPylon(x: number, z: number, index: number): TransformNode {
    const groundY = this.terrain.getHeightAt(x, z);
    const pylonRoot = new TransformNode(`pylon_${index}`, this.scene);
    pylonRoot.position = new Vector3(x, groundY, z);
    pylonRoot.parent = this.rootNode;

    const pylonHeight = 22;

    // 4 Corner Steel Legs tapering upward
    const legSpacingBase = 4.2;
    const legSpacingTop = 1.2;

    // Center lattice mast (approximated with clean structural cylinders and crossarms)
    const mast = MeshBuilder.CreateCylinder(
      `pylonMast_${index}`,
      {
        diameterBottom: legSpacingBase,
        diameterTop: legSpacingTop,
        height: pylonHeight,
        tessellation: 4,
      },
      this.scene
    );
    mast.rotation.y = Math.PI / 4;
    mast.position.y = pylonHeight / 2;
    mast.material = this.materials.pylonSteelMat;
    mast.checkCollisions = true;
    mast.parent = pylonRoot;

    // Lower Crossarm (Width 11m)
    const crossarm1 = MeshBuilder.CreateBox(
      `pylonArm1_${index}`,
      { width: 11, height: 0.5, depth: 0.6 },
      this.scene
    );
    crossarm1.position.y = pylonHeight * 0.72;
    crossarm1.material = this.materials.pylonSteelMat;
    crossarm1.parent = pylonRoot;

    // Upper Crossarm (Width 8.5m)
    const crossarm2 = MeshBuilder.CreateBox(
      `pylonArm2_${index}`,
      { width: 8.5, height: 0.5, depth: 0.6 },
      this.scene
    );
    crossarm2.position.y = pylonHeight * 0.88;
    crossarm2.material = this.materials.pylonSteelMat;
    crossarm2.parent = pylonRoot;

    // Insulator Strings (Ceramic bells hanging from arms)
    const armWidths = [
      { y: pylonHeight * 0.72, w: 10.2 },
      { y: pylonHeight * 0.88, w: 7.8 },
    ];
    armWidths.forEach((arm, aIdx) => {
      [-1, 1].forEach((dir) => {
        const insulator = MeshBuilder.CreateCylinder(
          `ins_${index}_${aIdx}_${dir}`,
          { diameter: 0.25, height: 1.4 },
          this.scene
        );
        insulator.position = new Vector3((dir * arm.w) / 2, arm.y - 0.7, 0);
        insulator.material = this.materials.houseWallBrickMat;
        insulator.parent = pylonRoot;
      });
    });

    // Pylon Peak
    const peak = MeshBuilder.CreateCylinder(
      `pylonPeak_${index}`,
      { diameterBottom: 1.2, diameterTop: 0.1, height: 3.5, tessellation: 4 },
      this.scene
    );
    peak.position.y = pylonHeight + 1.75;
    peak.rotation.y = Math.PI / 4;
    peak.material = this.materials.pylonSteelMat;
    peak.parent = pylonRoot;

    return pylonRoot;
  }

  private createPowerCables(
    x1: number,
    z1: number,
    x2: number,
    z2: number,
    id: string
  ): void {
    const y1 = this.terrain.getHeightAt(x1, z1) + 16.5;
    const y2 = this.terrain.getHeightAt(x2, z2) + 16.5;

    // 3 phase conductors with catenary sag
    [-3.8, 0, 3.8].forEach((offset, idx) => {
      const start = new Vector3(x1 + offset * 0.6, y1, z1 + offset * 0.6);
      const end = new Vector3(x2 + offset * 0.6, y2, z2 + offset * 0.6);

      // Catenary sag curve
      const mid = Vector3.Center(start, end);
      const sag = Math.min(4.5, Vector3.Distance(start, end) * 0.05);
      mid.y -= sag;

      const path = [start, mid, end];
      const cable = MeshBuilder.CreateTube(
        `${id}_cable_${idx}`,
        { path, radius: 0.06, tessellation: 4 },
        this.scene
      );
      cable.material = this.materials.powerPlantSteelMat;
      cable.parent = this.rootNode;
    });
  }

  public registerShadows(shadowGenerator: ShadowGenerator): void {
    this.scene.meshes.forEach((mesh) => {
      if (mesh.name.startsWith('pylonMast_')) {
        shadowGenerator.addShadowCaster(mesh);
        mesh.receiveShadows = true;
      }
    });
  }
}
