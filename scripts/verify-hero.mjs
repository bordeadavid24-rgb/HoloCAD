import assert from "node:assert/strict";
import { PerspectiveCamera, Group, MathUtils, Vector3 } from "three";
import { introPose } from "../src/three/product.ts";

// Compare the shared live-overlay pose against the film's original camera path.
for (const progress of [0, 0.01, 0.2, 0.32, 0.48, 0.63, 0.78, 0.94, 1]) {
  const camera = new PerspectiveCamera(35, 1.6, 0.1, 100);
  const model = new Group();
  const spread = introPose(camera, model, progress);
  const reveal = MathUtils.smoothstep(progress, 0, 0.32);
  const orbit = MathUtils.smoothstep(progress, 0.22, 0.63);
  const expectedSpread =
    MathUtils.smoothstep(progress, 0.48, 0.78) *
    (1 - MathUtils.smoothstep(progress, 0.94, 1) * 0.25);
  const angle = 0.45 + orbit * 0.72;
  const distance = MathUtils.lerp(9.2, 7.5, reveal) + expectedSpread * 2.3;
  assert.ok(Math.abs(spread - expectedSpread) < 1e-10);
  assert.ok(
    camera.position.distanceTo(
      new Vector3(
        Math.sin(angle) * distance,
        MathUtils.lerp(2.8, 4.1, reveal) + expectedSpread * 0.4,
        Math.cos(angle) * distance,
      ),
    ) < 1e-10,
    `Live interior matches film camera at ${progress}`,
  );
  assert.equal(model.rotation.y, -0.12 - orbit * 0.6);
  assert.equal(model.position.y, -0.18);
  assert.ok(camera.matrixWorld.elements.every(Number.isFinite));
}
console.log(
  "Hero checks passed: live interior stays registered to the film at nine camera/explosion stages.",
);
