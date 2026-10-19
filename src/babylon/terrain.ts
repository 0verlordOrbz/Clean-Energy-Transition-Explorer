import {
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
  VertexData,
  ShadowGenerator,
} from '@babylonjs/core';
import { MaterialManager } from './materials';

export class TerrainManager {
  private scene: Scene;
  private materials: MaterialManager;
  public groundMesh!: Mesh;
  public reservoirWaterMesh!: Mesh;
  public riverWaterMesh!: Mesh;

  constructor(scene: Scene, materials: MaterialManager) {
    this.scene = scene;
    this.materials = materials;
    this.buildTerrain();
    this.buildWaters();
    this.buildRoads();
  }

  /**
   * Analytical terrain height function for landscape generation and camera collision
   */
  public getHeightAt(x: number, z: number): number {
    // Distance to borders for perimeter mountain ranges
    const edgeDistX = Math.max(0, Math.abs(x) - 150);
    const edgeDistZ = Math.max(0, Math.abs(z) - 150);
    const borderDist = Math.sqrt(edgeDistX * edgeDistX + edgeDistZ * edgeDistZ);
    let borderHeight = 0;
    if (borderDist > 0) {
      borderHeight = Math.min(48, Math.pow(borderDist * 0.55, 1.3));
    }

    // 1. Highland Plateau (North-West, Hydro Reservoir area)
    const plateauCenter = { x: -115, z: 120 };
    const pDist = Math.hypot(x - plateauCenter.x, z - plateauCenter.z);
    let plateauHeight = 0;
    if (pDist < 85) {
      const t = Math.max(0, 1 - pDist / 85);
      plateauHeight = 28 * Math.sin(t * Math.PI * 0.5);

      // Carve reservoir basin in the plateau
      const basinDist = Math.hypot(x - (-105), z - 120);
      if (basinDist < 45) {
        const basinFactor = Math.cos((basinDist / 45) * Math.PI * 0.5);
        plateauHeight -= basinFactor * 10;
      }
    }

    // 2. Wind Ridge (West mountain spine)
    const ridgeDistX = Math.abs(x - (-135));
    let ridgeHeight = 0;
    if (ridgeDistX < 40 && z > -70 && z < 45) {
      const xFactor = Math.cos((ridgeDistX / 40) * Math.PI * 0.5);
      const zFactor = Math.sin(((z - (-70)) / 115) * Math.PI);
      ridgeHeight = 24 * xFactor * Math.max(0.2, zFactor);
    }

    // 3. River Canyon Trench (cuts from Dam down to South-East)
    // River centerline approximation: curve from (-65, 95) -> (-35, 45) -> (-10, 5) -> (25, -45) -> (85, -100) -> (140, -150)
    const riverDist = this.getDistanceToRiver(x, z);
    let riverCut = 0;
    if (riverDist < 18) {
      const rf = Math.cos((riverDist / 18) * Math.PI * 0.5);
      riverCut = 4.2 * rf;
    }

    // 4. Base rolling hills noise
    const roll =
      Math.sin(x * 0.035) * 2.2 +
      Math.cos(z * 0.03) * 2.0 +
      Math.sin((x + z) * 0.06) * 1.2;

    // Base valley height
    const baseHeight = 5.5 + roll;

    let finalHeight = baseHeight + plateauHeight + ridgeHeight + borderHeight - riverCut;

    // Flat zones for town and solar farm
    // Town zone (x: 10 to 75, z: 60 to 125)
    const townDist = Math.hypot(x - 42, z - 92);
    if (townDist < 45) {
      const tf = Math.cos((townDist / 45) * Math.PI * 0.5);
      finalHeight = finalHeight * (1 - tf * 0.75) + 6.8 * (tf * 0.75);
    }

    // Solar farm zone (x: 55 to 135, z: -25 to 35)
    const solarDist = Math.hypot(x - 95, z - 5);
    if (solarDist < 48) {
      const sf = Math.cos((solarDist / 48) * Math.PI * 0.5);
      finalHeight = finalHeight * (1 - sf * 0.8) + 5.0 * (sf * 0.8);
    }

    // Conventional Plant flat pad (x: 95 to 165, z: -110 to -45)
    const plantDist = Math.hypot(x - 128, z - (-78));
    if (plantDist < 48) {
      const pf = Math.cos((plantDist / 48) * Math.PI * 0.5);
      finalHeight = finalHeight * (1 - pf * 0.9) + 4.0 * (pf * 0.9);
    }

    return Math.max(0.5, finalHeight);
  }

