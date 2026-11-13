import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { InstagramLogo } from "@phosphor-icons/react/dist/csr/InstagramLogo";
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
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 768px)");
    const resize = () => {
      if (wide.matches) setMenu(false);
    };
    wide.addEventListener("change", resize);
    window.addEventListener("keydown", close);
    return () => {
      wide.removeEventListener("change", resize);
      window.removeEventListener("keydown", close);
    };
  }, [menu]);
  const nav = [
    ["Experiența", "#experience"],
    ["Tehnologia", "#technology"],
    ["Viziunea", "#vision"],
    ["Echipa", "#team"],
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
            ref={menuButton}
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
        <section
          className="manifesto section container"
          aria-labelledby="idea-title"
        >
          <Reveal className="manifesto-layout">
            <h2 id="idea-title" className="manifesto-lead">
              Unele idei merită
              <br />
              mai mult decât două dimensiuni.
            </h2>
            <div className="manifesto-copy">
              <p>
                Un motor. O structură. Un principiu științific. HoloCAD își
                propune să transforme modelele complexe în experiențe pe care le
                poți explora și înțelege.
              </p>
              <p>
                Un afișaj bazat pe reflexie aduce modelul în fața ta. Aplicația
                propusă îți permite să îl rotești, să separi componentele și să
                descoperi rolul fiecărei piese.
              </p>
              <a className="text-link" href="#technology">
                Cum funcționează <ArrowRight size={17} />
              </a>
            </div>
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
        <section
          id="team"
          className="section team-section container"
          aria-labelledby="team-title"
        >
          <Reveal className="team-layout">
            <div className="team-copy">
              <h2 id="team-title">
                În spatele ideii,
                <br />o echipă curioasă.
              </h2>
              <p>
                HoloCAD este un proiect educațional al Liceului Internațional
                PREMS, dezvoltat pentru Samsung Solve for Tomorrow.
              </p>
              <p>
                Lucrăm la o experiență care face cunoștințele tridimensionale
                mai accesibile și mai ușor de înțeles.
              </p>
              <a
                className="text-link"
                href="https://www.instagram.com/holocad26/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Urmărește proiectul <ArrowRight size={17} />
              </a>
            </div>
            <figure className="team-photo">
              <img
                src="/images/holocad-team-1200.webp"
                srcSet="/images/holocad-team-640.webp 640w, /images/holocad-team-1200.webp 1200w"
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 55vw, 700px"
                alt="Cei patru membri ai echipei HoloCAD, împreună la Liceul Internațional PREMS."
                width="1200"
                height="900"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                Echipa HoloCAD, Liceul Internațional PREMS.
              </figcaption>
            </figure>
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
        <section
          className="section faq-section container"
          aria-labelledby="faq-title"
        >
          <h2 id="faq-title">Bine de știut.</h2>
          <div className="faq-list">
            <details>
              <summary>Este o hologramă reală?</summary>
              <p>
                HoloCAD folosește principiul Pepper’s Ghost. Un ecran reflectă
                imaginea pe suprafețe transparente și creează iluzia unui obiect
                suspendat. Nu este o hologramă în spațiu liber.
              </p>
            </details>
            <details>
              <summary>Ce pot încerca pe această pagină?</summary>
              <p>
                Poți roti motorul demonstrativ, separa ansamblul și selecta o
                piesă pentru a citi sau asculta explicația. Modelul este
                ilustrativ; HoloCAD este încă în etapa de concept și
                prototipare.
              </p>
            </details>
            <details>
              <summary>Cum sunt generate explicațiile?</summary>
              <p>
                Demonstrația de aici folosește explicații pregătite și
                înregistrări vocale generate cu AI. Pentru produs explorăm un
                asistent conectat la etichetele și contextul tehnic al
                modelului. Asistența AI locală nu este încă validată.
              </p>
            </details>
          </div>
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
              <a className="button button-outline" href="#team">
                Cunoaște echipa
              </a>
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
          <p>
            Vizualizările de produs și narațiunea folosesc AI. Fotografia
            echipei este reală.
          </p>
        </div>
        <div>
          <p>
            Samsung Solve for Tomorrow
            <br />
            Liceul Internațional PREMS
          </p>
          <a
            href="https://www.instagram.com/holocad26/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramLogo size={14} /> @holocad26
          </a>
        </div>
        <div>
          <p>© 2026 HoloCAD</p>
          <a href="#technology">
            Despre tehnologie <ArrowRight size={14} />
          </a>
        </div>
      </footer>
    </>
  );
}
export default App;
