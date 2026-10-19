import {
  Engine,
  Scene,
  Vector3,
  Color3,
  Color4,
  HemisphericLight,
  DirectionalLight,
  ShadowGenerator,
  UniversalCamera,
  ArcRotateCamera,
  Camera,
  Animation,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  TransformNode,
  WebXRDefaultExperience,
  WebXRState,
  WebXRFeatureName,
  WebXRControllerMovement,
  WebXRInputSource,
  PointerEventTypes,
  ActionManager,
  ExecuteCodeAction,
} from '@babylonjs/core';
import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
  Button,
  StackPanel,
  Control,
} from '@babylonjs/gui';
import { MaterialManager } from './materials';
import { TerrainManager } from './terrain';
import { TownManager } from './structures/town';
import { SolarFarmManager } from './structures/solarFarm';
import { WindTurbinesManager } from './structures/windTurbines';
import { HydroDamManager } from './structures/hydroDam';
import { PowerPlantManager } from './structures/powerPlant';
import { PowerGridManager } from './structures/powerGrid';
import { CameraMode, Landmark, SectorInfo, TimeOfDay, SolarTrackingStatus, XRStatus } from './types';

export const LANDMARKS: Landmark[] = [
  {
    id: 'overview',
    name: 'Eagle Peak Lookout',
    category: 'Overview',
    position: new Vector3(0, 68, -145),
    target: new Vector3(0, 10, 15),
    description: 'Elevated panoramic viewpoint overlooking the entire clean energy transition landscape.',
    specs: {
      type: 'Observation Point',
      generationMW: 'N/A',
      footprint: 'Full Watershed & Valley',
      keyFeature: 'Panoramic view of all 5 energy sectors',
    },
    color: '#38bdf8',
  },
  {
    id: 'town',
    name: 'Greenwood Haven Eco-Town',
    category: 'Settlement',
    position: new Vector3(42, 8.6, 62),
    target: new Vector3(42, 9, 95),
    description: 'Modern decarbonized community featuring rooftop solar, EV chargers, and smart energy grid integration.',
    specs: {
      type: 'Smart Microgrid Community',
      generationMW: '0.8 MW (Distributed Rooftop PV)',
      footprint: '14 Residential & Civic structures',
      keyFeature: 'Bidirectional EV charging & solar rooftops',
    },
    color: '#4ade80',
  },
  {
    id: 'solar',
    name: 'Suncrest Photovoltaic Array',
    category: 'Renewable',
    position: new Vector3(68, 6.8, -12),
    target: new Vector3(102, 5.5, 6),
    description: 'Ground-mounted utility-scale horizontal single-axis tracking (HSAT) monocrystalline solar array.',
    specs: {
      type: 'Single-Axis Tracking PV Array (HSAT)',
      generationMW: '15.0 MW Peak',
      footprint: '40 Single-Axis Tracking Tables (320 PV modules)',
      keyFeature: 'Single-axis East-West sun tracking with 0° night stow',
    },
    color: '#fbbf24',
  },
  {
    id: 'wind',
    name: 'Whispering Ridge Wind Farm',
    category: 'Renewable',
    position: new Vector3(-118, 26, -18),
    target: new Vector3(-138, 38, 8),
    description: 'Utility-scale wind farm situated on an elevated geological ridge harnessing steady mountain currents.',
    specs: {
      type: 'Onshore Wind Turbine Array',
      generationMW: '15.0 MW (6x 2.5 MW Turbines)',
      footprint: 'Ridge Crest (180m corridor)',
      keyFeature: '36m towers with 38m rotor diameter',
    },
    color: '#a78bfa',
  },
  {
    id: 'hydro',
    name: 'Cascade Gorge Hydroelectric Dam',
    category: 'Hydro',
    position: new Vector3(-42, 24, 100),
    target: new Vector3(-52, 12, 85),
    description: 'Massive concrete gravity dam harnessing reservoir water to produce flexible, dispatchable baseload clean energy.',
    specs: {
      type: 'Storage Hydroelectric Facility',
      generationMW: '48.0 MW (4x Francis Turbines)',
      footprint: '24m Dam Height with Reservoir Basin',
      keyFeature: 'Deep penstocks & natural spillway chute',
    },
    color: '#06b6d4',
  },
  {
    id: 'plant',
    name: 'Ironwood Thermal Power Station',
    category: 'Fossil',
    position: new Vector3(96, 5.8, -48),
    target: new Vector3(128, 14, -78),
    description: 'Conventional thermal baseload power plant with hyperbolic cooling towers, illustrating generation transition.',
    specs: {
      type: 'Thermal Steam Power Station',
      generationMW: '120.0 MW (Coal/Gas Steam Turbine)',
      footprint: '65m x 60m Industrial Compound',
      keyFeature: 'Twin hyperbolic cooling towers with vapor plumes',
    },
    color: '#f87171',
  },
];

export class BabylonSceneManager {
  private canvas: HTMLCanvasElement;
  public engine: Engine;
  public scene: Scene;

  public materials!: MaterialManager;
  public terrain!: TerrainManager;
  public town!: TownManager;
  public solarFarm!: SolarFarmManager;
  public windTurbines!: WindTurbinesManager;
  public hydroDam!: HydroDamManager;
  public powerPlant!: PowerPlantManager;
  public powerGrid!: PowerGridManager;

  // Cameras
  public fpsCamera!: UniversalCamera;
  public droneCamera!: UniversalCamera;
  public orbitCamera!: ArcRotateCamera;
  public activeMode: CameraMode = 'first_person';

  // Lights & Shadows
  public sunLight!: DirectionalLight;
  public hemiLight!: HemisphericLight;
  public shadowGenerator!: ShadowGenerator;

  // State
  public currentTimeOfDay: TimeOfDay = 'day';
  public timeHours: number = 12.0;
  public shadowsEnabled: boolean = true;
  public isPointerLocked: boolean = false;
  private jumpVelocity: number = 0;
  private isJumping: boolean = false;
  private keyStates: { [key: string]: boolean } = {};

  // Callbacks for React state
  public onSectorChange?: (info: SectorInfo) => void;
  public onFpsUpdate?: (fps: number) => void;
  public onPointerLockChange?: (locked: boolean) => void;
  public onTrackingUpdate?: (status: SolarTrackingStatus) => void;
  public onXRStateChange?: (inXR: boolean, state: WebXRState) => void;
  public onXRError?: (errorMessage: string) => void;
  public onLocomotionChange?: (smooth: boolean) => void;
  public onSeatedModeChange?: (seated: boolean) => void;
  public onFacilitySelect?: (facilityId: string) => void;

  // WebXR State & 3D In-VR UI (Meta Quest 3 Primary Target)
  public xrHelper: WebXRDefaultExperience | null = null;
  public xrMovement: WebXRControllerMovement | null = null;
  public isXRActive: boolean = false;
  public isXRSupported: boolean = false;
  public isSmoothLocomotionEnabled: boolean = false;
  public isSeatedMode: boolean = false;
  public activeVRControllers: WebXRInputSource[] = [];
  private vrInfoPanelMesh: Mesh | null = null;
  private vrInfoPanelTexture: AdvancedDynamicTexture | null = null;
  private vrBeaconMeshes: Mesh[] = [];
  private activeVRFacilityIndex: number = 0;

