#!/usr/bin/env python3
import json
import subprocess
import urllib.error
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
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()


subprocess.run(
    [
        "docker",
        "exec",
        "c6fdf0e55844_cama-cafe24-postgres",
        "psql",
        "-U",
        "cama",
        "-d",
        "cama",
        "-c",
        "INSERT INTO account_login_history (account_seq, login_at) VALUES (121, now());",
    ]
)

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
status, body = get("/api/account/me", token)
print("me status", status)
print(body[:1500])
