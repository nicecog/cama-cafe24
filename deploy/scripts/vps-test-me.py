#!/usr/bin/env python3
import json
import urllib.request

BASE = "https://camaplus.cafe24.com"


def post(path, data):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(data).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())


def get(path, token):
    req = urllib.request.Request(
        BASE + path,
        headers={"api_key": f"Bearer {token}"},
        method="GET",
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, json.loads(r.read().decode())


reset = post(
    "/api/public/patient/recover/reset-password",
    {"loginId": "C23IFZ39UWLD4", "name": "최완규", "phone": "01032984763"},
)
temp = reset["response"]["temporaryPassword"]
auth = post(
    "/api/auth",
    {
        "principal": "C23IFZ39UWLD4",
        "credentials": temp,
        "firebase": {"token": "test", "platform": "ANDROID", "device": "test"},
    },
)
token = auth["response"]["apiToken"]
print("token len", len(token))
status, me = get("/api/account/me", token)
print("me", status, me.get("response", {}).get("loginId"))
