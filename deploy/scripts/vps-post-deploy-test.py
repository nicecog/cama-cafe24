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
            print(f"OK  {path} -> {resp.status}: {body[:500]}")
            return resp.status, json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"ERR {path} -> {e.code}: {body[:500]}")
        return e.code, None


print("=== recover/login-id ===")
post("/api/public/patient/recover/login-id", {"name": "최완규", "phone": "01032984763"})
post("/api/public/patient/recover/login-id", {"name": "wrong", "phone": "01032984763"})
post("/api/public/patient/recover/login-id", {"name": "abc", "phone": "01012341234"})

print("=== recover/password ===")
post("/api/public/patient/recover/password", {
    "name": "최완규",
    "phone": "01032984763",
    "email": "test@example.com",
})
post("/api/public/patient/recover/password", {
    "name": "최완규",
    "phone": "01032984763",
    "email": "user@camaplus.me",
})

print("=== legacy paths ===")
post("/api/account/patient/find/login-id", {"name": "최완규", "phone": "01032984763"})
post("/api/account/patient/check/phone", {"phone": "01032984763"})
