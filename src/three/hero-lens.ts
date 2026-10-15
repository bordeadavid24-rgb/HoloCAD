import * as THREE from "three";
import { createProduct, introPose } from "./product";
import { createRevealTrail, REVEAL_CUTOFF } from "./reveal-trail";

export type LensMode = "optics" | "hardware" | "intelligence";
type Activity = (active: boolean, pinned: boolean) => void;

// Original, illustrative board geometry. Not a specification of the final device.
function controllerBoard() {
  const group = new THREE.Group();
  const material = (color: string) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.45 });
  const green = material("#26794f");
  const silver = material("#c2d3db");
  const black = material("#161c21");
  const gold = material("#d3b579");
  const box = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material,
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  };
  box(2.35, 0.045, 1.55, 0, 0.27, 0, green);
  box(0.49, 0.11, 0.49, -0.18, 0.35, 0.06, black);
  for (let i = 0; i < 9; i++)
    box(0.035, 0.11, 0.43, -0.38 + i * 0.05, 0.43, 0.06, silver);
  box(0.29, 0.045, 0.4, -0.65, 0.32, 0.07, black);
  box(0.85, 0.08, 0.14, -0.55, 0.33, -0.61, black);
  // Forty GPIO pins, paired connectors, Ethernet and power outlines.
  for (let i = 0; i < 20; i++) {
    for (let row = 0; row < 2; row++) {
      box(
        0.018,
        0.14,
        0.018,
        -0.95 + i * 0.044,
        0.43,
        -0.645 + row * 0.07,
        gold,
      );
    }
  }
  for (const z of [-0.49, 0.02]) {
    box(0.4, 0.32, 0.4, 1.0, 0.45, z, silver);
    box(0.008, 0.21, 0.31, 1.205, 0.46, z, black);
  }
  box(0.5, 0.38, 0.45, 0.95, 0.47, 0.53, silver);
  box(0.01, 0.25, 0.33, 1.205, 0.47, 0.53, black);
  for (const x of [-0.82, -0.4, 0.12])
    box(0.22, 0.06, 0.12, x, 0.33, 0.73, silver);
  for (let i = 0; i < 22; i++) {
    const x = -1.02 + (i % 7) * 0.245;
    const z = -0.42 + Math.floor(i / 7) * 0.32;
    if (Math.abs(x + 0.18) < 0.3 && Math.abs(z - 0.06) < 0.3) continue;
    box(0.052, 0.055, 0.03, x, 0.325, z, i % 3 ? black : gold);
  }
  const tracks: number[] = [];
  for (let i = 0; i < 18; i++) {
    const x = -0.93 + i * 0.105;
    const z = i % 2 ? -0.52 : 0.58;
    tracks.push(
      x,
      0.297,
      z,
      x,
      0.297,
      z * 0.6,
      x,
      0.297,
      z * 0.6,
      x * 0.2,
      0.297,
      z * 0.32,
    );
  }
  const paths = new THREE.BufferGeometry();
  paths.setAttribute("position", new THREE.Float32BufferAttribute(tracks, 3));
  group.add(
    new THREE.LineSegments(
      paths,
      new THREE.LineBasicMaterial({
        color: "#a1b889",
        transparent: true,
        opacity: 0.65,
      }),
    ),
  );
  return group;
}

const fragment = /* glsl */ `
  uniform sampler2D uFilm;
  uniform sampler2D uInterior;
  uniform sampler2D uSilhouette;
  uniform sampler2D uTrail;
  uniform vec2 uPointer;
  uniform vec2 uVelocity;
  uniform vec4 uFilmRect;
  uniform float uStrength;
  uniform float uTime;
  uniform float uMode;
  varying vec2 vUv;
  vec3 film(vec2 uv) {
    return sRGBTransferEOTF(texture2D(uFilm, clamp(uv, 0.001, 0.999))).rgb;
  }
  void main() {
    vec2 uv = (vUv - uFilmRect.xy) / uFilmRect.zw;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
    // Local brush history reveals the device; it never draws an outline.
    float mask = texture2D(uSilhouette, uv).r * texture2D(uTrail, vUv).a * uStrength;
    if (mask < 0.001) discard;
    vec2 direction = (uPointer - vec2(0.5)) * 0.008;
    float shimmer = sin(uv.y * 28.0 + uv.x * 13.0 + uTime * 0.6) * 0.00045;
    vec2 bend = direction + uVelocity * 0.000004 + vec2(shimmer, -shimmer);
    vec2 sampleUv = uv + bend;
    vec3 refracted;
    refracted.r = film(sampleUv + direction * 0.12).r;
    refracted.g = film(sampleUv).g;
    refracted.b = film(sampleUv - direction * 0.12).b;
    vec4 interior = texture2D(uInterior, uv);
    // Reveal only actual components, not a painted/spotlit patch of background.
    mask *= smoothstep(0.03, 0.22, interior.a);
    float reveal = uMode < 0.5 ? 0.93 : 0.98;
    vec3 xray = vec3(0.005, 0.009, 0.014) + interior.rgb * 1.25;
    vec3 result = mix(refracted, xray, reveal);
    gl_FragColor = vec4(result, mask);
    #include <colorspace_fragment>
  }
`;

