import { chromium } from "playwright";
import path from "node:path";
const dir = path.dirname(new URL(import.meta.url).pathname);
const jobs = [["profile", 1080, 1080], ["post-01", 1080, 1350], ["post-03", 1080, 1350], ["og-image", 1200, 630], ["touch-icon", 180, 180]];
const b = await chromium.launch({ executablePath: process.env.CHROME_BIN });
for (const [n, w, h] of jobs) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto("file://" + path.join(dir, n + ".html"));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(dir, "../export", `holocad-${n}.png`) });
}
await b.close();
