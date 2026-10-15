# HoloCAD

A Romanian cinematic presentation for HoloCAD, developed for Samsung Solve for Tomorrow at Liceul Internațional PREMS.

## Run locally

```sh
npm install
npm run dev
```

Vite serves the page at http://localhost:5173. Run `npm run build` for a production bundle and `npm run preview` to inspect it.

## Implemented experience

The introduction opens on the exact first frame of the 16-second technical animation, which responds directly to scrolling from the beginning without a delayed fade-in. The scroll playhead controls the video and three Romanian messages. The primary film is rendered natively at 3840 × 2400, with a 1920 × 1200 mobile version, lower compression, improved studio materials, and clearer acrylic. Reduced motion keeps the photorealistic product concept and all messages without the extended scroll sequence.

Move the cursor over the prototype to reveal only the components under your path. Soft, irregular strokes linger for roughly two seconds before fading; there is no visible circle, rim, magnification, or spotlight background. Unbrushed areas retain the original product film. Optică / Hardware / Inteligență pin a local view of the glass, illustrative controller board, or contextual AI signal flow; Escape or the close button returns to the film. Touch and keyboard users can use the same controls. Raspberry Pi is labelled as an exploratory option. This is a concept visualization, not an implemented hardware configuration or live AI inference. Reduced motion and WebGL failure keep the explanations without distortion.

The display contains an original six-cylinder cutaway engine with pistons, articulated connecting rods, crankshaft, valves, camshafts, gears, and a timing belt. A slider-crank calculation maintains a fixed rod length and connection to the piston; camshafts rotate at half the crank speed. This is conceptual geometry, not a specific manufactured engine. Pointer and keyboard controls rotate it horizontally and vertically. Slower, critically damped separation opens the assembly in staged groups, with camera framing for the expanded view.

The engine is the control surface: raycasting selects a piston, connecting rod, distribution assembly, crankshaft, or housing. The selected part separates, a nearby annotation appears, and a prepared Romanian ElevenLabs explanation plays. A compact native selector provides a keyboard alternative. Full disassembly plays a general explanation. Recordings are served locally; presentation playback makes no API requests and spends no credits. This is not a live conversational AI or a validated engineering simulation.

The software section is a static, responsive preview of the proposed HoloCAD desktop interface: model library and component tree, a central 3D workspace, contextual assistance, and display-output controls. It replaces the pinned workflow animation. The preview is explicitly labeled as conceptual, and its illustrated controls are not interactive.

The hardware section includes a 32-second narrated motion-graphics MP4. Its component labels follow ElevenLabs speech timestamps; Romanian WebVTT captions and playback, mute, and replay controls are included. A separate technical section explains the proposed hardware, Tauri/React/TypeScript/Three.js application, Python/Ollama direction, calibration, model metadata requirements, and development/testing sequence.

All product capabilities are described as planned or exploratory. The display uses a Pepper's Ghost optical illusion; the visualizations do not represent a tested physical prototype. The page does not imply Samsung endorsement.

Reduced motion disables automatic mechanism motion and spatial transitions. Interactive scenes pause outside the viewport and when the browser tab is hidden, handle WebGL failure, and dispose of their resources on unmount.

Lower scenes initialize near the viewport. The hero uses video decoding rather than live WebGL, reducing the rendering needed during the introduction.

## Verification

TypeScript and the production build pass. `node --experimental-strip-types scripts/verify-engine.mjs` checks the linkage, full piston stroke, 15 selectable groups, expanded separation, isolation, and recomposition. Browser review includes component selection and narrated-film playback. Physical-phone presentation testing is still recommended.

The first updated Lighthouse desktop/mobile audit scored 99/90 for performance and 100 for accessibility, best practices, and SEO. Mobile largest contentful paint was 3.2s, total blocking time 0ms, and cumulative layout shift 0. These are local lab measurements, not field results, and supersede the shorter intro's earlier scores.

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

Design direction: cinematic Samsung-style hardware storytelling with Emil Kowalski's design engineering guidance and design-taste-frontend. DESIGN_VARIANCE: 7, MOTION_INTENSITY: 9, VISUAL_DENSITY: 2. Rounded content surfaces use 18-24px radii; interactive buttons use pills. The supplied dark product direction takes precedence over the taste skill's dual-theme default.

Current videos are in `public/video/`; Romanian ElevenLabs recordings are in `public/audio/`. The active photographic asset is `public/images/holocad-hero-realistic.webp` (quality 92, about 150 KB). Its original PNG and JPEG are retained. The image-generation tool returned 1586 × 992; the still is not claimed to be 4K. See `docs/hero-image-prompt.md` for the final prompt and provenance. Shared geometry and camera choreography are in `src/three/product.ts`; interactive controls are in `src/components/DeviceScene.tsx`. The older studio photograph and 1440 × 900 movie remain preserved.
