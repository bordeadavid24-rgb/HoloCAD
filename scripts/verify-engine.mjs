import assert from "node:assert/strict";
import { Vector3, Vector2, PerspectiveCamera, Raycaster } from "three";
import { createEngine } from "../src/three/product.ts";

const engine = createEngine();
assert.equal(
  engine.parts.size,
  15,
  "Six pistons, six rods, crankshaft, distribution, block",
);
const phasePositions = [];
for (let frame = 0; frame < 360; frame++) {
  const time = frame / 30;
  engine.update(time, 0);
  for (let i = 0; i < 6; i++) {
    const piston = engine.parts.get(`piston-${i}`);
    const rod = engine.parts.get(`rod-${i}`);
    const wrist = new Vector3(
      piston.position.x,
      piston.position.y - 0.11,
      piston.position.z,
    );
    const end = new Vector3(0, 0.23, 0)
      .applyQuaternion(rod.quaternion)
      .add(rod.position);
    assert.ok(
      wrist.distanceTo(end) < 1e-8,
      `Rod ${i} remains connected to its piston`,
    );
    assert.ok(Number.isFinite(piston.position.y), "Piston movement is finite");
  }
  phasePositions.push(engine.parts.get("piston-0").position.y);
}
assert.ok(
  Math.max(...phasePositions) - Math.min(...phasePositions) > 0.23,
  "Full crank stroke is represented",
);
engine.update(1, 0);
const assembled = new Map(
  [...engine.parts].map(([id, object]) => [id, object.position.clone()]),
);
engine.update(1, 1);
assert.ok(
  engine.parts.get("heads").position.distanceTo(assembled.get("heads")) > 1.5,
);
assert.ok(
  engine.parts.get("block").position.distanceTo(assembled.get("block")) > 1.6,
);
for (const id of engine.parts.keys()) {
  engine.update(1, 0, null, id, 1);
  assert.ok(
    engine.parts.get(id).position.distanceTo(assembled.get(id)) > 1.9,
    `${id} can be isolated`,
  );
  engine.update(1, 0);
  assert.ok(
    engine.parts.get(id).position.distanceTo(assembled.get(id)) < 1e-8,
    `${id} returns to assembly`,
  );
}
const camera = new PerspectiveCamera(38, 1280 / 620, 0.1, 100);
camera.position.set(3.2, 2.2, 4.1).multiplyScalar(0.88);
camera.lookAt(0, 0.22, 0);
camera.updateMatrixWorld();
engine.group.updateMatrixWorld(true);
const point = engine.parts
  .get("piston-5")
  .getWorldPosition(new Vector3())
  .project(camera);
const ray = new Raycaster();
ray.setFromCamera(new Vector2(point.x, point.y), camera);
const hit = ray
  .intersectObject(engine.group, true)
  .find(
    (item) =>
      item.object.userData.part && item.object.userData.part !== "block",
  );
assert.equal(
  hit?.object.userData.part,
  "piston-5",
  "Raycasting resolves the visible piston rather than the transparent casing",
);
console.log(
  "Engine checks passed: 15 selectable groups; linkage, full stroke, expanded separation, individual isolation, recomposition.",
);
