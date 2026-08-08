#!/usr/bin/env node
/**
 * RN WebView URL ↔ react-app-dawplus route file parity check
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesRoot = path.resolve(
  __dirname,
  "../../react-app-dawplus/src/routes",
);

const RN_WEBVIEW_PATHS = [
  "webview/coaching/$loginId/index.tsx",
  "webview/coaching/$categoryCd/$loginId/index.tsx",
  "webview/coaching/wellbeing/$loginId/index.tsx",
  "webview/help/index.tsx",
  "webview/treatment/$seq/index.tsx",
  "webview/nutrition/meal/capture/index.tsx",
  "webview/nutrition/meal/review/index.tsx",
  "webview/nutrition/meal/result/index.tsx",
  "webview/nutrition/meal/history/index.tsx",
];

const INTERNAL_TARGETS = [
  "_auth/_layout/coaching/index.tsx",
  "_auth/_coaching/coaching/mind/index.tsx",
  "help/index.tsx",
  "content/detail/$id/index.tsx",
];

let failed = 0;

for (const rel of [...RN_WEBVIEW_PATHS, ...INTERNAL_TARGETS]) {
  const full = path.join(routesRoot, rel);
  if (!fs.existsSync(full)) {
    console.error(`MISSING: ${rel}`);
    failed++;
  } else {
    console.log(`OK: ${rel}`);
  }
}

if (failed > 0) {
  process.exit(1);
}
console.log("\nAll WebView parity route files present.");
