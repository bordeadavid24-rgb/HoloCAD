# Release and rollback runbook

The current Cloudflare Pages project is `holocad26`. Its public origin, `https://holocad26.pages.dev`, is recorded in `site.config.json` so ordinary future builds keep the correct canonical URL and sitemap. `HOLOCAD_SITE_URL` overrides that public setting for a custom domain or another deployment.

David requires a zero-cost website address. Keep the existing `pages.dev` origin; custom-domain purchase and paid hosting upgrades are outside the current scope. The alternate-domain instructions below are technical reference only, not a pending launch requirement.

Use Node 24 (`.nvmrc`). Install the locked dependencies with `npm ci`. The existing production assets are already present; releasing does not need narration generation, an ElevenLabs key or paid API calls.

## Verify and package

Run `npm run package:release`. This builds and prerenders the site, checks geometry and packaged files, compares output against any local secrets without logging their values, starts a temporary loopback preview, runs desktop/mobile browser checks, closes it, and creates a ZIP under `releases/` with a SHA-256 checksum and manifest. Only `dist/` enters the ZIP.

Chrome is the default local test browser. On CI, set `HOLOCAD_BROWSER_CHANNEL=chromium` and install the matching browser using `npx playwright install --with-deps chromium`. Screenshots use the operating system temporary directory, or `HOLOCAD_QA_DIR` if set.

Once the exact public address is known, set `HOLOCAD_SITE_URL` to its HTTPS origin in the shell/hosting build environment and rebuild. The build generates its canonical URL, absolute social image URL, `og:url`, robots sitemap declaration and sitemap. Example shell syntax is `HOLOCAD_SITE_URL=https://your-public-domain npm run package:release`; replace the example with the actual host before running. Do not prefix secret variables with `VITE_`.

## Cloudflare Pages direct upload

1. Use the intended team-owned Cloudflare account. Choose Workers & Pages, Create application, Continue to Pages and the direct-upload option.
2. Select a project name and read the resulting address. Rebuild the checked package using that actual HTTPS origin.
3. Upload the ZIP generated under `releases/`, with `index.html` at its root. Never select the workspace folder, `.env.local`, `.git` or `node_modules`.
4. Deploy the site and retain the returned project URL and deployment identifier privately.
5. Run `npm run verify:live -- https://actual-host` and then run the browser tests with `HOLOCAD_TEST_URL=https://actual-host npm run verify:landing`.
6. Complete the real-phone and social-preview checks in `PROJECT-TODO.md` before sharing the link broadly.

The [Cloudflare direct-upload documentation](https://developers.cloudflare.com/pages/get-started/direct-upload/) states that a Direct Upload project cannot be switched to Git integration later. It can still receive later direct/CLI deployments; a future native Git integration needs a new project. No repository permissions are granted by this upload. The local GitHub workflow checks source changes but does not deploy them.

`dist/_headers` carries the security policy and hashed-asset caching. For Vercel, the matching policy lives in `vercel.json`. On any other host, copy the same actual response headers; a meta tag cannot supply frame protection.

## Source and CI

David chose `bordeadavid24-rgb/HoloCAD` as the source of truth. The repository was created and the existing history was pushed on November 17. `lalachmoon/HoloCAD` remains intact. Consult `PROJECT-CONTEXT.md` before pushing. Do not share credentials. A passing GitHub check does not publish the site. Cloudflare direct upload still requires the hosting account.

The prepared workflow runs on pull requests, pushes to main and manual dispatch. It uses read-only repository permissions and does not persist checkout credentials. It performs a dependency audit and the same release verification. It is not a completed GitHub run until the files are uploaded/pushed and the actual run succeeds.

## Rollback

Keep the previous known-good ZIP/checksum and its deployment identifier. Verify the archive's checksum, then use the hosting project's rollback or deploy that checked ZIP as a new version. Run the live check and browser smoke test afterward. Do not solve a broken release by weakening CSP or exposing a local development server.

## Regular maintenance

Review dependency-update pull requests, rerun verification before merging, and check the live site after publication or domain changes. Store account recovery material and keys privately. Regenerate narration only when required and with an explicitly approved paid account; it is unrelated to ordinary releases.
