#!/usr/bin/env python3
import json
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:8080"


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
    {"loginId": "C23IFZ39UWLD4", "name": "최완규", "phone": "01032984763"},
)
temp = reset["response"]["temporaryPassword"]
print("temp:", temp)

variants = [
    ("full firebase", {"principal": "C23IFZ39UWLD4", "credentials": temp, "firebase": {"token": "test", "platform": "android", "device": "test"}}),
    ("no firebase", {"principal": "C23IFZ39UWLD4", "credentials": temp}),
    ("null firebase", {"principal": "C23IFZ39UWLD4", "credentials": temp, "firebase": None}),
]

for label, payload in variants:
    status, body = post("/api/auth", payload)
    print(label, "->", status, body.get("error", body.get("response", {})))
