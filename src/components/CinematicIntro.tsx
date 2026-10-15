"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import HeroInteraction from "./HeroInteraction";

gsap.registerPlugin(ScrollTrigger);

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
    let requestedTime = 0;
    let disposed = false;
    let active = -1;
    const seek = () => {
      if (disposed || !film.duration || film.seeking) return;
      if (Math.abs(film.currentTime - requestedTime) > 1 / 120)
        film.currentTime = requestedTime;
    };
    film.addEventListener("seeked", seek);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
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
        const meter = section.querySelector<HTMLElement>(".film-progress-fill");
        if (meter) meter.style.transform = `scaleX(${progress})`;
      };
      const playhead = { progress: 0 };
      const animation = gsap.to(playhead, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top+=64",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
        onUpdate: () => update(playhead.progress),
      });
      const ready = () => update(playhead.progress);
      film.addEventListener("loadedmetadata", ready);
      film.addEventListener("loadeddata", ready);
      update(playhead.progress);
      return () => {
        film.removeEventListener("loadedmetadata", ready);
        film.removeEventListener("loadeddata", ready);
        animation.scrollTrigger?.kill();
        animation.kill();
      };
    });
    media.add("(prefers-reduced-motion: reduce)", () => {
      chapters.forEach((chapter, i) => {
        chapter.inert = false;
        chapter.setAttribute("aria-hidden", "false");
        chapter.style.opacity = "1";
        chapter.style.transform = "none";
      });
    });
    return () => {
      disposed = true;
      media.revert();
      film.removeEventListener("seeked", seek);
    };
  }, []);
  return (
    <section
      ref={root}
      className="cinematic-intro"
      aria-label="Prezentare cinematică HoloCAD"
    >
      <div className="film-stage">
        <video
          ref={video}
          className="intro-film"
          poster="/video/holocad-intro-first-frame.jpg"
          preload="auto"
          muted
          playsInline
          aria-hidden="true"
        >
          <source
            media="(max-width: 767px)"
            src="/video/holocad-intro-hq-hd.mp4"
            type="video/mp4"
          />
          <source src="/video/holocad-intro-hq.mp4" type="video/mp4" />
          <source src="/video/holocad-intro.mp4" type="video/mp4" />
        </video>
        <img
          className="intro-keyvisual"
          src="/images/holocad-hero-realistic.webp"
          width="1586"
          height="992"
          fetchPriority="high"
          alt=""
          aria-hidden="true"
        />
        <div className="film-vignette" />
        <div className="film-chapter film-chapter-first">
          <span className="film-brand">HoloCAD</span>
          <h1>Dincolo de ecran.</h1>
          <p>O nouă dimensiune a înțelegerii.</p>
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
