/**
 * Cafe24 POST /api/auth 스모크 테스트
 * 사용: node scripts/test-login-api.mjs
 *       CAMA_TEST_LOGIN_ID=happycog CAMA_TEST_PASSWORD=*** node scripts/test-login-api.mjs
 */
const API_BASE = (
  process.env.VITE_API_SERVER || "https://camaplus.cafe24.com/"
).replace(/\/$/, "");

async function postAuth(body) {
  const res = await fetch(`${API_BASE}/api/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json };
}

const firebase = {
  device: "cama-web-spa-test",
  platform: "ANDROID",
  token: "web-no-fcm",
};

console.log("API:", API_BASE);

const invalid = await postAuth({
  principal: "__invalid_login_id__",
  credentials: "wrong-password",
  firebase,
});
console.log("\n[1] invalid credentials:", invalid.status);
console.log(JSON.stringify(invalid.json, null, 2));

const loginId = process.env.CAMA_TEST_LOGIN_ID;
const password = process.env.CAMA_TEST_PASSWORD;

if (loginId && password) {
  const ok = await postAuth({
    principal: loginId,
    credentials: password,
    firebase,
  });
  console.log("\n[2] real login:", ok.status);
  const token = ok.json?.response?.apiToken;
  console.log("apiToken present:", !!token);
  if (token) {
    const me = await fetch(`${API_BASE}/api/webview/account/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        api_key: `Bearer ${token}`,
      },
      body: JSON.stringify({ loginId }),
    });
    const meJson = await me.json();
    console.log("[3] webview/account/me:", me.status, meJson?.response?.name);
  }
} else {
  console.log(
    "\n[2] skipped — set CAMA_TEST_LOGIN_ID and CAMA_TEST_PASSWORD for full test",
  );
}
