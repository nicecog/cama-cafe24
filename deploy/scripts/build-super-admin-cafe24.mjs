#!/usr/bin/env node
/**
 * Cafe24 PROD build: cama-super-admin (Vite) — .env.production 사용
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../cama-super-admin");
const envProduction = join(root, ".env.production");

if (!existsSync(envProduction)) {
  console.error("Missing:", envProduction);
  process.exit(1);
}

console.log("Building cama-super-admin with mode=production (.env.production)");

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const r = spawnSync(npm, ["run", "build:prod"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(r.status ?? 1);
