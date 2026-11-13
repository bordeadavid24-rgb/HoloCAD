"use client";
import { useEffect, useRef } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import HeroInteraction from "./HeroInteraction";

export default function CinematicIntro() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const section = root.current;
    const film = video.current;
    if (!section || !film) return;
    const chapters = Array.from(
      section.querySelectorAll<HTMLElement>(".film-chapter"),
    );
    const meter = section.querySelector<HTMLElement>(".film-progress-fill");
    let requestedTime = 0;
    let disposed = false;
    let active = -1;
    let generation = 0;
    let cleanupAnimation = () => {};
    const seek = () => {
      if (disposed || !film.duration || film.seeking) return;
      if (Math.abs(film.currentTime - requestedTime) > 1 / 120)
        film.currentTime = requestedTime;
    };
    film.addEventListener("seeked", seek);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean };
      }
    ).connection;
    const start = async () => {
      if (disposed || preference.matches) return;
      const run = ++generation;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || preference.matches || run !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      const update = (progress: number) => {
        requestedTime = Math.max(0, (film.duration || 16) - 0.05) * progress;
        seek();
        const index = progress < 0.31 ? 0 : progress < 0.68 ? 1 : 2;
        if (index !== active) {
          active = index;
          chapters.forEach((chapter, i) => {
            chapter.inert = i !== index;
            chapter.setAttribute("aria-hidden", String(i !== index));
          });
          section.dataset.chapter = String(index);
        }
        chapters.forEach((chapter, i) => {
          const center = i === 0 ? 0 : i === 1 ? 0.46 : 0.86;
          const distance = Math.abs(progress - center);
          const opacity =
            i === 2
              ? gsap.utils.clamp(0, 1, (progress - 0.66) / 0.11)
              : i === 0
                ? 1 - gsap.utils.clamp(0, 1, (progress - 0.18) / 0.13)
                : 1 - gsap.utils.clamp(0, 1, (distance - 0.09) / 0.11);
          chapter.style.opacity = String(opacity);
          chapter.style.transform = `translateY(${i === 0 ? -Math.max(0, progress - 0.16) * 60 : (progress < center ? 1 : -1) * (1 - opacity) * 24}px)`;
        });
        if (meter) meter.style.transform = `scaleX(${progress})`;
      };
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top+=64",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => update(self.progress),
      });
      const ready = () => {
        if (film.readyState >= 2) section.dataset.filmReady = "true";
        // Read actual scroll progress when remote metadata arrives. A separate
        // tween can still be at zero if scrolling stopped during its import.
        update(trigger.progress);
      };
      const unavailable = () => {
        section.dataset.filmReady = "false";
      };
      film.addEventListener("loadedmetadata", ready);
      film.addEventListener("loadeddata", ready);
      film.addEventListener("error", unavailable);
      update(trigger.progress);
      // A direct link to the team/demo must not download an offscreen movie.
      let loadingFilm = false;
      let filmUrl: string | null = null;
      const download = new AbortController();
      const loadFilm = async () => {
        const bounds = section.getBoundingClientRect();
        if (
          connection?.saveData ||
          preference.matches ||
          loadingFilm ||
          film.hasAttribute("src") ||
          bounds.bottom <= 64 ||
          bounds.top >= window.innerHeight
        )
          return;
        loadingFilm = true;
        const source = window.matchMedia("(max-width: 767px)").matches
          ? "/video/holocad-intro-mobile.mp4"
          : "/video/holocad-intro-desktop.mp4";
        try {
          // Some static hosts return 200/full files for Range requests. Fetch
          // once after intent, then seek the complete, same-origin Blob locally.
          const response = await fetch(source, { signal: download.signal });
          if (!response.ok) throw new Error("Film unavailable");
          const blob = await response.blob();
          if (disposed || preference.matches || run !== generation) return;
          filmUrl = URL.createObjectURL(blob);
          film.preload = "auto";
          film.src = filmUrl;
          film.load();
        } catch {
          if (!disposed && !download.signal.aborted) unavailable();
        } finally {
          loadingFilm = false;
        }
      };
      const visibility = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) void loadFilm();
      });
      visibility.observe(section);
      void loadFilm();
      cleanupAnimation = () => {
        download.abort();
        if (filmUrl) URL.revokeObjectURL(filmUrl);
        visibility.disconnect();
        film.removeEventListener("loadedmetadata", ready);
        film.removeEventListener("loadeddata", ready);
        film.removeEventListener("error", unavailable);
        trigger.kill();
      };
    };
    let starting = false;
    const begin = () => {
      if (starting || preference.matches) return;
      starting = true;
      void start().catch(() => {
        // The first frame and readable chapters survive an offline chunk.
        section.dataset.static = "true";
        chapters.forEach((chapter) => {
          chapter.inert = false;
          chapter.setAttribute("aria-hidden", "false");
        });
      });
    };
    const sentinel = section.querySelector(".film-start-marker");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 64) begin();
      },
      { rootMargin: "-64px 0px 0px" },
    );
    if (sentinel) observer.observe(sentinel);
    if (window.scrollY > section.offsetTop) begin();
    film.addEventListener("holocad:activate", begin);
    const change = () => {
      generation++;
      cleanupAnimation();
      cleanupAnimation = () => {};
      starting = false;
      active = -1;
      if (preference.matches) {
        film.removeAttribute("src");
        film.load();
        section.dataset.filmReady = "false";
      }
      chapters.forEach((chapter) => {
        chapter.inert = false;
        chapter.setAttribute("aria-hidden", "false");
        chapter.style.opacity = "1";
        chapter.style.transform = "none";
      });
      if (!preference.matches) begin();
    };
    if (preference.matches) change();
    preference.addEventListener("change", change);
    return () => {
      disposed = true;
      observer.disconnect();
      preference.removeEventListener("change", change);
      cleanupAnimation();
      film.removeEventListener("holocad:activate", begin);
      film.removeEventListener("seeked", seek);
      film.removeAttribute("src");
      film.load();
    };
  }, []);
  return (
    <section
      ref={root}
      className="cinematic-intro"
      aria-label="Prezentare cinematică HoloCAD"
    >
      <span className="film-start-marker" aria-hidden="true" />
      <div className="film-stage">
        <video
          ref={video}
          className="intro-film"
          preload="none"
          muted
          playsInline
          aria-hidden="true"
        />
        <picture>
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet="/images/holocad-hero-realistic.webp"
          />
          <img
            className="intro-poster"
            src="/video/holocad-intro-poster-1920.webp"
            srcSet="/video/holocad-intro-poster-960.webp 960w, /video/holocad-intro-poster-1280.webp 1280w, /video/holocad-intro-poster-1920.webp 1920w"
            sizes="(max-width: 767px) 150vw, 100vw"
            width="1920"
            height="1200"
            fetchPriority="high"
            alt="Conceptul HoloCAD: un motor în secțiune, reflectat în interiorul unei piramide transparente."
          />
        </picture>
        <div className="film-vignette" />
        <div className="film-chapter film-chapter-first">
          <span className="film-brand">HoloCAD</span>
          <h1>Dincolo de ecran.</h1>
          <p>Modele CAD, explorare 3D și explicații pentru educație.</p>
          <a className="film-direct-link" href="#explore">
            Încearcă modelul interactiv <ArrowRight size={16} />
          </a>
        </div>
        <div
          className="film-chapter film-chapter-second"
          inert
          aria-hidden="true"
        >
          <h2>
            Ideile prind
            <br />
            <span>o altă dimensiune.</span>
          </h2>
          <p>
            Vizualizare 3D. Explorare interactivă.
            <br />
            Inteligență care explică.
          </p>
        </div>
        <div
          className="film-chapter film-chapter-third"
          inert
          aria-hidden="true"
        >
          <h2>
            Privește mai aproape.
            <br />
            <span>Înțelege mai mult.</span>
          </h2>
          <p>
            Descoperă legătura dintre fiecare piesă
            <br />
            și întregul din care face parte.
          </p>
          <a className="button button-light" href="#explore">
            Explorează HoloCAD <ArrowRight size={17} />
          </a>
        </div>
        <div className="film-bottom">
          <span>Concept de produs în dezvoltare</span>
          <div className="film-progress" aria-hidden="true">
            <span className="film-progress-fill" />
          </div>
          <span className="film-navigation">Derulează pentru a descoperi</span>
        </div>
        <HeroInteraction film={video} />
      </div>
    </section>
  );
}
