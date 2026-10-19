import {
  Scene,
  StandardMaterial,
  Color3,
  DynamicTexture,
  Texture,
} from '@babylonjs/core';

export class MaterialManager {
  private scene: Scene;
  public terrainMat!: StandardMaterial;
  public riverWaterMat!: StandardMaterial;
  public lakeWaterMat!: StandardMaterial;
  public concreteMat!: StandardMaterial;
  public solarPanelMat!: StandardMaterial;
  public solarFrameMat!: StandardMaterial;
  public solarBacksheetMat!: StandardMaterial;
  public turbineBodyMat!: StandardMaterial;
  public turbineBladeMat!: StandardMaterial;
  public turbineStripeMat!: StandardMaterial;
  public roadMat!: StandardMaterial;
  public houseWallWhiteMat!: StandardMaterial;
  public houseWallWoodMat!: StandardMaterial;
  public houseWallBrickMat!: StandardMaterial;
  public roofTileMat!: StandardMaterial;
  public roofSlateMat!: StandardMaterial;
  public windowGlassMat!: StandardMaterial;
  public windowLitMat!: StandardMaterial;
  public powerPlantConcreteMat!: StandardMaterial;
  public powerPlantSteelMat!: StandardMaterial;
  public chimneyRedMat!: StandardMaterial;
  public chimneyWhiteMat!: StandardMaterial;
  public pylonSteelMat!: StandardMaterial;
  public treeTrunkMat!: StandardMaterial;
  public treeFoliageMat!: StandardMaterial;
  public pineFoliageMat!: StandardMaterial;
  public beaconGlowMat!: StandardMaterial;
  public foamWaterMat!: StandardMaterial;
  public safetyYellowMat!: StandardMaterial;

  constructor(scene: Scene) {
    this.scene = scene;
    this.initMaterials();
  }

  private createSolarTexture(): DynamicTexture {
    const texture = new DynamicTexture('solarTex', 1024, this.scene, true);
    const ctx = texture.getContext() as CanvasRenderingContext2D;

    // Dark crystalline navy-indigo anti-reflective silicon base
    ctx.fillStyle = '#081426';
    ctx.fillRect(0, 0, 1024, 1024);

    // Multi-stage anti-reflective optical gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
    grad.addColorStop(0, 'rgba(30, 80, 160, 0.45)');
    grad.addColorStop(0.5, 'rgba(12, 36, 74, 0.75)');
    grad.addColorStop(1, 'rgba(6, 18, 40, 0.9)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Grid of monocrystalline solar cells: 6 columns x 10 rows
    const cols = 6;
    const rows = 10;
    const cellW = 1024 / cols;
    const cellH = 1024 / rows;
    const padding = 3;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * cellW + padding;
        const y = r * cellH + padding;
        const w = cellW - padding * 2;
        const h = cellH - padding * 2;

        // Monocrystalline pseudo-square cell with chamfered/rounded corners
        ctx.fillStyle = '#0b203c';
        ctx.fillRect(x, y, w, h);

        // Micro-texture for crystalline silicon texture
        ctx.fillStyle = 'rgba(40, 95, 175, 0.2)';
        ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

        // Thin silver fingers (horizontal lines across each wafer)
        ctx.strokeStyle = 'rgba(160, 200, 255, 0.35)';
        ctx.lineWidth = 1;
        const numFingers = 8;
        for (let f = 1; f < numFingers; f++) {
          const fy = y + (h / numFingers) * f;
          ctx.beginPath();
          ctx.moveTo(x + 2, fy);
          ctx.lineTo(x + w - 2, fy);
          ctx.stroke();
        }

        // 3 Silver primary busbars (vertical lines)
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.5;
        const busbars = [0.22, 0.5, 0.78];
        busbars.forEach((bbRatio) => {
          const bx = x + w * bbRatio;
          ctx.beginPath();
          ctx.moveTo(bx, y + 1);
          ctx.lineTo(bx, y + h - 1);
          ctx.stroke();
        });

        // Cell border outline
        ctx.strokeStyle = 'rgba(70, 120, 190, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(x, y, w, h);
      }
    }

