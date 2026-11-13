# HoloCAD

A Romanian cinematic presentation for HoloCAD, developed for Samsung Solve for Tomorrow at Liceul Internațional PREMS.

Live site: [holocad26.pages.dev](https://holocad26.pages.dev), published on Cloudflare Pages on November 12, 2026. The November 13 playback update passed the live security/media checks and full browser regression suite.

Project handoff: start with [AGENTS.md](AGENTS.md), [confirmed context and team decisions](docs/PROJECT-CONTEXT.md), and [current tasks](docs/PROJECT-TODO.md). Current focus is the website launch and frequent social videos; the physical prototype is conditional on reaching the further competition phase. David owns software; Petre and Stefan own content; Tulica is the professor/coordinator. See the [social-video plan](docs/social-content-plan.md) for the draft backlog.

## Run locally

Use Node 24 (see `.nvmrc`).

```sh
npm install
npm run dev
```

Vite serves the page at http://localhost:5173. Run `npm run build` for a production bundle and `npm run preview` to inspect it.

For the complete release check, run `npm run verify:release`; it manages its temporary preview automatically. `npm run package:release` verifies and creates a static upload ZIP/checksum under the ignored `releases/` directory. Once the public origin is known, set `HOLOCAD_SITE_URL` in the shell/build environment so the build emits matching canonical, social and sitemap metadata. `npm run verify:live -- https://actual-host` checks the deployed response headers and essential assets.

The [release runbook](docs/release-runbook.md) covers publishing, source/CI ownership and rollback. The [complete project task list](docs/PROJECT-TODO.md) separates completed website work from the team, physical prototype, application and competition tasks. The [prototype plan](docs/prototype-plan.md) supplies hardware and classroom validation procedures.

The public origin is configured in `site.config.json`; `HOLOCAD_SITE_URL` can override it for another domain. This public setting contains no account credentials.

## Implemented experience

The landing page is prerendered at build time, so the introduction, explanations, team and FAQ are readable before JavaScript runs. React hydrates that HTML. The small stylesheet is inlined, and fonts are self-hosted.

The introduction opens on a responsive WebP of the exact first frame of the 16-second technical animation. Scrolling loads GSAP and the film on demand: 1920 × 1200 on desktop and 960 × 600 on mobile, with frequent keyframes for seeking. The original 4K masters remain in `public/` for regeneration and are excluded from release uploads. Reduced motion keeps the photorealistic product concept and all messages without the extended scroll sequence. Data Saver keeps the still image and readable explanations without requesting the movie.

Move the cursor over the prototype to reveal only the components under your path. Soft, irregular strokes linger for roughly two seconds before fading; there is no visible circle, rim, magnification, or spotlight background. Unbrushed areas retain the original product film. Optică / Hardware / Inteligență pin a local view of the glass, illustrative controller board, or contextual AI signal flow; Escape or the close button returns to the film. Touch and keyboard users can use the same controls. Raspberry Pi is labelled as an exploratory option. This is a concept visualization, not an implemented hardware configuration or live AI inference. Reduced motion and WebGL failure keep the explanations without distortion.

The display contains an original six-cylinder cutaway engine with pistons, articulated connecting rods, crankshaft, valves, camshafts, gears, and a timing belt. A slider-crank calculation maintains a fixed rod length and connection to the piston; camshafts rotate at half the crank speed. This is conceptual geometry, not a specific manufactured engine. Pointer and keyboard controls rotate it horizontally and vertically. Slower, critically damped separation opens the assembly in staged groups, with camera framing for the expanded view.

The engine is the control surface: raycasting selects a piston, connecting rod, distribution assembly, crankshaft, or housing. The selected part separates, a nearby annotation appears, and a prepared Romanian ElevenLabs explanation plays. A compact native selector provides a keyboard alternative. Full disassembly plays a general explanation. Recordings are served locally; presentation playback makes no API requests and spends no credits. This is not a live conversational AI or a validated engineering simulation.

The software section is a static, responsive preview of the proposed HoloCAD desktop interface: model library and component tree, a central 3D workspace, contextual assistance, and display-output controls. It replaces the pinned workflow animation. The preview is explicitly labeled as conceptual, and its illustrated controls are not interactive.

The hardware section includes a 32-second narrated motion-graphics MP4. Its component labels follow ElevenLabs speech timestamps; Romanian WebVTT captions and playback, mute, and replay controls are included. A separate technical section explains the proposed hardware, Tauri/React/TypeScript/Three.js application, Python/Ollama direction, calibration, model metadata requirements, and development/testing sequence.

All product capabilities are described as planned or exploratory. The display uses a Pepper's Ghost optical illusion; the visualizations do not represent a tested physical prototype. The page does not imply Samsung endorsement.

Reduced motion disables automatic mechanism motion and spatial transitions. Interactive scenes pause outside the viewport and when the browser tab is hidden, handle WebGL failure, and dispose of their resources on unmount.

Lower scenes initialize near the viewport. The hero glass effect initializes only after pointer interaction or an explicit layer selection. Neither Three.js, GSAP nor movies are requested on arrival. Ordinary sections stay visible without repeated reveal animations. Mobile keeps vertical scrolling and pinch zoom available over the engine; the native selector uses 16px text on touch devices.

The team photograph appears in a dedicated section, with 640px and 1200px WebP variants, lazy loading, explicit dimensions and no EXIF/XMP metadata. The technical implementation plan is available through a native disclosure, and the FAQ explains the optical principle, demo limitations and planned AI assistance.

## Verification

`npm run build` checks TypeScript, builds the assets, prerenders the page, generates static-host security headers and excludes unused source media from `dist/`. `npm run verify:landing` runs the production browser checks against `http://127.0.0.1:4177`; start `npm run preview -- --port 4177` first. Override the URL with `HOLOCAD_TEST_URL` when needed. Checks cover deferred downloads, actual security response headers, hydration/CSP errors, film seeking, glass controls, component selection, narrated video, menus, disclosures, reduced motion, Data Saver, no-JavaScript content and layouts from 320px to desktop. Screenshots are saved under `/private/tmp/holocad-release-qa`.

The existing geometry checks also pass: `node --experimental-strip-types scripts/verify-engine.mjs`, `node --experimental-strip-types scripts/verify-hero.mjs` and `node scripts/verify-reveal-trail.mjs`. Physical-phone touch and browser-chrome behavior still need a real-device check.

The November 10, 2026 release audit scores 100 desktop / 92 mobile for performance, and 100 for accessibility, best practices and SEO on both. The same-session baseline was 97 desktop / 43 mobile. Mobile largest contentful paint falls from 6.5s to 2.6s, total blocking time from 2,070ms to 170ms, and initial transfer from 6,087 KiB to 204 KiB. CLS remains zero. An intermediate optimized run scored 94 mobile with 2.4s LCP; lab scores vary. See [release review](docs/release-review.md) for the measured limits and hosting notes.

Initial WebGL shader preparation can still take time on slower devices. Live scenes are loaded near the viewport; the introduction itself is pre-rendered.

## Regenerate presentation assets

With the local development server running:

```sh
npm run render:intro
node scripts/render-intro.mjs --hq
node scripts/render-intro.mjs --hardware
node scripts/render-intro.mjs --stills
```

The deterministic renderer captures at 24fps: 384 intro frames, or the hardware narration's duration. `--hq` renders the intro at 3840 × 2400 with CRF 16 and derives a 1920 × 1200 mobile file. The standard renderer remains available for the older 1440 × 900 film and engine study images. Hardware audio is embedded in its MP4. Successful videos replace previous files atomically; `--stills` updates only the engine study images.

To regenerate narration, configure the secret `ELEVENLABS_API_KEY` and optionally `ELEVENLABS_VOICE_ID` in `.env.local`, then run:

```sh
npm run generate:voice
node scripts/generate-voice.mjs --only=piston,rod,heads,block,hardware
```

The API key remains local and is ignored by Git. Voice generation uses your ElevenLabs credits. The default is the George voice and the multilingual v2 model. Scripts and narration text are in `scripts/generate-voice.mjs`.

Use `--only` to avoid regenerating unrelated clips. Hardware generation also exports caption/timeline assets using ElevenLabs' [speech-with-timestamps endpoint](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps). Generate that narration before rendering the hardware film.

## Design and assets

Design direction: cinematic hardware storytelling refined with Emil Kowalski, design-taste-frontend and Impeccable. The local MINA-TLC project informed readable editorial columns, human photography and content hierarchy, while HoloCAD retains its dark palette, Geist typography, product film and interactive engine. DESIGN_VARIANCE: 6, MOTION_INTENSITY: 7, VISUAL_DENSITY: 3. Content surfaces use 18-24px radii; interactive buttons use pills. The existing dark brand direction takes precedence over the taste skill's dual-theme default.

## Release security

Deploy only `dist/` over HTTPS. The page uses same-origin assets and local recordings, with no login, form endpoint, analytics or live AI API requests. Secret narration credentials remain outside the browser bundle. Local development and preview bind to `127.0.0.1` by default.

`security-headers.json` is the shared policy for production preview and the generated Netlify/Cloudflare Pages `_headers` file. `vercel.json` supplies matching Vercel headers; the build verifies they agree. Policies include a same-origin CSP, denied framing and embedding, disabled sensitive browser permissions, no referrer, MIME sniffing protection and HSTS. Inline styles are allowed for the stylesheet and existing animation styles; inline scripts and eval are not allowed. The dependency audit is clean after patching `fast-uri` to 3.1.9.

For another host, apply the same response headers there. Verify the actual HTTPS deployment headers after publishing; local checks do not establish the security of an unselected production host.

Current videos are in `public/video/`; Romanian ElevenLabs recordings are in `public/audio/`. The active photographic asset is `public/images/holocad-hero-realistic.webp` (quality 92, about 150 KB). Its original PNG and JPEG are retained. The image-generation tool returned 1586 × 992; the still is not claimed to be 4K. See `docs/hero-image-prompt.md` for the final prompt and provenance. Shared geometry and camera choreography are in `src/three/product.ts`; interactive controls are in `src/components/DeviceScene.tsx`. The older studio photograph and 1440 × 900 movie remain preserved.
