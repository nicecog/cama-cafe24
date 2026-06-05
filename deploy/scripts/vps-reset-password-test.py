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
            print(f"OK  {path} -> {resp.status}: {body[:600]}")
            return resp.status, json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"ERR {path} -> {e.code}: {body[:600]}")
        return e.code, None


print("=== reset-password ===")
post("/api/public/patient/recover/reset-password", {
    "loginId": "C23IFZ39UWLD4",
    "name": "최완규",
    "phone": "01032984763",
})
post("/api/public/patient/recover/reset-password", {
    "loginId": "wrongid",
    "name": "최완규",
    "phone": "01032984763",
})
post("/api/public/patient/recover/reset-password", {
    "loginId": "C23IFZ39UWLD4",
    "name": "최완규",
    "phone": "01032984763",
})
