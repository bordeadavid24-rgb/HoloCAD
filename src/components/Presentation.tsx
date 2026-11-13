import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Hand } from "@phosphor-icons/react/dist/csr/Hand";
import { Pause } from "@phosphor-icons/react/dist/csr/Pause";
import { Play } from "@phosphor-icons/react/dist/csr/Play";
import { SpeakerHigh } from "@phosphor-icons/react/dist/csr/SpeakerHigh";
import { SpeakerSlash } from "@phosphor-icons/react/dist/csr/SpeakerSlash";
import { Stack } from "@phosphor-icons/react/dist/csr/Stack";
import { X } from "@phosphor-icons/react/dist/csr/X";
import type { PartId } from "../three/product";
import { Reveal } from "./Reveal";
const DeviceScene = lazy(() => import("./DeviceScene"));

function DeferredScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
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
  }, []);
  return (
    <div ref={root} className="scene-viewport">
      {ready ? (
        <Suspense
          fallback={<p className="scene-loading">Pregătim modelul 3D…</p>}
        >
          {children}
        </Suspense>
      ) : (
        <p className="scene-loading">Pregătim modelul 3D…</p>
      )}
    </div>
  );
}

const explanations = {
  piston: {
    title: "Pistonul",
    audio: "piston",
    text: "Se deplasează în cilindru și transmite forța către bielă. Segmenții de pe margine contribuie la etanșarea camerei de ardere.",
  },
  rod: {
    title: "Biela",
    audio: "rod",
    text: "Leagă pistonul de arborele cotit. Articulațiile îi permit să urmărească mișcarea alternativă a pistonului și rotația arborelui.",
  },
  crankshaft: {
    title: "Arborele cotit",
    audio: "crankshaft",
    text: "Transformă, împreună cu bielele, mișcarea alternativă în rotație. Contragreutățile contribuie la echilibrarea ansamblului.",
  },
  heads: {
    title: "Distribuția",
    audio: "heads",
    text: "Arborii cu came comandă supapele. Distribuția sincronizează admisia și evacuarea cu mișcarea pistoanelor.",
  },
  block: {
    title: "Blocul motor",
    audio: "block",
    text: "Susține cilindrii și componentele mecanismului. În această reprezentare este transparent, pentru a putea vedea piesele din interior.",
  },
  assembly: {
    title: "Un sistem. Piese care lucrează împreună.",
    audio: "assembly",
    text: "Distribuția se ridică, pistoanele și bielele se separă, iar arborele cotit coboară. Descompunerea face vizibile relațiile dintre componente.",
  },
};
function explanationFor(part: PartId | null) {
  return part?.startsWith("piston-")
    ? explanations.piston
    : part?.startsWith("rod-")
      ? explanations.rod
      : part === "heads"
        ? explanations.heads
        : part === "block"
          ? explanations.block
          : explanations.crankshaft;
}

