import assert from "node:assert/strict";
import {
  fadeReveal,
  REVEAL_CUTOFF,
  strokeSteps,
} from "../src/three/reveal-trail.ts";

assert.equal(fadeReveal(1, 0), 1);
assert.ok(
  fadeReveal(1, 0.5) > 0.4,
  "Revealed parts remain clearly visible after leaving",
);
assert.ok(
  fadeReveal(1, 1.5) > REVEAL_CUTOFF,
  "The trail does not disappear immediately",
);
assert.ok(
  fadeReveal(1, 2.5) < REVEAL_CUTOFF,
  "The trail eventually clears completely",
);
let thirtyFps = 1;
let sixtyFps = 1;
for (let frame = 0; frame < 30; frame++)
  thirtyFps = fadeReveal(thirtyFps, 1 / 30);
for (let frame = 0; frame < 60; frame++)
  sixtyFps = fadeReveal(sixtyFps, 1 / 60);
assert.ok(
  Math.abs(thirtyFps - sixtyFps) < 1e-10,
  "Fade lifetime is independent of refresh rate",
);
assert.ok(
  strokeSteps(600, 140) > 10,
  "Fast movement paints a continuous trail",
);
assert.equal(strokeSteps(0, 140), 1);
assert.equal(strokeSteps(100000, 140), 48, "Painting work stays bounded");
console.log(
  "Reveal trail checks passed: persistence, complete decay, refresh independence, interpolated strokes, bounded work.",
);
