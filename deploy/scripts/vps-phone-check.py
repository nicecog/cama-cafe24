#!/usr/bin/env python3
import json
import subprocess
import urllib.error
import urllib.request
import zipfile


def psql(q):
    r = subprocess.run(
        [
            "docker",
            "exec",
            "cama-cafe24-postgres",
            "psql",
            "-U",
            "cama",
            "-d",
            "cama",
            "-c",
            q,
        ],
        capture_output=True,
        text=True,
    )
    print(r.stdout)
    if r.stderr.strip():
        print("ERR:", r.stderr)


print("=== accounts with phone 01032984763 ===")
psql(
    "SELECT seq, login_id, name, phone, sign_type, is_enabled, is_dropped, email, created_at "
    "FROM account WHERE REPLACE(REPLACE(phone, '-', ''), ' ', '') = '01032984763' ORDER BY seq;"
)

print("=== name+phone find simulation (active only) ===")
psql(
    "SELECT seq, login_id, name, phone FROM account "
    "WHERE name = '최완규' AND REPLACE(REPLACE(phone, '-', ''), ' ', '') = '01032984763' "
    "AND is_enabled = true AND is_dropped = false;"
)


def post_raw(path, data):
    req = urllib.request.Request(
        "http://127.0.0.1:8080" + path,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode()
            print(f"{path} -> {resp.status}: {body[:400]}")
    except urllib.error.HTTPError as e:
        print(f"{path} -> {e.code}: {e.read().decode()[:400]}")


def post(path, data):
    post_raw(path, data)


print("=== API tests (no token) ===")
post("/api/account/patient/check/phone", {"phone": "01032984763"})
post("/api/account/patient/find/login-id", {"name": "최완규", "phone": "01032984763"})

print("=== via nginx https ===")
def post_url(url, data):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    import ssl
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            print(url, "->", resp.status, resp.read().decode()[:300])
    except urllib.error.HTTPError as e:
        print(url, "->", e.code, e.read().decode()[:300])

post_url("https://camaplus.cafe24.com/api/account/patient/check/phone", {"phone": "01032984763"})
post_url("https://camaplus.cafe24.com/api/account/patient/find/login-id", {"name": "최완규", "phone": "01032984763"})

print("=== jar class check ===")
with zipfile.ZipFile("/opt/cama/jars/cama-back-1.0-SNAPSHOT.jar") as z:
    hits = [n for n in z.namelist() if "PatientAccount" in n or "PatientFind" in n]
    for n in hits:
        print(n)
