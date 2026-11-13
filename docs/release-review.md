# HoloCAD release review

**Published November 12, 2026:** [https://holocad26.pages.dev](https://holocad26.pages.dev). Cloudflare confirmed successful deployment in the intended account. The live-host check passed for HTTPS, CSP/frame protection, permissions policy, MIME/referrer/HSTS headers, required media, immutable asset caching, canonical URL and sitemap. The sections below preserve the earlier local audit history.

November 10, 2026. Local production build, Chrome / Lighthouse 13, default simulated mobile throttling and desktop preset. These are lab results, not field measurements or a guarantee on every device.

| Metric | Before | After |
| --- | --- | --- |
| Mobile performance | 43 | 92 |
| Desktop performance | 97 | 100 |
| Mobile first contentful paint | 3.0s | 2.2s |
| Mobile largest contentful paint | 6.5s | 2.6s |
| Desktop largest contentful paint | 1.0s | 0.5s |
| Mobile total blocking time | 2,070ms | 170ms |
| Desktop total blocking time | 120ms | 0ms |
| Mobile initial transfer | 6,087 KiB | 204 KiB |
| Desktop initial transfer | 15,687 KiB | 220 KiB |
| Cumulative layout shift | 0 | 0 |
| Accessibility / best practices / SEO | 100 / 100 / 100 | 100 / 100 / 100 |

The intermediate mobile run scored 94, with 2.4s LCP and 221 KiB transferred. Report the final 92 conservatively; measurement variance matters. Full reports are at `/private/tmp/holocad-before-{mobile,desktop}.json` and `/private/tmp/holocad-final-{mobile,desktop}.json` on the development computer.

## What changed

| Before | After | Why |
| --- | --- | --- |
| Empty HTML root until React loads | Prerendered HTML hydrated by React | Content and the product image render before application JavaScript |
| Immediate 4K film / WebGL setup | Responsive first-frame WebP; film and animation runtime on scroll; glass effect on interaction | Remove media and shader work from initial loading |
| 4K desktop and 1920px mobile films | 1920px desktop and 960px mobile derivatives | Reduce decode and transfer costs while preserving the camera sequence |
| Separate render-blocking stylesheet | Small stylesheet inlined during the build | Remove a critical network round trip |
| Repeated centered headings and hidden section reveals | Editorial columns, readable copy and visible sections | Improve comprehension and reduce repeated animation/observer work |
| Team information in a modal | Team photo and copy in a linked section | Make the people behind the project easy to find |
| Long implementation section | Native technical disclosure plus a short FAQ | Keep the explanation approachable with details available |
| Touch scene captures every gesture | Vertical scrolling / pinch zoom preserved; larger controls | Improve phone navigation without disabling the interactive model |

The local MINA-TLC source and design documentation supplied principles for the educational presentation. Its palette, paper materials and visual identity were not copied. Existing product claims remain conceptual or planned.

## Security and privacy

- Production preview returns the expected CSP, frame protection, permissions policy, referrer policy, MIME protection and HSTS headers. Browser tests report no CSP, hydration or runtime errors through the main interactions.
- CSP allows scripts and connections only from the same origin. Objects, frames, workers and form submission are disabled. Inline styles remain allowed because React/GSAP controls use style attributes and the build inlines the stylesheet. Inline scripts and eval are not enabled.
- Netlify / Cloudflare Pages consume the generated `dist/_headers`; Vercel consumes the tracked `vercel.json`. Hashed assets receive immutable caching. HTML revalidates. Other hosts need the policy configured explicitly.
- Build output has no environment files, private key files or source maps. The release smoke test also scans text assets for common credential patterns. Narration generation remains a local script; visitors make no paid narration requests.
- The dependency audit reports zero known vulnerabilities after patching the indirect development dependency `fast-uri` from 3.1.8 to 3.1.9.
- Team WebPs contain only a VP8 image chunk, with no EXIF, GPS or XMP metadata. The supplied original photo stays outside the deployed assets. No individual names or personal contact details were added.
- The site introduces no visitor analytics, tracking scripts or application cookies. The eventual hosting provider may still keep normal access logs.
- Development and preview default to loopback. Publish the static `dist/` output, not a development server or the repository root.

The policy follows [MDN’s CSP documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy) and its [frame-ancestors guidance](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors). Framing protection requires an actual HTTP response header; a meta tag cannot supply it. Local file isolation follows [Vite’s server options](https://vite.dev/config/server-options).

## Verification and release limits

`npm run build` and the three existing geometry/trail verification scripts pass. `npm run verify:landing` passes on desktop and an emulated iPhone, plus 320px / 768px / 1024px layouts, reduced motion, Data Saver and disabled JavaScript. It exercises movie seeking, layer selection and close, engine component selection, narrated playback/pause, menu dismissal and native disclosures. The final screenshots are in `/private/tmp/holocad-release-qa`.

At the November 10 audit, the live browser-control host was unavailable; verification used automated headless Chrome and screenshots, and publication was still pending. The subsequent November 12 publication is recorded above. Check touch feel and Safari browser chrome on a real phone. The live 3D engine still downloads its renderer and prepares shaders when reached; initial-load scores do not measure that first interaction on low-end hardware.

## November 12 follow-up

Added a one-command release check, portable QA output/browser selection, CI/dependency-update configuration, a static ZIP/checksum generator, a packaged-file/local-secret comparison and a live-host verifier. The release check now verifies actual WebGL initialization, engine separation/reset, initial section links and switching reduced motion at runtime. A direct-link loading regression was found by the new test and fixed before packaging.

Production metadata can be generated from `HOLOCAD_SITE_URL`; no public domain or secret is hardcoded into the app. The [current release runbook](release-runbook.md) and [project task list](PROJECT-TODO.md) carry the follow-up instructions. The Lighthouse numbers above remain the November 10 measurements; they were not rerun for these follow-up changes.

## November 13 playback correction

Live static checks pass, but the first public browser run exposed film seeking that stalled on this host. Cloudflare returned whole MP4 files with status 200 for byte-range requests. The local correction downloads the responsive film once after scroll intent, then seeks within an object URL backed by the downloaded Blob. It cancels obsolete downloads and revokes object URLs during cleanup. Initial arrival, reduced motion, Data Saver and direct links to later sections retain deferred media loading.

The complete local release check passed with the correction, including delayed film delivery, actual film seeking, engine interactions, narration, responsive layouts and preference changes. The corrected ZIP at `releases/holocad-site.zip` was deployed successfully on November 13. Both `node scripts/verify-live.mjs https://holocad26.pages.dev` and `node scripts/verify-landing.mjs https://holocad26.pages.dev` passed against the public release. Desktop/mobile film seeking, WebGL controls, engine selection/separation/reset, narration, responsive layouts, reduced motion, Data Saver, section links and no-JavaScript content were verified. Real-device Safari/touch checks remain a team task. The Lighthouse figures above still describe the earlier November 10 audit.
