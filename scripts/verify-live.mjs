import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { siteMetadata } from "./site-metadata.mjs";

const site = siteMetadata(process.argv[2]);
if (!site)
  throw new Error("Usage: npm run verify:live -- https://your-public-domain");
const response = await fetch(`${site.origin}/`, {
  signal: AbortSignal.timeout(20000),
  cache: "no-store",
});
assert.equal(response.status, 200, "Landing page must return 200.");
assert.equal(new URL(response.url).protocol, "https:");
const html = await response.text();
assert.match(html, /Dincolo de ecran/);
assert.match(html, /id="team"/);
const csp = response.headers.get("content-security-policy") || "";
for (const directive of [
  "default-src 'self'",
  "script-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
])
  assert.ok(
    csp.includes(directive),
    `Missing live CSP directive: ${directive}`,
  );
assert.ok(
  !/script-src[^;]*(?:unsafe-inline|unsafe-eval|\*)/.test(csp),
  "Live script policy is broader than expected.",
);
assert.equal(response.headers.get("x-content-type-options"), "nosniff");
assert.equal(response.headers.get("referrer-policy"), "no-referrer");
assert.match(
  response.headers.get("strict-transport-security") || "",
  /max-age=\d+/,
);
for (const permission of ["camera=()", "microphone=()", "geolocation=()"])
  assert.ok(
    (response.headers.get("permissions-policy") || "").includes(permission),
  );
for (const path of [
  "/og-image.png",
  "/robots.txt",
  "/images/holocad-team-640.webp",
  "/images/holocad-team-1200.webp",
  "/video/holocad-intro-mobile.mp4",
  "/video/holocad-intro-desktop.mp4",
  "/video/holocad-hardware.mp4",
  "/video/holocad-hardware.vtt",
]) {
  const asset = await fetch(site.origin + path, {
    method: "HEAD",
    signal: AbortSignal.timeout(20000),
  });
  assert.equal(asset.status, 200, `Missing live asset: ${path}`);
  assert.ok(
    !(asset.headers.get("content-type") || "").includes("text/html"),
    `Asset resolves to HTML: ${path}`,
  );
}
for (const path of [
  "/video/holocad-intro-desktop.mp4",
  "/video/holocad-intro-mobile.mp4",
]) {
  const media = await fetch(site.origin + path, {
    headers: { Range: "bytes=0-63" },
    signal: AbortSignal.timeout(20000),
  });
  assert.ok([200, 206].includes(media.status), "Film byte request failed.");
  const bytes = Buffer.from(await media.arrayBuffer());
  assert.equal(
    bytes.toString("ascii", 4, 8),
    "ftyp",
    "Film URL did not serve an MP4.",
  );
  const middle = await fetch(site.origin + path, {
    headers: { Range: "bytes=500000-500063" },
    signal: AbortSignal.timeout(20000),
  });
  assert.ok([200, 206].includes(middle.status), "Live media request failed.");
  const delivered = Buffer.from(await middle.arrayBuffer());
  const actual =
    middle.status === 206 ? delivered : delivered.subarray(500000, 500064);
  const expected = (await readFile(`dist${path}`)).subarray(500000, 500064);
  assert.deepEqual(
    actual,
    expected,
    "Live video range differs from the checked local media.",
  );
}
const script = html.match(/<script[^>]+src="(\/assets\/[^"?]+\.js)"/);
assert.ok(script, "Missing application script.");
const asset = await fetch(site.origin + script[1], {
  method: "HEAD",
  signal: AbortSignal.timeout(20000),
});
assert.equal(asset.status, 200);
assert.match(asset.headers.get("cache-control") || "", /immutable/);
assert.ok(
  html.includes(`<link rel="canonical" href="${site.origin}/"`),
  "Canonical URL does not match this host; rebuild with HOLOCAD_SITE_URL.",
);
const sitemap = await fetch(`${site.origin}/sitemap.xml`, {
  signal: AbortSignal.timeout(20000),
});
assert.equal(sitemap.status, 200);
assert.ok((await sitemap.text()).includes(`<loc>${site.origin}/</loc>`));
console.log(
  `Live checks passed: ${site.origin}/\nHTTPS, required security headers, page content, media, cache policy, canonical URL and sitemap verified.`,
);
