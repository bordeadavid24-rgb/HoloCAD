import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdir,
  readFile,
  writeFile,
  readdir,
  stat,
  copyFile,
} from "node:fs/promises";
import { resolve } from "node:path";

await mkdir("releases", { recursive: true });
const files = await readdir("dist", { recursive: true });
const hashes = {};
for (const file of files.sort()) {
  if ((await stat(`dist/${file}`)).isFile())
    hashes[file] = createHash("sha256")
      .update(await readFile(`dist/${file}`))
      .digest("hex");
}
const archive = resolve("releases", `holocad-site-${Date.now()}.zip`);
await new Promise((resolve, reject) => {
  // Archive only the deployable output, never the checkout or local secrets.
  const child = spawn("zip", ["-q", "-r", archive, "."], {
    cwd: "dist",
    stdio: "inherit",
  });
  child.once("error", reject);
  child.once("exit", (code) =>
    code === 0 ? resolve() : reject(new Error(`zip exited ${code}`)),
  );
});
const digest = createHash("sha256")
  .update(await readFile(archive))
  .digest("hex");
await copyFile(archive, resolve("releases/holocad-site.zip"));
await writeFile(
  "releases/holocad-site.zip.sha256",
  `${digest}  holocad-site.zip\n`,
);
await writeFile(
  `${archive}.sha256`,
  `${digest}  ${archive.split("/").at(-1)}\n`,
);
await writeFile(
  "releases/manifest.json",
  JSON.stringify(
    {
      createdAt: new Date().toISOString(),
      archive,
      sha256: digest,
      files: hashes,
    },
    null,
    2,
  ) + "\n",
);
console.log(`Static upload package: ${archive}\nSHA-256: ${digest}`);
