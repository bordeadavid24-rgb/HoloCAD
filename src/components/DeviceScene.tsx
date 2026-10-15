"use client";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import { createStage, type FocusPart, type PartId } from "../three/product";

interface Props {
  variant?: "device" | "engine";
  exploded?: boolean;
  focus?: FocusPart;
  paused?: boolean;
  resetKey?: number;
  eager?: boolean;
  selectedPart?: PartId | null;
  onPartSelect?: (part: PartId) => void;
  annotation?: ReactNode;
}
function RenderedScene({
  variant = "device",
  exploded = false,
  focus = null,
  paused = false,
  resetKey = 0,
  selectedPart = null,
  onPartSelect,
  annotation,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const control = useRef({
    exploded,
    focus,
    paused,
    resetKey,
    selectedPart,
    onPartSelect,
  });
  control.current = {
    exploded,
    focus,
    paused,
    resetKey,
    selectedPart,
    onPartSelect,
  };
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    element.appendChild(canvas);
    let stage: ReturnType<typeof createStage>;
    try {
      stage = createStage(canvas, variant);
    } catch {
      canvas.remove();
      setFailed(true);
      return;
    }
    const resize = new ResizeObserver(() => {
      const bounds = canvas.getBoundingClientRect();
      stage.resize(bounds.width, Math.max(1, bounds.height));
    });
    resize.observe(element);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = preference.matches;
    const preferenceChange = () => {
      reduced = preference.matches;
    };
    preference.addEventListener("change", preferenceChange);
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(element);
    let pointer: number | null = null;
    let lastX = 0;
    let lastY = 0;
    let downX = 0;
    let downY = 0;
    let traveled = 0;
    let yaw = 0;
    let pitch = 0;
    let reset = resetKey;
    let explosion = 0;
    let explosionVelocity = 0;
    let isolation = 0;
    let isolationVelocity = 0;
    let time = 0;
    let previous = performance.now();
    let accumulator = 0;
    const down = (event: PointerEvent) => {
      if (pointer !== null || event.button !== 0) return;
      pointer = event.pointerId;
      lastX = event.clientX;
      lastY = event.clientY;
      downX = lastX;
      downY = lastY;
      traveled = 0;
      element.setPointerCapture(pointer);
      element.classList.add("dragging");
    };
    const move = (event: PointerEvent) => {
      if (pointer === null && control.current.onPartSelect) {
        const rect = canvas.getBoundingClientRect();
        const part = stage.pick(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          1 - ((event.clientY - rect.top) / rect.height) * 2,
        );
        element.style.cursor = part ? "pointer" : "grab";
      }
      if (event.pointerId !== pointer) return;
      traveled = Math.max(
        traveled,
        Math.hypot(event.clientX - downX, event.clientY - downY),
      );
      yaw += (event.clientX - lastX) * 0.009;
      pitch += (event.clientY - lastY) * 0.009;
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const up = (event: PointerEvent) => {
      if (pointer !== event.pointerId) return;
      if (
        event.type === "pointerup" &&
        traveled < 6 &&
        control.current.onPartSelect
      ) {
        const rect = canvas.getBoundingClientRect();
        const part = stage.pick(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          1 - ((event.clientY - rect.top) / rect.height) * 2,
        );
        if (part) control.current.onPartSelect(part);
      }
      if (element.hasPointerCapture(pointer))
        element.releasePointerCapture(pointer);
      pointer = null;
      element.classList.remove("dragging");
    };
    const key = (event: KeyboardEvent) => {
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(
          event.key,
        )
      )
        return;
      event.preventDefault();
      if (event.key === "Home") {
        yaw = pitch = 0;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        yaw += event.key === "ArrowRight" ? 0.2 : -0.2;
      } else {
        pitch += event.key === "ArrowDown" ? 0.2 : -0.2;
      }
      stage.model.rotation.set(pitch, yaw, 0);
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      stage.renderer.setAnimationLoop(null);
      setFailed(true);
    };
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    element.addEventListener("keydown", key);
    canvas.addEventListener("webglcontextlost", contextLost);
    stage.renderer.setAnimationLoop(() => {
      const now = performance.now();
      accumulator += (now - previous) / 1000;
      previous = now;
      if (accumulator < 1 / 30) return;
      const dt = Math.min(accumulator, 0.035);
      accumulator = 0;
      if (!visible || document.hidden) return;
      const current = control.current;
      if (reset !== current.resetKey) {
        yaw = pitch = 0;
        reset = current.resetKey;
      }
      if (!current.paused && !reduced) time += dt;
      const target = current.exploded ? 1 : 0;
      if (reduced) {
        explosion = target;
        explosionVelocity = 0;
      } else {
        // Critically damped spring: the current velocity survives quick reversals.
        explosionVelocity +=
          ((target - explosion) * 9 - explosionVelocity * 6) * dt;
        explosion += explosionVelocity * dt;
      }
      const isolateTarget = current.selectedPart ? 1 : 0;
      if (reduced) isolation = isolateTarget;
      else {
        isolationVelocity +=
          ((isolateTarget - isolation) * 16 - isolationVelocity * 8) * dt;
        isolation += isolationVelocity * dt;
      }
      const blend = reduced ? 1 : 1 - Math.exp(-dt * 10);
      stage.model.rotation.y += (yaw - stage.model.rotation.y) * blend;
      stage.model.rotation.x += (pitch - stage.model.rotation.x) * blend;
      stage.render(
        time,
        Math.min(1, Math.max(0, explosion)),
        current.focus,
        current.selectedPart,
        isolation,
      );
      if (current.selectedPart && label.current) {
        const anchor = stage.anchor(current.selectedPart);
        const bounds = element.getBoundingClientRect();
        const x = Math.max(
          16,
          Math.min(bounds.width - 332, anchor.x * bounds.width + 42),
        );
        const y = Math.max(
          60,
          Math.min(bounds.height - 230, anchor.y * bounds.height - 70),
        );
        label.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      } else if (label.current) label.current.style.transform = "none";
    });
    return () => {
      stage.renderer.setAnimationLoop(null);
      resize.disconnect();
      observer.disconnect();
      preference.removeEventListener("change", preferenceChange);
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
      element.removeEventListener("keydown", key);
      canvas.removeEventListener("webglcontextlost", contextLost);
      stage.dispose();
      canvas.remove();
    };
  }, [variant]);
  return (
    <div
      ref={host}
      className={`scene scene-${variant}`}
      tabIndex={0}
      role="group"
      aria-label={`Model 3D interactiv: ${variant === "device" ? "dispozitivul HoloCAD cu motor în secțiune" : "motor demonstrativ cu șase cilindri"}. Selectează o piesă pentru explicație. Trage în orice direcție sau folosește săgețile pentru rotire. Home resetează perspectiva.`}
    >
      {annotation && (
        <div
          ref={label}
          className={`part-annotation ${selectedPart ? "anchored" : "assembly-annotation"}`}
          onPointerDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          {annotation}
        </div>
      )}
      {failed && (
        <div className="scene-fallback">
          <img src="/video/holocad-poster.jpg" alt="Conceptul HoloCAD" />
          <p>Vizualizarea 3D nu este disponibilă în acest browser.</p>
        </div>
      )}
    </div>
  );
}
const Scene = memo(RenderedScene);
function DeviceScene(props: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(!!props.eager);
  useEffect(() => {
    if (ready) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, [ready]);
  return (
    <div ref={root} className="scene-viewport">
      {ready ? (
        <Scene {...props} />
      ) : (
        <div className="scene-loading">
          Pregătim o nouă perspectivă
          <span />
        </div>
      )}
    </div>
  );
}
export default memo(DeviceScene);