export function Exploration() {
  const [selected, setSelected] = useState<PartId | null>(null);
  const [exploded, setExploded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reset, setReset] = useState(0);
  const [voice, setVoice] = useState(true);
  const [audioState, setAudioState] = useState("idle");
  const audio = useRef<HTMLAudioElement | null>(null);
  const region = useRef<HTMLDivElement>(null);
  const stop = () => {
    audio.current?.pause();
    audio.current = null;
    setAudioState("idle");
  };
  const speak = (id: string) => {
    stop();
    const clip = new Audio(`/audio/${id}.mp3`);
    audio.current = clip;
    setAudioState("loading");
    clip.onplaying = () => {
      if (audio.current === clip) setAudioState("playing");
    };
    clip.onended = () => {
      if (audio.current === clip) setAudioState("idle");
    };
    clip.onerror = () => {
      if (audio.current === clip) setAudioState("error");
    };
    void clip.play().catch(() => {
      if (audio.current === clip) setAudioState("error");
    });
  };
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) {
        audio.current?.pause();
        setAudioState("idle");
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        audio.current?.pause();
        setAudioState("idle");
      }
    });
    if (region.current) observer.observe(region.current);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      audio.current?.pause();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const choose = (part: PartId) => {
    setSelected(part);
    setExploded(false);
    setPaused(true);
    if (voice) speak(explanationFor(part).audio);
    else stop();
  };
  const current = selected
    ? explanationFor(selected)
    : exploded
      ? explanations.assembly
      : null;
  const close = () => {
    setSelected(null);
    setExploded(false);
    setPaused(false);
    stop();
  };
  return (
    <section id="explore" className="section explore-section container">
      <Reveal className="section-heading">
        <h2>
          Nu doar vezi.
          <br />
          <span>Înțelegi.</span>
        </h2>
        <p>Atinge o piesă. Descoperă rolul ei. Ascultă explicația.</p>
      </Reveal>
      <Reveal className="engine-experience">
        <div ref={region} className="engine-view immersive-engine">
          <div className="viewer-heading">
            <span>Motor cu șase cilindri · vedere în secțiune</span>
            <span>Model demonstrativ</span>
          </div>
          <DeferredScene>
            <DeviceScene
              variant="engine"
              exploded={exploded}
              selectedPart={selected}
              onPartSelect={choose}
              paused={paused}
              resetKey={reset}
              annotation={
                current ? (
                  <>
                    <button
                      className="annotation-close icon-button"
                      aria-label="Recompune și închide explicația"
                      onClick={close}
                    >
                      <X size={16} />
                    </button>
                    <span className="part-caption">
                      {selected?.startsWith("piston-")
                        ? `Piston ${Number(selected.split("-")[1]) + 1} / 6`
                        : "HoloCAD explică"}
                    </span>
                    <h3>{current.title}</h3>
                    <p>{current.text}</p>
                    <span className="narration-status" role="status">
                      {audioState === "playing"
                        ? "Explicație vocală în curs"
                        : audioState === "loading"
                          ? "Pregătim explicația…"
                          : audioState === "error"
                            ? "Audio indisponibil. Încearcă din nou."
                            : "Explicație de concept"}
                    </span>
                  </>
                ) : undefined
              }
            />
          </DeferredScene>
          {!current && (
            <p className="engine-instruction">
              Selectează direct un piston, o bielă sau distribuția.
            </p>
          )}
          <div className="engine-toolbar">
            <span className="drag-hint">
              <Hand size={17} /> Trage în orice direcție
            </span>
            <button
              className="button button-small button-outline"
              aria-pressed={exploded}
              onClick={() => {
                const next = !exploded;
                setExploded(next);
                setSelected(null);
                if (next && voice) speak("assembly");
                else stop();
              }}
            >
              <Stack size={17} />
              {exploded ? "Recompune ansamblul" : "Descompune ansamblul"}
            </button>
            <div className="engine-actions">
              <button
                className="icon-button"
                aria-label={paused ? "Pornește mișcarea" : "Oprește mișcarea"}
                aria-pressed={paused}
                onClick={() => setPaused(!paused)}
              >
                {paused ? <Play size={17} /> : <Pause size={17} />}
              </button>
              <button
                className="subtle-button"
                onClick={() => {
                  setReset(reset + 1);
                  close();
                }}
              >
                Resetează
              </button>
              <button
                className="icon-button"
                aria-label={voice ? "Oprește vocea" : "Activează vocea"}
                aria-pressed={voice}
                onClick={() => {
                  if (voice) stop();
                  setVoice(!voice);
                }}
              >
                {voice ? <SpeakerHigh size={19} /> : <SpeakerSlash size={19} />}
              </button>
              {current && voice && (
                <button
                  className="subtle-button"
                  onClick={() =>
                    audioState === "playing" ? stop() : speak(current.audio)
                  }
                >
                  {audioState === "playing" ? "Oprește vocea" : "Reascultă"}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="engine-caption">
          <p>
            Explicații pregătite · voce ElevenLabs · mecanism ilustrativ, nu
            simulare validată.
          </p>
          <label className="accessible-parts">
            Selectare alternativă{" "}
            <select
              aria-label="Selectează o componentă a motorului"
              value={selected ?? ""}
              onChange={(event) =>
                event.target.value
                  ? choose(event.target.value as PartId)
                  : close()
              }
            >
              <option value="">Întregul motor</option>
              {Array.from({ length: 6 }, (_, i) => (
                <option value={`piston-${i}`} key={`p${i}`}>
                  Pistonul {i + 1}
                </option>
              ))}
              {Array.from({ length: 6 }, (_, i) => (
                <option value={`rod-${i}`} key={`r${i}`}>
                  Biela {i + 1}
                </option>
              ))}
              <option value="crankshaft">Arborele cotit</option>
              <option value="heads">Distribuția</option>
              <option value="block">Blocul motor</option>
            </select>
          </label>
        </div>
      </Reveal>
    </section>
  );
}

export function Technology() {
  const video = useRef<HTMLVideoElement>(null);
  const region = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.current?.pause();
    });
    if (region.current) observer.observe(region.current);
    const visibility = () => {
      if (document.hidden) video.current?.pause();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const play = () => {
    const film = video.current;
    if (!film) return;
    if (playing) film.pause();
    else {
      setStarted(true);
      setError(false);
      void film.play().catch(() => setError(true));
    }
  };
  return (
    <section id="technology" className="section technology-section container">
      <Reveal className="section-heading">
        <h2>
          Un principiu simplu.
          <br />O perspectivă extraordinară.
        </h2>
        <p>Descoperă ce se află între imagine și iluzie.</p>
      </Reveal>
      <Reveal className="hardware-film-wrapper">
        <div className="hardware-film" ref={region}>
          <video
            ref={video}
            src="/video/holocad-hardware.mp4"
            preload="none"
            playsInline
            muted={muted}
            controls={started}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            aria-label="Animație explicată a componentelor dispozitivului HoloCAD"
          >
            <track
              default
              kind="captions"
              srcLang="ro"
              label="Română"
              src="/video/holocad-hardware.vtt"
            />
          </video>
          {!started && (
            <img
              className="hardware-poster"
              src="/video/holocad-hardware-poster.jpg"
              alt=""
              width="1440"
              height="900"
              loading="lazy"
              decoding="async"
            />
          )}
          {!started && (
            <div className="hardware-film-intro">
              <span>HoloCAD, strat cu strat.</span>
              <button className="button button-light" onClick={play}>
                <Play size={18} weight="fill" />
                Descoperă componentele
              </button>
              <p>Scurtă prezentare animată, cu explicație vocală.</p>
            </div>
          )}
        </div>
        <div className="film-control-row">
          <span>Suprafețe optice · afișaj · electronică · sunet</span>
          <div>
            <button className="subtle-button" onClick={play}>
              {playing
                ? "Pauză"
                : started
                  ? "Continuă prezentarea"
                  : "Pornește prezentarea"}
            </button>
            <button
              className="icon-button"
              aria-label={muted ? "Activează sunetul" : "Oprește sunetul"}
              aria-pressed={!muted}
              onClick={() => setMuted(!muted)}
            >
              {muted ? <SpeakerSlash size={19} /> : <SpeakerHigh size={19} />}
            </button>
            {started && (
              <button
                className="subtle-button"
                onClick={() => {
                  if (video.current) video.current.currentTime = 0;
                  if (!playing) play();
                }}
              >
                De la început
              </button>
            )}
          </div>
        </div>
        {error && (
          <p role="status">
            Prezentarea nu poate fi redată. Încearcă din nou sau consultă
            componentele de mai jos.
          </p>
        )}
        <p className="section-note">
          Reprezentare conceptuală. Pepper’s Ghost creează o iluzie prin
          reflexie, nu o hologramă în spațiu liber.
        </p>
      </Reveal>
    </section>
  );
}

