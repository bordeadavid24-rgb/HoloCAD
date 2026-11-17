# HoloCAD: complete remaining task list

Updated November 17, 2026 after the source push to David's GitHub account. Start with `PROJECT-CONTEXT.md` for roles and phase gates. The current focus is the website launch and frequent social videos. David is already working on the app; this repository does not establish its implementation status. Build the physical prototype only if selected for the further competition phase. Check an item only when its evidence exists.

## Current priorities and owners

| Work | Owner | Timing |
| --- | --- | --- |
| Website, source migration and release checks | Active AI assistant with David's account/domain decisions | Now |
| Content and nearly daily social-video preparation | Petre + Stefan, with David providing software captures | Now / launch |
| Application | David | Work already underway; continue after website launch |
| Real-phone checks | David/team | Deliberately deferred until a later session |
| Physical display/hardware | Probably David + Petre + Stefan | Only if the team reaches the further competition phase |
| AI evaluation and classroom testing | Owners to confirm with David/Tulica | After launch and a usable demonstration |
| Pitch/live demonstration plan | Team + Tulica, to discuss | Later |
| Maintenance records and technical checks | Active AI assistant during work sessions | Ongoing; no unattended monitoring configured |

## Completed in the workspace

- [x] Refine the landing page while preserving the existing brand.
- [x] Add the supplied team photograph with responsive sizes, lazy loading and stripped metadata.
- [x] Prerender the page, inline the small stylesheet, defer movie/3D work and optimize media delivery.
- [x] Add readable explanations, conceptual-status disclosures and a FAQ.
- [x] Add security response-header configurations and localhost-only development defaults.
- [x] Patch the known dependency issue; current audit reports zero known vulnerabilities.
- [x] Add a build/artifact check that compares the output against local secrets without printing their values.
- [x] Add one-command release verification, browser regression coverage and an upload-package generator.
- [x] Add GitHub CI and dependency-update configuration. Both are active on `bordeadavid24-rgb/HoloCAD` as of November 17. The main-branch verify workflow passed. Dependabot opened update pull requests that still need review.
- [x] Prepare the prototype and classroom validation plan in `prototype-plan.md`.
- [x] Publish the checked static release on Cloudflare Pages at [holocad26.pages.dev](https://holocad26.pages.dev).
- [x] Verify the live site's HTTPS response, required security headers, media, immutable caching, canonical URL and sitemap.
- [x] Deploy the host-specific film playback correction and pass the full browser regression checks against the public URL on November 13.

## Competition and team: confirmed and remaining

- [x] HoloCAD is registered for Samsung Solve for Tomorrow, confirmed by David on November 13. No further registration action is currently requested.
- [ ] Keep the confirmation email/submission identifier privately and follow the organizer's next-stage notices.
- [ ] Confirm participant eligibility, team membership and coordinating teacher against the current rules. Obtain any permissions the organizer requires.
- [x] Record responsibilities: David/software; Petre and Stefan/content; probably all three/future hardware; Tulica/professor. See `PROJECT-CONTEXT.md`.
- [ ] Agree the next website/social checkpoint, who operates the social accounts and who approves each publication.
- [ ] Confirm the school/project wording and permission to publish the team photograph and institutional references. Keep approvals privately; do not put personal forms in this repository.
- [ ] Check the permitted use of Samsung's name and competition branding. Keep prototype claims consistent with what has actually been built.

Registration is user-confirmed; advancing to the further phase has not been confirmed. Check the organizer's actual notices for later requirements. Do not make hardware work or purchases a current launch requirement.

## Website publication and ownership

- [x] Verify the published URL and HTTPS deployment, including the actual response headers and interactive demo, using the release runbook in `release-runbook.md`.
- [ ] Later, by David's request: open the live site on a real iPhone/Safari and Android/Chrome. Test scrolling past the engine, horizontal rotation, selecting parts, voice mute, narrated film, menu, team image and landscape layout. Emulated checks have passed; real-phone checks remain open.
- [ ] Send the live link in a private message to yourself and verify the social preview image/title. This requires a real crawler on the final domain.
- [x] Record the latest domain decision: the website address must be free. Retain the existing `https://holocad26.pages.dev` address with HTTPS and matching production metadata.
- [x] Remove paid custom-domain selection, purchase and connection from current launch tasks. Earlier registry research remains historical context only; availability is not zero-cost registration.
- [x] David chose `bordeadavid24-rgb` as the GitHub repository owner.
- [x] Point local Git `origin` at `https://github.com/bordeadavid24-rgb/HoloCAD.git`.
- [x] Complete migration to `bordeadavid24-rgb/HoloCAD`, verify the destination and preserve history. Leave the old `lalachmoon` repository intact. Verified November 17: https://github.com/bordeadavid24-rgb/HoloCAD is public, and https://github.com/lalachmoon/HoloCAD remains at `1ce1164`.
- [x] Upload/push the checked source to the agreed repository and confirm CI runs successfully. Do not upload `.env.local`, `.git`, local credentials, `node_modules` or release manifests containing local paths. Push of `44d9e95` succeeded, and https://github.com/bordeadavid24-rgb/HoloCAD/actions/runs/44102153626 passed. Tracked files include `.env.example` only, with no secret values found.
- [ ] Keep the remote source and deployed release in sync. The CI configuration verifies changes; it does not automatically publish the site or grant hosting access.
- [ ] Keep a previous verified ZIP and checksum for rollback. Save the hosting project URL and account recovery information privately.
- [ ] Use individual accounts and two-factor authentication for GitHub and hosting; give teammates only the access they need. Do not share passwords or place API tokens in public files.

The current verified upload is `releases/holocad-site.zip`; a local binary patch of the prepared source changes is saved at `releases/holocad-source-changes.patch`. Both stay local and ignored. The source itself is now on https://github.com/bordeadavid24-rgb/HoloCAD . Dependabot opened four pull requests after the push. They are not merged. The checkout, GSAP, and three.js checks passed. The TypeScript 7 bump failed its check. Review those updates separately.

## Social videos: current priority

Owners: Petre and Stefan for content; David supplies software captures and technical checks. Target: nearly daily uploads, not automatic publication. Use `social-content-plan.md` for the initial 14-video backlog, production loop and per-clip record.

- [ ] Confirm target platforms/handles, posting operator, final approver and first launch date.
- [ ] Choose and assign the next batch of short video topics from the backlog.
- [ ] Draft scripts, captions and shot lists; confirm technical claims against what actually exists.
- [ ] Prepare reusable vertical editing/caption templates and permission-cleared team/product media.
- [ ] Record real website/software captures and label renders/concept footage clearly.
- [ ] Build a small buffer of finished clips to support nearly daily uploads.
- [ ] Human-review and publish each approved clip; record the date, URL and observations.
- [ ] Use audience questions and observed response to plan the next batch without inventing metrics or learning results.

## Define the first usable prototype: only after further-phase selection

Deferred by David. The following is a future preparation checklist, not current work. See `prototype-plan.md` for the plain-language optical-rig explanation.

- [ ] Choose one lesson and learner group with the teacher. Suggested starting point: explain piston/biela/crankshaft relationships using the existing engine example.
- [ ] State the learning outcome in observable terms, such as identifying three parts and explaining how reciprocating movement becomes rotation.
- [ ] Define what the first demonstration must do: load one approved model, rotate it, select and separate parts, provide reviewed explanations, and display synchronized optical views.
- [ ] Confirm the demonstration computer/OS, available screen, classroom lighting, viewing distance, budget ceiling and deadline. These facts are needed before final hardware choices or application packaging.
- [ ] Decide what runs locally, what needs internet, and how the demo behaves offline. Treat offline AI as unproven until measured on the chosen machine.

## Physical display and hardware: same conditional phase gate

- [ ] Inventory existing screens, computers, cables, power supplies, fabrication tools and materials before purchasing anything.
- [ ] Build a low-cost adjustable optical test rig before the final enclosure. Use the calibration procedure in `prototype-plan.md`.
- [ ] Measure readable image size, brightness, viewing zone, duplicate reflections and alignment in actual classroom lighting. Save photographs and observations.
- [ ] Compare candidate reflective materials and screen orientations using the same test image. Select from measured results rather than the presentation render.
- [ ] Confirm whether the current laptop/screen arrangement works without a separate controller board. Add a Raspberry Pi or other board only for a demonstrated requirement.
- [ ] Produce dimensioned enclosure/optical drawings after the setup is measured. Plan stable mounting, protected edges, cable routing, cooling and access for adjustment with the teacher/supervisor.
- [ ] Prepare a bill of materials with supplier links, quantities, actual quotes, shipping, available stock, total and contingency. Get the budget approved, then order.
- [ ] Assemble and calibrate the prototype. Record final dimensions, materials, display settings and wiring so the team can reproduce the setup.
- [ ] Run a complete demonstration for its intended duration and verify that it remains stable, readable and easy to transport/reassemble.

## Working application and model content: David, after website launch

- [ ] Confirm a lawful source/license for every imported model, technical image and explanation. Keep attribution requirements with each asset.
- [ ] Prepare one model with distinct, consistently named components, correct scale and transforms. Verify how it behaves before promising automatic recognition.
- [ ] Implement local model import, validation, a clear loading state and a useful error for invalid/unsupported files.
- [ ] Implement rotation, zoom, component tree/selection, isolation, separation/recomposition and reset on the actual model.
- [ ] Implement output views and orientation/calibration controls matched to the measured physical display. Test them on the real screen.
- [ ] Add reviewed component metadata and explanations with references. Make the text explanation available when audio cannot play.
- [ ] Add explicit playback/mute controls, prevent overlapping clips and test offline playback.
- [ ] Package and test the application on the chosen demonstration computer, including first launch, missing files, recovery and an offline restart.
- [ ] Verify model/file handling and any desktop permissions before distributing installers. Keep service credentials outside shipped frontend/application assets.

David is already working on the app. Before resuming application work, inspect its actual checkout and update the tasks from implementation evidence; do not infer that every item above is unimplemented. Hardware-specific output/calibration waits for measured hardware. This website task does not authorize silently expanding into a separate application project.

## AI: after launch and a reviewed usable demo

Deferred by David. Revisit scope and ownership after launch.

- [ ] Decide whether AI improves the chosen lesson enough to justify its latency, hardware needs and ongoing cost.
- [ ] Define supported questions and connect answers to component identifiers and reviewed references.
- [ ] Make the assistant state uncertainty for missing information and keep component highlighting tied to actual model data.
- [ ] Prepare teacher-reviewed correct, ambiguous and out-of-scope questions. Record answer quality, latency and failures on the chosen computer.
- [ ] Test internet loss, model/service unavailability and recovery to reviewed static explanations.
- [ ] Confirm any data sent to a service and the associated budget. Keep keys in an appropriate local/server secret store; do not embed them in distributed JavaScript.
- [ ] Describe only measured capabilities publicly. Do not claim validated offline inference until it works on the demonstration hardware.

## Classroom validation: after launch, discuss with Tulica

Deferred by David. Do not arrange a pilot or collect student data as part of the current website/social work.

- [ ] Arrange a supervised test with a teacher and a small group of students through the school. Obtain the permissions the school requires before recording people or collecting personal information.
- [ ] Use the same lesson task before and after the demonstration; record anonymous responses and observed difficulties using `prototype-plan.md`.
- [ ] Check whether students can identify parts, explain their relationship and complete the interaction without coaching.
- [ ] Record technical failures, setup time, explanation errors and accessibility barriers as well as positive feedback.
- [ ] Fix the most important issues, then repeat the test. Preserve the sample size and limitations when describing results; do not infer a proven learning benefit from informal enthusiasm.

## Demonstration and competition materials: discuss later

Deferred by David. These are future reminders; dates and required deliverables must come from the actual next-stage instructions.

- [ ] Prepare a short story: learning problem, intended users, current alternatives, HoloCAD's approach, measured evidence, limitations and next milestone.
- [ ] Record a short video of the actual device and application working together. Label renders and simulated/proposed behavior clearly.
- [ ] Prepare a live demo script, an offline fallback recording, spare essential cables and a setup checklist. Rehearse using the demonstration computer.
- [ ] Prepare the requested application/pitch materials using the organizer's current format and time limits. Include the budget, team responsibilities and evidence; do not invent scores, testimonials, partnerships or readiness.
- [ ] Submit the requested materials through the organizer's official channel and retain confirmation. Keep private participant documents outside the public repository/site.

## After launch

The active AI assistant keeps the maintenance record in `PROJECT-CONTEXT.md` during relevant sessions. There is no background watcher, scheduled task or auto-publisher; do not imply otherwise.

- [ ] Check the live site after every deployment and after domain changes.
- [ ] Review dependency/security update pull requests and rerun the release check before merging.
- [ ] Review hosting usage and any AI spending; remove unused credentials and team access when no longer needed.
- [ ] Update the website's progress statements and demonstration media only when the corresponding capability has been verified.
