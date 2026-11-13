import assert from "node:assert/strict";
import { mkdir, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium, devices } from "@playwright/test";

const base = (
  process.argv[2] ||
  process.env.HOLOCAD_TEST_URL ||
  "http://127.0.0.1:4177"
).replace(/\/$/, "");
const output =
  process.env.HOLOCAD_QA_DIR || join(tmpdir(), "holocad-release-qa");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  channel:
    process.env.HOLOCAD_BROWSER_CHANNEL === "chromium" ? undefined : "chrome",
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--no-sandbox"],
});
const errors = [];
try {
  for (const [name, options] of [
    ["desktop", { viewport: { width: 1440, height: 900 } }],
    ["mobile", { ...devices["iPhone 13"], defaultBrowserType: undefined }],
  ]) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    // Keep metadata slower than animation initialization, as on a remote host.
    await page.route("**/video/holocad-intro-*.mp4", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 900));
      await route.continue();
    });
    const requests = [];
    page.on("pageerror", (error) => errors.push(`${name}: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`${name}: ${message.text()}`);
    });
    page.on("request", (request) => requests.push(request.url()));
    const response = await page.goto(base, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    const expected = JSON.parse(
      await readFile("security-headers.json", "utf8"),
    );
    for (const [key, value] of Object.entries(expected))
      assert.equal(response.headers()[key.toLowerCase()], value, key);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(
      await page.locator(".intro-film").getAttribute("src"),
      null,
      "No film requested before interaction",
    );
    assert.ok(
      !requests.some((url) =>
        /three-|hero-lens-|ScrollTrigger-|\.mp4/.test(url),
      ),
      "No 3D runtime or movies on arrival",
    );
    await page.screenshot({ path: `${output}/${name}-hero.png` });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "No horizontal overflow",
    );

    // First scroll initializes the existing film choreography.
    await page.evaluate(() =>
      window.scrollTo({ top: innerHeight * 0.6, behavior: "instant" }),
    );
    await page
      .waitForFunction(
        () => document.querySelector(".intro-film").readyState >= 2,
      )
      .catch(async (error) => {
        console.error(
          JSON.stringify(
            {
              errors,
              requests: requests.filter((url) => /assets|mp4/.test(url)),
              state: await page.evaluate(() => {
                const video = document.querySelector(".intro-film");
                return {
                  scroll: scrollY,
                  height: innerHeight,
                  source: video.getAttribute("src"),
                  currentSource: video.currentSrc,
                  ready: video.readyState,
                  network: video.networkState,
                  error: video.error?.message,
                  section: {
                    ...document.querySelector(".cinematic-intro").dataset,
                  },
                };
              }),
            },
            null,
            2,
          ),
        );
        throw error;
      });
    await page
      .waitForFunction(
        () => document.querySelector(".intro-film").currentTime > 0.2,
      )
      .catch(async (error) => {
        console.error(
          JSON.stringify(
            {
              phase: "film-seeking",
              errors,
              state: await page.evaluate(() => {
                const film = document.querySelector(".intro-film");
                return {
                  scroll: scrollY,
                  time: film.currentTime,
                  duration: film.duration,
                  ready: film.readyState,
                  network: film.networkState,
                  error: film.error?.message,
                  meter: document.querySelector(".film-progress-fill").style
                    .transform,
                  chapter:
                    document.querySelector(".cinematic-intro").dataset.chapter,
                };
              }),
            },
            null,
            2,
          ),
        );
        throw error;
      });
    const film = await page.locator(".intro-film").getAttribute("src");
    assert.ok(film.startsWith("blob:"), "Hero seeks the downloaded local film");
    assert.ok(
      requests.some((url) =>
        url.endsWith(
          `/video/holocad-intro-${name === "mobile" ? "mobile" : "desktop"}.mp4`,
        ),
      ),
      "Correct responsive film requested",
    );
    await page.getByRole("button", { name: "Hardware", exact: true }).click();
    await page.waitForFunction(
      () =>
        document.querySelector(".hero-interaction").dataset.pinned === "true",
    );
    await page.waitForFunction(
      () =>
        document.querySelector(".hero-interaction").dataset.fallback ===
        "false",
    );
    await page
      .getByRole("button", { name: "Închide explorarea stratului" })
      .click();

    await page
      .locator(".manifesto")
      .screenshot({ path: `${output}/${name}-explanation.png` });
    await page.locator("#team").scrollIntoViewIfNeeded();
    await page.locator("#team img").evaluate((img) => img.decode());
    await page.locator("#team").screenshot({
      path: `${output}/${name}-team.png`,
      style: ".site-header, .skip-link { visibility: hidden !important; }",
    });
    await page.locator("#explore").scrollIntoViewIfNeeded();
    await page.waitForSelector(".scene-engine canvas");
    assert.equal(
      await page.locator(".scene-engine .scene-fallback").count(),
      0,
    );
    const voice = page.getByRole("button", {
      name: /Oprește vocea|Dezactivează vocea|Oprește explicațiile/,
    });
    // Keep the smoke test silent when the voice toggle is available.
    if (await voice.count()) await voice.first().click();
    await page
      .getByRole("combobox", { name: "Selectează o componentă a motorului" })
      .selectOption("piston-0");
    await page
      .getByRole("heading", { name: "Pistonul", exact: true })
      .waitFor();
    await page
      .getByRole("combobox", { name: "Selectează o componentă a motorului" })
      .selectOption("");
    await page
      .getByRole("button", { name: "Descompune ansamblul", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("button", { name: "Recompune ansamblul", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    await page.getByRole("button", { name: "Resetează", exact: true }).click();
    await page.locator("#technology").scrollIntoViewIfNeeded();
    await page
      .getByRole("button", { name: "Descoperă componentele", exact: true })
      .click();
    await page.waitForFunction(() => {
      const film = document.querySelector(".hardware-film video");
      return film.currentTime > 0 && !film.paused;
    });
    await page.getByRole("button", { name: "Pauză", exact: true }).click();
    await page.locator(".technical-details > summary").click();
    assert.equal(
      await page.locator(".technical-details").getAttribute("open"),
      "",
    );
    await page.locator(".faq-list summary").first().click();
    assert.equal(
      await page.locator(".faq-list details").first().getAttribute("open"),
      "",
    );
    await page
      .locator(".faq-section")
      .screenshot({ path: `${output}/${name}-faq.png` });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "No overflow after expanding content",
    );
    if (name === "mobile") {
      await page.getByRole("button", { name: "Deschide meniul" }).click();
      await page.keyboard.press("Escape");
      assert.equal(
        await page
          .getByRole("button", { name: "Deschide meniul" })
          .getAttribute("aria-expanded"),
        "false",
      );
    }
    console.log(
      `${name}: deferred loading, security headers, film, glass controls, engine selection, narration film, disclosures and layout passed.`,
    );
    await context.close();
  }
  const reduced = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await reduced.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  assert.equal(await page.locator(".intro-film").getAttribute("src"), null);
  assert.equal(
    await page.locator(".film-chapter[aria-hidden='true']").count(),
    0,
  );
  await page.getByRole("button", { name: "Optică", exact: true }).click();
  assert.equal(
    await page.locator(".hero-interaction").getAttribute("data-pinned"),
    "true",
  );
  console.log(
    "Reduced motion: readable chapters, static product image and accessible layer explanations passed.",
  );
  await reduced.close();
  const sizes = await browser.newContext();
  const responsive = await sizes.newPage();
  await responsive.goto(base);
  for (const width of [320, 768, 1024]) {
    await responsive.setViewportSize({ width, height: 900 });
    assert.ok(
      await responsive.evaluate(() => {
        const title = document.querySelector("h1").getBoundingClientRect();
        return (
          document.documentElement.scrollWidth <= innerWidth &&
          title.left >= 0 &&
          title.right <= innerWidth
        );
      }),
      `Layout and headline fit at ${width}px`,
    );
  }
  await sizes.close();
  const dataSaver = await browser.newContext();
  await dataSaver.addInitScript(() =>
    Object.defineProperty(navigator, "connection", {
      value: { saveData: true },
    }),
  );
  const economical = await dataSaver.newPage();
  await economical.goto(base, { waitUntil: "networkidle" });
  await economical.evaluate(() =>
    window.scrollTo({ top: 500, behavior: "instant" }),
  );
  await economical
    .getByRole("button", { name: "Hardware", exact: true })
    .click();
  assert.equal(
    await economical.locator(".intro-film").getAttribute("src"),
    null,
  );
  assert.equal(
    await economical.locator(".hero-interaction").getAttribute("data-pinned"),
    "true",
  );
  await dataSaver.close();
  const direct = await browser.newContext();
  const linked = await direct.newPage();
  await linked.goto(`${base}/#team`, { waitUntil: "networkidle" });
  assert.equal(
    await linked.locator(".intro-film").getAttribute("src"),
    null,
    "Direct section links do not load an offscreen film",
  );
  await linked.evaluate(() =>
    window.scrollTo({ top: 300, behavior: "instant" }),
  );
  await linked.waitForFunction(
    () => document.querySelector(".intro-film").readyState >= 2,
  );
  await linked.emulateMedia({ reducedMotion: "reduce" });
  await linked.waitForFunction(
    () => !document.querySelector(".intro-film").hasAttribute("src"),
  );
  await linked.emulateMedia({ reducedMotion: "no-preference" });
  await linked.waitForFunction(
    () => document.querySelector(".intro-film").readyState >= 2,
  );
  await direct.close();
  console.log(
    "320px, tablet and small laptop layouts fit. Data Saver keeps film unloaded and layer explanations available.",
  );
  const noScript = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const staticPage = await noScript.newPage();
  await staticPage.goto(base);
  assert.equal(
    await staticPage.locator("h1").textContent(),
    "Dincolo de ecran.",
  );
  assert.ok(await staticPage.locator("#team").textContent());
  console.log(
    "No JavaScript: prerendered main content and team section present.",
  );
  await noScript.close();
  assert.deepEqual(
    errors,
    [],
    "No browser errors, hydration failures or CSP violations",
  );
  const files = await readdir("dist", { recursive: true });
  assert.ok(
    !files.some((file) => /(?:^|\/)\.env|\.map$|\.pem$|\.key$/.test(file)),
    "No secrets or source maps in release",
  );
  for (const file of files.filter((file) =>
    /\.(?:html|js|css|json|txt)$/.test(file),
  )) {
    const content = await readFile(`dist/${file}`, "utf8");
    assert.ok(
      !/(?:sk-proj-[A-Za-z0-9_-]{16,}|AKIA[A-Z0-9]{16}|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)/.test(
        content,
      ),
      `No credential patterns in ${file}`,
    );
  }
  console.log(`Release checks passed. Screenshots: ${output}`);
} finally {
  await browser.close();
}
