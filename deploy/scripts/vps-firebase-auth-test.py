#!/usr/bin/env python3
import json
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:8080"
LOGIN_ID = "C23IFZ39UWLD4"


def post(path, data):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(data, ensure_ascii=False).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())


_, reset = post(
    "/api/public/patient/recover/reset-password",
    {"loginId": LOGIN_ID, "name": "최완규", "phone": "01032984763"},
)
temp = reset["response"]["temporaryPassword"]
print("temp:", temp)

cases = [
    ("platform android lower", {"token": "test", "platform": "android", "device": "test"}),
    ("platform ANDROID upper", {"token": "test", "platform": "ANDROID", "device": "test"}),
    ("empty token", {"token": "", "platform": "ANDROID", "device": "test"}),
    ("real-ish token", {"token": "fcm-token-abc123", "platform": "ANDROID", "device": "Pixel"}),
]

for label, firebase in cases:
    status, resp = post(
        "/api/auth",
        {"principal": LOGIN_ID, "credentials": temp, "firebase": firebase},
    )
    err = (resp.get("error") or {}).get("message")
    token = (resp.get("response") or {}).get("apiToken") if resp.get("response") else None
    print(f"{label}: {status} token={bool(token)} err={err}")
