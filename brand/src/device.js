// Orthographic outline of the HoloCAD device (plinth + acrylic pyramid) built from 3D points.
window.device = function device({ yaw = 32, pitch = 22, scale = 100, cx = 0, cy = 0, hologram = true } = {}) {
  const ry = (yaw * Math.PI) / 180, rx = (pitch * Math.PI) / 180;
  const P = ([x, y, z]) => {
    const x1 = x * Math.cos(ry) - z * Math.sin(ry), z1 = x * Math.sin(ry) + z * Math.cos(ry);
    const y1 = y * Math.cos(rx) - z1 * Math.sin(rx), d = y * Math.sin(rx) + z1 * Math.cos(rx);
    return { x: cx + x1 * scale, y: cy - y1 * scale, d };
  };
  const t = 0.16, k = 0.86, h = 1.25;
  const top = [[-1, 0, -1], [1, 0, -1], [1, 0, 1], [-1, 0, 1]];
  const bot = top.map(([x, , z]) => [x, -t, z]);
  const pyr = top.map(([x, , z]) => [x * k, 0, z * k]);
  const apex = [0, h, 0];
  const seg = (a, b) => [P(a), P(b)];
  // Nearest corner to the camera is the one with the largest depth.
  const front = top.map((p, i) => [P(p).d, i]).sort((a, b) => b[0] - a[0])[0][1];
  const back = (front + 2) % 4;
  const solid = [], hidden = [];
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    solid.push(seg(top[i], top[j]));
    (i === back || j === back ? hidden : solid).push(seg(bot[i], bot[j]));
    (i === back ? hidden : solid).push(seg(top[i], bot[i]));
    (i === back || j === back ? hidden : solid).push(seg(pyr[i], pyr[j]));
    (i === back ? hidden : solid).push(seg(pyr[i], apex));
  }
  const cube = [];
  if (hologram) {
    const s = 0.15, c = [0, 0.36, 0];
    const v = [];
    for (const a of [-1, 1]) for (const b of [-1, 1]) for (const e of [-1, 1]) v.push([c[0] + a * s, c[1] + b * s, c[2] + e * s]);
    for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
      const diff = v[i].reduce((n, x, q) => n + (x !== v[j][q] ? 1 : 0), 0);
      if (diff === 1) cube.push(seg(v[i], v[j]));
    }
  }
  const line = ([a, b]) => `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  return { solid: solid.map(line).join(""), hidden: hidden.map(line).join(""), cube: cube.map(line).join(""), P, apex: P(apex) };
}