export function createHeroLens(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  film: HTMLVideoElement,
  onActivity: Activity,
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  const interior = new THREE.Scene();
  const product = createProduct();
  const oldMaterials = new Set<THREE.Material>();
  const originalTextures = new Set<THREE.Texture>();
  const shell = new Set<THREE.Object3D>();
  for (const layer of [
    product.layers.base,
    product.layers.display,
    product.layers.optics,
  ]) {
    layer.traverse((object) => shell.add(object));
  }
  const contours: [THREE.Object3D, THREE.LineSegments][] = [];
  product.group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    for (const mat of Array.isArray(object.material)
      ? object.material
      : [object.material]) {
      oldMaterials.add(mat);
      if ("map" in mat && mat.map instanceof THREE.Texture)
        originalTextures.add(mat.map);
    }
    object.material = new THREE.MeshBasicMaterial({
      color: "#8eafba",
      transparent: true,
      opacity: shell.has(object) ? 0 : 0.18,
      depthWrite: false,
    });
    contours.push([
      object,
      new THREE.LineSegments(
        new THREE.EdgesGeometry(object.geometry, 28),
        new THREE.LineBasicMaterial({
          color: "#bfdce5",
          transparent: true,
          opacity: shell.has(object) ? 0.12 : 0.7,
        }),
      ),
    ]);
  });
  contours.forEach(([object, lines]) => object.add(lines));
  // Keep discarded geometry attached but invisible so disposal still reaches it.
  product.layers.electronics.children.forEach((child) => {
    child.visible = false;
  });
  const board = controllerBoard();
  product.layers.electronics.add(board);
  interior.add(product.group);
  interior.add(new THREE.HemisphereLight("#e8f2f5", "#2c3935", 2.6));
  const light = new THREE.DirectionalLight("#ffffff", 3);
  light.position.set(-3, 6, 4);
  interior.add(light);
  const camera = new THREE.PerspectiveCamera(35, 1.6, 0.1, 100);
  const target = new THREE.WebGLRenderTarget(1280, 800, { depthBuffer: true });
  const silhouette = new THREE.WebGLRenderTarget(1280, 800, {
    depthBuffer: true,
  });
  const silhouetteMaterial = new THREE.MeshBasicMaterial({
    color: "#ffffff",
    side: THREE.DoubleSide,
  });
  let maskDirty = true;
  let maskTime = -1;
  const filmTexture = new THREE.VideoTexture(film);
  filmTexture.colorSpace = THREE.SRGBColorSpace;
  const trail = createRevealTrail();
  const trailTexture = new THREE.CanvasTexture(trail.canvas);
  trailTexture.generateMipmaps = false;
  trailTexture.minFilter = THREE.LinearFilter;
  const uniforms = {
    uFilm: { value: filmTexture },
    uInterior: { value: target.texture },
    uSilhouette: { value: silhouette.texture },
    uTrail: { value: trailTexture },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uVelocity: { value: new THREE.Vector2() },
    uFilmRect: { value: new THREE.Vector4(0, 0, 1, 1) },
    uStrength: { value: 1 },
    uTime: { value: 0 },
    uMode: { value: 0 },
  };
  const screen = new THREE.Scene();
  const composite = new THREE.ShaderMaterial({
    uniforms,
    vertexShader:
      "varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
    fragmentShader: fragment,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  screen.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), composite));
  const screenCamera = new THREE.Camera();
  // Educational signal paths, not an invented neural-network architecture.
  const curves = Array.from(
    { length: 7 },
    (_, i) =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.5 + i * 0.16, 0.38, -0.3),
        new THREE.Vector3(-0.7 + i * 0.23, 0.8, -0.38),
        new THREE.Vector3(-0.8 + i * 0.26, 1.4, 0),
        new THREE.Vector3(-0.65 + i * 0.22, 1.9, 0.1),
      ]),
  );
  const signals = new THREE.Group();
  const dots: THREE.Mesh[] = [];
  const signalMaterial = new THREE.MeshBasicMaterial({ color: "#e7c99c" });
  const dotGeometry = new THREE.SphereGeometry(0.024, 8, 6);
  curves.forEach((curve) => {
    const points = new THREE.BufferGeometry().setFromPoints(
      curve.getPoints(35),
    );
    signals.add(
      new THREE.Line(
        points,
        new THREE.LineBasicMaterial({
          color: "#ad9371",
          transparent: true,
          opacity: 0.42,
        }),
      ),
    );
    const dot = new THREE.Mesh(dotGeometry, signalMaterial);
    dots.push(dot);
    signals.add(dot);
  });
  product.group.add(signals);
  let mode: LensMode = "optics";
  let pinned = false;
  let followAnchor = false;
  let hovered = false;
  let visible = true;
  let disposed = false;
  let frame = 0;
  let previous = performance.now();
  let strength = 0;
  let lastActivity = "";
  const pointer = { x: 0.5, y: 0.5, vx: 0, vy: 0, targetX: 0.5, targetY: 0.5 };
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const projected = new THREE.Vector3();
  const bounds = { width: 1, height: 1 };
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const resize = () => {
    const area = host.getBoundingClientRect();
    const movie = film.getBoundingClientRect();
    bounds.width = area.width;
    bounds.height = area.height;
    renderer.setSize(area.width, area.height, false);
    trail.resize(area.width, area.height);
    trailTexture.needsUpdate = true;
    const aspect = film.videoWidth / film.videoHeight || 1.6;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    const width = Math.min(movie.width, movie.height * aspect);
    const height = width / aspect;
    const position = getComputedStyle(film)
      .objectPosition.split(" ")
      .map(parseFloat);
    const left =
      movie.left - area.left + (movie.width - width) * (position[0] / 100);
    const top =
      movie.top - area.top + (movie.height - height) * (position[1] / 100);
    uniforms.uFilmRect.value.set(
      left / area.width,
      1 - (top + height) / area.height,
      width / area.width,
      height / area.height,
    );
    const targetWidth = Math.min(
      1600,
      Math.round(width * renderer.getPixelRatio()),
    );
    target.setSize(targetWidth, Math.round(targetWidth / aspect));
    silhouette.setSize(targetWidth, Math.round(targetWidth / aspect));
    maskDirty = true;
  };
  const pose = () => {
    const progress = Math.min(1, film.currentTime / 16);
    const separate = introPose(camera, product.group, progress);
    product.group.rotation.x = 0;
    product.update(film.currentTime, separate);
    product.group.updateMatrixWorld(true);
  };
  const anchor = () => {
    projected.set(
      mode === "hardware" ? 0.05 : 0,
      mode === "hardware" ? 0.35 : 1.48,
      0,
    );
    if (mode === "hardware") product.layers.electronics.localToWorld(projected);
    else product.group.localToWorld(projected);
    projected.project(camera);
    const rect = uniforms.uFilmRect.value;
    pointer.targetX = rect.x + (projected.x + 1) * 0.5 * rect.z;
    pointer.targetY = rect.y + (projected.y + 1) * 0.5 * rect.w;
  };
  const notify = () => {
    const active = hovered || pinned;
    const key = `${active}:${pinned}`;
    if (key !== lastActivity) {
      lastActivity = key;
      onActivity(active, pinned);
    }
  };
  const render = (now: number) => {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const dt = Math.min((now - previous) / 1000, 0.035);
    previous = now;
    const active = hovered || pinned;
    pose();
    if (pinned && followAnchor) anchor();
    // Mass 1 / stiffness 100 / damping 10: interruptible pointer spring.
    for (let i = 0; i < 4; i++) {
      const step = dt / 4;
      pointer.vx +=
        ((pointer.targetX - pointer.x) * 100 - pointer.vx * 10) * step;
      pointer.vy +=
        ((pointer.targetY - pointer.y) * 100 - pointer.vy * 10) * step;
      pointer.x += pointer.vx * step;
      pointer.y += pointer.vy * step;
    }
    uniforms.uPointer.value.set(pointer.x, pointer.y);
    uniforms.uVelocity.value.set(
      pointer.vx * bounds.width,
      pointer.vy * bounds.height,
    );
    strength = trail.step(dt, active ? pointer : null);
    trailTexture.needsUpdate = true;
    const revealState = active
      ? "painting"
      : strength > 0
        ? "trailing"
        : "idle";
    if (canvas.dataset.reveal !== revealState)
      canvas.dataset.reveal = revealState;
    if (film.readyState >= 2 && strength > REVEAL_CUTOFF) {
      uniforms.uTime.value = now / 1000;
      // Cache the geometry mask while the scroll film is stationary.
      if (maskDirty || maskTime !== film.currentTime) {
        signals.visible = false;
        interior.overrideMaterial = silhouetteMaterial;
        renderer.setRenderTarget(silhouette);
        renderer.render(interior, camera);
        interior.overrideMaterial = null;
        maskDirty = false;
        maskTime = film.currentTime;
      }
      // The internals respond in 3D beneath the stationary glass silhouette.
      product.group.rotation.y += (pointer.x - 0.5) * 0.16;
      product.group.rotation.x = (pointer.y - 0.5) * 0.1;
      signals.visible = mode === "intelligence";
      curves.forEach((curve, i) =>
        curve.getPoint((now / 3600 + i / 7) % 1, dots[i].position),
      );
      renderer.setRenderTarget(target);
      renderer.render(interior, camera);
      renderer.setRenderTarget(null);
      renderer.render(screen, screenCamera);
    } else renderer.clear();
    if (active || strength > REVEAL_CUTOFF)
      frame = requestAnimationFrame(render);
  };
  const wake = () => {
    if (!frame && visible && !document.hidden && !disposed) {
      previous = performance.now();
      frame = requestAnimationFrame(render);
    }
  };
  const move = (event: PointerEvent) => {
    if (!fine.matches || event.pointerType === "touch" || pinned) return;
    if ((event.target as Element).closest("button, a")) {
      hovered = false;
      notify();
      wake();
      return;
    }
    const area = host.getBoundingClientRect();
    const x = (event.clientX - area.left) / area.width;
    const y = 1 - (event.clientY - area.top) / area.height;
    const rect = uniforms.uFilmRect.value;
    ndc.set(((x - rect.x) / rect.z) * 2 - 1, ((y - rect.y) / rect.w) * 2 - 1);
    pose();
    ray.setFromCamera(ndc, camera);
    hovered = ray
      .intersectObject(product.group, true)
      .some((hit) => hit.object instanceof THREE.Mesh);
    pointer.targetX = x;
    pointer.targetY = y;
    if (strength < 0.01) {
      pointer.x = x;
      pointer.y = y;
      pointer.vx = pointer.vy = 0;
    }
    notify();
    wake();
  };
  const leave = () => {
    hovered = false;
    notify();
    wake();
  };
  const close = () => {
    pinned = false;
    followAnchor = false;
    hovered = false;
    trail.clear();
    strength = 0;
    notify();
    wake();
  };
  const key = (event: KeyboardEvent) => {
    if (event.key === "Escape") close();
  };
  const down = { x: 0, y: 0 };
  const pointerDown = (event: PointerEvent) => {
    down.x = event.clientX;
    down.y = event.clientY;
  };
  const click = (event: MouseEvent) => {
    if (
      (event.target as Element).closest("button, a") ||
      !hovered ||
      Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6
    )
      return;
    pinned = !pinned;
    followAnchor = false;
    notify();
    wake();
  };
  const visibility = () => {
    if (document.hidden) {
      trail.clear();
      cancelAnimationFrame(frame);
      frame = 0;
    } else wake();
  };
  const observer = new ResizeObserver(() => {
    resize();
    wake();
  });
  observer.observe(host);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) {
      trail.clear();
      cancelAnimationFrame(frame);
      frame = 0;
    } else wake();
  });
  intersection.observe(host);
  film.addEventListener("loadeddata", resize);
  host.addEventListener("pointermove", move, { passive: true });
  host.addEventListener("pointerleave", leave);
  host.addEventListener("pointerdown", pointerDown);
  host.addEventListener("click", click);
  window.addEventListener("keydown", key);
  document.addEventListener("visibilitychange", visibility);
  resize();
  pose();
  return {
    setMode(next: LensMode) {
      mode = next;
      uniforms.uMode.value =
        next === "optics" ? 0 : next === "hardware" ? 1 : 2;
      pinned = true;
      followAnchor = true;
      trail.clear();
      pose();
      anchor();
      notify();
      wake();
    },
    close,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      film.removeEventListener("loadeddata", resize);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointerdown", pointerDown);
      host.removeEventListener("click", click);
      window.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>(oldMaterials);
      for (const scene of [interior, screen])
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
            geometries.add(object.geometry);
            for (const mat of Array.isArray(object.material)
              ? object.material
              : [object.material])
              materials.add(mat);
          }
        });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((mat) => mat.dispose());
      originalTextures.forEach((texture) => texture.dispose());
      filmTexture.dispose();
      trailTexture.dispose();
      target.dispose();
      silhouette.dispose();
      silhouetteMaterial.dispose();
      renderer.dispose();
    },
  };
}
