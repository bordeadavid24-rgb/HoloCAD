import { useEffect, useRef, useState, type RefObject } from "react";
import { Scan } from "@phosphor-icons/react/dist/csr/Scan";
import { X } from "@phosphor-icons/react/dist/csr/X";
import type { createHeroLens, LensMode } from "../three/hero-lens";
import "../hero-interaction.css";

const layers = [
  {
    id: "optics",
    label: "Optică",
    title: "Lumina devine volum.",
    body: "Treci peste sticlă și descoperă structura. Imaginile reflectate creează iluzia unui obiect suspendat.",
  },
  {
    id: "hardware",
    label: "Hardware",
    title: "Sub suprafață.",
    body: "O placă de control, conexiuni și trasee de semnal. Raspberry Pi este o opțiune explorată; configurația finală nu este stabilită.",
  },
  {
    id: "intelligence",
    label: "Inteligență",
    title: "De la model la explicație.",
    body: "Componente etichetate → context tehnic → explicație. Traseele ilustrează legătura dintre model și asistent, nu inferență AI live.",
  },
] as const;

export default function HeroInteraction({
  film,
}: {
  film: RefObject<HTMLVideoElement | null>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<ReturnType<typeof createHeroLens> | null>(null);
  const [mode, setMode] = useState<LensMode>("optics");
  const [activity, setActivity] = useState({ active: false, pinned: false });
  const [fallback, setFallback] = useState(false);
  const [ready, setReady] = useState(false);
  const lastControl = useRef<HTMLButtonElement | null>(null);
  const current = layers.find((layer) => layer.id === mode)!;
  useEffect(() => {
    const surface = canvas.current;
    const video = film.current;
    const host = surface?.closest<HTMLElement>(".film-stage");
    if (!surface || !video || !host) return;
    let disposed = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fail = () => {
      controller.current?.dispose();
      controller.current = null;
      setFallback(true);
      setReady(true);
    };
    const load = async () => {
      if (reduced.matches) {
        fail();
        return;
      }
      try {
        const { createHeroLens } = await import("../three/hero-lens");
        if (disposed || reduced.matches) return;
        controller.current = createHeroLens(
          surface,
          host,
          video,
          (active, pinned) => setActivity({ active, pinned }),
        );
        setFallback(false);
        setReady(true);
      } catch {
        if (!disposed) fail();
      }
    };
    const change = () => {
      controller.current?.dispose();
      controller.current = null;
      setActivity({ active: false, pinned: false });
      void load();
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      fail();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !controller.current) {
        setActivity({ active: false, pinned: false });
      }
    };
    reduced.addEventListener("change", change);
    window.addEventListener("keydown", key);
    surface.addEventListener("webglcontextlost", contextLost);
    void load();
    return () => {
      disposed = true;
      reduced.removeEventListener("change", change);
      window.removeEventListener("keydown", key);
      surface.removeEventListener("webglcontextlost", contextLost);
      controller.current?.dispose();
      controller.current = null;
    };
  }, [film]);
  const select = (id: LensMode) => {
    setMode(id);
    if (fallback) setActivity({ active: true, pinned: true });
    else controller.current?.setMode(id);
  };
  const close = () => {
    controller.current?.close();
    setActivity({ active: false, pinned: false });
    lastControl.current?.focus({ preventScroll: true });
  };
  return (
    <div
      className="hero-interaction"
      data-active={activity.active}
      data-pinned={activity.pinned}
      data-fallback={fallback}
    >
      <canvas ref={canvas} className="hero-lens" aria-hidden="true" />
      <div className="hero-inspector-controls">
        <p className="hero-inspector-hint">
          <Scan size={16} aria-hidden="true" />
          <span>
            {activity.pinned
              ? "Vedere fixată · Esc pentru a reveni"
              : "Explorează dincolo de sticlă"}
          </span>
        </p>
        <div
          className="hero-layer-switch"
          role="group"
          aria-label="Explorează straturile prototipului"
        >
          {layers.map((layer) => (
            <button
              key={layer.id}
              type="button"
              disabled={!ready}
              aria-pressed={activity.pinned && mode === layer.id}
              aria-controls="hero-layer-detail"
              onClick={(event) => {
                lastControl.current = event.currentTarget;
                select(layer.id);
              }}
            >
              {layer.label}
            </button>
          ))}
        </div>
        <span className="hero-pointer-hint">
          Mișcă cursorul peste prototip. Clic pentru a fixa.
        </span>
      </div>
      <aside
        id="hero-layer-detail"
        className="hero-layer-detail"
        aria-hidden={!activity.active}
        inert={!activity.active}
      >
        <div className="hero-detail-top">
          <span>{current.label}</span>
          <button
            type="button"
            onClick={close}
            aria-label="Închide explorarea stratului"
          >
            <X size={17} />
          </button>
        </div>
        <h2>{current.title}</h2>
        <p>{current.body}</p>
        <span className="hero-concept-note">
          Explorare conceptuală · HoloCAD
        </span>
      </aside>
      <div className="hero-lens-status" role="status" aria-live="polite">
        {activity.pinned
          ? `${current.label}. ${current.title} ${current.body}`
          : ""}
      </div>
    </div>
  );
}
