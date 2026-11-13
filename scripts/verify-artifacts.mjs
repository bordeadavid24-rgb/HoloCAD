import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

const files = await readdir("dist", { recursive: true });
assert.ok(
  files.includes("index.html"),
  "Build the site before verifying artifacts.",
);
assert.ok(
  !files.some((file) =>
    /(?:^|\/)\.(?:env|git|aws|vercel)|\.(?:map|pem|key)$/.test(file),
  ),
  "Release contains a private file or source map.",
);
const localSecrets = [];
try {
  const environment = await readFile(".env.local", "utf8");
  for (const line of environment.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([\w]+)\s*=\s*(.*?)\s*$/);
    if (!match || !/(?:KEY|SECRET|TOKEN|PASSWORD)/.test(match[1])) continue;
    const value = match[2].replace(/^(['"])(.*)\1$/, "$2");
    if (value.length >= 16) localSecrets.push(value);
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
for (const file of files.filter((name) =>
  /\.(?:html|js|css|json|txt|svg|vtt)$/.test(name),
)) {
  const content = await readFile(`dist/${file}`, "utf8");
  assert.ok(
    !/(?:sk-proj-[A-Za-z0-9_-]{16,}|AKIA[A-Z0-9]{16}|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)/.test(
      content,
    ),
    `Credential pattern in ${file}`,
  );
  assert.ok(
    !localSecrets.some((secret) => content.includes(secret)),
    `Local secret found in ${file}; value withheld.`,
  );
}
const html = await readFile("dist/index.html", "utf8");
assert.match(html, /<h1[^>]*>Dincolo de ecran\.<\/h1>/);
assert.match(html, /id="team"/);
assert.match(html, /<style>/);
assert.ok(
  !/<video[^>]*class="intro-film"[^>]*\ssrc=/.test(html),
  "Intro film is loaded eagerly.",
);
const paths = new Set(
  [...html.matchAll(/(?:src|href)="(\/[^"?#]*)"/g)].map((match) => match[1]),
);
for (const match of html.matchAll(/url\((\/[^)\s'"]+)/g)) paths.add(match[1]);
for (const path of paths) {
  const target = resolve("dist", `.${decodeURIComponent(path)}`);
  assert.ok(
    target.startsWith(resolve("dist") + "/") || target === resolve("dist"),
    "Asset path escapes the build.",
  );
  await stat(target);
}
for (const name of ["holocad-team-640.webp", "holocad-team-1200.webp"]) {
  const data = await readFile(`dist/images/${name}`);
  for (let offset = 12; offset + 8 <= data.length;) {
    const chunk = data.toString("ascii", offset, offset + 4);
    assert.ok(
      !["EXIF", "XMP "].includes(chunk),
      "Team image contains private metadata.",
    );
    const length = data.readUInt32LE(offset + 4);
    offset += 8 + length + (length % 2);
  }
}
const headers = JSON.parse(await readFile("security-headers.json", "utf8"));
const configured = JSON.parse(await readFile("vercel.json", "utf8")).headers[0]
  .headers;
assert.deepEqual(
  Object.fromEntries(configured.map(({ key, value }) => [key, value])),
  headers,
);
const staticHeaders = await readFile("dist/_headers", "utf8");
for (const [name, value] of Object.entries(headers))
  assert.ok(staticHeaders.includes(`${name}: ${value}`));
console.log(
  "Release artifacts passed: readable HTML, linked files, matching headers, no source maps/local secrets, and stripped team-image metadata.",
);
