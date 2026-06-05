#!/usr/bin/env python3
import json
import subprocess
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:8080"
LOGIN_ID = "C23IFZ39UWLD4"
NAME = "최완규"
PHONE = "01032984763"


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


def assert_ok(label, status, body):
    ok = status == 200 and body.get("success") is not False and body.get("response") is not None
    print(f"{label}: {status} {'OK' if ok else 'FAIL'}")
    if not ok:
        print("  error:", body.get("error"))
        raise SystemExit(1)


# login-id OK
status, body = post("/api/public/patient/recover/login-id", {"name": NAME, "phone": PHONE})
assert_ok("recover/login-id OK", status, body)
if body["response"].get("loginId") != LOGIN_ID:
    print("unexpected loginId:", body["response"].get("loginId"))
    raise SystemExit(1)

# login-id wrong name
status, body = post(
    "/api/public/patient/recover/login-id",
    {"name": "없는이름", "phone": PHONE},
)
assert_ok("recover/login-id wrong name", status, body)
if body["response"].get("found") is not False:
    raise SystemExit(1)

# reset OK
status, reset = post(
    "/api/public/patient/recover/reset-password",
    {"loginId": LOGIN_ID, "name": NAME, "phone": PHONE},
)
assert_ok("recover/reset-password OK", status, reset)
temp = reset["response"]["temporaryPassword"]
print("temp_pw:", temp)

hash_after = psql(
    f"SELECT password FROM account WHERE login_id='{LOGIN_ID}' "
    f"AND is_enabled=true AND is_dropped=false;"
)
try:
    import bcrypt

    print("bcrypt_match:", bcrypt.checkpw(temp.encode(), hash_after.encode()))
except ImportError:
    pass

# reset wrong loginId
status, body = post(
    "/api/public/patient/recover/reset-password",
    {"loginId": "WRONGID1234567", "name": NAME, "phone": PHONE},
)
print("reset wrong loginId:", status, body.get("error", {}).get("message", "OK"))

# legacy find path still works
status, body = post("/api/account/patient/find/login-id", {"name": NAME, "phone": PHONE})
assert_ok("legacy find/login-id", status, body)

# auth after reset (app-like firebase payload)
status, auth = post(
    "/api/auth",
    {
        "principal": LOGIN_ID,
        "credentials": temp,
        "firebase": {"token": "test", "platform": "ANDROID", "device": "test"},
    },
)
print("auth after reset:", status)
if status != 200:
    print("auth_error:", auth.get("error"))
    raise SystemExit(1)
print("auth_ok:", bool(auth.get("response", {}).get("apiToken")))

# lowercase platform should also work after server fix
status, reset2 = post(
    "/api/public/patient/recover/reset-password",
    {"loginId": LOGIN_ID, "name": NAME, "phone": PHONE},
)
temp2 = reset2["response"]["temporaryPassword"]
status, auth2 = post(
    "/api/auth",
    {
        "principal": LOGIN_ID,
        "credentials": temp2,
        "firebase": {"token": "test", "platform": "android", "device": "test"},
    },
)
print("auth lowercase platform:", status, bool((auth2.get("response") or {}).get("apiToken")))
if status != 200:
    raise SystemExit(1)

print("ALL TESTS PASSED")
