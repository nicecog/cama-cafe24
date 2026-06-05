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
            print(f"{path} -> {resp.status}: {resp.read().decode()[:400]}")
    except urllib.error.HTTPError as e:
        print(f"{path} -> {e.code}: {e.read().decode()[:400]}")


print("=== body matrix ===")
post("/api/public/patient/recover/login-id", {})
post("/api/public/patient/recover/login-id", {"name": "a"})
post("/api/public/patient/recover/login-id", {"phone": "01032984763"})
post("/api/public/patient/recover/login-id", {"name": "a", "phone": "bad"})
post("/api/public/patient/recover/login-id", {"name": "abc", "phone": "01012341234"})
post("/api/public/patient/recover/login-id", {"name": "최완규", "phone": "01032984763"})
post("/api/account/patient/check/phone", {"phone": "01032984763"})
