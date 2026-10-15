import "@fontsource/geist/latin-400.css";
import "@fontsource/geist/latin-500.css";
import "@fontsource/geist/latin-ext-400.css";
import "@fontsource/geist/latin-ext-500.css";
import { createStage } from "./product";
const mode = new URLSearchParams(window.location.search).get("mode") || "intro";
const canvas = document.getElementById("render") as HTMLCanvasElement;
const stage = createStage(
  canvas,
  mode === "engine" ? "engine" : "device",
  mode !== "engine",
  mode === "intro-hq",
);
stage.resize(window.innerWidth, window.innerHeight);
const control = window as unknown as {
  renderReady: boolean;
  renderFrame: (progress: number) => void;
};
type Timing = {
  duration: number;
  chapters: { key: string; start: number; title: string; text: string }[];
};
const build = async () => {
  await document.fonts.ready;
  if (mode === "hardware") {
    const timing: Timing = await fetch("/video/hardware-timing.json").then(
      (response) => response.json(),
    );
    const graphics = document.createElement("div");
    graphics.className = "render-graphics";
    graphics.innerHTML = `<div class="render-title">HoloCAD <span>Strat cu strat.</span></div><div class="render-copy"><span class="render-counter"></span><h1></h1><p></p></div><svg class="render-lines"><path /><circle r="4" /></svg><div class="render-footer"><span>Reprezentare conceptuală · componente propuse</span><span class="render-time"></span></div><div class="render-progress"></div>`;
    document.body.appendChild(graphics);
    const style = document.createElement("style");
    style.textContent = `body { font-family: Geist, sans-serif; color: #f5f7fa; } .render-graphics { position: fixed; inset: 0; pointer-events: none; } .render-title { position: absolute; left: 5%; top: 6%; font-size: 27px; letter-spacing: -0.03em; } .render-title span { color: #b0b7bf; margin-left: 15px; font-size: 18px; } .render-copy { position: absolute; left: 5%; top: 28%; width: 25%; } .render-counter { font-size: 13px; color: #b9bdc2; } .render-copy h1 { font-size: 36px; font-weight: 500; letter-spacing: -0.035em; line-height: 1.1; margin: 24px 0 18px; } .render-copy p { font-size: 18px; line-height: 1.6; color: #b9c0c8; margin: 0; } .render-lines { width: 100%; height: 100%; fill: none; stroke: #929ba5; stroke-width: 1; } .render-lines circle { fill: #dbdedf; stroke: none; } .render-footer { position: absolute; bottom: 5%; left: 5%; right: 5%; display: flex; justify-content: space-between; color: #a5adb7; font-size: 12px; } .render-progress { position: absolute; bottom: 0; left: 0; height: 2px; background: #d5d1ca; width: 100%; transform-origin: left; }`;
    document.head.appendChild(style);
    const copy = graphics.querySelector<HTMLElement>(".render-copy")!;
    const path = graphics.querySelector("path")!;
    const dot = graphics.querySelector("circle")!;
    control.renderFrame = (progress) => {
      const time = progress * timing.duration;
      let index = 0;
      timing.chapters.forEach((chapter, i) => {
        if (time >= chapter.start) index = i;
      });
      const chapter = timing.chapters[index];
      const next = timing.chapters[index + 1]?.start ?? timing.duration;
      const local = Math.min(1, Math.max(0, (time - chapter.start) / 0.8));
      const exit = Math.min(1, Math.max(0, (next - time) / 0.35));
      const visibility = local * exit;
      copy.style.opacity = String(visibility);
      copy.style.transform = `translateY(${(1 - local) * 12}px)`;
      graphics.querySelector("h1")!.textContent = chapter.title;
      graphics.querySelector(".render-copy p")!.textContent = chapter.text;
      graphics.querySelector(".render-counter")!.textContent =
        `${String(index + 1).padStart(2, "0")} / 05`;
      const points = stage.hardwareFrame(progress);
      const point = points.find((item) => item.name === chapter.key)!;
      const x = point.x * window.innerWidth;
      const y = point.y * window.innerHeight;
      const originX = window.innerWidth * 0.31;
      const originY = window.innerHeight * 0.56;
      path.setAttribute(
        "d",
        `M ${originX} ${originY} H ${originX + 35} L ${x} ${y}`,
      );
      path.setAttribute("opacity", String(visibility));
      dot.setAttribute("cx", String(x));
      dot.setAttribute("cy", String(y));
      dot.setAttribute("opacity", String(visibility));
      graphics.querySelector<HTMLElement>(".render-progress")!.style.transform =
        `scaleX(${progress})`;
      graphics.querySelector(".render-time")!.textContent =
        `${Math.floor(time).toString().padStart(2, "0")}s / ${Math.ceil(timing.duration)}s`;
    };
  } else if (mode === "engine") {
    control.renderFrame = (progress) => {
      for (let i = 0; i < 80; i++)
        stage.render(
          1,
          progress === 0.5 ? 1 : 0,
          null,
          progress === 1 ? "piston-3" : null,
          progress === 1 ? 1 : 0,
        );
    };
  } else control.renderFrame = (progress) => stage.cinematicFrame(progress);
  control.renderFrame(0);
  control.renderReady = true;
};
void build();
