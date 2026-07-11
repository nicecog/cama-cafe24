import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../../dist/preview");

const url = "http://localhost:5176/#/preview";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  await page.screenshot({
    path: path.join(outDir, "dashboard-health-tab.png"),
    fullPage: true,
  });

  await page.getByRole("tab", { name: /문의사항/ }).click();
  await page.waitForTimeout(800);

  await page.screenshot({
    path: path.join(outDir, "dashboard-inquiry-tab.png"),
    fullPage: true,
  });

  await browser.close();
  console.log("Saved screenshots to", outDir);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
