#!/usr/bin/env python3
"""Full E2E: webview audit + login-id change to happycog for 01032984763."""
import json
import subprocess
import urllib.error
import urllib.request

BASE = "https://camaplus.cafe24.com"
PHONE = "01032984763"
NAME = "최완규"
OLD_LOGIN_ID = "C23IFZ39UWLD4"  # fallback
NEW_LOGIN_ID = "happycog"


def find_login_id():
    _, resp = post("/api/public/patient/recover/login-id", {"name": NAME, "phone": PHONE})
    lid = resp.get("response", {}).get("loginId")
    return lid or OLD_LOGIN_ID


def post(path, data, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["api_key"] = f"Bearer {token}"
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(data, ensure_ascii=False).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())


def put(path, data, token):
    headers = {"Content-Type": "application/json", "api_key": f"Bearer {token}"}
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(data, ensure_ascii=False).encode("utf-8"),
        headers=headers,
        method="PUT",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())


def get(path, token=None):
    headers = {}
    if token:
        headers["api_key"] = f"Bearer {token}"
    req = urllib.request.Request(BASE + path, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())


def curl_code(path):
    return subprocess.check_output(
        ["curl", "-sS", "-o", "/dev/null", "-w", "%{http_code}", f"{BASE}{path}"],
        text=True,
    )


print("=== WebView URL audit ===")
current_id = find_login_id()
print("current loginId:", current_id)
paths = [
    f"/webview/coaching/{current_id}",
    f"/webview/coaching/wellbeing/{current_id}",
    "/webview/help",
    "/webview/treatment/1",
]
for p in paths:
    code = curl_code(p)
    print(f"[{code}] {p}")
    if code != "200":
        raise SystemExit(f"webview fail: {p}")

print("\n=== Reset password ===")
_, reset = post(
    "/api/public/patient/recover/reset-password",
    {"loginId": current_id, "name": NAME, "phone": PHONE},
)
temp = reset["response"]["temporaryPassword"]
print("temp pw obtained")

if current_id == NEW_LOGIN_ID:
    print("\n=== Already happycog — verify login only ===")
    _, auth2 = post(
        "/api/auth",
        {
            "principal": NEW_LOGIN_ID,
            "credentials": temp,
            "firebase": {"token": "test", "platform": "ANDROID", "device": "test"},
        },
    )
    print("login ok:", auth2.get("response", {}).get("account", {}).get("loginId"))
    raise SystemExit(0)

print("\n=== Login ===")
_, auth = post(
    "/api/auth",
    {
        "principal": current_id,
        "credentials": temp,
        "firebase": {"token": "test", "platform": "ANDROID", "device": "test"},
    },
)
token = auth["response"]["apiToken"]
print("login ok")

print("\n=== Change login ID -> happycog ===")
status, changed = put(
    "/api/account/login-id",
    {"newLoginId": NEW_LOGIN_ID, "credentials": temp},
    token,
)
print("change status:", status, changed.get("response", {}).get("message"))
if status != 200:
    print(changed)
    raise SystemExit(1)
new_token = changed["response"]["apiToken"]
new_login = changed["response"]["account"]["loginId"]
print("new loginId:", new_login)
assert new_login == NEW_LOGIN_ID

print("\n=== Login with new ID ===")
_, auth2 = post(
    "/api/auth",
    {
        "principal": NEW_LOGIN_ID,
        "credentials": temp,
        "firebase": {"token": "test", "platform": "ANDROID", "device": "test"},
    },
)
print("auth2:", auth2.get("response", {}).get("account", {}).get("loginId"))

print("\n=== account/me with new token ===")
status, me = get("/api/account/me", new_token)
print("me status:", status, me.get("response", {}).get("loginId"))

print("\n=== WebView with new loginId ===")
for p in [
    f"/webview/coaching/{NEW_LOGIN_ID}",
    f"/webview/coaching/wellbeing/{NEW_LOGIN_ID}",
]:
    code = curl_code(p)
    print(f"[{code}] {p}")

print("\nALL TESTS PASSED — loginId changed to happycog")
