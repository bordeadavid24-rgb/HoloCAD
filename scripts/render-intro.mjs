import { chromium } from "@playwright/test";
import ffmpeg from "ffmpeg-static";
import { spawn } from "node:child_process";
import { mkdir, writeFile, rename, readFile } from "node:fs/promises";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

// Deterministic offline asset rendering; this does not interact with the website UI.
const output = fileURLToPath(new URL("../public/video/", import.meta.url));
const hardware = process.argv.includes("--hardware");
const highQuality = process.argv.includes("--hq");
const name = hardware
  ? "holocad-hardware"
  : highQuality
    ? "holocad-intro-hq"
    : "holocad-intro";
const duration = hardware
  ? JSON.parse(await readFile(output + "hardware-timing.json", "utf8")).duration
  : 16;
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--no-sandbox"],
});
const page = await browser.newPage({
  viewport: highQuality
    ? { width: 3840, height: 2400 }
    : { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
async function ready(mode) {
  await page.goto("http://localhost:5173/render.html?mode=" + mode);
  await page.waitForFunction(() => window.renderReady, {}, { timeout: 60000 });
}
async function renderStills() {
  await ready("engine");
  for (const [imageName, progress] of [
    ["engine-study", 0],
    ["engine-exploded", 0.5],
    ["engine-piston", 1],
  ]) {
    await page.evaluate((p) => window.renderFrame(p), progress);
    await writeFile(
      output + imageName + ".png",
      await page.screenshot({ type: "png", omitBackground: true }),
    );
  }
}
if (process.argv.includes("--stills")) {
  try {
    await renderStills();
    console.log("Updated engine study renders.");
  } finally {
    await browser.close();
  }
  process.exit(0);
}
const encoder = spawn(
  ffmpeg,
  [
    "-y",
    "-f",
    "image2pipe",
    "-vcodec",
    "png",
    "-r",
    "24",
    "-i",
    "pipe:0",
    ...(hardware
      ? ["-i", output + "../audio/hardware.mp3", "-c:a", "aac", "-b:a", "128k"]
      : ["-an"]),
    "-c:v",
    "libx264",
    "-preset",
    highQuality ? "medium" : "fast",
    "-crf",
    highQuality ? "16" : "21",
    "-pix_fmt",
    "yuv420p",
    "-g",
    highQuality ? "12" : "6",
    "-keyint_min",
    highQuality ? "12" : "6",
    "-movflags",
    "+faststart",
    output + name + "-render.mp4",
  ],
  { stdio: ["pipe", "ignore", "pipe"] },
);
let encoderError = "";
encoder.stderr.on("data", (data) => {
  encoderError = String(data).slice(-1800);
});
try {
  if (!hardware && !highQuality) await renderStills();
  await ready(hardware ? "hardware" : highQuality ? "intro-hq" : "intro");
  const total = Math.ceil(duration * 24);
  for (let frame = 0; frame < total; frame++) {
    await page.evaluate(
      (progress) => window.renderFrame(progress),
      frame / (total - 1),
    );
    const pixels = await page.screenshot({ type: "png" });
    if (!encoder.stdin.write(pixels)) await once(encoder.stdin, "drain");
    if (frame === Math.round(total * (hardware ? 0.025 : 0.15))) {
      await writeFile(
        output +
          (hardware
            ? "holocad-hardware-poster"
            : highQuality
              ? "holocad-poster-hq"
              : "holocad-poster") +
          ".jpg",
        await page.screenshot({ type: "jpeg", quality: highQuality ? 96 : 92 }),
      );
    }
    if (frame % 48 === 0) console.log(name + " frames: " + frame + "/" + total);
  }
  const finished = once(encoder, "close");
  encoder.stdin.end();
  const [code] = await finished;
  if (code !== 0) throw new Error("Encoder failed: " + encoderError);
  await rename(output + name + "-render.mp4", output + name + ".mp4");
  if (highQuality) {
    const downsample = spawn(
      ffmpeg,
      [
        "-y",
        "-v",
        "error",
        "-i",
        output + name + ".mp4",
        "-vf",
        "scale=1920:1200:flags=lanczos",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "17",
        "-pix_fmt",
        "yuv420p",
        "-g",
        "12",
        "-keyint_min",
        "12",
        "-an",
        "-movflags",
        "+faststart",
        output + name + "-hd-render.mp4",
      ],
      { stdio: ["ignore", "ignore", "inherit"] },
    );
    const [code] = await once(downsample, "close");
    if (code !== 0) throw new Error("Mobile video encoding failed.");
    await rename(output + name + "-hd-render.mp4", output + name + "-hd.mp4");
    console.log("Created 1920×1200 mobile fallback.");
  }
  console.log(
    "Created " + output + name + ".mp4 (" + duration.toFixed(1) + "s)",
  );
} finally {
  await browser.close();
  if (encoder.exitCode === null) encoder.kill();
}
