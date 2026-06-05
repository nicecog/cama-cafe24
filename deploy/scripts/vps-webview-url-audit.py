#!/usr/bin/env python3
"""Audit app WebView URLs against production nginx."""
import json
import subprocess
import urllib.request

BASE = "https://camaplus.cafe24.com"
AUDIT_NAME = "최완규"
AUDIT_PHONE = "01032984763"
FALLBACK_LOGIN_ID = "happycog"


def resolve_login_id():
    req = urllib.request.Request(
        f"{BASE}/api/public/patient/recover/login-id",
        data=json.dumps({"name": AUDIT_NAME, "phone": AUDIT_PHONE}).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            return data.get("response", {}).get("loginId") or FALLBACK_LOGIN_ID
    except Exception:
        return FALLBACK_LOGIN_ID


LOGIN_ID = resolve_login_id()
print(f"audit loginId: {LOGIN_ID}")

PATHS = [
    ("coaching main", f"/webview/coaching/{LOGIN_ID}"),
    ("coaching category", f"/webview/coaching/D/{LOGIN_ID}"),
    ("coaching wellbeing", f"/webview/coaching/wellbeing/{LOGIN_ID}"),
    ("help", "/webview/help"),
    ("treatment", "/webview/treatment/1"),
    ("assets js", "/assets/index-D4nNh9Ug.js"),
    ("doctor login", "/login"),
]

API_PATHS = [
    ("coaching progress", "POST", "/api/coaching/service/getCoachingProgressList", {"loginId": LOGIN_ID}),
    ("webview coaching", "POST", "/api/webview/coaching/service/getCoachingProgressList", {"loginId": LOGIN_ID}),
    ("hospital list", "GET", "/api/webview/hospital/list", None),
    ("account me", "GET", "/api/account/me", None),
]

def curl_code(path):
    return subprocess.check_output(
        ["curl", "-sS", "-o", "/dev/null", "-w", "%{http_code}", f"{BASE}{path}"],
        text=True,
    )

def curl_body(path, max_len=120):
    out = subprocess.check_output(["curl", "-sS", f"{BASE}{path}"], text=True)
    return out[:max_len].replace("\n", " ")

print("=== WebView / static paths ===")
for label, path in PATHS:
    code = curl_code(path)
    body = curl_body(path)
    ok = code == "200" and ("Whitelabel" not in body and '"error":"Not Found"' not in body)
    print(f"{'OK' if ok else 'FAIL'} [{code}] {label}: {path}")
    if not ok:
        print(f"  body: {body}")

print("\n=== API paths (no auth where noted) ===")
for item in API_PATHS:
    label, method, path, body = item
    cmd = ["curl", "-sS", "-o", "/tmp/audit_body.json", "-w", "%{http_code}", "-X", method, f"{BASE}{path}", "-H", "Content-Type: application/json"]
    if body is not None:
        cmd += ["-d", json.dumps(body)]
    code = subprocess.check_output(cmd, text=True)
    try:
        resp = open("/tmp/audit_body.json").read()[:150]
    except OSError:
        resp = ""
    print(f"[{code}] {label}: {path} -> {resp}")
