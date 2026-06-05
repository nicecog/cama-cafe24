#!/usr/bin/env python3
"""Debug happycog login: reset pw, try auth, check account state."""
import json
import urllib.error
import urllib.request

BASE = "https://camaplus.cafe24.com"
LOGIN_ID = "happycog"
NAME = "최완규"
PHONE = "01032984763"


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
        body = e.read().decode()
        try:
            return e.code, json.loads(body)
        except json.JSONDecodeError:
            return e.code, {"raw": body}


print("=== 1. Account lookup by phone ===")
_, find = post("/api/public/patient/recover/login-id", {"name": NAME, "phone": PHONE})
print(json.dumps(find, ensure_ascii=False, indent=2))

print("\n=== 2. Reset password ===")
_, reset = post(
    "/api/public/patient/recover/reset-password",
    {"loginId": LOGIN_ID, "name": NAME, "phone": PHONE},
)
print(json.dumps(reset, ensure_ascii=False, indent=2))
temp = reset.get("response", {}).get("temporaryPassword")
if not temp:
    raise SystemExit("reset failed")

print("\n=== 3. Login with fresh temp password ===")
status, auth = post(
    "/api/auth",
    {
        "principal": LOGIN_ID,
        "credentials": temp,
        "firebase": {"token": "test", "platform": "ANDROID", "device": "test"},
    },
)
print("status:", status)
print(json.dumps(auth, ensure_ascii=False, indent=2)[:2000])

print("\n=== 4. Login with wrong password ===")
status2, auth2 = post(
    "/api/auth",
    {
        "principal": LOGIN_ID,
        "credentials": "WrongPass1!",
        "firebase": {"token": "test", "platform": "ANDROID", "device": "test"},
    },
)
print("status:", status2)
print(json.dumps(auth2, ensure_ascii=False, indent=2)[:800])

print("\n=== 5. Login missing firebase ===")
status3, auth3 = post(
    "/api/auth",
    {"principal": LOGIN_ID, "credentials": temp},
)
print("status:", status3)
print(json.dumps(auth3, ensure_ascii=False, indent=2)[:800])

print("\nFresh temp password for user:", temp)
