# HoloCAD project context and decisions

Last updated: November 17, 2026, after the eligibility confirmation. Read this with `PROJECT-TODO.md`. This is the shared handoff for any assistant working from this repository; other tools will need this repository or these files supplied to them.

## Confirmed by David on November 13

- HoloCAD is registered for Samsung Solve for Tomorrow. Do not keep asking the team to register. Registration is user-confirmed; no private submission documents were inspected or stored.
- David is the software developer and is already working on the application. Application development continues after the website launch; this website checkout is not evidence of the app's current implementation status.
- Petre and Stefan work on content. The specific social account operator, final publishing approver and per-post assignments remain to be agreed.
- David, Petre and Stefan will probably work together on the holographic display/hardware. This is an intended shared responsibility, not a finalized hardware design.
- The coordinating teacher named on the form is Dr. Ing. Prof. Alexandru Constantin Tulica. The students named for the entry are Bordea David, Oprea Petre Teodor and Cheslerean Stefan. On November 17 the user confirmed that all three students are 16–19 and enrolled at the school, and that the school has given permission for the team photograph and the school references. The permission document and the registration confirmation were not copied into this repository.
- Immediate priorities are the website and frequent social-media videos, aiming for nearly daily uploads.
- Build the physical first prototype only if the team reaches the further competition phase. Do not purchase hardware or start fabrication now.
- Real-phone checks stay open until a physical iPhone/Safari and Android/Chrome have been used. An emulator result does not close that item. On November 17 the user asked to attempt the remaining device, account, and message checks from this machine.
- AI evaluation and classroom testing are after-launch work. The later demonstration/pitch plan will be discussed separately.
- David wants the source under GitHub user `bordeadavid24-rgb`, not `lalachmoon`.
- Latest domain constraint: the address must be completely free. Use the existing `https://holocad26.pages.dev` address. The earlier preference for `holocad.com`, `.ro` or `.app` does not authorize registration fees. Do not buy a domain, enable a paid plan or propose introductory-free offers with paid renewals as a zero-cost solution.
- Assistants should maintain the task list, release evidence and maintenance history during active work. No unattended monitoring, automatic posting or scheduled maintenance is configured.

## Roles

| Person | Confirmed responsibility | Practical handoff |
| --- | --- | --- |
| Bordea David | Software / application | Website and app implementation; domain/account decisions |
| Oprea Petre Teodor | Content | Scripts, educational explanations and video preparation with Stefan |
| Cheslerean Stefan | Content | Scripts, educational explanations and video preparation with Petre |
| David + Petre + Stefan | Likely shared future hardware work | Plan and build only after the competition phase gate is met |
| Dr. Ing. Prof. Alexandru Constantin Tulica | Professor / coordinator, named on the entry | Coordinate school/competition questions and discuss educational review |
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
- November 17: the corrected concept copy was uploaded to the same Cloudflare Pages project. The public site and the live browser checks agree with the source.
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
| November 17, 2026 | Uploaded the corrected build to Cloudflare Pages `holocad26` from the `bordeadavid24@gmail.com` account. Production https://holocad26.pages.dev serves the concept-stage wording. Live header, media, and desktop/mobile browser checks passed. The November 13 ZIP was kept as `releases/holocad-site-2026-11-13.zip` | GitHub and Cloudflare two-factor authentication, the confirmation email, a real iPhone, a real Android phone, and a private-message unfurl remain open. `npm audit` reports a picomatch ReDoS advisory in Vite's build tools; the published files do not contain picomatch, and the audit's forced fix would downgrade Vite |
| November 17, 2026 | User confirmed the named entry: Bordea David, Oprea Petre Teodor and Cheslerean Stefan, each 16–19 and enrolled at the school, with Dr. Ing. Prof. Alexandru Constantin Tulica as the coordinating teacher, and confirmed school permission for the team photograph and school references. The form and permission document were not copied here. GitHub settings for `bordeadavid24-rgb` showed two-factor authentication is not enabled; it was left off. Cloudflare dashboard and both visible Google accounts were signed out, so the corrected site was not uploaded and the confirmation email was not opened. Chrome on Android emulator FlotaMea_API35 exercised the live site: film scroll, scrolling past the engine, part selection, voice mute, narrated film, team image, menu and landscape worked. The engine viewport stayed black, so visible rotation was not confirmed | Live upload, GitHub and Cloudflare two-factor authentication, the confirmation email, a real iPhone, a real Android phone, and a private-message unfurl remain open |
| November 17, 2026 | Read the public Solve for Tomorrow page and the linked rules PDF. Corrected source copy that treated the physical prototype or optical tests as current. Verified the rollback ZIP checksum, the single GitHub collaborator, and that Cloudflare login is not available in this session | Live site still serves the November 13 text until the next upload |
| November 17, 2026 | Created public `bordeadavid24-rgb/HoloCAD`, pushed existing history, and confirmed the main-branch verify workflow succeeded for `44d9e95`. `lalachmoon/HoloCAD` remains at `1ce1164` | Dependabot opened four unmerged update pull requests |
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
- November 17: Compared the team and the website with the public Solve for Tomorrow rules. The competition name may be used; the Samsung logo may not. Prototype and classroom work stay behind selection. Details are in `competition-status.md`.
- November 17: Uploaded the corrected concept copy to Cloudflare Pages project `holocad26`. The public site passed the live and browser checks. The November 13 package remains the local rollback copy.
- November 17: The user confirmed eligibility and school permission. The students on the entry are Bordea David, Oprea Petre Teodor and Cheslerean Stefan, all 16–19 and enrolled at the school. The coordinating teacher named on the form is Dr. Ing. Prof. Alexandru Constantin Tulica. The school has permitted the team photograph and the school references. These are user-reported facts. The registration form, the permission document, and the confirmation email were not opened or stored in this repository. Full names stay in this handoff; they were not added to the public marketing page.
