import { spawn } from "node:child_process";
import { preview } from "vite";
import { siteMetadata } from "./site-metadata.mjs";

const metadata = siteMetadata(process.argv[2] || process.env.HOLOCAD_SITE_URL);
if (metadata) process.env.HOLOCAD_SITE_URL = metadata.origin;

function run(command, args, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      env: { ...process.env, ...extraEnv },
    });
    child.once("error", reject);
    child.once("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${command} ${args.join(" ")} exited ${code}`)),
    );
  });
}
let server;
try {
  await run("npm", ["run", "build"]);
  await run("npm", ["run", "verify:geometry"]);
  await run(process.execPath, ["scripts/verify-artifacts.mjs"]);
  await run("npm", ["audit", "--audit-level=low"]);
  server = await preview({
    preview: { host: "127.0.0.1", port: 0, strictPort: true },
  });
  const address = server.httpServer.address();
  if (!address || typeof address === "string")
    throw new Error("Preview did not start.");
  await run(process.execPath, ["scripts/verify-landing.mjs"], {
    HOLOCAD_TEST_URL: `http://127.0.0.1:${address.port}`,
  });
  console.log("Release verification passed. The temporary preview is closing.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (server)
    await new Promise((resolve, reject) =>
      server.httpServer.close((error) => (error ? reject(error) : resolve())),
    );
}
