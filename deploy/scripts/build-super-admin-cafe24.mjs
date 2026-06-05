#!/usr/bin/env node
/**
 * Cafe24 PROD build: cama-super-admin .env.cafe24.example → .env 후 CRA build
 */
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../cama-super-admin");
const example = join(root, ".env.cafe24.example");
const envFile = join(root, ".env");

if (!existsSync(example)) {
  console.error("Missing:", example);
  process.exit(1);
}

copyFileSync(example, envFile);
console.log("Using", example, "→ .env");

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const r = spawnSync(npm, ["run", "build:cafe24"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(r.status ?? 1);
