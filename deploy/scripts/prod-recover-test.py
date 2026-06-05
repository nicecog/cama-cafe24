#!/usr/bin/env python3
import json
import urllib.error
import urllib.request

BASE = "https://camaplus.cafe24.com"
NAME = "최완규"
PHONE = "01032984763"
LOGIN_ID = "C23IFZ39UWLD4"


def post(path, data):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(data, ensure_ascii=False).encode("utf-8"),
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read().decode()
            print(f"{path} -> {resp.status}: {body[:400]}")
            return resp.status, json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"{path} -> {e.code}: {body[:400]}")
        return e.code, json.loads(body) if body else {}


print("=== production recover ===")
post("/api/public/patient/recover/login-id", {"name": NAME, "phone": PHONE})
post("/api/public/patient/recover/login-id", {"name": "없는이름", "phone": PHONE})
post(
    "/api/public/patient/recover/reset-password",
    {"loginId": LOGIN_ID, "name": NAME, "phone": PHONE},
)
post(
    "/api/public/patient/recover/reset-password",
    {"loginId": "WRONG", "name": NAME, "phone": PHONE},
)