    // Outer anodized aluminum frame border
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, 1012, 1012);

    // Inner bevel shadow
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(14, 14, 996, 996);

    texture.update();
    return texture;
  }

  private createRoadTexture(): DynamicTexture {
    const texture = new DynamicTexture('roadTex', 256, this.scene, true);
    const ctx = texture.getContext() as CanvasRenderingContext2D;

    // Dark asphalt
    ctx.fillStyle = '#262930';
    ctx.fillRect(0, 0, 256, 256);

    // Asphalt noise grain
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const shade = Math.floor(Math.random() * 40 + 30);
      ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Yellow center divider dashed line
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(124, 20, 8, 80);
    ctx.fillRect(124, 150, 8, 80);

    // White edge lines
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(8, 0, 6, 256);
    ctx.fillRect(242, 0, 6, 256);

    texture.update();
    return texture;
  }

  private createTerrainTexture(): DynamicTexture {
    const texture = new DynamicTexture('terrainTex', 1024, this.scene, true);
    const ctx = texture.getContext() as CanvasRenderingContext2D;

    // Base rich meadow green
    ctx.fillStyle = '#3f6228';
    ctx.fillRect(0, 0, 1024, 1024);

    // Grass texture variations
    for (let i = 0; i < 15000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const r = Math.floor(45 + Math.random() * 30);
      const g = Math.floor(85 + Math.random() * 45);
      const b = Math.floor(25 + Math.random() * 20);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
      ctx.fillRect(x, y, 4, 4);
    }

    // Rocky outcrops/soil patches
    for (let i = 0; i < 40; i++) {
      const cx = Math.random() * 1024;
      const cy = Math.random() * 1024;
      const radius = 15 + Math.random() * 40;
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
      grad.addColorStop(0, 'rgba(100, 90, 75, 0.4)');
      grad.addColorStop(1, 'rgba(63, 98, 40, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    texture.update();
    return texture;
  }

  private initMaterials(): void {
    // Terrain
    this.terrainMat = new StandardMaterial('terrainMat', this.scene);
    this.terrainMat.diffuseColor = new Color3(0.38, 0.58, 0.25);
    const terrainTex = this.createTerrainTexture();
    terrainTex.uScale = 8;
    terrainTex.vScale = 8;
    this.terrainMat.diffuseTexture = terrainTex;
    this.terrainMat.specularColor = new Color3(0.05, 0.08, 0.04);
    this.terrainMat.roughness = 0.9;

    // River Water
    this.riverWaterMat = new StandardMaterial('riverWaterMat', this.scene);
    this.riverWaterMat.diffuseColor = new Color3(0.12, 0.42, 0.58);
    this.riverWaterMat.specularColor = new Color3(0.9, 0.95, 1.0);
    this.riverWaterMat.specularPower = 64;
    this.riverWaterMat.alpha = 0.88;

    // Lake / Reservoir Water
    this.lakeWaterMat = new StandardMaterial('lakeWaterMat', this.scene);
    this.lakeWaterMat.diffuseColor = new Color3(0.08, 0.32, 0.48);
    this.lakeWaterMat.specularColor = new Color3(0.95, 0.98, 1.0);
    this.lakeWaterMat.specularPower = 96;
    this.lakeWaterMat.alpha = 0.92;

    // Concrete (Dam, cooling towers, foundations)
    this.concreteMat = new StandardMaterial('concreteMat', this.scene);
    this.concreteMat.diffuseColor = new Color3(0.68, 0.7, 0.72);
    this.concreteMat.specularColor = new Color3(0.15, 0.15, 0.16);

    // Solar Panel
    this.solarPanelMat = new StandardMaterial('solarPanelMat', this.scene);
    this.solarPanelMat.diffuseTexture = this.createSolarTexture();
    this.solarPanelMat.specularColor = new Color3(0.4, 0.6, 0.9);
    this.solarPanelMat.specularPower = 64;

    this.solarFrameMat = new StandardMaterial('solarFrameMat', this.scene);
    this.solarFrameMat.diffuseColor = new Color3(0.35, 0.4, 0.45);
    this.solarFrameMat.specularColor = new Color3(0.5, 0.5, 0.55);

    this.solarBacksheetMat = new StandardMaterial('solarBacksheetMat', this.scene);
    this.solarBacksheetMat.diffuseColor = new Color3(0.88, 0.9, 0.92);
    this.solarBacksheetMat.specularColor = new Color3(0.1, 0.1, 0.1);

    // Wind Turbine
    this.turbineBodyMat = new StandardMaterial('turbineBodyMat', this.scene);
    this.turbineBodyMat.diffuseColor = new Color3(0.92, 0.94, 0.96);
    this.turbineBodyMat.specularColor = new Color3(0.3, 0.3, 0.35);

    this.turbineBladeMat = new StandardMaterial('turbineBladeMat', this.scene);
    this.turbineBladeMat.diffuseColor = new Color3(0.95, 0.96, 0.98);
    this.turbineBladeMat.specularColor = new Color3(0.2, 0.2, 0.25);

    this.turbineStripeMat = new StandardMaterial('turbineStripeMat', this.scene);
    this.turbineStripeMat.diffuseColor = new Color3(0.85, 0.15, 0.15);
    this.turbineStripeMat.specularColor = new Color3(0.2, 0.2, 0.2);

    // Roads
    this.roadMat = new StandardMaterial('roadMat', this.scene);
    const roadTex = this.createRoadTexture();
    roadTex.uScale = 1;
    roadTex.vScale = 12;
    this.roadMat.diffuseTexture = roadTex;
    this.roadMat.specularColor = new Color3(0.1, 0.1, 0.1);

    // Town Building Walls
    this.houseWallWhiteMat = new StandardMaterial('wallWhite', this.scene);
    this.houseWallWhiteMat.diffuseColor = new Color3(0.92, 0.91, 0.88);

    this.houseWallWoodMat = new StandardMaterial('wallWood', this.scene);
    this.houseWallWoodMat.diffuseColor = new Color3(0.65, 0.48, 0.32);

    this.houseWallBrickMat = new StandardMaterial('wallBrick', this.scene);
    this.houseWallBrickMat.diffuseColor = new Color3(0.72, 0.35, 0.25);

    // Roofs
    this.roofTileMat = new StandardMaterial('roofTile', this.scene);
    this.roofTileMat.diffuseColor = new Color3(0.78, 0.28, 0.18);

    this.roofSlateMat = new StandardMaterial('roofSlate', this.scene);
    this.roofSlateMat.diffuseColor = new Color3(0.28, 0.32, 0.38);

    // Windows
    this.windowGlassMat = new StandardMaterial('windowGlass', this.scene);
    this.windowGlassMat.diffuseColor = new Color3(0.2, 0.35, 0.5);
    this.windowGlassMat.specularColor = new Color3(0.8, 0.9, 1.0);
    this.windowGlassMat.specularPower = 64;

    this.windowLitMat = new StandardMaterial('windowLit', this.scene);
    this.windowLitMat.diffuseColor = new Color3(1.0, 0.88, 0.55);
    this.windowLitMat.emissiveColor = new Color3(0.8, 0.65, 0.3);

    // Conventional Power Plant
    this.powerPlantConcreteMat = new StandardMaterial('plantConcrete', this.scene);
    this.powerPlantConcreteMat.diffuseColor = new Color3(0.48, 0.5, 0.53);
    this.powerPlantConcreteMat.specularColor = new Color3(0.1, 0.1, 0.1);

    this.powerPlantSteelMat = new StandardMaterial('plantSteel', this.scene);
    this.powerPlantSteelMat.diffuseColor = new Color3(0.28, 0.3, 0.34);
    this.powerPlantSteelMat.specularColor = new Color3(0.5, 0.5, 0.55);

    this.chimneyRedMat = new StandardMaterial('chimneyRed', this.scene);
    this.chimneyRedMat.diffuseColor = new Color3(0.82, 0.2, 0.15);

    this.chimneyWhiteMat = new StandardMaterial('chimneyWhite', this.scene);
    this.chimneyWhiteMat.diffuseColor = new Color3(0.9, 0.92, 0.94);

    // Transmission Pylons
    this.pylonSteelMat = new StandardMaterial('pylonSteel', this.scene);
    this.pylonSteelMat.diffuseColor = new Color3(0.4, 0.44, 0.48);
    this.pylonSteelMat.specularColor = new Color3(0.3, 0.3, 0.35);

    // Foliage & Trees
    this.treeTrunkMat = new StandardMaterial('treeTrunk', this.scene);
    this.treeTrunkMat.diffuseColor = new Color3(0.38, 0.25, 0.16);

    this.treeFoliageMat = new StandardMaterial('treeFoliage', this.scene);
    this.treeFoliageMat.diffuseColor = new Color3(0.24, 0.55, 0.2);

    this.pineFoliageMat = new StandardMaterial('pineFoliage', this.scene);
    this.pineFoliageMat.diffuseColor = new Color3(0.14, 0.38, 0.22);

    // Safety Beacons (Turbines & Smokestacks)
    this.beaconGlowMat = new StandardMaterial('beaconGlow', this.scene);
    this.beaconGlowMat.diffuseColor = new Color3(1.0, 0.1, 0.1);
    this.beaconGlowMat.emissiveColor = new Color3(1.0, 0.2, 0.2);

    // Frothy Aerated Water (Spillway chute & tailrace discharge)
    this.foamWaterMat = new StandardMaterial('foamWaterMat', this.scene);
    this.foamWaterMat.diffuseColor = new Color3(0.72, 0.9, 0.98);
    this.foamWaterMat.specularColor = new Color3(1.0, 1.0, 1.0);
    this.foamWaterMat.specularPower = 32;
    this.foamWaterMat.alpha = 0.92;

    // Industrial Safety Yellow (Cranes, gates, handrails)
    this.safetyYellowMat = new StandardMaterial('safetyYellowMat', this.scene);
    this.safetyYellowMat.diffuseColor = new Color3(0.95, 0.72, 0.08);
    this.safetyYellowMat.specularColor = new Color3(0.3, 0.3, 0.3);
  }
}
