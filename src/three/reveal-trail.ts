// A low-resolution alpha field, not a visible cursor graphic.
export const REVEAL_DECAY = 1.7;
export const REVEAL_CUTOFF = 0.015;
export const fadeReveal = (value: number, seconds: number) =>
  value * Math.exp(-REVEAL_DECAY * seconds);
export const strokeSteps = (distance: number, radius: number) =>
  Math.max(1, Math.min(48, Math.ceil(distance / (radius * 0.22))));

export function createRevealTrail() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  const brush = document.createElement("canvas");
  brush.width = brush.height = 96;
  const ink = brush.getContext("2d")!;
  // Overlapping, soft lobes avoid a geometrically circular reveal edge.
  for (const [x, y, radius] of [
    [44, 48, 43],
    [58, 39, 32],
    [35, 58, 31],
  ]) {
    const gradient = ink.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.72, "rgba(255,255,255,0.45)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ink.fillStyle = gradient;
    ink.fillRect(0, 0, 96, 96);
  }
  let level = 0;
  let radius = 1;
  let last: { x: number; y: number } | null = null;
  return {
    canvas,
    resize(width: number, height: number) {
      canvas.width = Math.min(768, Math.round(width));
      canvas.height = Math.max(1, Math.round((canvas.width * height) / width));
      radius =
        (Math.min(180, Math.max(110, width * 0.1)) * canvas.width) / width;
      level = 0;
      last = null;
    },
    step(seconds: number, point: { x: number; y: number } | null) {
      level = fadeReveal(level, seconds);
      context.globalCompositeOperation = "destination-out";
      context.fillStyle = `rgba(0,0,0,${1 - Math.exp(-REVEAL_DECAY * seconds)})`;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.globalCompositeOperation = "source-over";
      if (point) {
        const next = {
          x: point.x * canvas.width,
          y: (1 - point.y) * canvas.height,
        };
        const from = last ?? next;
        const count = strokeSteps(
          Math.hypot(next.x - from.x, next.y - from.y),
          radius,
        );
        for (let i = 1; i <= count; i++) {
          const x = from.x + ((next.x - from.x) * i) / count;
          const y = from.y + ((next.y - from.y) * i) / count;
          context.drawImage(
            brush,
            x - radius * 1.12,
            y - radius * 0.84,
            radius * 2.24,
            radius * 1.68,
          );
        }
        last = next;
        level = 1;
      } else last = null;
      if (level < REVEAL_CUTOFF) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        level = 0;
      }
      return level;
    },
    clear() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      level = 0;
      last = null;
    },
  };
}