  private currentSectorId: string | null = null;
  private lastReportedDistance: number = 9999;
  private fpsCounterTimer: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true,
    });
    this.scene = new Scene(this.engine);
    this.scene.collisionsEnabled = true;
    this.scene.clearColor = new Color4(0.5, 0.72, 0.92, 1.0);
    // Linear fog starting at 280m so foreground is 100% crystal clear and never washed in blue
    this.scene.fogMode = Scene.FOGMODE_LINEAR;
    this.scene.fogStart = 280;
    this.scene.fogEnd = 950;
    this.scene.fogColor = new Color3(0.62, 0.78, 0.92);

    this.initSkybox();
    this.initLighting();
    this.initWorld();
    this.initCameras();
    this.initInputListeners();
    this.initRenderLoop();
  }

  private initSkybox(): void {
    const skybox = MeshBuilder.CreateBox('skyBox', { size: 1200 }, this.scene);
    const skyboxMaterial = new StandardMaterial('skyBoxMat', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skyboxMaterial.emissiveColor = new Color3(0.52, 0.72, 0.92);
    skybox.material = skyboxMaterial;
  }

  private initLighting(): void {
    // 1. Directional Sun Light positioned for realistic shadows
    this.sunLight = new DirectionalLight(
      'sunLight',
      new Vector3(-0.65, -0.75, 0.4).normalize(),
      this.scene
    );
    this.sunLight.position = new Vector3(120, 180, -120);
    this.sunLight.intensity = 1.35;
    this.sunLight.diffuse = new Color3(1.0, 0.97, 0.9);
    this.sunLight.specular = new Color3(0.9, 0.9, 0.9);

    // 2. Hemispheric sky ambient light
    this.hemiLight = new HemisphericLight(
      'hemiLight',
      new Vector3(0, 1, 0),
      this.scene
    );
    this.hemiLight.intensity = 0.65;
    this.hemiLight.diffuse = new Color3(0.8, 0.9, 1.0);
    this.hemiLight.groundColor = new Color3(0.28, 0.32, 0.22);

    // 3. Shadow Generator
    this.shadowGenerator = new ShadowGenerator(2048, this.sunLight);
    this.shadowGenerator.usePoissonSampling = true;
    this.shadowGenerator.bias = 0.003;
    this.shadowGenerator.darkness = 0.55;
  }

  private initWorld(): void {
    this.materials = new MaterialManager(this.scene);
    this.terrain = new TerrainManager(this.scene, this.materials);
    this.town = new TownManager(this.scene, this.materials, this.terrain);
    this.solarFarm = new SolarFarmManager(this.scene, this.materials, this.terrain);
    this.windTurbines = new WindTurbinesManager(this.scene, this.materials, this.terrain);
    this.hydroDam = new HydroDamManager(this.scene, this.materials, this.terrain);
    this.powerPlant = new PowerPlantManager(this.scene, this.materials, this.terrain);
    this.powerGrid = new PowerGridManager(this.scene, this.materials, this.terrain);

    // Register shadow casters & receivers
    this.windTurbines.registerShadows(this.shadowGenerator);
    this.solarFarm.registerShadows(this.shadowGenerator);
    this.hydroDam.registerShadows(this.shadowGenerator);
    this.powerPlant.registerShadows(this.shadowGenerator);
    this.town.registerShadows(this.shadowGenerator);
    this.powerGrid.registerShadows(this.shadowGenerator);
    this.terrain.registerShadows(this.shadowGenerator);

    // Initial sun tracking calculation for solar panels
    this.solarFarm.updateSunTracking(this.sunLight.direction);

    // Interactive 3D Beacons for WebXR and desktop inspection
    this.createVRInteractiveBeacons();

    // Check WebXR support on startup
    this.checkXRSupport();
  }

  private initCameras(): void {
    // 1. First-Person Camera (UniversalCamera)
    const initialLandmark = LANDMARKS[1]; // Town
    const initialY = this.terrain.getHeightAt(initialLandmark.position.x, initialLandmark.position.z) + 1.8;
    this.fpsCamera = new UniversalCamera(
      'fpsCamera',
      new Vector3(initialLandmark.position.x, initialY, initialLandmark.position.z),
      this.scene
    );
    this.fpsCamera.setTarget(initialLandmark.target);
    this.fpsCamera.speed = 0.85;
    this.fpsCamera.angularSensibility = 2000;
    this.fpsCamera.minZ = 0.2;
    this.fpsCamera.maxZ = 1200;
    this.fpsCamera.checkCollisions = true;
    this.fpsCamera.ellipsoid = new Vector3(0.6, 0.9, 0.6);
    this.fpsCamera.ellipsoidOffset = new Vector3(0, 0, 0);

    // Map WASD and Arrow Keys
    this.fpsCamera.keysUp = [87, 38]; // W, Up
    this.fpsCamera.keysDown = [83, 40]; // S, Down
    this.fpsCamera.keysLeft = [65, 37]; // A, Left
    this.fpsCamera.keysRight = [68, 39]; // D, Right

    // 2. Drone Camera (6-DOF Free Camera)
    this.droneCamera = new UniversalCamera(
      'droneCamera',
      new Vector3(initialLandmark.position.x, initialY + 12, initialLandmark.position.z - 15),
      this.scene
    );
    this.droneCamera.setTarget(initialLandmark.target);
    this.droneCamera.speed = 1.4;
    this.droneCamera.angularSensibility = 2200;
    this.droneCamera.minZ = 0.5;
    this.droneCamera.maxZ = 1500;
    this.droneCamera.keysUp = [87, 38];
    this.droneCamera.keysDown = [83, 40];
    this.droneCamera.keysLeft = [65, 37];
    this.droneCamera.keysRight = [68, 39];

    // 3. Orbit Camera (ArcRotateCamera)
    this.orbitCamera = new ArcRotateCamera(
      'orbitCamera',
      -Math.PI / 2.5,
      Math.PI / 3,
      120,
      new Vector3(42, 8, 85),
      this.scene
    );
    this.orbitCamera.lowerRadiusLimit = 15;
    this.orbitCamera.upperRadiusLimit = 350;
    this.orbitCamera.upperBetaLimit = Math.PI / 2 - 0.05;
    this.orbitCamera.wheelPrecision = 12;
    this.orbitCamera.minZ = 0.5;
    this.orbitCamera.maxZ = 1500;

    // Set default camera active
    this.scene.activeCamera = this.fpsCamera;
    this.fpsCamera.attachControl(this.canvas, true);
    this.activeMode = 'first_person';
  }

  public setCameraMode(mode: CameraMode): void {
    const prevCamera = this.scene.activeCamera;
    if (prevCamera) {
      prevCamera.detachControl();
    }

    this.activeMode = mode;
    let targetCam: Camera = this.fpsCamera;

    if (mode === 'first_person') {
      if (prevCamera && prevCamera !== this.fpsCamera) {
        const curPos = prevCamera.position.clone();
        const groundH = this.terrain.getHeightAt(curPos.x, curPos.z);
        this.fpsCamera.position = new Vector3(curPos.x, groundH + 1.8, curPos.z);
      }
      targetCam = this.fpsCamera;
    } else if (mode === 'drone') {
      if (prevCamera && prevCamera !== this.droneCamera) {
        const curPos = prevCamera.position.clone();
        this.droneCamera.position = new Vector3(curPos.x, curPos.y + 10, curPos.z);
      }
      targetCam = this.droneCamera;
    } else if (mode === 'orbit') {
      if (prevCamera) {
        this.orbitCamera.target = new Vector3(prevCamera.position.x, 8, prevCamera.position.z + 25);
        this.orbitCamera.radius = 90;
      }
      targetCam = this.orbitCamera;
    }

    this.scene.activeCamera = targetCam;
    targetCam.attachControl(this.canvas, true);
  }

  public getActiveCameraPosition(): Vector3 {
    if (this.scene.activeCamera) {
      return this.scene.activeCamera.position.clone();
    }
    return new Vector3(0, 10, 0);
  }

  public teleportToLandmark(landmarkId: string): void {
    const landmark = LANDMARKS.find((l) => l.id === landmarkId);
    if (!landmark) return;

    if (this.activeMode === 'first_person') {
      const groundH = this.terrain.getHeightAt(landmark.position.x, landmark.position.z);
      const targetPos = new Vector3(landmark.position.x, groundH + 1.8, landmark.position.z);
      this.animateCameraTransition(this.fpsCamera, targetPos, landmark.target);
    } else if (this.activeMode === 'drone') {
      const groundH = this.terrain.getHeightAt(landmark.position.x, landmark.position.z);
      const targetPos = new Vector3(landmark.position.x, groundH + 18, landmark.position.z - 15);
      this.animateCameraTransition(this.droneCamera, targetPos, landmark.target);
    } else if (this.activeMode === 'orbit') {
      this.orbitCamera.target = landmark.target.clone();
      this.orbitCamera.radius = landmark.id === 'overview' ? 240 : 85;
    }
  }

  private animateCameraTransition(camera: UniversalCamera, targetPos: Vector3, targetLookAt: Vector3): void {
    const frameRate = 60;
    const durationFrames = 45;

    const animPos = new Animation('camPosAnim', 'position', frameRate, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
    const keysPos = [
      { frame: 0, value: camera.position.clone() },
      { frame: durationFrames, value: targetPos },
    ];
    animPos.setKeys(keysPos);

    camera.animations = [animPos];
    this.scene.beginAnimation(camera, 0, durationFrames, false, 1.0, () => {
      camera.setTarget(targetLookAt);
    });
  }

  public setTimeHours(hours: number): void {
    this.timeHours = Math.max(0, Math.min(24, hours));
    const t = this.timeHours;

    const skyboxMesh = this.scene.getMeshByName('skyBox');
    const skyboxMat = skyboxMesh?.material as StandardMaterial | undefined;

    // Check if daytime (sun above horizon approx 5.4h to 18.8h)
    const isDaytime = t >= 5.4 && t <= 18.8;

    // Solar arc angle: 6:00 is sunrise (phi=0), 12:00 is zenith (phi=PI/2), 18:00 is sunset (phi=PI)
    const phi = ((t - 6.0) / 12.0) * Math.PI;
    const sunElev = Math.sin(phi);
    const sunEastWest = -Math.cos(phi); // East > 0 in morning, West < 0 in afternoon

    if (isDaytime) {
      // Sun vector pointing DOWN from sky towards the ground
      const sunDir = new Vector3(
        -sunEastWest,
        -(Math.max(0.06, sunElev) * 0.88 + 0.12),
        0.48 // Shines toward north (+Z) as sun arcs through southern sky
      ).normalize();

      this.sunLight.direction = sunDir;

      // Color and ambiance progression across day
      if (t < 7.5) {
        // Dawn / Golden Sunrise (5.4 to 7.5)
        const factor = Math.max(0, Math.min(1, (t - 5.4) / 2.1));
        this.sunLight.intensity = 0.55 + factor * 0.8;
        this.sunLight.diffuse = Color3.Lerp(new Color3(1.0, 0.52, 0.28), new Color3(1.0, 0.96, 0.88), factor);
        this.hemiLight.intensity = 0.35 + factor * 0.3;
        this.hemiLight.diffuse = Color3.Lerp(new Color3(0.68, 0.48, 0.65), new Color3(0.8, 0.9, 1.0), factor);
        this.hemiLight.groundColor = Color3.Lerp(new Color3(0.18, 0.16, 0.14), new Color3(0.28, 0.32, 0.22), factor);
        this.scene.clearColor = new Color4(0.72 - factor * 0.22, 0.45 + factor * 0.27, 0.38 + factor * 0.54, 1.0);
        this.scene.fogColor = Color3.Lerp(new Color3(0.72, 0.48, 0.4), new Color3(0.62, 0.78, 0.92), factor);
        this.scene.fogStart = 250;
        this.scene.fogEnd = 880;
        if (skyboxMat) skyboxMat.emissiveColor = this.scene.fogColor.clone();
      } else if (t <= 16.5) {
        // High Midday Sun (7.5 to 16.5)
        this.sunLight.intensity = 1.38;
        this.sunLight.diffuse = new Color3(1.0, 0.98, 0.92);
        this.hemiLight.intensity = 0.65;
        this.hemiLight.diffuse = new Color3(0.8, 0.9, 1.0);
        this.hemiLight.groundColor = new Color3(0.28, 0.32, 0.22);
        this.scene.clearColor = new Color4(0.5, 0.72, 0.92, 1.0);
        this.scene.fogColor = new Color3(0.62, 0.78, 0.92);
        this.scene.fogStart = 280;
        this.scene.fogEnd = 950;
        if (skyboxMat) skyboxMat.emissiveColor = new Color3(0.52, 0.72, 0.92);
      } else {
        // Golden Hour / Sunset (16.5 to 18.8)
        const factor = Math.max(0, Math.min(1, (t - 16.5) / 2.3));
        this.sunLight.intensity = 1.38 - factor * 0.25;
        this.sunLight.diffuse = Color3.Lerp(new Color3(1.0, 0.96, 0.88), new Color3(1.0, 0.48, 0.22), factor);
        this.hemiLight.intensity = 0.65 - factor * 0.16;
        this.hemiLight.diffuse = Color3.Lerp(new Color3(0.8, 0.9, 1.0), new Color3(0.72, 0.48, 0.68), factor);
        this.hemiLight.groundColor = Color3.Lerp(new Color3(0.28, 0.32, 0.22), new Color3(0.18, 0.16, 0.14), factor);
        this.scene.clearColor = new Color4(0.5 + factor * 0.25, 0.72 - factor * 0.3, 0.92 - factor * 0.57, 1.0);
        this.scene.fogColor = Color3.Lerp(new Color3(0.62, 0.78, 0.92), new Color3(0.75, 0.45, 0.35), factor);
        this.scene.fogStart = 240;
        this.scene.fogEnd = 850;
        if (skyboxMat) skyboxMat.emissiveColor = this.scene.fogColor.clone();
      }
      this.currentTimeOfDay = t < 8.0 || t > 16.5 ? 'sunset' : 'day';
    } else {
      // Twilight & Night (t < 5.4 or t > 18.8)
      this.sunLight.direction = new Vector3(-0.35, -0.85, 0.4).normalize();
      this.sunLight.intensity = 0.28;
      this.sunLight.diffuse = new Color3(0.35, 0.45, 0.75);
      this.hemiLight.intensity = 0.22;
      this.hemiLight.diffuse = new Color3(0.18, 0.22, 0.4);
      this.hemiLight.groundColor = new Color3(0.08, 0.1, 0.14);
      this.scene.clearColor = new Color4(0.06, 0.09, 0.16, 1.0);
      this.scene.fogColor = new Color3(0.08, 0.11, 0.2);
      this.scene.fogStart = 200;
      this.scene.fogEnd = 700;
      if (skyboxMat) skyboxMat.emissiveColor = new Color3(0.08, 0.11, 0.2);
      this.currentTimeOfDay = 'night';
    }

    // Dynamic solar tracker re-alignment to face the sunlight
    const status = this.solarFarm.updateSunTracking(this.sunLight.direction);
    if (this.onTrackingUpdate) {
      this.onTrackingUpdate(status);
    }
  }

  public setTimeOfDay(time: TimeOfDay): void {
    if (time === 'day') {
      this.setTimeHours(12.0);
    } else if (time === 'sunset') {
      this.setTimeHours(18.2);
    } else if (time === 'night') {
      this.setTimeHours(22.0);
    }
  }

  public toggleShadows(): boolean {
    this.shadowsEnabled = !this.shadowsEnabled;
    this.shadowGenerator.getShadowMap()?.renderList?.forEach((mesh) => {
      mesh.receiveShadows = this.shadowsEnabled;
    });
    return this.shadowsEnabled;
  }

  private initInputListeners(): void {
    // Keyboard inputs
    window.addEventListener('keydown', (e) => {
      this.keyStates[e.code] = true;

      // Sprint boost with Shift
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (this.fpsCamera) this.fpsCamera.speed = 2.4;
        if (this.droneCamera) this.droneCamera.speed = 3.6;
      }

      // Jump in First-Person mode
      if (e.code === 'Space' && this.activeMode === 'first_person' && !this.isJumping) {
        this.isJumping = true;
        this.jumpVelocity = 8.5;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keyStates[e.code] = false;

      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (this.fpsCamera) this.fpsCamera.speed = 0.85;
        if (this.droneCamera) this.droneCamera.speed = 1.4;
      }
    });

    // Pointer lock for immersive desktop first-person navigation
    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.canvas;
      if (this.onPointerLockChange) {
        this.onPointerLockChange(this.isPointerLocked);
      }
    });

    this.canvas.addEventListener('click', () => {
      if (!this.isPointerLocked && (this.activeMode === 'first_person' || this.activeMode === 'drone')) {
        this.canvas.requestPointerLock?.();
      }
    });

    // Ray-based facility interaction for VR controllers (laser pointer) and desktop clicks
    this.scene.onPointerObservable.add((pointerInfo) => {
      if (
        pointerInfo.type === PointerEventTypes.POINTERDOWN ||
        pointerInfo.type === PointerEventTypes.POINTERTAP
      ) {
        const pickedMesh = pointerInfo.pickInfo?.pickedMesh;
        if (!pickedMesh) return;

        // Skip clicks on the 3D VR Information Panel itself (handled by Babylon GUI)
        if (
          pickedMesh === this.vrInfoPanelMesh ||
          pickedMesh.name === 'vrInfoPanelMesh' ||
          pickedMesh.name.startsWith('vr')
        ) {
          return;
        }

        // 1. Check if an energy landmark beacon was targeted
        for (const lm of LANDMARKS) {
          if (
            pickedMesh.name.includes(lm.id) ||
            (pickedMesh.parent && pickedMesh.parent.name.includes(lm.id))
          ) {
            this.triggerFacilityInteraction(lm.id);
            return;
          }
        }

        // 2. Check if an energy facility structure was targeted by mesh naming
        const name = pickedMesh.name.toLowerCase();
        if (
          name.includes('solar') ||
          name.includes('rack') ||
          name.includes('panel') ||
          name.includes('inverter') ||
          name.includes('substation')
        ) {
          this.triggerFacilityInteraction('solar');
          return;
        }
        if (
          name.includes('wind') ||
          name.includes('turbine') ||
          name.includes('blade') ||
          name.includes('nacelle')
        ) {
          this.triggerFacilityInteraction('wind');
          return;
        }
        if (
          name.includes('dam') ||
          name.includes('hydro') ||
          name.includes('penstock') ||
          name.includes('powerhouse')
        ) {
          this.triggerFacilityInteraction('hydro');
          return;
        }
        if (
          name.includes('powerplant') ||
          name.includes('cooling') ||
          name.includes('chimney') ||
          name.includes('plant')
        ) {
          this.triggerFacilityInteraction('plant');
          return;
        }
        if (
          name.includes('town') ||
          name.includes('house') ||
          name.includes('roof') ||
          name.includes('civic')
        ) {
          this.triggerFacilityInteraction('town');
          return;
        }
      }
    });
  }

  /**
   * Ray-based facility trigger: updates 3D VR panel and pulses Meta Quest controller haptics
   */
  public triggerFacilityInteraction(facilityId: string): void {
    const landmarkIdx = LANDMARKS.findIndex((l) => l.id === facilityId);
    if (landmarkIdx >= 0) {
      this.activeVRFacilityIndex = landmarkIdx;
    }
    this.currentSectorId = facilityId;

    // Pulse Meta Quest 3 controller haptic motors
    this.pulseVRControllers(0.6, 60);

    if (this.isXRActive) {
      this.showVRInfoPanel(facilityId);
    } else {
      if (this.onFacilitySelect) {
        this.onFacilitySelect(facilityId);
      } else {
        this.showVRInfoPanel(facilityId);
      }
    }
  }

  /**
   * Pulses all active Meta Quest VR motion controllers with haptic vibration
   */
  public pulseVRControllers(intensity = 0.5, duration = 50): void {
    for (const ctrl of this.activeVRControllers) {
      try {
        ctrl?.motionController?.pulse(intensity, duration);
      } catch (e) {
        // Haptics might not be supported on some simulated platforms
      }
    }
  }

  /**
   * Toggles optional smooth locomotion (thumbstick gliding) on/off
   */
  public toggleSmoothLocomotion(): boolean {
    return this.setSmoothLocomotion(!this.isSmoothLocomotionEnabled);
  }

  public setSmoothLocomotion(enabled: boolean): boolean {
    this.isSmoothLocomotionEnabled = enabled;
    if (this.xrMovement) {
      this.xrMovement.movementEnabled = enabled;
    }
    this.onLocomotionChange?.(this.isSmoothLocomotionEnabled);
    return this.isSmoothLocomotionEnabled;
  }

  /**
   * Toggles comfortable seated vs standing posture mode
   * Standing mode: 1:1 physical room-scale floor tracking
   * Seated mode: adds +0.65m height compensation so seated players have eye-level panoramic overview
   */
  public toggleSeatedMode(): boolean {
    return this.setSeatedMode(!this.isSeatedMode);
  }

  public setSeatedMode(enabled: boolean): boolean {
    this.isSeatedMode = enabled;
    if (this.xrHelper && this.isXRActive) {
      const deltaY = enabled ? 0.65 : -0.65;
      this.xrHelper.baseExperience.camera.position.y += deltaY;
    }
    this.onSeatedModeChange?.(this.isSeatedMode);
    return this.isSeatedMode;
  }

  public requestPointerLock(): void {
    this.canvas.requestPointerLock?.();
  }

  public exitPointerLock(): void {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
  }

  private initRenderLoop(): void {
    let lastTime = performance.now();

    this.scene.onBeforeRenderObservable.add(() => {
      const now = performance.now();
      const deltaSeconds = (now - lastTime) / 1000;
      lastTime = now;

      // 1. Update wind turbine rotations
      this.windTurbines.updateAnimation(deltaSeconds);

      // 2. First-Person Physics / Terrain Height Locking
      if (this.activeMode === 'first_person') {
        const camPos = this.fpsCamera.position;
        const terrainH = this.terrain.getHeightAt(camPos.x, camPos.z);
        const eyeHeight = 1.8;

        if (this.isJumping) {
          camPos.y += this.jumpVelocity * deltaSeconds;
          this.jumpVelocity -= 22 * deltaSeconds; // Gravity

          if (camPos.y <= terrainH + eyeHeight) {
            camPos.y = terrainH + eyeHeight;
            this.isJumping = false;
            this.jumpVelocity = 0;
          }
        } else {
          // Smooth terrain following
          const targetY = terrainH + eyeHeight;
          camPos.y += (targetY - camPos.y) * 0.25;
        }
      }

      // 3. Drone Flight Vertical Movement (Space to rise, C to descend)
      if (this.activeMode === 'drone') {
        const camPos = this.droneCamera.position;
        if (this.keyStates['Space']) {
          camPos.y += 18 * deltaSeconds;
        }
        if (this.keyStates['KeyC']) {
          camPos.y -= 18 * deltaSeconds;
          const minH = this.terrain.getHeightAt(camPos.x, camPos.z) + 1.5;
          if (camPos.y < minH) camPos.y = minH;
        }
      }

      // 4. Proximity Check for Active Facility (Threshold: 45 meters)
      const activePos = this.getActiveCameraPosition();
      let nearestLandmark: Landmark | null = null;
      let minDistance = 9999;

      for (const lm of LANDMARKS) {
        if (lm.id === 'overview') continue;
        const dist = Math.hypot(activePos.x - lm.target.x, activePos.z - lm.target.z);
        if (dist < minDistance) {
          minDistance = dist;
          nearestLandmark = lm;
        }
      }

      if (minDistance <= 45 && nearestLandmark) {
        if (
          this.currentSectorId !== nearestLandmark.id ||
          Math.abs(this.lastReportedDistance - minDistance) >= 1.5
        ) {
          this.currentSectorId = nearestLandmark.id;
          this.lastReportedDistance = minDistance;
          if (this.onSectorChange) {
            this.onSectorChange({
              landmark: nearestLandmark,
              distance: Math.round(minDistance),
            });
          }
        }
      } else {
        if (this.currentSectorId !== null) {
          this.currentSectorId = null;
          this.lastReportedDistance = 9999;
          if (this.onSectorChange) {
            this.onSectorChange({
              landmark: null,
              distance: Math.round(minDistance),
            });
          }
        }
      }

      // 5. FPS update throttle
      this.fpsCounterTimer += deltaSeconds;
      if (this.fpsCounterTimer > 0.4) {
        this.fpsCounterTimer = 0;
        if (this.onFpsUpdate) {
          this.onFpsUpdate(Math.round(this.engine.getFps()));
        }
      }
    });

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  /**
   * 3D Interactive Holographic Beacons for WebXR and desktop picking
   */
  private createVRInteractiveBeacons(): void {
    LANDMARKS.forEach((lm) => {
      const gy = this.terrain.getHeightAt(lm.position.x, lm.position.z);
      const beaconRoot = new TransformNode(`beaconRoot_${lm.id}`, this.scene);
      beaconRoot.position = new Vector3(lm.position.x, gy + 3.0, lm.position.z);

      const beaconDisk = MeshBuilder.CreateCylinder(
        `beaconDisk_${lm.id}`,
        { diameter: 2.2, height: 0.15, tessellation: 24 },
        this.scene
      );
      beaconDisk.position = Vector3.Zero();
      const beaconMat = new StandardMaterial(`beaconMat_${lm.id}`, this.scene);
      beaconMat.emissiveColor = Color3.FromHexString(lm.color);
      beaconMat.diffuseColor = Color3.FromHexString(lm.color);
      beaconMat.alpha = 0.85;
      beaconDisk.material = beaconMat;
      beaconDisk.isPickable = true;
      beaconDisk.parent = beaconRoot;

      const beaconPillar = MeshBuilder.CreateCylinder(
        `beaconPillar_${lm.id}`,
        { diameterBottom: 0.35, diameterTop: 0.1, height: 2.5 },
        this.scene
      );
      beaconPillar.position = new Vector3(0, -1.25, 0);
      beaconPillar.material = beaconMat;
      beaconPillar.parent = beaconRoot;

      beaconDisk.actionManager = new ActionManager(this.scene);
      beaconDisk.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.showVRInfoPanel(lm.id);
        })
      );

      this.vrBeaconMeshes.push(beaconDisk);
    });
  }

  /**
   * Queries WebXR Device API compatibility and requirements (HTTPS/headset)
   */
  public async checkXRSupport(): Promise<{ supported: boolean; reason?: string }> {
    if (typeof navigator === 'undefined' || !navigator.xr) {
      this.isXRSupported = false;
      return {
        supported: false,
        reason:
          'WebXR Device API is not available in this browser. Please use Meta Quest Browser, Google Chrome, MS Edge with an attached VR headset, or the WebXR API Emulator extension.',
      };
    }
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      this.isXRSupported = false;
      return {
        supported: false,
        reason:
          'WebXR requires a secure context (HTTPS or localhost). Please ensure the application is loaded via https://',
      };
    }
    try {
      const supported = await navigator.xr.isSessionSupported('immersive-vr');
      this.isXRSupported = supported;
      if (supported) {
        return { supported: true };
      }
      return {
        supported: false,
        reason:
          'Immersive VR session not supported on current device/display. Connect a compatible headset (Meta Quest, HTC Vive, Valve Index, Apple Vision Pro) or activate the WebXR API Emulator.',
      };
    } catch (err: any) {
      this.isXRSupported = false;
      return {
        supported: false,
        reason: err?.message || 'Error querying WebXR support.',
      };
    }
  }

  /**
   * Initialize Babylon.js WebXR default experience with teleportation, controllers, and smooth locomotion
   */
  public async initWebXR(): Promise<WebXRDefaultExperience | null> {
    if (this.xrHelper) return this.xrHelper;
    try {
      this.xrHelper = await this.scene.createDefaultXRExperienceAsync({
        floorMeshes: [this.terrain.groundMesh],
        disableDefaultUI: true,
        disableTeleportation: false,
        pointerSelectionOptions: {
          enablePointerSelectionOnAllControllers: true,
          maxDistance: 280,
        },
        teleportationOptions: {
          floorMeshes: [this.terrain.groundMesh],
          parabolicRayEnabled: true,
          rotationAngle: Math.PI / 6, // 30° snap turn for Meta Quest thumbsticks
          backwardsTeleportation: true,
          defaultTargetMeshOptions: {
            teleportationBorderColor: '#10b981',
            teleportationFillColor: 'rgba(6, 78, 59, 0.65)',
            disableLighting: true,
          },
        },
        inputOptions: {
          doNotLoadControllerMeshes: false,
        },
      });

      if (this.xrHelper.pointerSelection) {
        this.xrHelper.pointerSelection.displayLaserPointer = true;
      }

      // Initialize optional smooth locomotion feature (WebXRControllerMovement)
      try {
        this.xrMovement = this.xrHelper.baseExperience.featuresManager.enableFeature(
          WebXRFeatureName.MOVEMENT,
          'latest',
          {
            xrInput: this.xrHelper.input,
            movementEnabled: this.isSmoothLocomotionEnabled,
            movementSpeed: 0.22,
            rotationEnabled: true,
            rotationSpeed: 0.28,
            movementOrientationFollowsViewerPose: true,
          }
        ) as WebXRControllerMovement;
      } catch (moveErr) {
        console.warn('WebXR movement locomotion notice:', moveErr);
      }

      this.xrHelper.baseExperience.onStateChangedObservable.add((state) => {
        const inXR = state === WebXRState.IN_XR;
        this.isXRActive = inXR;
        if (inXR) {
          // Meta Quest 3 display optimizations (Fixed Foveation & Refresh Rate)
          try {
            const sm = this.xrHelper!.baseExperience.sessionManager;
            if (sm.isFixedFoveationSupported) {
              sm.fixedFoveation = 1.0;
            }
            if (sm.supportedFrameRates && sm.supportedFrameRates.includes(90)) {
              sm.updateTargetFrameRate(90);
            }
          } catch (optErr) {
            console.warn('Quest display optimizations notice:', optErr);
          }

          const landmark = LANDMARKS.find((l) => l.id === this.currentSectorId) || LANDMARKS[1];
          this.teleportInVR(landmark.position);
          this.showVRInfoPanel(landmark.id);
        } else {
          this.hideVRInfoPanel();
        }
        this.onXRStateChange?.(inXR, state);
      });

      // Controller interactions: Squeeze/grip toggles the 3D VR Information Panel with haptic pulse
      this.xrHelper.input.onControllerAddedObservable.add((controller) => {
        this.activeVRControllers.push(controller);

        controller.onMotionControllerInitObservable.add((motionController) => {
          const isRight = motionController.handness === 'right';

          // 1. Grip / Squeeze button: summons or toggles the 3D VR Info Panel
          const squeeze = motionController.getComponentOfType('squeeze');
          if (squeeze) {
            squeeze.onButtonStateChangedObservable.add((component) => {
              if (component.pressed) {
                motionController.pulse(0.4, 40);
                this.toggleVRInfoPanelGaze();
              }
            });
          }

          // 2. Controller Buttons (A/B on Right, X/Y on Left)
          const buttons = motionController.getAllComponentsOfType('button');
          buttons.forEach((btnComp) => {
            const btnId = btnComp.id.toLowerCase();
            btnComp.onButtonStateChangedObservable.add((component) => {
              if (component.pressed) {
                motionController.pulse(0.35, 35);
                if (isRight) {
                  // A button (primary): Next facility
                  if (btnId.includes('a') || btnId.includes('primary')) {
                    const nextIdx = (this.activeVRFacilityIndex + 1) % LANDMARKS.length;
                    this.showVRInfoPanel(LANDMARKS[nextIdx].id);
                  }
                  // B button (secondary): Previous facility
                  else if (btnId.includes('b') || btnId.includes('secondary')) {
                    let prevIdx = this.activeVRFacilityIndex - 1;
                    if (prevIdx < 0) prevIdx = LANDMARKS.length - 1;
                    this.showVRInfoPanel(LANDMARKS[prevIdx].id);
                  }
                } else {
                  // X button: Toggle Smooth Locomotion vs Teleport
                  if (btnId.includes('x') || btnId.includes('primary')) {
                    this.toggleSmoothLocomotion();
                    if (this.vrInfoPanelMesh?.isEnabled()) {
                      this.showVRInfoPanel(LANDMARKS[this.activeVRFacilityIndex].id);
                    }
                  }
                  // Y button: Toggle Standing vs Seated mode
                  else if (btnId.includes('y') || btnId.includes('secondary')) {
                    this.toggleSeatedMode();
                    if (this.vrInfoPanelMesh?.isEnabled()) {
                      this.showVRInfoPanel(LANDMARKS[this.activeVRFacilityIndex].id);
                    }
                  }
                }
              }
            });
          });
        });
      });

      this.xrHelper.input.onControllerRemovedObservable.add((controller) => {
        this.activeVRControllers = this.activeVRControllers.filter((c) => c !== controller);
      });

      this.isXRSupported = true;
      return this.xrHelper;
    } catch (err: any) {
      console.warn('WebXR init notice:', err);
      this.isXRSupported = false;
      return null;
    }
  }

  /**
   * Requests entry into WebXR immersive-vr room-scale session with fallback reference space
   */
  public async enterVR(): Promise<boolean> {
    const check = await this.checkXRSupport();
    if (!check.supported) {
      this.onXRError?.(check.reason || 'WebXR immersive-vr not supported');
      throw new Error(check.reason || 'WebXR immersive-vr not supported');
    }
    if (!this.xrHelper) {
      await this.initWebXR();
    }
    if (!this.xrHelper) {
      throw new Error('Could not initialize Babylon WebXR session manager');
    }
    try {
      // Primary: room-scale local-floor
      await this.xrHelper.baseExperience.enterXRAsync('immersive-vr', 'local-floor');
      return true;
    } catch (floorErr: any) {
      console.warn('local-floor reference space unavailable, attempting local:', floorErr);
      try {
        // Fallback: local reference space
        await this.xrHelper.baseExperience.enterXRAsync('immersive-vr', 'local');
        return true;
      } catch (err: any) {
        let msg = err?.message || 'Failed to enter VR session';
        if (err?.name === 'NotAllowedError') {
          msg = 'Permission to enter immersive VR was denied in your browser. Please allow VR permissions in Meta Quest Browser.';
        } else if (err?.name === 'SecurityError') {
          msg = 'WebXR requires a secure HTTPS context or localhost.';
        } else if (err?.name === 'InvalidStateError') {
          msg = 'An active WebXR session is already running or cannot be started right now.';
        }
        this.onXRError?.(msg);
        throw new Error(msg);
      }
    }
  }

  /**
   * Exits active WebXR session and returns to desktop mode
   */
  public async exitVR(): Promise<void> {
    if (this.xrHelper && this.isXRActive) {
      await this.xrHelper.baseExperience.exitXRAsync();
    }
  }

  /**
   * Teleports the WebXR camera to a specific terrain coordinate in room-scale VR
   */
  public teleportInVR(target: Vector3): void {
    if (this.xrHelper && this.isXRActive) {
      const groundY = this.terrain.getHeightAt(target.x, target.z);
      const heightOffset = this.isSeatedMode ? 2.35 : 1.75;
      this.xrHelper.baseExperience.camera.position = new Vector3(target.x, groundY + heightOffset, target.z);
    }
  }

  /**
   * Constructs and positions a VR-friendly 3D holographic information panel
   */
  public showVRInfoPanel(facilityId: string): void {
    const landmarkIdx = LANDMARKS.findIndex((l) => l.id === facilityId);
    this.activeVRFacilityIndex = landmarkIdx >= 0 ? landmarkIdx : 1;
    const landmark = LANDMARKS[this.activeVRFacilityIndex];

    if (!this.vrInfoPanelMesh) {
      this.vrInfoPanelMesh = MeshBuilder.CreatePlane(
        'vrInfoPanelMesh',
        { width: 3.6, height: 2.6 },
        this.scene
      );
      this.vrInfoPanelMesh.isPickable = true;
      this.vrInfoPanelTexture = AdvancedDynamicTexture.CreateForMesh(
        this.vrInfoPanelMesh,
        1024,
        740
      );
    }

    if (this.vrInfoPanelTexture) {
      [...this.vrInfoPanelTexture.rootContainer.children].forEach((child) => child.dispose());

      // Main Glass Slate Panel
      const card = new Rectangle('vrCard');
      card.width = '1000px';
      card.height = '720px';
      card.cornerRadius = 28;
      card.color = landmark.color;
      card.thickness = 3;
      card.background = 'rgba(15, 23, 42, 0.95)';
      this.vrInfoPanelTexture.addControl(card);

      const panelStack = new StackPanel('vrStack');
      panelStack.width = '940px';
      card.addControl(panelStack);

      // Top Category & Meta Quest 3 badge
      const categoryText = new TextBlock(
        'vrCategory',
        `SECTOR: ${landmark.category.toUpperCase()} • META QUEST 3 VR`
      );
      categoryText.height = '32px';
      categoryText.color = landmark.color;
      categoryText.fontSize = 19;
      categoryText.fontWeight = 'bold';
      panelStack.addControl(categoryText);

      // Title
      const titleText = new TextBlock('vrTitle', landmark.name);
      titleText.height = '48px';
      titleText.color = '#ffffff';
      titleText.fontSize = 30;
      titleText.fontWeight = 'bold';
      panelStack.addControl(titleText);

      // Description
      const descText = new TextBlock('vrDesc', landmark.description);
      descText.height = '62px';
      descText.color = '#cbd5e1';
      descText.fontSize = 17;
      descText.textWrapping = true;
      panelStack.addControl(descText);

      // Specs Matrix Stack
      const specsStack = new StackPanel('vrSpecs');
      specsStack.isVertical = false;
      specsStack.height = '105px';
      panelStack.addControl(specsStack);

      const specItems = [
        { label: 'CAPACITY', val: landmark.specs.generationMW },
        { label: 'TYPE', val: landmark.specs.type },
        { label: 'FOOTPRINT', val: landmark.specs.footprint },
      ];

      specItems.forEach((sp, idx) => {
        const box = new Rectangle(`vrSpecBox_${idx}`);
        box.width = '300px';
        box.height = '92px';
        box.cornerRadius = 14;
        box.background = 'rgba(30, 41, 59, 0.75)';
        box.color = '#475569';
        box.thickness = 1;

        const innerStack = new StackPanel();
        box.addControl(innerStack);

        const lbl = new TextBlock(`lbl_${idx}`, sp.label);
        lbl.height = '26px';
        lbl.color = '#94a3b8';
        lbl.fontSize = 14;
        lbl.fontWeight = 'bold';
        innerStack.addControl(lbl);

        const val = new TextBlock(`val_${idx}`, sp.val);
        val.height = '46px';
        val.color = '#f1f5f9';
        val.fontSize = 17;
        val.fontWeight = 'bold';
        val.textWrapping = true;
        innerStack.addControl(val);

        specsStack.addControl(box);
      });

      // Key Feature Callout
      const featureText = new TextBlock(
        'vrFeature',
        `Key Engineering: ${landmark.specs.keyFeature}`
      );
      featureText.height = '36px';
      featureText.color = '#38bdf8';
      featureText.fontSize = 16;
      featureText.fontStyle = 'italic';
      panelStack.addControl(featureText);

      // --- Button Row 1: Facility Navigation & Daylight ---
      const buttonRow1 = new StackPanel('vrBtnRow1');
      buttonRow1.isVertical = false;
      buttonRow1.height = '68px';
      panelStack.addControl(buttonRow1);

      // Prev Button
      const btnPrev = Button.CreateSimpleButton('btnPrev', '< Prev Facility');
      btnPrev.width = '175px';
      btnPrev.height = '48px';
      btnPrev.color = '#ffffff';
      btnPrev.cornerRadius = 14;
      btnPrev.background = '#334155';
      btnPrev.fontSize = 15;
      btnPrev.onPointerClickObservable.add(() => {
        this.pulseVRControllers(0.4, 40);
        let prevIdx = this.activeVRFacilityIndex - 1;
        if (prevIdx < 0) prevIdx = LANDMARKS.length - 1;
        this.showVRInfoPanel(LANDMARKS[prevIdx].id);
      });
      buttonRow1.addControl(btnPrev);

      // Teleport Button
      const btnTeleport = Button.CreateSimpleButton('btnTeleport', 'Teleport Here');
      btnTeleport.width = '195px';
      btnTeleport.height = '48px';
      btnTeleport.color = '#ffffff';
      btnTeleport.cornerRadius = 14;
      btnTeleport.background = '#059669';
      btnTeleport.fontSize = 16;
      btnTeleport.fontWeight = 'bold';
      btnTeleport.onPointerClickObservable.add(() => {
        this.pulseVRControllers(0.5, 50);
        if (this.isXRActive) {
          this.teleportInVR(landmark.position);
        } else {
          this.teleportToLandmark(landmark.id);
        }
      });
      buttonRow1.addControl(btnTeleport);

      // Cycle Daylight Button
      const btnTime = Button.CreateSimpleButton('btnTime', 'Cycle Daylight');
      btnTime.width = '185px';
      btnTime.height = '48px';
      btnTime.color = '#ffffff';
      btnTime.cornerRadius = 14;
      btnTime.background = '#d97706';
      btnTime.fontSize = 15;
      btnTime.onPointerClickObservable.add(() => {
        this.pulseVRControllers(0.4, 40);
        let nextHour = this.timeHours + 3.5;
        if (nextHour > 22.0) nextHour = 6.0;
        this.setTimeHours(nextHour);
      });
      buttonRow1.addControl(btnTime);

      // Next Button
      const btnNext = Button.CreateSimpleButton('btnNext', 'Next Facility >');
      btnNext.width = '175px';
      btnNext.height = '48px';
      btnNext.color = '#ffffff';
      btnNext.cornerRadius = 14;
      btnNext.background = '#334155';
      btnNext.fontSize = 15;
      btnNext.onPointerClickObservable.add(() => {
        this.pulseVRControllers(0.4, 40);
        let nextIdx = (this.activeVRFacilityIndex + 1) % LANDMARKS.length;
        this.showVRInfoPanel(LANDMARKS[nextIdx].id);
      });
      buttonRow1.addControl(btnNext);

      // --- Button Row 2: WebXR Locomotion, Posture & Exit ---
      const buttonRow2 = new StackPanel('vrBtnRow2');
      buttonRow2.isVertical = false;
      buttonRow2.height = '68px';
      panelStack.addControl(buttonRow2);

      // Locomotion Toggle Button
      const locoLabel = this.isSmoothLocomotionEnabled
        ? 'Loco: Smooth Stick [X]'
        : 'Loco: Teleport Only [X]';
      const btnLoco = Button.CreateSimpleButton('btnLoco', locoLabel);
      btnLoco.width = '230px';
      btnLoco.height = '48px';
      btnLoco.color = '#ffffff';
      btnLoco.cornerRadius = 14;
      btnLoco.background = this.isSmoothLocomotionEnabled ? '#0284c7' : '#1e293b';
      btnLoco.fontSize = 15;
      btnLoco.fontWeight = 'bold';
      btnLoco.onPointerClickObservable.add(() => {
        this.pulseVRControllers(0.4, 40);
        this.toggleSmoothLocomotion();
        this.showVRInfoPanel(LANDMARKS[this.activeVRFacilityIndex].id);
      });
      buttonRow2.addControl(btnLoco);

      // Posture Toggle Button (Standing vs Seated)
      const postureLabel = this.isSeatedMode ? 'Posture: Seated [Y]' : 'Posture: Standing 1:1 [Y]';
      const btnPosture = Button.CreateSimpleButton('btnPosture', postureLabel);
      btnPosture.width = '230px';
      btnPosture.height = '48px';
      btnPosture.color = '#ffffff';
      btnPosture.cornerRadius = 14;
      btnPosture.background = this.isSeatedMode ? '#7c3aed' : '#1e293b';
      btnPosture.fontSize = 15;
      btnPosture.fontWeight = 'bold';
      btnPosture.onPointerClickObservable.add(() => {
        this.pulseVRControllers(0.4, 40);
        this.toggleSeatedMode();
        this.showVRInfoPanel(LANDMARKS[this.activeVRFacilityIndex].id);
      });
      buttonRow2.addControl(btnPosture);

      // Exit VR Button
      const btnExitVR = Button.CreateSimpleButton('btnExitVR', 'Exit VR');
      btnExitVR.width = '140px';
      btnExitVR.height = '48px';
      btnExitVR.color = '#ffffff';
      btnExitVR.cornerRadius = 14;
      btnExitVR.background = '#e11d48';
      btnExitVR.fontSize = 15;
      btnExitVR.fontWeight = 'bold';
      btnExitVR.onPointerClickObservable.add(() => {
        this.pulseVRControllers(0.5, 60);
        this.exitVR();
      });
      buttonRow2.addControl(btnExitVR);

      // Dismiss Button
      const btnClose = Button.CreateSimpleButton('btnClose', 'Close (Grip)');
      btnClose.width = '140px';
      btnClose.height = '48px';
      btnClose.color = '#ffffff';
      btnClose.cornerRadius = 14;
      btnClose.background = '#475569';
      btnClose.fontSize = 15;
      btnClose.onPointerClickObservable.add(() => {
        this.pulseVRControllers(0.3, 30);
        this.hideVRInfoPanel();
      });
      buttonRow2.addControl(btnClose);
    }

    // Position panel 2.5m in front of current headset / camera at comfortable eye height
    let camPos: Vector3;
    let forwardDir: Vector3;

    if (this.isXRActive && this.xrHelper) {
      camPos = this.xrHelper.baseExperience.camera.position.clone();
      forwardDir = this.xrHelper.baseExperience.camera.getForwardRay(1.0).direction;
    } else {
      camPos = this.getActiveCameraPosition();
      forwardDir = this.scene.activeCamera
        ? this.scene.activeCamera.getForwardRay(1.0).direction
        : new Vector3(0, 0, 1);
    }

    const panelPos = camPos.add(forwardDir.scale(2.5));
    const groundH = this.terrain.getHeightAt(panelPos.x, panelPos.z);
    panelPos.y = Math.max(panelPos.y, groundH + 1.2);

    this.vrInfoPanelMesh.position = panelPos;
    this.vrInfoPanelMesh.lookAt(camPos);
    this.vrInfoPanelMesh.rotation.x = 0;
    this.vrInfoPanelMesh.rotation.z = 0;
    this.vrInfoPanelMesh.setEnabled(true);
  }

  public hideVRInfoPanel(): void {
    if (this.vrInfoPanelMesh) {
      this.vrInfoPanelMesh.setEnabled(false);
    }
  }

  public toggleVRInfoPanelGaze(): void {
    if (this.vrInfoPanelMesh && this.vrInfoPanelMesh.isEnabled()) {
      this.hideVRInfoPanel();
    } else {
      const targetId = this.currentSectorId || 'town';
      this.showVRInfoPanel(targetId);
    }
  }

  public dispose(): void {
    this.hideVRInfoPanel();
    if (this.vrInfoPanelTexture) {
      this.vrInfoPanelTexture.dispose();
    }
    if (this.xrHelper && this.isXRActive) {
      this.xrHelper.baseExperience.exitXRAsync();
    }
    this.engine.stopRenderLoop();
    this.scene.dispose();
    this.engine.dispose();
  }
}
