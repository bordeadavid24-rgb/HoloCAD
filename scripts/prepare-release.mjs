import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { readFile, writeFile, readdir, unlink } from "node:fs/promises";
import { siteMetadata } from "./site-metadata.mjs";

const siteConfig = JSON.parse(
  await readFile(new URL("../site.config.json", import.meta.url), "utf8"),
);
const metadata = siteMetadata(process.env.HOLOCAD_SITE_URL || siteConfig.url);

// Ship readable HTML before JavaScript runs; React hydrates the same component.
const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
  appType: "custom",
});
try {
  const { default: App } = await server.ssrLoadModule("/src/App.tsx");
  const markup = renderToString(createElement(App));
  const html = await readFile("dist/index.html", "utf8");
  if (!html.includes('<div id="root"></div>')) {
    throw new Error("Cannot find the empty root for prerendering.");
  }
  let document = html.replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>`,
  );
  // The complete stylesheet is only ~10 KB compressed. Inline it to remove a
  // render-blocking round trip, keeping its already-rewritten /assets/ URLs.
  for (const match of document.matchAll(
    /<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
  )) {
    const css = await readFile(`dist${match[1]}`, "utf8");
    document = document.replace(match[0], `<style>${css}</style>`);
  }
  if (metadata) {
    document = document
      .replace("</head>", `${metadata.head}\n</head>`)
      .replace(
        'content="/og-image.png"',
        `content="${metadata.origin}/og-image.png"`,
      );
    await writeFile("dist/robots.txt", metadata.robots);
    await writeFile("dist/sitemap.xml", metadata.sitemap);
  }
  await writeFile("dist/index.html", document);
} finally {
  await server.close();
}

const headers = JSON.parse(await readFile("security-headers.json", "utf8"));
const headerLines = Object.entries(headers)
  .map(([name, value]) => `  ${name}: ${value}`)
  .join("\n");
// Cloudflare Pages / Netlify static hosting. Vercel uses vercel.json below.
await writeFile(
  "dist/_headers",
  `/*\n${headerLines}\n\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/index.html\n  Cache-Control: no-cache\n\n/\n  Cache-Control: no-cache\n`,
);

const vercel = JSON.parse(await readFile("vercel.json", "utf8"));
const configuredHeaders = Object.fromEntries(
  vercel.headers[0].headers.map(({ key, value }) => [key, value]),
);
if (JSON.stringify(configuredHeaders) !== JSON.stringify(headers)) {
  throw new Error("Vercel security headers must match security-headers.json.");
}

// Preserve original production assets in public/ for reproducible renders, but
// exclude unused source-quality images and old films from the release upload.
const retained = new Set([
  "engine-study.png",
  "engine-exploded.png",
  "engine-piston.png",
  "holocad-poster.jpg",
  "holocad-hardware.mp4",
  "holocad-hardware.vtt",
  "holocad-hardware-poster.jpg",
  "holocad-intro-desktop.mp4",
  "holocad-intro-mobile.mp4",
  "holocad-intro-poster-1920.webp",
  "holocad-intro-poster-960.webp",
  "holocad-intro-poster-1280.webp",
]);
for (const name of await readdir("dist/video")) {
  if (!retained.has(name)) await unlink(`dist/video/${name}`);
}
for (const name of await readdir("dist/images")) {
  if (!name.endsWith(".webp")) await unlink(`dist/images/${name}`);
}
console.log(
  "Prerendered landing page, generated security headers, excluded unused source media.",
);
