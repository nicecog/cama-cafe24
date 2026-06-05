#!/usr/bin/env python3
import json
import subprocess
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:8080"
LOGIN_ID = "C23IFZ39UWLD4"


def pg_container():
    out = subprocess.check_output(
        ["docker", "ps", "--format", "{{.Names}}"],
        text=True,
    )
    for name in out.splitlines():
        if "postgres" in name:
            return name
    raise RuntimeError("postgres container not found")


def psql(sql):
    c = pg_container()
    return subprocess.check_output(
        ["docker", "exec", c, "psql", "-U", "cama", "-d", "cama", "-t", "-A", "-c", sql],
        text=True,
    ).strip()


def post(path, data):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(data, ensure_ascii=False).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())


hash_before = psql(
    f"SELECT substring(password,1,40) FROM account "
    f"WHERE login_id='{LOGIN_ID}' AND is_enabled=true AND is_dropped=false;"
)
print("hash_before:", hash_before)

_, reset = post(
    "/api/public/patient/recover/reset-password",
    {"loginId": LOGIN_ID, "name": "최완규", "phone": "01032984763"},
)
print("reset:", json.dumps(reset, ensure_ascii=False)[:500])
if not reset or not reset.get("response"):
    raise SystemExit(1)
temp = reset["response"]["temporaryPassword"]
print("temp_pw:", temp)

hash_after = psql(
    f"SELECT password FROM account "
    f"WHERE login_id='{LOGIN_ID}' AND is_enabled=true AND is_dropped=false;"
)
print("hash_after_prefix:", hash_after[:40])
print("hash_changed:", hash_before != hash_after[:40])

try:
    import bcrypt

    print("bcrypt_match:", bcrypt.checkpw(temp.encode(), hash_after.encode()))
except ImportError:
    print("bcrypt module not installed — skip local verify")

sign_type = psql(
    f"SELECT sign_type FROM account "
    f"WHERE login_id='{LOGIN_ID}' AND is_enabled=true AND is_dropped=false;"
)
print("sign_type:", sign_type)

status, auth = post(
    "/api/auth",
    {
        "principal": LOGIN_ID,
        "credentials": temp,
        "firebase": {"token": "test", "platform": "ANDROID", "device": "test"},
    },
)
print("auth_status:", status)
if status == 200:
    print("auth_ok: token present=", bool(auth.get("response", {}).get("apiToken")))
else:
    print("auth_error:", auth.get("error", {}))
