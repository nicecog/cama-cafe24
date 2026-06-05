#!/usr/bin/env python3
import json
import subprocess
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
            return resp.status, dict(resp.headers), json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        try:
            parsed = json.loads(body)
        except json.JSONDecodeError:
            parsed = body
        return e.code, dict(e.headers), parsed


_, _, reset = post(
    "/api/public/patient/recover/reset-password",
    {"loginId": LOGIN_ID, "name": "최완규", "phone": "01032984763"},
)
temp = reset["response"]["temporaryPassword"]
print("temp:", temp)

status, headers, body = post(
    "/api/auth",
    {
        "principal": LOGIN_ID,
        "credentials": temp,
        "firebase": {"token": "test", "platform": "android", "device": "test"},
    },
)
print("status:", status)
print(
    "headers:",
    {k: v for k, v in headers.items() if k.lower() in ("content-type", "www-authenticate", "server")},
)
print("body:", json.dumps(body, ensure_ascii=False)[:800])

logs = subprocess.check_output(
    ["docker", "logs", "--since", "30s", "cama-plus-server"],
    text=True,
    stderr=subprocess.STDOUT,
)
for line in logs.splitlines():
    if "cama-" in line:
        print("log:", line)
