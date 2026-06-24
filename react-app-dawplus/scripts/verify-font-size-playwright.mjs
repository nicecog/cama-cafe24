/**
 * E2E: 글자 크기 +/- 버튼 (FontSizeController) on coaching header.
 *
 * Usage:
 *   LOGIN_ID=... PASSWORD=... BASE_URL=https://camaplus.cafe24.com/webview node scripts/verify-font-size-playwright.mjs
 */
import { chromium } from "playwright";

const BASE_URL = (process.env.BASE_URL || "https://camaplus.cafe24.com/webview").replace(
  /\/$/,
  "",
);
const LOGIN_ID = process.env.LOGIN_ID;
const PASSWORD = process.env.PASSWORD;
const SLEEP_DAY2_URL = `${BASE_URL}/coaching/sleep/day2`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function login(page) {
  assert(LOGIN_ID && PASSWORD, "LOGIN_ID and PASSWORD env vars are required");

  await page.goto(`${BASE_URL}/login/credentials`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.locator('input[name="loginId"]').fill(LOGIN_ID);
  await page.locator('input[autocomplete="current-password"]').fill(PASSWORD);
  await page.getByRole("button", { name: /^로그인$/ }).click();
  await page.waitForURL((url) => !url.pathname.includes("/login"), {
    timeout: 30000,
  });
}

async function readFontBase(page) {
  return page.evaluate(() =>
    document.documentElement.style.getPropertyValue("--font-base").trim(),
  );
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  try {
    await login(page);
    await page.goto(SLEEP_DAY2_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.getByRole("button", { name: "글자 크기 키우기" }).waitFor({
      timeout: 20000,
    });

    const medium = await readFontBase(page);
    console.log("initial --font-base:", medium || "(css default)");
    assert(
      medium === "" || medium === "1rem",
      `expected medium scale (--font-base 1rem or unset), got ${medium}`,
    );

    await page.getByRole("button", { name: "글자 크기 키우기" }).click();
    const large = await readFontBase(page);
    console.log("after +:", large);
    assert(large === "1.125rem", `expected 1.125rem after increase, got ${large}`);

    await page.getByRole("button", { name: "글자 크기 키우기" }).click();
    const xlarge = await readFontBase(page);
    console.log("after ++:", xlarge);
    assert(xlarge === "1.25rem", `expected 1.25rem after second increase, got ${xlarge}`);

    await page.getByRole("button", { name: "글자 크기 줄이기" }).click();
    const backLarge = await readFontBase(page);
    console.log("after -:", backLarge);
    assert(backLarge === "1.125rem", `expected 1.125rem after decrease, got ${backLarge}`);

    await page.getByRole("button", { name: "기본 크기로 되돌리기" }).click();
    const reset = await readFontBase(page);
    console.log("after reset:", reset);
    assert(reset === "1rem", `expected 1rem after reset, got ${reset}`);

    const persisted = await page.evaluate(() => window.localStorage.getItem("fontScale"));
    console.log("localStorage fontScale:", persisted);
    assert(persisted === '"medium"', `expected persisted medium, got ${persisted}`);

    console.log("PASS: font size controls work on", SLEEP_DAY2_URL);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("FAIL:", error.message);
  process.exit(1);
});
