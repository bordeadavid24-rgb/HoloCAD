import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export type FocusPart = "pistons" | "crankshaft" | "assembly" | null;
export type PartId =
  `piston-${number}` | `rod-${number}` | "crankshaft" | "heads" | "block";
const TAU = Math.PI * 2;
const ease = (a: number, b: number, x: number) =>
  THREE.MathUtils.smoothstep(x, a, b);

function cylinder(
  radius: number,
  length: number,
  material: THREE.Material,
  position: THREE.Vector3,
  axis: "x" | "y" | "z" = "y",
) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, 32),
    material,
  );
  mesh.position.copy(position);
  if (axis === "x") mesh.rotation.z = Math.PI / 2;
  if (axis === "z") mesh.rotation.x = Math.PI / 2;
  return mesh;
}

export function createEngine() {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({
    color: "#9caeb9",
    metalness: 0.82,
    roughness: 0.24,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: "#273742",
    metalness: 0.85,
    roughness: 0.3,
  });
  const cyan = new THREE.MeshStandardMaterial({
    color: "#7dcfe9",
    metalness: 0.66,
    roughness: 0.27,
    emissive: "#2b9bbb",
    emissiveIntensity: 0.2,
  });
  const pistonMaterial = cyan.clone();
  const shaftMaterial = metal.clone();
  const shellMaterial = new THREE.MeshPhysicalMaterial({
    color: "#537486",
    metalness: 0.2,
    roughness: 0.22,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const block = new THREE.Group();
  const heads = new THREE.Group();
  const crankshaft = new THREE.Group();
  const pistons: THREE.Group[] = [];
  const rods: THREE.Group[] = [];
  const parts = new Map<PartId, THREE.Object3D>();
  const pins: THREE.Mesh[] = [];
  const cams: THREE.Group[] = [];
  const pistonMaterials: THREE.MeshStandardMaterial[] = [];
  const tag = (object: THREE.Object3D, id: PartId) => {
    object.traverse((child) => {
      child.userData.part = id;
    });
    parts.set(id, object);
  };
  const columns = [-0.64, 0, 0.64];

  const casing = new THREE.Mesh(
    new RoundedBoxGeometry(2.13, 0.88, 1.15, 3, 0.06),
    shellMaterial,
  );
  casing.position.y = -0.04;
  block.add(casing);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(casing.geometry, 30),
    new THREE.LineBasicMaterial({
      color: "#72bad3",
      transparent: true,
      opacity: 0.52,
    }),
  );
  edges.position.copy(casing.position);
  block.add(edges);
  const sump = new THREE.Mesh(
    new RoundedBoxGeometry(2.02, 0.24, 0.94, 3, 0.06),
    dark,
  );
  sump.position.y = -0.62;
  block.add(sump);
  for (let bank = 0; bank < 2; bank++) {
    const z = bank === 0 ? -0.29 : 0.29;
    for (let i = 0; i < 3; i++) {
      const x = columns[i];
      const piston = new THREE.Group();
      piston.position.set(x, 0.2, z);
      const surface = pistonMaterial.clone();
      pistonMaterials.push(surface);
      piston.add(cylinder(0.195, 0.24, surface, new THREE.Vector3()));
      for (let ring = 0; ring < 3; ring++) {
        const rim = new THREE.Mesh(
          new THREE.TorusGeometry(0.196, 0.009, 8, 36),
          dark,
        );
        rim.rotation.x = Math.PI / 2;
        rim.position.y = 0.06 - ring * 0.037;
        piston.add(rim);
      }
      const top = new THREE.Mesh(
        new THREE.CylinderGeometry(0.168, 0.168, 0.009, 32),
        metal,
      );
      top.position.y = 0.123;
      piston.add(top);
      const wrist = cylinder(
        0.035,
        0.4,
        metal,
        new THREE.Vector3(0, -0.11, 0),
        "x",
      );
      piston.add(wrist);
      pistons.push(piston);
      tag(piston, `piston-${pistons.length - 1}`);
      group.add(piston);
      const rod = new THREE.Group();
      const web = new THREE.Mesh(
        new THREE.BoxGeometry(0.038, 0.35, 0.065),
        metal,
      );
      rod.add(web);
      for (const offset of [-0.031, 0.031]) {
        const flange = new THREE.Mesh(
          new RoundedBoxGeometry(0.02, 0.36, 0.08, 2, 0.008),
          metal,
        );
        flange.position.x = offset;
        rod.add(flange);
      }
      for (const [y, radius, thickness] of [
        [0.23, 0.043, 0.017],
        [-0.23, 0.083, 0.022],
      ]) {
        const eye = new THREE.Mesh(
          new THREE.TorusGeometry(radius, thickness, 12, 32),
          metal,
        );
        eye.rotation.y = Math.PI / 2;
        eye.position.y = y;
        rod.add(eye);
      }
      rod.position.set(x, -0.13, z);
      rods.push(rod);
      tag(rod, `rod-${rods.length - 1}`);
      group.add(rod);
      const pin = cylinder(
        0.065,
        0.12,
        shaftMaterial,
        new THREE.Vector3(x, -0.39, z),
        "x",
      );
      pins.push(pin);
      group.add(pin);
      const bearing = new THREE.Mesh(
        new THREE.TorusGeometry(0.078, 0.027, 10, 24),
        metal,
      );
      bearing.rotation.y = Math.PI / 2;
      bearing.position.set(x, -0.36, z);
      crankshaft.add(bearing);
      const bore = new THREE.Mesh(
        new THREE.TorusGeometry(0.215, 0.016, 10, 36),
        metal,
      );
      bore.rotation.x = Math.PI / 2;
      bore.position.set(x, 0.42, z);
      block.add(bore);
      const valve = cylinder(0.055, 0.28, cyan, new THREE.Vector3(x, 0.69, z));
      heads.add(valve);
      for (let coil = 0; coil < 4; coil++) {
        const spring = new THREE.Mesh(
          new THREE.TorusGeometry(0.057, 0.009, 6, 20),
          dark,
        );
        spring.rotation.x = Math.PI / 2;
        spring.position.set(x, 0.59 + coil * 0.038, z);
        heads.add(spring);
      }
      const plug = cylinder(
        0.04,
        0.17,
        metal,
        new THREE.Vector3(x + 0.1, 0.85, z),
      );
      heads.add(plug);
    }
    const rail = new THREE.Mesh(
      new RoundedBoxGeometry(2.02, 0.11, 0.45, 2, 0.025),
      dark,
    );
    rail.position.set(0, 0.54, z);
    heads.add(rail);
    const camAssembly = new THREE.Group();
    camAssembly.position.set(0, 0.82, z);
    const camshaft = cylinder(0.038, 2.12, metal, new THREE.Vector3(), "x");
    camAssembly.add(camshaft);
    for (const x of columns) {
      const cam = cylinder(0.09, 0.045, cyan, new THREE.Vector3(x, 0, 0), "x");
      cam.scale.y = 1.25;
      camAssembly.add(cam);
    }
    cams.push(camAssembly);
    heads.add(camAssembly);
  }
  crankshaft.add(
    cylinder(0.07, 2.58, shaftMaterial, new THREE.Vector3(0, -0.39, 0), "x"),
  );
  for (const x of [-0.85, -0.4, 0.05, 0.5, 0.95]) {
    const counterweight = cylinder(
      0.21,
      0.07,
      shaftMaterial,
      new THREE.Vector3(x, -0.39, 0),
      "x",
    );
    crankshaft.add(counterweight);
  }
  const flywheel = cylinder(
    0.37,
    0.09,
    dark,
    new THREE.Vector3(-1.24, -0.39, 0),
    "x",
  );
  crankshaft.add(flywheel);
  const gearShape = new THREE.Shape();
  for (let tooth = 0; tooth < 96; tooth++) {
    const angle = (tooth / 96) * TAU;
    const r = tooth % 4 === 0 || tooth % 4 === 3 ? 0.33 : 0.36;
    if (!tooth) gearShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else gearShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  gearShape.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.1, 0, TAU, true);
  gearShape.holes.push(hole);
  const gearGeometry = new THREE.ExtrudeGeometry(gearShape, {
    depth: 0.045,
    bevelEnabled: true,
    bevelSize: 0.004,
    bevelThickness: 0.004,
    bevelSegments: 1,
  });
  const gear = new THREE.Mesh(gearGeometry, cyan);
  gear.rotation.y = Math.PI / 2;
  gear.position.set(1.24, -0.39, 0);
  crankshaft.add(gear);
  const timingGear = new THREE.Mesh(gearGeometry, metal);
  timingGear.rotation.y = Math.PI / 2;
  timingGear.scale.setScalar(0.55);
  timingGear.position.set(1.19, 0.76, 0);
  heads.add(timingGear);
  const beltPoints = [
    new THREE.Vector3(1.27, -0.68, 0),
    new THREE.Vector3(1.27, -0.39, 0.31),
    new THREE.Vector3(1.27, 0.76, 0.18),
    new THREE.Vector3(1.27, 0.94, 0),
    new THREE.Vector3(1.27, 0.76, -0.18),
    new THREE.Vector3(1.27, -0.39, -0.31),
  ];
  const belt = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(beltPoints, true),
      72,
      0.021,
      6,
      true,
    ),
    dark,
  );
  heads.add(belt);
  for (let i = 0; i < 3; i++) {
    const x = columns[i];
    const points = [
      new THREE.Vector3(x, 0.37, -0.53),
      new THREE.Vector3(x, 0.5, -0.7),
      new THREE.Vector3(x, 0.67, -0.76),
      new THREE.Vector3(x, 0.75, -0.54),
    ];
    const pipe = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        22,
        0.047,
        10,
        false,
      ),
      metal,
    );
    heads.add(pipe);
  }
  for (let i = 0; i < 12; i++) {
    const bolt = cylinder(
      0.025,
      0.06,
      metal,
      new THREE.Vector3(-0.93 + (i % 6) * 0.37, 0.57, i < 6 ? -0.53 : 0.53),
    );
    heads.add(bolt);
  }
  // Center rotation on the shaft itself rather than on the engine's origin.
  crankshaft.children.forEach((piece) => {
    piece.position.y += 0.39;
  });
  group.add(block, heads, crankshaft);
  tag(block, "block");
  tag(heads, "heads");
  tag(crankshaft, "crankshaft");
  pins.forEach((pin) => {
    pin.userData.part = "crankshaft";
  });
  const up = new THREE.Vector3(0, 1, 0);
  const direction = new THREE.Vector3();
  return {
    group,
    parts,
    update(
      time: number,
      explosion: number,
      focus: FocusPart = null,
      selected: PartId | null = null,
      isolation = 0,
      weights?: Map<PartId, number>,
    ) {
      const first = ease(0, 0.6, explosion);
      const second = ease(0.15, 0.85, explosion);
      heads.position.set(0, first * 1.65, -first * 0.35);
      block.position.set(-second * 0.6, -second * 0.25, -second * 1.65);
      crankshaft.position.set(
        0,
        -0.39 - ease(0.3, 1, explosion) * 1.05,
        second * 0.3,
      );
      crankshaft.rotation.x = time * 0.75;
      cams.forEach((cam) => {
        cam.rotation.x = time * 0.375;
      });
      for (let i = 0; i < pistons.length; i++) {
        // Slider-crank linkage: a fixed-length rod connects crank pin and wrist pin.
        const angle =
          time * 0.75 + ((i % 3) * TAU) / 3 + (i >= 3 ? Math.PI : 0);
        const z = i < 3 ? -0.29 : 0.29;
        const pinY = -0.39 + Math.cos(angle) * 0.12;
        const pinZ = z + Math.sin(angle) * 0.12;
        const wristY = pinY + Math.sqrt(0.46 ** 2 - (pinZ - z) ** 2);
        const bankSpread = (i < 3 ? -1 : 1) * second * 0.65;
        pistons[i].position.set(
          columns[i % 3] * (1 + second * 0.38),
          wristY + 0.11 + second * 0.7,
          z + bankSpread,
        );
        rods[i].position.set(
          columns[i % 3] * (1 + second * 0.38),
          (pinY + wristY) / 2 + second * 0.25,
          (pinZ + z) / 2 + bankSpread,
        );
        direction.set(0, wristY - pinY, z - pinZ).normalize();
        rods[i].quaternion.setFromUnitVectors(up, direction);
        pins[i].position.set(
          columns[i % 3],
          pinY - ease(0.3, 1, explosion) * 1.05,
          pinZ + second * 0.3,
        );
        pistonMaterials[i].emissiveIntensity =
          selected === `piston-${i}` ? 0.8 : focus === "pistons" ? 0.5 : 0.12;
      }
      for (const [id, part] of parts) {
        const weight = weights?.get(id) ?? (id === selected ? isolation : 0);
        part.position.x -= weight * 1.55;
        part.position.y += weight * (id === "crankshaft" ? 0.45 : 0.85);
        part.position.z += weight * 1.05;
      }
      shaftMaterial.emissive.set(
        focus === "crankshaft" || selected === "crankshaft"
          ? "#4bb6d6"
          : "#000000",
      );
      shaftMaterial.emissiveIntensity =
        focus === "crankshaft" || selected === "crankshaft" ? 0.45 : 0;
    },
  };
}

