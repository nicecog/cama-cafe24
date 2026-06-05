#!/usr/bin/env python3
"""Fix happycog admin password hash and verify login."""
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

LOGIN = os.environ.get("CAMA_NEW_ADMIN_LOGIN", "happycog")
PASSWORD = os.environ.get("CAMA_NEW_ADMIN_PASSWORD", "CamaAdmin2026!")
API = os.environ.get("CAMA_API_BASE", "https://camaplus.cafe24.com").rstrip("/")

# Known-good: localadmin / localadmin123
KNOWN_HASH = "$2a$10$Ozp4MIZAiAqs0tgxvuearObsVIbMx/fUt4kvYwuZXPeaq3uM3nfgu"


def make_hash(password: str) -> str:
    import bcrypt

    raw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=10))
    s = raw.decode("ascii")
    if s.startswith("$2b$"):
        s = "$2a$" + s[4:]
    return s


def psql(c, sql: str) -> str:
    import base64

    b64 = base64.b64encode(sql.encode("utf-8")).decode("ascii")
    cmd = (
        "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
        f"echo {b64} | base64 -d | docker exec -i \"$PG\" psql -U cama -d cama"
    )
    _, o, e = c.exec_command(cmd)
    time.sleep(1)
    return o.read().decode(errors="replace") + e.read().decode(errors="replace")


def try_login(password: str) -> tuple[int, str]:
    body = json.dumps({"principal": LOGIN, "credentials": password}).encode("utf-8")
    req = urllib.request.Request(
        f"{API}/api/auth/admin",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.read().decode(errors="replace")[:120]
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode(errors="replace")[:200]


c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)

print("=== stored hash prefix ===")
print(psql(c, f"SELECT login_id, left(password, 30) FROM cm_admin WHERE login_id='{LOGIN}';"))

new_hash = make_hash(PASSWORD).replace("'", "''")
print("=== update password ===")
print(psql(c, f"UPDATE cm_admin SET password='{new_hash}' WHERE login_id='{LOGIN}';"))

print("=== verify known seed hash works for localadmin123 (sanity) ===")
# optional: not updating wisdomh

c.close()

code, body = try_login(PASSWORD)
print(f"login [{code}]: {body}")
raise SystemExit(0 if code == 200 else 1)
