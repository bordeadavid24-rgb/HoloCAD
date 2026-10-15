import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { Cube } from "@phosphor-icons/react/dist/csr/Cube";
import { X } from "@phosphor-icons/react/dist/csr/X";
import CinematicIntro from "./components/CinematicIntro";
import { Reveal } from "./components/Reveal";
import {
  Exploration,
  Technology,
  TechnicalSection,
} from "./components/Presentation";
import SoftwarePreview from "./components/SoftwarePreview";

function App() {
  const [menu, setMenu] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  const nav = [
    ["Experiența", "#experience"],
    ["Tehnologia", "#technology"],
    ["Viziunea", "#vision"],
  ];
  return (
    <>
      <a className="skip-link" href="#main">
        Sari la conținut
      </a>
      <header className="site-header">
        <nav className="container nav" aria-label="Navigare principală">
          <a className="wordmark" href="#">
            Holo<span>CAD</span>
          </a>
          <div className="desktop-links">
            {nav.map(([name, href]) => (
              <a key={href} href={href}>
                {name}
              </a>
            ))}
          </div>
          <a
            className="button button-small button-light nav-cta"
            href="#explore"
          >
            Explorează HoloCAD <ArrowRight size={14} />
          </a>
          <button
            className="mobile-menu-button"
            aria-label={menu ? "Închide meniul" : "Deschide meniul"}
            aria-expanded={menu}
            aria-controls="mobile-nav"
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? (
              <X size={22} />
            ) : (
              <span className="menu-lines">
                <i />
                <i />
              </span>
            )}
          </button>
        </nav>
        {menu && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Navigare mobilă"
          >
            {[...nav, ["Explorează HoloCAD", "#explore"]].map(
              ([name, href]) => (
                <a key={href} href={href} onClick={() => setMenu(false)}>
                  {name}
                  <ArrowRight size={17} />
                </a>
              ),
            )}
          </nav>
        )}
      </header>
      <main id="main">
        <CinematicIntro />
        <section className="manifesto section container">
          <Reveal>
            <p className="manifesto-lead">
              Unele idei merită
              <br />
              mai mult decât două dimensiuni.
            </p>
            <p>
              Un motor. O structură. Un principiu științific.
              <br />
              HoloCAD își propune să transforme modelele complexe în experiențe
              pe care le poți explora și înțelege.
            </p>
          </Reveal>
          <div className="project-context">
            <span>Un proiect pentru Samsung Solve for Tomorrow</span>
            <span>Liceul Internațional PREMS</span>
          </div>
        </section>
        <Exploration />
        <SoftwarePreview />
        <Technology />
        <TechnicalSection />
        <section className="section purpose-section container">
          <Reveal>
            <div className="purpose-image">
              <img
                src="/images/holocad-hero-realistic.webp"
                alt="Conceptul HoloCAD cu un motor cu șase cilindri în interiorul structurii optice"
                width="1586"
                height="992"
                loading="lazy"
              />
            </div>
            <div className="purpose-copy">
              <span className="eyebrow">Pentru minți curioase</span>
              <h2>
                Învățarea începe
                <br />
                cu o întrebare.
              </h2>
              <p>
                Pentru elevi care vor să înțeleagă. Profesori care vor să
                explice. Viitori ingineri care vor să exploreze.
              </p>
              <div className="purpose-tags">
                <span>Educație STEM</span>
                <span>Inginerie</span>
                <span>Design</span>
              </div>
            </div>
          </Reveal>
        </section>
        <section id="vision" className="section vision-section container">
          <Reveal>
            <h2>
              Viitorul învățării
              <br />
              se construiește acum.
            </h2>
            <p>
              HoloCAD este la început. Primul obiectiv: un prototip educațional
              care conectează modelele 3D, vizualizarea optică și explicațiile
              inteligente.
            </p>
            <div className="vision-progress">
              <span>
                Concept și experiență<small>Acum</small>
              </span>
              <span>
                Prototip și integrare<small>Planificat</small>
              </span>
              <span>
                Testare în educație<small>Planificat</small>
              </span>
            </div>
          </Reveal>
        </section>
        <section className="final-section container">
          <Reveal>
            <span>HoloCAD</span>
            <h2>
              Dincolo de vizualizare.
              <br />
              Spre înțelegere.
            </h2>
            <div className="final-actions">
              <a className="button button-light" href="#explore">
                Explorează HoloCAD <ArrowRight size={16} />
              </a>
              <button
                className="button button-outline"
                onClick={() => dialog.current?.showModal()}
              >
                Despre echipă
              </button>
            </div>
          </Reveal>
        </section>
      </main>
      <footer className="site-footer container">
        <div>
          <a className="wordmark" href="#">
            Holo<span>CAD</span>
          </a>
          <p>Un proiect educațional în dezvoltare.</p>
        </div>
        <div>
          <p>
            Samsung Solve for Tomorrow
            <br />
            Liceul Internațional PREMS
          </p>
        </div>
        <div>
          <p>© 2026 HoloCAD</p>
          <a href="#technology">
            Despre tehnologie <ArrowRight size={14} />
          </a>
        </div>
      </footer>
      <dialog
        ref={dialog}
        className="team-dialog"
        aria-labelledby="team-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div>
          <button
            autoFocus
            className="icon-button dialog-close"
            aria-label="Închide"
            onClick={() => dialog.current?.close()}
          >
            <X size={22} />
          </button>
          <Cube size={40} weight="light" />
          <h2 id="team-title">
            Curiozitate.
            <br />O idee. Un început.
          </h2>
          <p>
            HoloCAD este un proiect educațional al Liceului Internațional PREMS,
            dezvoltat pentru Samsung Solve for Tomorrow.
          </p>
          <p>
            Lucrăm la o experiență care face cunoștințele tridimensionale mai
            accesibile și mai ușor de înțeles.
          </p>
          <button
            className="button button-light"
            onClick={() => dialog.current?.close()}
          >
            Înapoi la HoloCAD
          </button>
        </div>
      </dialog>
    </>
  );
}
export default App;
