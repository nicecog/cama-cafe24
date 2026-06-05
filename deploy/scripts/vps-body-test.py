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
            print(f"{path} {data} -> {resp.status}: {resp.read().decode()[:300]}")
    except urllib.error.HTTPError as e:
        print(f"{path} {data} -> {e.code}: {e.read().decode()[:300]}")


post("/api/public/patient/recover/login-id", {})
post("/api/public/patient/recover/login-id", {"name": "최완규", "phone": "01032984763"})
post("/api/account/patient/check/phone", {"phone": "01032984763"})
post("/api/account/patient/check/login-id", {"loginId": "x"})
post("/api/enums", {})