export function TechnicalSection() {
  return (
    <section id="architecture" className="section technical-section container">
      <Reveal className="technical-heading">
        <h2>
          Din viziune.
          <br />
          În construcție.
        </h2>
        <p>
          Ce propunem să folosim.
          <br />
          Cum vom conecta totul.
        </p>
      </Reveal>
      <Reveal className="technical-blueprint">
        <div className="blueprint-top">
          <h3>Arhitectura propusă</h3>
          <span>În dezvoltare · nu specificații finale</span>
        </div>
        <div className="architecture-flow">
          <div>
            <span>Intrare</span>
            <h4>Model 3D</h4>
            <p>
              GLB / GLTF / STL
              <br />
              Piese etichetate + context
            </p>
          </div>
          <span className="architecture-connector" aria-hidden="true" />
          <div>
            <span>Procesare locală</span>
            <h4>Aplicație desktop</h4>
            <p>
              Import · explorare · randare
              <br />
              Perspective sincronizate
            </p>
          </div>
          <span className="architecture-connector" aria-hidden="true" />
          <div>
            <span>Ieșire</span>
            <h4>Dispozitiv optic</h4>
            <p>
              Conexiune prin cablu
              <br />
              Imagine reflectată + audio
            </p>
          </div>
        </div>
        <div className="intelligence-branch">
          <span className="branch-line" aria-hidden="true" />
          <h4>Asistență AI</h4>
          <p>Contextul modelului → explicație → componentă evidențiată</p>
        </div>
      </Reveal>
      <details className="technical-details">
        <summary>Componente, software și etapele de dezvoltare</summary>
        <Reveal className="engineering-columns">
          <div className="engineering-column">
            <h3>Hardware</h3>
            <dl>
              <div>
                <dt>Structură optică</dt>
                <dd>
                  Fețe transparente reflectante, cu materialul și unghiurile
                  validate prin teste de vizibilitate.
                </dd>
              </div>
              <div>
                <dt>Sursă de imagine</dt>
                <dd>
                  Un afișaj orientat spre suprafețele optice. Dimensiunea și
                  luminozitatea vor fi alese în prototipare.
                </dd>
              </div>
              <div>
                <dt>Carcasă + audio</dt>
                <dd>
                  Carcasă realizabilă prin fabricație digitală, difuzor și
                  amplificare pentru explicațiile vocale.
                </dd>
              </div>
              <div>
                <dt>Conectare</dt>
                <dd>
                  Laptopul furnizează randarea. Prima variantă este prin cablu;
                  alimentarea și interfața depind de afișajul ales.
                </dd>
              </div>
            </dl>
          </div>
          <div className="engineering-column">
            <h3>Software</h3>
            <dl>
              <div>
                <dt>Tauri · React · TypeScript</dt>
                <dd>
                  Aplicația desktop: bibliotecă de modele, comenzi de explorare
                  și controlul dispozitivului.
                </dd>
              </div>
              <div>
                <dt>Three.js</dt>
                <dd>
                  Scenă 3D locală, camere sincronizate, orientare calibrată și
                  pregătirea imaginilor reflectate.
                </dd>
              </div>
              <div>
                <dt>Python · Ollama</dt>
                <dd>
                  Direcție explorată pentru asistență locală, folosind etichete,
                  metadate și referințe tehnice. AI-ul offline nu este încă
                  validat.
                </dd>
              </div>
              <div>
                <dt>Identificarea componentelor</dt>
                <dd>
                  Evidențierea și descompunerea necesită piese distincte în
                  model. Geometria singură nu oferă suficiente informații pentru
                  explicații sigure.
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
        <Reveal className="build-sequence">
          <h3>Cum îl vom construi.</h3>
          <ol>
            <li>
              <span>01</span>
              <div>
                <h4>Import și explorare</h4>
                <p>
                  Un viewer stabil, cu manipulare și identificarea pieselor.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h4>Optică și calibrare</h4>
                <p>
                  Construirea structurii și alinierea camerelor virtuale cu
                  reflexiile.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h4>Explicații conectate</h4>
                <p>
                  Context tehnic, selecție, evidențiere și integrarea audio.
                </p>
              </div>
            </li>
            <li>
              <span>04</span>
              <div>
                <h4>Testare în clasă</h4>
                <p>
                  Un caz educațional complet, urmat de feedback și comparație cu
                  o diagramă.
                </p>
              </div>
            </li>
          </ol>
        </Reveal>
      </details>
    </section>
  );
}
