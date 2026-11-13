# Design direction

The brief is interpreted as a premium hardware landing page for students and educators. Samsung-style product storytelling informs the hierarchy, graphite surfaces, cool lighting, spacious compositions, and compact pill controls. This is visual inspiration; no Samsung endorsement or proprietary brand assets are implied.

The requested `emil-design-eng` and `design-taste-frontend` skills guide the implementation. The animation skill informs brief press feedback, interruptible state transitions, reduced motion, pointer capture, and explanatory rather than constant decorative motion. React review guidance informs leaf scene components, lazy imports, mutable interaction refs, and effect cleanup.

DESIGN_VARIANCE: 6. MOTION_INTENSITY: 7. VISUAL_DENSITY: 3 for the release refinement. The existing cinematic product sequence remains the authored motion moment; ordinary content stays visible and still.

## Release refinement, November 2026

The requested Emil Kowalski, design-taste-frontend and Impeccable skills guide a preservation pass. The local MINA-TLC project informs editorial columns, readable explanation and human photography. HoloCAD retains its own dark hardware identity, Geist type, neutral controls and optical blue inside the product imagery.

A dedicated team section pairs the supplied photograph with existing project facts. Responsive WebPs contain no EXIF/XMP metadata and load below the fold. Main explanations use more readable type, varied alignment and native disclosures for technical depth. A short FAQ explains Pepper’s Ghost, the demonstrative model and prepared AI narration. Repeated section-entry animations and the team modal are removed.

The release build prerenders the page and inlines its small stylesheet. Arrival shows a responsive WebP of the original film's first frame. Scrolling loads the animation runtime and a 1920px desktop or 960px mobile derivative; the glass effect loads on interaction. Reduced motion and Data Saver preserve static imagery and explanations. Original 4K masters remain as regeneration inputs and are omitted from release uploads. This release behavior supersedes the older cinematic implementation notes below. See `docs/release-review.md` for measured results, security policy and verification limits.

The page follows the explicit dark brand direction. Silver-white typography replaces the pale blue text accent; blue is reserved for the optical and engine visuals. There is no decorative AI sparkle mark. The engine is a full-width interaction surface, with annotations beside selected parts rather than a question-button panel. Native CSS handles presentation states; Three.js handles spatial motion.

The physical device and engine are original procedural concept geometry. They are not manufacturing specifications or an optical simulation. Replace them with accurate product geometry when a prototype is available. All product functionality remains labeled as planned, illustrative, or exploratory as appropriate.

## Cinematic Romanian presentation

The presentation uses a six-cylinder cutaway engine. The introduction is a 16-second pre-rendered MP4 with orbiting camera movement, staged optical-layer separation, and three messages synchronized with a smoothed scroll playhead. This is a deliberately cinematic launch sequence, following the user's direction.

Live geometry appears in the educational engine section. Raycasting identifies actual components; pointer movement controls pitch and yaw. Keyboard rotation, a native component selector, and reset are available. Wider exploded views use a slower critically damped spring. A fixed-length slider-crank linkage and articulated rod geometry improve mechanism continuity. Reduced motion presents static introductory imagery; the software preview is static for everyone.

Romanian narration clips were generated with the user's configured ElevenLabs account. Local MP3s start after selecting a part or requesting full separation. The 32-second device breakdown is a separately authored motion-graphics film with timestamp-synchronized component labels, embedded narration, and Romanian captions. Playback requires an explicit action. The prototype has scripted explanations, not a live conversational model; the secret API key is excluded from Git and the client build.

The former pinned workflow is replaced, at the user's request, with a static desktop-software concept. Library and component navigation sit on the left, the 3D model occupies the center, and grounded component assistance sits on the right. Mobile stacks the workspace and explanation for readability. It has no scroll choreography or simulated working controls. The subsequent technical section covers proposed parts, software responsibilities, calibration, grounded model context, and classroom testing. Hardware choices remain provisional; no component model or cost is invented.

The hero now shows the 3840 × 2400 technical film continuously from its first frame, responding directly to the first scroll without a photographic lead-in or crossfade; mobile loads a 1920 × 1200 derivative. The photorealistic concept image remains in the page and as the reduced-motion hero. Generated from the existing product render, it preserves the device design with focus-stacked detail, realistic anodized aluminum, acrylic reflections, and a crisp engine. Its native resolution is 1586 × 992, delivered as a 150 KB high-quality WebP. The render and narration scripts support reproducible changes without exposing credentials. Older assets remain preserved.

References consulted: [Samsung product presentation](https://www.samsung.com/uk/smartphones/galaxy-s25-ultra/) and [Three.js renderer documentation](https://threejs.org/docs/pages/WebGLRenderer.html).

## Cursor-driven glass exploration

Inspired by the layered pointer interaction in [Lando Norris's hero](https://landonorris.com/), the WebGL reveal follows only the area brushed by the cursor, not the whole prototype. A low-resolution alpha field remembers soft, irregular strokes and fades each brushed area over roughly two seconds. There is no drawn circle, rim, magnification, spotlight background, or caustic halo: the shader reveals actual component pixels rather than painting a patch over the device. Brighter board materials, stronger interior contours and improved contrast keep the exposed parts legible. A geometry silhouette also confines the effect to the product, leaving the background and typography untouched. The shared camera pose keeps the live interior registered to the film, including exploded layers; the pointer retains its mass-1, stiffness-100, damping-10 spring. The silhouette pass is cached until scrolling or resizing changes its geometry, and rendering continues only long enough to clear lingering strokes after the pointer leaves.

Optics, Hardware, and Intelligence controls pin an explanatory view for mouse, touch, and keyboard users. The illustrated board includes GPIO pins, connector housings, a processor/heatsink and circuit traces. Raspberry Pi is explicitly an exploratory control-board option, not confirmed hardware or a claim that it runs the AI. Moving signal paths illustrate contextual model assistance, not live inference. Reduced motion and unavailable WebGL retain readable layer explanations without the shader. Rendering stops when idle, offscreen, or the document is hidden; resolution is capped and the effect is lazy-loaded.
