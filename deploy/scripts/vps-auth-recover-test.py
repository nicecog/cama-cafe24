#!/usr/bin/env python3
import json
import urllib.error
import urllib.request


def post(path, data):
    req = urllib.request.Request(
        "http://127.0.0.1:8080" + path,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode()
            print(f"{path} -> {resp.status}: {body[:500]}")
            return resp.status
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"{path} -> {e.code}: {body[:500]}")
        return e.code


payload = {"name": "최완규", "phone": "01032984763", "email": "test@example.com"}

print("=== BEFORE DEPLOY: find vs recover paths ===")
post("/api/account/patient/check/phone", {"phone": "01032984763"})
post("/api/account/patient/find/login-id", {"name": "최완규", "phone": "01032984763"})
post("/api/account/patient/find/password", payload)
post("/api/account/patient/recover/login-id", {"name": "최완규", "phone": "01032984763"})
post("/api/account/patient/recover/password", payload)
post("/api/public/patient/recover/login-id", {"name": "최완규", "phone": "01032984763"})
post("/api/public/patient/recover/password", payload)