function surfaceGrain() {
  const pixels = new Uint8Array(256 * 256);
  let seed = 173;
  for (let i = 0; i < pixels.length; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    pixels[i] = 118 + (seed % 24);
  }
  const texture = new THREE.DataTexture(pixels, 256, 256, THREE.RedFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

export function createProduct(studio = false) {
  const group = new THREE.Group();
  const base = new THREE.Group();
  const optics = new THREE.Group();
  const display = new THREE.Group();
  const electronics = new THREE.Group();
  const speaker = new THREE.Group();
  const graphite = new THREE.MeshPhysicalMaterial({
    color: studio ? "#171a1f" : "#15191e",
    metalness: studio ? 1 : 0.86,
    roughness: studio ? 0.64 : 0.27,
    clearcoat: studio ? 0 : 0.4,
    envMapIntensity: studio ? 1.1 : 0.7,
  });
  if (studio) {
    const grain = surfaceGrain();
    graphite.roughnessMap = grain;
    graphite.bumpMap = grain;
    graphite.bumpScale = 0.0015;
  }
  const body = new THREE.Mesh(
    new RoundedBoxGeometry(4.35, 0.4, 3.95, 5, 0.11),
    graphite,
  );
  body.position.y = 0.24;
  body.castShadow = true;
  body.receiveShadow = true;
  base.add(body);
  const foot = new THREE.Mesh(
    new RoundedBoxGeometry(4.18, 0.08, 3.79, 3, 0.06),
    new THREE.MeshStandardMaterial({
      color: "#07090d",
      metalness: 0.5,
      roughness: 0.4,
    }),
  );
  foot.position.y = 0.045;
  base.add(foot);
  const screen = new THREE.Mesh(
    new RoundedBoxGeometry(4.23, 0.045, 3.83, 4, 0.065),
    new THREE.MeshPhysicalMaterial({
      color: "#060b10",
      metalness: studio ? 0.16 : 0.55,
      roughness: studio ? 0.065 : 0.16,
      clearcoat: 1,
      envMapIntensity: studio ? 0.75 : 0.35,
    }),
  );
  screen.position.y = 0.47;
  display.add(screen);
  const rim = new THREE.Mesh(
    new RoundedBoxGeometry(4.24, 0.009, 3.84, 4, 0.065),
    new THREE.MeshBasicMaterial({
      color: "#65c2e3",
      transparent: true,
      opacity: studio ? 0.12 : 0.28,
    }),
  );
  rim.position.y = 0.439;
  base.add(rim);
  const vertices = new Float32Array([
    -1.8, 0.51, -1.63, 1.8, 0.51, -1.63, 0, 3.15, 0, 1.8, 0.51, -1.63, 1.8,
    0.51, 1.63, 0, 3.15, 0, 1.8, 0.51, 1.63, -1.8, 0.51, 1.63, 0, 3.15, 0, -1.8,
    0.51, 1.63, -1.8, 0.51, -1.63, 0, 3.15, 0,
  ]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  optics.add(
    new THREE.Mesh(
      geometry,
      new THREE.MeshPhysicalMaterial({
        color: "#b3e0ed",
        transparent: true,
        opacity: studio ? 0.045 : 0.024,
        roughness: studio ? 0.035 : 0.08,
        metalness: studio ? 0 : 0.1,
        clearcoat: studio ? 0.45 : 0,
        ior: 1.49,
        envMapIntensity: studio ? 0.35 : 1,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    ),
  );
  optics.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({
        color: "#bce9f4",
        transparent: true,
        opacity: studio ? 0.7 : 0.5,
      }),
    ),
  );
  const grille = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.018, 0.05, 0.008),
    new THREE.MeshBasicMaterial({ color: "#05070a" }),
    38,
  );
  const transform = new THREE.Object3D();
  for (let i = 0; i < 38; i++) {
    transform.position.set(0.45 + i * 0.031, 0.245, 1.979);
    transform.updateMatrix();
    grille.setMatrixAt(i, transform.matrix);
  }
  base.add(grille);
  const board = new THREE.Mesh(
    new RoundedBoxGeometry(2.4, 0.035, 1.65, 2, 0.025),
    new THREE.MeshStandardMaterial({
      color: "#213c32",
      roughness: 0.5,
      metalness: 0.25,
    }),
  );
  board.position.y = 0.27;
  electronics.add(board);
  const chipMaterial = new THREE.MeshStandardMaterial({
    color: "#181c20",
    roughness: 0.42,
    metalness: 0.4,
  });
  for (let i = 0; i < 6; i++) {
    const chip = new THREE.Mesh(
      new THREE.BoxGeometry(i === 0 ? 0.42 : 0.21, 0.045, 0.28),
      chipMaterial,
    );
    chip.position.set(-0.78 + (i % 3) * 0.7, 0.315, i < 3 ? -0.35 : 0.35);
    electronics.add(chip);
  }
  const audioBody = cylinder(
    0.29,
    0.1,
    chipMaterial,
    new THREE.Vector3(1.55, 0.28, 0.65),
  );
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.23, 0.06, 48, 1, true),
    new THREE.MeshStandardMaterial({
      color: "#4b5259",
      metalness: 0.35,
      roughness: 0.6,
      side: THREE.DoubleSide,
    }),
  );
  cone.position.set(1.55, 0.35, 0.65);
  speaker.add(audioBody, cone);
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#dbe3eb";
  ctx.font = "500 64px Arial";
  ctx.fillText("HoloCAD", 12, 88);
  const labelMap = new THREE.CanvasTexture(canvas);
  labelMap.colorSpace = THREE.SRGBColorSpace;
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.82, 0.205),
    new THREE.MeshBasicMaterial({ map: labelMap, transparent: true }),
  );
  label.position.set(-1.27, 0.24, 1.98);
  base.add(label);
  const engine = createEngine();
  engine.group.scale.setScalar(0.72);
  engine.group.position.set(0, 1.5, 0);
  group.add(base, electronics, speaker, display, optics, engine.group);
  return {
    group,
    engine,
    layers: { optics, display, electronics, speaker, base },
    update(time: number, explosion: number, focus: FocusPart = null) {
      optics.position.y = ease(0, 0.55, explosion) * 1.65;
      optics.rotation.y = ease(0.15, 0.8, explosion) * 0.07;
      display.position.y = ease(0.2, 0.8, explosion) * 0.85;
      electronics.position.y = ease(0.25, 0.85, explosion) * 0.45;
      speaker.position.x = ease(0.35, 1, explosion) * 1.2;
      speaker.position.y = ease(0.35, 1, explosion) * 0.5;
      engine.group.position.y = 1.5 + ease(0.12, 0.8, explosion) * 0.8;
      engine.update(time, explosion * 0.5, focus);
    },
  };
}

