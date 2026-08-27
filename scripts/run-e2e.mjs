import "dotenv/config";
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:net";

const host = "127.0.0.1";
const port = 3100;
const baseUrl = `http://${host}:${port}`;
const testEnvironment = {
  ...process.env,
  APP_ACCESS_CREDENTIAL:
    process.env.APP_ACCESS_CREDENTIAL ?? "credential-e2e-lokal",
  SESSION_SECRET:
    process.env.SESSION_SECRET ??
    "session-secret-e2e-lokal-minimum-tiga-puluh-dua-karakter",
};

let server;

async function assertPortIsAvailable() {
  const probe = createServer();

  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(port, host, () => probe.close(resolve));
  });
}

function seedSyntheticM4Fixtures() {
  const seed = spawnSync(
    process.execPath,
    [
      "node_modules/tsx/dist/cli.mjs",
      "scripts/seed-synthetic-resolved-cases.ts",
    ],
    {
      env: testEnvironment,
      stdio: "inherit",
      windowsHide: true,
    },
  );
  if (seed.status !== 0) {
    throw new Error("Fixture sintetis M4 tidak dapat disiapkan untuk E2E.");
  }
}

async function waitForServer() {
  const deadline = Date.now() + 30_000;

  // Beri proses kesempatan untuk melaporkan kegagalan awal seperti port terpakai.
  await new Promise((resolve) => setTimeout(resolve, 350));

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error("Server produksi berhenti sebelum siap.");
    }

    try {
      const response = await fetch(`${baseUrl}/akses`, {
        redirect: "manual",
      });
      if (response.status < 500) return;
    } catch {
      // Server masih memulai. Coba lagi sampai tenggat.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error("Server produksi tidak siap dalam 30 detik.");
}

async function stopServer() {
  if (!server.pid || server.exitCode !== null) return;

  server.kill("SIGTERM");

  const exitedGracefully = await Promise.race([
    new Promise((resolve) => server.once("exit", () => resolve(true))),
    new Promise((resolve) => setTimeout(() => resolve(false), 5_000)),
  ]);

  if (exitedGracefully || server.exitCode !== null) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
    return;
  }

  process.kill(-server.pid, "SIGTERM");
}

try {
  await assertPortIsAvailable();
  seedSyntheticM4Fixtures();

  server = spawn(
    process.execPath,
    [".next/standalone/server.js"],
    {
      env: {
        ...testEnvironment,
        HOSTNAME: host,
        PORT: String(port),
      },
      stdio: "inherit",
      windowsHide: true,
      detached: process.platform !== "win32",
    },
  );

  await waitForServer();

  const playwright = spawn(
    process.execPath,
    ["node_modules/@playwright/test/cli.js", "test"],
    {
    env: testEnvironment,
    stdio: "inherit",
    windowsHide: true,
    },
  );

  const exitCode = await new Promise((resolve, reject) => {
    playwright.once("error", reject);
    playwright.once("exit", (code) => resolve(code ?? 1));
  });

  process.exitCode = exitCode;
} catch (error) {
  console.error(
    error instanceof Error ? error.message : "Pengujian browser gagal dijalankan.",
  );
  process.exitCode = 1;
} finally {
  if (server) await stopServer();
}
