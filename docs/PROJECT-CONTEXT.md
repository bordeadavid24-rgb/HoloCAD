# HoloCAD project context and decisions

Last updated: November 17, 2026. Read this with `PROJECT-TODO.md`. This is the shared handoff for any assistant working from this repository; other tools will need this repository or these files supplied to them.

## Confirmed by David on November 13

- HoloCAD is registered for Samsung Solve for Tomorrow. Do not keep asking the team to register. Registration is user-confirmed; no private submission documents were inspected or stored.
- David is the software developer and is already working on the application. Application development continues after the website launch; this website checkout is not evidence of the app's current implementation status.
- Petre and Stefan work on content. The specific social account operator, final publishing approver and per-post assignments remain to be agreed.
- David, Petre and Stefan will probably work together on the holographic display/hardware. This is an intended shared responsibility, not a finalized hardware design.
- Tulica is the team's professor/coordinator. Do not infer a full legal name or additional responsibilities without confirmation.
- Immediate priorities are the website and frequent social-media videos, aiming for nearly daily uploads.
- Build the physical first prototype only if the team reaches the further competition phase. Do not purchase hardware or start fabrication now.
- Real-phone checks are deliberately postponed until a later session. Keep them open; do not claim emulation replaces real Safari/touch testing.
- AI evaluation and classroom testing are after-launch work. The later demonstration/pitch plan will be discussed separately.
- David wants the source under GitHub user `bordeadavid24-rgb`, not `lalachmoon`.
- Latest domain constraint: the address must be completely free. Use the existing `https://holocad26.pages.dev` address. The earlier preference for `holocad.com`, `.ro` or `.app` does not authorize registration fees. Do not buy a domain, enable a paid plan or propose introductory-free offers with paid renewals as a zero-cost solution.
- Assistants should maintain the task list, release evidence and maintenance history during active work. No unattended monitoring, automatic posting or scheduled maintenance is configured.

## Roles

| Person | Confirmed responsibility | Practical handoff |
| --- | --- | --- |
| David | Software / application | Website and app implementation; domain/account decisions |
| Petre | Content | Scripts, educational explanations and video preparation with Stefan |
| Stefan | Content | Scripts, educational explanations and video preparation with Petre |
| David + Petre + Stefan | Likely shared future hardware work | Plan and build only after the competition phase gate is met |
| Tulica | Professor / coordinator | Coordinate school/competition questions and discuss educational review |
| Active AI assistant | Technical execution and project records within the user's instructions | Verify changes, keep tasks/evidence current, prepare content drafts; do not publish social posts or make purchases without specific authorization |

## Phases and gates

| Phase | Status / gate | Work |
| --- | --- | --- |
| Website and social launch | Current priority | Source ownership, existing free address, website checks, reusable video workflow and content backlog |
| Application | David is already working on it; expanded work after website launch | Establish the app's actual state before planning or claiming features |
| Physical prototype | Only if selected for the further competition phase | Lesson/hardware decisions, optical experiment, measurements, bill of materials, enclosure |
| AI and classroom validation | After launch, with a usable demo and a separate decision | Reviewed explanations first; evaluate AI and test with a teacher later |
| Pitch / live demonstration | Discuss later | Match the actual phase requirements and demonstrated capabilities |

## Website and source state

- Production: https://holocad26.pages.dev on Cloudflare Pages project `holocad26`.
- Hosting access uses David's intended account. Keep login/recovery information outside public source files.
- November 13: the host-specific film correction was deployed; live security/media and desktop/mobile browser regression suites passed. Full details are in `release-review.md`.
- The website is a concept presentation with an interactive demonstration and prepared narration. Physical display performance, live AI and classroom learning improvements are not verified by this website.
- Source repository: https://github.com/bordeadavid24-rgb/HoloCAD . Created November 17, 2026 on David's account, public, with an empty initial state so the existing history could be pushed. Local `main` matches `origin/main`. The push of `44d9e95` passed "Verify landing page": https://github.com/bordeadavid24-rgb/HoloCAD/actions/runs/44102153626 . Dependabot then opened four update pull requests from the existing configuration. They are not merged. Review each one before accepting it.
- Previous source remote: https://github.com/lalachmoon/HoloCAD.git . It still points at `1ce1164` and was not deleted, transferred, or overwritten.
- The local release ZIP/checksum and staged-source backup are under ignored `releases/`. Publish only checked site assets to hosting and checked source to GitHub.