// Shared with the interactive X-ray so it stays registered to the rendered film.
export function introPose(
  camera: THREE.PerspectiveCamera,
  model: THREE.Object3D,
  progress: number,
) {
  const reveal = ease(0, 0.32, progress);
  const orbit = ease(0.22, 0.63, progress);
  const separate =
    ease(0.48, 0.78, progress) * (1 - ease(0.94, 1, progress) * 0.25);
  const angle = 0.45 + orbit * 0.72;
  const distance = THREE.MathUtils.lerp(9.2, 7.5, reveal) + separate * 2.3;
  camera.position.set(
    Math.sin(angle) * distance,
    THREE.MathUtils.lerp(2.8, 4.1, reveal) + separate * 0.4,
    Math.cos(angle) * distance,
  );
  camera.lookAt(
    -1.15 * orbit * Math.cos(angle),
    1.35 + separate * 0.65,
    1.15 * orbit * Math.sin(angle),
  );
  model.rotation.y = -0.12 - orbit * 0.6;
  model.position.y = -0.18;
  camera.updateMatrixWorld();
  return separate;
}

export function createStage(
  canvas: HTMLCanvasElement,
  variant: "device" | "engine" = "device",
  cinematic = false,
  studio = false,
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: !cinematic,
    preserveDrawingBuffer: cinematic,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(1);
  renderer.setClearColor("#050609", cinematic ? 1 : 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = cinematic;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0, 0.1, 100, {
    size: studio ? 256 : 64,
  });
  scene.environment = environment.texture;
  scene.environmentIntensity = studio ? 0.5 : 1;
  room.dispose();
  pmrem.dispose();
  const product = variant === "device" ? createProduct(studio) : null;
  const engine = product?.engine ?? createEngine();
  const model = product?.group ?? engine.group;
  scene.add(model);
  const ambient = new THREE.HemisphereLight(
    "#c5d8e7",
    "#080b12",
    studio ? 0.45 : 1.25,
  );
  scene.add(ambient);
  const key = new THREE.DirectionalLight("#ffffff", 3.4);
  key.position.set(-3, 7, 4);
  key.castShadow = cinematic;
  key.shadow.mapSize.set(studio ? 2048 : 1024, studio ? 2048 : 1024);
  key.shadow.camera.left = key.shadow.camera.bottom = -6;
  key.shadow.camera.right = key.shadow.camera.top = 6;
  key.shadow.normalBias = 0.04;
  scene.add(key);
  const rim = new THREE.DirectionalLight("#8abed6", 2.6);
  rim.position.set(4, 4, -4);
  scene.add(rim);
  const glow = new THREE.PointLight("#44b5db", 2.6, 5);
  glow.position.set(0, 1.6, 1);
  scene.add(glow);
  const camera = new THREE.PerspectiveCamera(cinematic ? 35 : 38, 1, 0.1, 100);
  if (variant === "device") {
    camera.position.set(5.4, 3.8, 7.8);
    camera.lookAt(0, 1.3, 0);
  } else {
    camera.position.set(3.2, 2.2, 4.1);
    camera.lookAt(0, 0.05, 0);
  }
  if (cinematic) {
    scene.background = new THREE.Color("#050609");
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({
        color: studio ? "#010204" : "#050609",
        metalness: studio ? 0.15 : 0.6,
        roughness: studio ? 0.7 : 0.35,
        envMapIntensity: studio ? 0.005 : 0.07,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.025;
    ground.receiveShadow = true;
    scene.add(ground);
    scene.fog = new THREE.Fog("#050609", 14, 28);
  }
  const raycaster = new THREE.Raycaster();
  const projected = new THREE.Vector3();
  const cameraOrigin = camera.position.clone();
  const selectionWeights = new Map<PartId, number>();
  return {
    renderer,
    scene,
    camera,
    model,
    resize(width: number, height: number) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    },
    pick(x: number, y: number): PartId | null {
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const hits = raycaster.intersectObject(engine.group, true);
      const hit =
        hits.find(
          (item) =>
            item.object.userData.part && item.object.userData.part !== "block",
        ) ?? hits.find((item) => item.object.userData.part);
      return hit?.object.userData.part ?? null;
    },
    anchor(part: PartId) {
      engine.parts.get(part)?.getWorldPosition(projected);
      projected.project(camera);
      return {
        x: (projected.x + 1) / 2,
        y: (1 - projected.y) / 2,
        visible: projected.z < 1,
      };
    },
    render(
      time: number,
      explosion: number,
      focus: FocusPart = null,
      selected: PartId | null = null,
      isolation = 0,
    ) {
      if (product) product.update(time, explosion, focus);
      else {
        for (const id of engine.parts.keys()) {
          const previous = selectionWeights.get(id) ?? 0;
          selectionWeights.set(
            id,
            THREE.MathUtils.lerp(previous, id === selected ? 1 : 0, 0.12),
          );
        }
        engine.update(
          time,
          explosion,
          focus,
          selected,
          isolation,
          selectionWeights,
        );
        camera.position
          .copy(cameraOrigin)
          .multiplyScalar(0.88 + explosion * 0.72 + isolation * 0.2);
        camera.lookAt(-isolation * 0.35, 0.22 + explosion * 0.28, 0);
      }
      renderer.render(scene, camera);
    },
    cinematicFrame(progress: number) {
      const reveal = ease(0, 0.32, progress);
      const separate = introPose(camera, model, progress);
      key.intensity = 2.9 + reveal * 0.7;
      rim.intensity = 2.8;
      if (product) product.update(progress * 16, separate);
      renderer.render(scene, camera);
    },
    hardwareFrame(progress: number) {
      const spread = ease(0.03, 0.25, progress) * (1 - ease(0.91, 1, progress));
      const angle = 0.62 + progress * 0.22;
      camera.position.set(Math.sin(angle) * 11.5, 6.2, Math.cos(angle) * 11.5);
      camera.lookAt(0, 2, 0);
      model.rotation.y = -0.22;
      product?.update(progress * 9, spread);
      renderer.render(scene, camera);
      return Object.entries(product?.layers ?? {}).map(([name, object]) => {
        object.getWorldPosition(projected);
        const offsets: Record<string, [number, number, number]> = {
          optics: [0, 2, 0],
          display: [1.7, 0.47, 0],
          electronics: [0.8, 0.3, 0],
          speaker: [1.55, 0.3, 0.65],
          base: [-1.6, 0.24, 1.6],
        };
        const offset = new THREE.Vector3(...offsets[name]);
        object.localToWorld(offset).project(camera);
        return { name, x: (offset.x + 1) / 2, y: (1 - offset.y) / 2 };
      });
    },
    dispose() {
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      const textures = new Set<THREE.Texture>();
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.LineSegments
        ) {
          geometries.add(object.geometry);
          for (const material of Array.isArray(object.material)
            ? object.material
            : [object.material]) {
            materials.add(material);
            for (const property of ["map", "roughnessMap", "bumpMap"]) {
              const texture = (material as unknown as Record<string, unknown>)[
                property
              ];
              if (texture instanceof THREE.Texture) textures.add(texture);
            }
          }
          if (object instanceof THREE.InstancedMesh) object.dispose();
        }
      });
      geometries.forEach((x) => x.dispose());
      materials.forEach((x) => x.dispose());
      textures.forEach((x) => x.dispose());
      environment.dispose();
      renderer.dispose();
    },
  };
}
