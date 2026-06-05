#!/usr/bin/env python3
import json
import subprocess
import urllib.error
import urllib.request

BASE = "https://camaplus.cafe24.com"


def post(path, data, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["api_key"] = f"Bearer {token}"
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(data, ensure_ascii=False).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


def put(path, data, token):
    headers = {"Content-Type": "application/json", "api_key": f"Bearer {token}"}
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(data, ensure_ascii=False).encode("utf-8"),
        headers=headers,
        method="PUT",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()


print("=== DB check ===")
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
        "SELECT seq, login_id, name, phone FROM account WHERE login_id IN ('happycog','C23IFZ39UWLD4') OR phone='01032984763';",
    ],
    check=False,
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
status, body = put(
    "/api/account/login-id",
    {"newLoginId": "happycog", "credentials": temp},
    token,
)
print("status", status)
print("body", body)