## Domain investigation: November 13

**Superseded as an active purchase task:** David subsequently required a zero-cost address. Keep `holocad26.pages.dev`, already deployed with HTTPS, as the production origin. No paid custom domain is required for launch. The registry findings below are historical research, not a purchase recommendation or an open budget request.

| Domain | Registry result | Decision |
| --- | --- | --- |
| `holocad.com` | Verisign RDAP returned an existing registration | Unavailable for ordinary new registration; no acquisition request or budget approved |
| `holocad.ro` | RoTLD WHOIS returned no entries | Appears unregistered; final availability, price and any restrictions must be confirmed by the registrar |
| `holocad.app` | Google Registry RDAP returned 404, `holocad.app not found` | Appears unregistered; premium/reserved status and checkout price remain unconfirmed |

Availability is not a reservation, and an unregistered domain is not free of charge. Do not pursue registration under the current zero-cost requirement. Keep production canonical metadata on the working `pages.dev` origin.

Sources: [Verisign .com RDAP](https://rdap.verisign.com/com/v1/domain/holocad.com), [Google Registry .app RDAP](https://pubapi.registry.google/rdap/domain/holocad.app), [RoTLD WHOIS](https://rotld.ro/whois/), [RoTLD prices](https://www.rotld.ro/prices/).

## Maintenance handoff

At each relevant work session, read this context and the open tasks, check the last maintenance entry, perform the checks appropriate to the change and record the dated result. Check the public website after a deployment or domain change. Review dependency/security updates periodically; CI/Dependabot only work once their configuration is on GitHub. Check hosting/domain renewals and usage in the provider account when requested or when relevant to a release. Do not claim these checks happen between sessions.

| Date | Evidence / action | Remaining follow-up |
| --- | --- | --- |
| November 17, 2026 | Created public `bordeadavid24-rgb/HoloCAD`, pushed existing history, and confirmed the main-branch verify workflow succeeded for `44d9e95`. `lalachmoon/HoloCAD` remains at `1ce1164` | Dependabot opened four unmerged update pull requests. Real phones and social preview remain deferred |
| November 13, 2026 | Public release and full live browser/security/media verification passed; complete local release check passed; dependency audit reported zero known vulnerabilities | Real phones and social preview deferred; retain the free `pages.dev` address |
| November 13, 2026 | David confirmed registration, roles and revised sequencing; registry lookups completed | Keep future assistants on the website/social focus; no hardware purchases or automated social publishing |

## Decision log

- November 13: David confirmed competition registration; removed registration urgency from current work.
- November 13: Recorded David/software, Petre+Stefan/content, likely shared hardware and Tulica/professor roles.
- November 13: Prioritized website launch and nearly daily social videos; made the physical prototype conditional on further-phase selection.
- November 13: Deferred real-phone checks by request; AI/classroom work after launch and pitch planning for later discussion.
- November 13: Chose `bordeadavid24-rgb` as the repository owner and recorded domain preferences and registry findings.
- November 13, later clarification: domain/address must cost nothing. Retain `holocad26.pages.dev`; paid custom-domain research is no longer an active launch task.
- November 13: Changed local Git `origin` to `bordeadavid24-rgb/HoloCAD`. Remote creation was still blocked at that time; the old repository was not deleted or changed.
- November 17: Created public `bordeadavid24-rgb/HoloCAD` with David's stored GitHub credential, pushed the existing history, and confirmed CI on `main`. Left `lalachmoon/HoloCAD` unchanged.
