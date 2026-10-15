import { Cube } from "@phosphor-icons/react/dist/csr/Cube";
import { CaretDown } from "@phosphor-icons/react/dist/csr/CaretDown";
import { FolderOpen } from "@phosphor-icons/react/dist/csr/FolderOpen";
import { ArrowsOut } from "@phosphor-icons/react/dist/csr/ArrowsOut";
import { ArrowsClockwise } from "@phosphor-icons/react/dist/csr/ArrowsClockwise";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { SpeakerHigh } from "@phosphor-icons/react/dist/csr/SpeakerHigh";
import { Stack } from "@phosphor-icons/react/dist/csr/Stack";

export default function SoftwarePreview() {
  return (
    <section
      id="experience"
      className="section software-section container"
      aria-labelledby="software-title"
    >
      <div className="software-heading">
        <h2 id="software-title">
          Modelul tău.
          <br />
          Un spațiu pentru înțelegere.
        </h2>
        <p>
          O privire către aplicația HoloCAD.
          <br />
          Explorare, explicații și controlul afișajului, într-un singur loc.
        </p>
      </div>
      <figure className="software-preview">
        <div className="desktop-concept">
          <div className="app-titlebar">
            <span className="app-brand">
              HoloCAD <span>Desktop</span>
            </span>
            <span className="app-document">
              motor.glb <span>/ Proiect demonstrativ</span>
            </span>
            <span className="app-concept-status">Concept de interfață</span>
          </div>
          <div className="app-workspace">
            <aside
              className="app-library"
              aria-label="Biblioteca și componentele modelului propuse"
            >
              <div className="app-panel-heading">
                <span>Bibliotecă</span>
                <FolderOpen size={16} aria-hidden="true" />
              </div>
              <div className="app-model-file">
                <Cube size={18} aria-hidden="true" />
                <div>
                  <span>motor.glb</span>
                  <small>Ansamblu demonstrativ</small>
                </div>
              </div>
              <div className="app-tree-title">
                Componente <span>6 cilindri</span>
              </div>
              <ul className="app-model-tree">
                <li>
                  <CaretDown size={12} aria-hidden="true" />
                  Motor cu șase cilindri
                </li>
                <li className="tree-group">
                  <Stack size={13} aria-hidden="true" />
                  Distribuție
                </li>
                <li className="tree-group">
                  <CaretDown size={12} aria-hidden="true" />
                  Pistoane
                </li>
                {[1, 2, 3, 4, 5, 6].map((number) => (
                  <li
                    key={number}
                    className={`tree-part ${number === 4 ? "tree-selected" : ""}`}
                  >
                    <Cube size={12} aria-hidden="true" />
                    Piston {String(number).padStart(2, "0")}
                    {number === 4 && (
                      <span
                        className="tree-selection-mark"
                        role="img"
                        aria-label="Componentă selectată"
                      />
                    )}
                  </li>
                ))}
                <li className="tree-group">
                  <Stack size={13} aria-hidden="true" />
                  Biele
                </li>
                <li className="tree-group">
                  <Cube size={13} aria-hidden="true" />
                  Arbore cotit
                </li>
                <li className="tree-group">
                  <Cube size={13} aria-hidden="true" />
                  Bloc motor
                </li>
              </ul>
              <div className="app-library-footer">
                <span>Formate vizate</span>
                <p>GLB · GLTF · STL</p>
              </div>
            </aside>
            <div className="app-model-workspace">
              <div className="app-model-toolbar">
                <span className="app-view-name">Explorare 3D</span>
                <div
                  className="app-illustrated-tools"
                  aria-label="Comenzi ilustrate, inactive"
                >
                  <span>
                    <ArrowsClockwise size={15} aria-hidden="true" />
                    Rotire
                  </span>
                  <span>
                    <Stack size={15} aria-hidden="true" />
                    Descompunere
                  </span>
                  <span className="app-fit-tool">
                    <ArrowsOut size={15} aria-hidden="true" />
                    Încadrare
                  </span>
                </div>
              </div>
              <div className="app-model-canvas">
                <svg
                  className="app-floor-grid"
                  viewBox="0 0 600 400"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <g fill="none" stroke="currentColor" strokeWidth="0.6">
                    <path d="M60 330 L540 330 M110 300 L490 300 M160 270 L440 270 M210 240 L390 240 M260 210 L340 210 M60 330 L260 210 M160 330 L276 210 M260 330 L292 210 M360 330 L308 210 M460 330 L324 210 M540 330 L340 210" />
                  </g>
                </svg>
                <img
                  className="app-engine-image"
                  src="/video/engine-piston.png"
                  width="1440"
                  height="900"
                  loading="lazy"
                  alt="Previzualizare a spațiului 3D, cu pistonul patru separat de ansamblul motorului"
                />
                <div className="app-part-label">
                  <span>Piston 04</span>
                  <small>Componentă selectată</small>
                  <span className="app-label-leader" aria-hidden="true" />
                </div>
                <span className="app-orientation" aria-hidden="true">
                  <i />X<span />Y
                </span>
                <span className="app-model-view-caption">
                  Perspectivă · model în secțiune
                </span>
              </div>
              <div className="app-display-bar">
                <div>
                  <span>Afișaj optic</span>
                  <small>Previzualizare a imaginilor reflectate</small>
                </div>
                <span className="app-output-mode">4 perspective</span>
              </div>
            </div>
            <aside
              className="app-assistance"
              aria-label="Exemplu ilustrativ de asistență contextuală"
            >
              <div className="app-panel-heading">
                <span>Asistență HoloCAD</span>
                <span className="app-assistant-monogram" aria-hidden="true">
                  H
                </span>
              </div>
              <div className="app-context-tag">
                <Cube size={13} aria-hidden="true" />
                Piston 04 <span>selectat</span>
              </div>
              <div className="app-example-question">
                Ce rol are această piesă?
              </div>
              <div className="app-example-answer">
                <span>De la mișcare la rotație.</span>
                <p>
                  Pistonul se deplasează în cilindru și transmite forța către
                  bielă. Împreună cu arborele cotit, mecanismul transformă
                  mișcarea alternativă în rotație.
                </p>
                <p>
                  Segmenții de pe margine contribuie la etanșarea camerei de
                  ardere.
                </p>
              </div>
              <div className="app-answer-context">
                <span>Contextul explicației</span>
                <p>
                  Componentă etichetată
                  <br />
                  Informații tehnice asociate
                </p>
              </div>
              <div className="app-voice-preview">
                <SpeakerHigh size={16} aria-hidden="true" />
                <span>Explicație vocală</span>
                <small>Funcție planificată</small>
              </div>
              <div className="app-question-preview">
                <MagnifyingGlass size={15} aria-hidden="true" />
                <span>Întreabă despre model…</span>
              </div>
            </aside>
          </div>
          <div className="app-statusbar">
            <span>Model demonstrativ · 6 cilindri</span>
            <span>
              Randare locală <span className="app-status-divider">/</span>{" "}
              arhitectură propusă
            </span>
          </div>
        </div>
        <figcaption>
          Previzualizare statică a interfeței propuse. Aplicația este în
          dezvoltare; comenzile ilustrate nu sunt active.
        </figcaption>
      </figure>
      <div className="software-principles">
        <div>
          <h3>Modelul, în centru.</h3>
          <p>
            Import, rotire și explorare, fără să pierzi perspectiva asupra
            întregului.
          </p>
        </div>
        <div>
          <h3>Piesa, în context.</h3>
          <p>
            Selecția conectează componentele identificabile cu explicațiile
            relevante.
          </p>
        </div>
        <div>
          <h3>Afișajul, în control.</h3>
          <p>
            Aplicația va pregăti perspectivele și orientarea pentru dispozitivul
            optic.
          </p>
        </div>
      </div>
    </section>
  );
}