  private getDistanceToRiver(x: number, z: number): number {
    // 6 waypoint segments
    const pts = [
      { x: -70, z: 100 },
      { x: -45, z: 65 },
      { x: -20, z: 30 },
      { x: 10, z: -15 },
      { x: 50, z: -65 },
      { x: 95, z: -115 },
      { x: 145, z: -155 },
    ];

    let minDist = 999;
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const lenSq = dx * dx + dz * dz;
      let t = ((x - p1.x) * dx + (z - p1.z) * dz) / lenSq;
      t = Math.max(0, Math.min(1, t));
      const projX = p1.x + t * dx;
      const projZ = p1.z + t * dz;
      const dist = Math.hypot(x - projX, z - projZ);
      if (dist < minDist) minDist = dist;
    }
    return minDist;
  }

  private buildTerrain(): void {
    const size = 380;
    const subdivisions = 120;

    this.groundMesh = MeshBuilder.CreateGround(
      'terrain',
      { width: size, height: size, subdivisions: subdivisions, updatable: true },
      this.scene
    );

    const positions = this.groundMesh.getVerticesData(
      BABYLON_POSITION_KIND
    );

    if (positions) {
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] = this.getHeightAt(x, z);
      }
      this.groundMesh.setVerticesData(BABYLON_POSITION_KIND, positions);

      // Recompute vertex normals for smooth shading
      const normals: number[] = [];
      const indices = this.groundMesh.getIndices();
      if (indices) {
        VertexData.ComputeNormals(positions, indices, normals);
        this.groundMesh.setVerticesData(BABYLON_NORMAL_KIND, normals);
      }
    }

    this.groundMesh.material = this.materials.terrainMat;
    this.groundMesh.receiveShadows = true;
    this.groundMesh.checkCollisions = true;
  }

  private buildWaters(): void {
    // 1. Upper Reservoir Lake behind dam
    this.reservoirWaterMesh = MeshBuilder.CreateDisc(
      'reservoirWater',
      { radius: 42, tessellation: 48 },
      this.scene
    );
    this.reservoirWaterMesh.rotation.x = Math.PI / 2;
    this.reservoirWaterMesh.position = new Vector3(-105, 23.5, 122);
    this.reservoirWaterMesh.material = this.materials.lakeWaterMat;

    // 2. Downstream River Ribbon
    // Starts right at the hydroelectric powerhouse tailrace apron
    const riverCenterline = [
      new Vector3(-35, 2.5, 88),
      new Vector3(-26, 2.8, 55),
      new Vector3(-18, 3.0, 20),
      new Vector3(8, 2.7, -15),
      new Vector3(42, 2.4, -58),
      new Vector3(82, 2.1, -104),
      new Vector3(122, 1.8, -142),
      new Vector3(160, 1.5, -172),
    ];

    const leftBank: Vector3[] = [];
    const rightBank: Vector3[] = [];
    const halfWidth = 8.5;

    for (let i = 0; i < riverCenterline.length; i++) {
      const cur = riverCenterline[i];
      let tangent = Vector3.Zero();

      if (i === 0) {
        tangent = riverCenterline[1].subtract(cur).normalize();
      } else if (i === riverCenterline.length - 1) {
        tangent = cur.subtract(riverCenterline[i - 1]).normalize();
      } else {
        tangent = riverCenterline[i + 1].subtract(riverCenterline[i - 1]).normalize();
      }

      // Perpendicular vector on XZ plane
      const normal = new Vector3(-tangent.z, 0, tangent.x).normalize();

      leftBank.push(cur.add(normal.scale(halfWidth)));
      rightBank.push(cur.subtract(normal.scale(halfWidth)));
    }

    this.riverWaterMesh = MeshBuilder.CreateRibbon(
      'riverMesh',
      {
        pathArray: [leftBank, rightBank],
        closeArray: false,
        closePath: false,
      },
      this.scene
    );
    this.riverWaterMesh.material = this.materials.riverWaterMat;
  }

  private buildRoads(): void {
    // Road from Town to Solar Farm & Wind Ridge & Dam
    const roadPoints = [
      // From town center
      new Vector3(40, 0, 90),
      new Vector3(20, 0, 75),
      new Vector3(0, 0, 60),
      new Vector3(-15, 0, 45),
      // Branch toward wind ridge & dam
      new Vector3(-35, 0, 30),
      new Vector3(-70, 0, 20),
      new Vector3(-105, 0, 15),
    ];

    // Align Y with terrain
    const adjustedPoints = roadPoints.map((pt) => {
      const h = this.getHeightAt(pt.x, pt.z);
      return new Vector3(pt.x, h + 0.1, pt.z);
    });

    const roadMesh = MeshBuilder.CreateTube(
      'mainHighway',
      {
        path: adjustedPoints,
        radius: 3.5,
        tessellation: 8,
        sideOrientation: Mesh.DOUBLESIDE,
      },
      this.scene
    );
    // Flatten tube into a road ribbon profile
    roadMesh.scaling = new Vector3(1, 0.04, 1);
    roadMesh.material = this.materials.roadMat;
    roadMesh.receiveShadows = true;

    // Road 2: From Town south to Solar Farm and Thermal Plant
    const southRoad = [
      new Vector3(45, 0, 75),
      new Vector3(55, 0, 45),
      new Vector3(70, 0, 15),
      new Vector3(85, 0, -20),
      new Vector3(100, 0, -60),
      new Vector3(120, 0, -100),
    ];

    const adjustedSouth = southRoad.map((pt) => {
      const h = this.getHeightAt(pt.x, pt.z);
      return new Vector3(pt.x, h + 0.1, pt.z);
    });

    const southRoadMesh = MeshBuilder.CreateTube(
      'southHighway',
      {
        path: adjustedSouth,
        radius: 3.2,
        tessellation: 8,
        sideOrientation: Mesh.DOUBLESIDE,
      },
      this.scene
    );
    southRoadMesh.scaling = new Vector3(1, 0.04, 1);
    southRoadMesh.material = this.materials.roadMat;
    southRoadMesh.receiveShadows = true;
  }

  public registerShadows(shadowGenerator: ShadowGenerator): void {
    // Terrain receives shadows; objects cast
    this.groundMesh.receiveShadows = true;
  }
}

const BABYLON_POSITION_KIND = 'position';
const BABYLON_NORMAL_KIND = 'normal';
