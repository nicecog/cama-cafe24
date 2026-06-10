#!/usr/bin/env python3
"""Set happycog password for Super Admin (/admin/login uses /api/auth/doctor)."""
from __future__ import annotations

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
LOGIN = os.environ.get("CAMA_ADMIN_LOGIN", "happycog")
PASSWORD = os.environ.get("CAMA_ADMIN_PASSWORD", "whanam74!")
API = os.environ.get("CAMA_API_BASE", "https://camaplus.cafe24.com").rstrip("/")


def load_ssh() -> tuple[str, str]:
    host, pw = "210.114.18.156", "admincama!"
    if ACCESS.is_file():
        text = ACCESS.read_text(encoding="utf-8")
        if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
            host = m.group(1)
        if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
            pw = m.group(1)
    return host, pw


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
        f"echo {b64} | base64 -d | docker exec -i \"$PG\" psql -U cama -d cama -v ON_ERROR_STOP=1"
    )
    _, o, e = c.exec_command(cmd, timeout=120)
    time.sleep(0.5)
    return o.read().decode(errors="replace") + e.read().decode(errors="replace")


def try_login(path: str, password: str) -> tuple[int, str]:
    body = json.dumps({"principal": LOGIN, "credentials": password}).encode("utf-8")
    req = urllib.request.Request(
        f"{API}{path}",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.read().decode(errors="replace")[:200]
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode(errors="replace")[:200]


def main() -> int:
    host, ssh_pw = load_ssh()
    pwd_hash = make_hash(PASSWORD).replace("'", "''")

    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=ssh_pw, timeout=30, allow_agent=False, look_for_keys=False)

    print(f"=== before: {LOGIN} ===")
    print(psql(c, f"""
SELECT 'cm_admin' AS tbl, seq, login_id, name, is_enabled FROM cm_admin WHERE login_id='{LOGIN}';
SELECT 'cm_doctor' AS tbl, seq, login_id, name, hospital_seq, is_enabled FROM cm_doctor WHERE login_id='{LOGIN}';
SELECT seq, login_id, hospital_seq FROM cm_doctor WHERE login_id='cama' AND is_enabled=true LIMIT 1;
"""))

    print("=== upsert cm_admin password ===")
    print(psql(c, f"""
UPDATE cm_admin SET password='{pwd_hash}', is_enabled=true WHERE login_id='{LOGIN}';
INSERT INTO cm_admin (login_id, password, name, is_enabled)
SELECT '{LOGIN}', '{pwd_hash}', 'Happy Cog Admin', true
WHERE NOT EXISTS (SELECT 1 FROM cm_admin WHERE login_id='{LOGIN}');
"""))

    print("=== upsert cm_doctor (same hospital as cama) ===")
    print(psql(c, f"""
UPDATE cm_doctor d SET password='{pwd_hash}', is_enabled=true
WHERE d.login_id='{LOGIN}';

INSERT INTO cm_doctor (login_id, password, name, nick, phone, hospital_seq, department_seq, is_enabled)
SELECT '{LOGIN}', '{pwd_hash}', 'Happy Cog', 'happycog', '', c.hospital_seq, c.department_seq, true
FROM cm_doctor c
WHERE c.login_id='cama' AND c.is_enabled=true
  AND NOT EXISTS (SELECT 1 FROM cm_doctor WHERE login_id='{LOGIN}')
LIMIT 1;
"""))

    print("=== after ===")
    print(psql(c, f"""
SELECT 'cm_admin' AS tbl, seq, login_id, name, is_enabled FROM cm_admin WHERE login_id='{LOGIN}';
SELECT 'cm_doctor' AS tbl, seq, login_id, name, hospital_seq, is_enabled FROM cm_doctor WHERE login_id='{LOGIN}';
"""))

    c.close()

    print("\n=== API login test ===")
    code_d, body_d = try_login("/api/auth/doctor", PASSWORD)
    print(f"POST /api/auth/doctor -> HTTP {code_d}")
    if code_d != 200:
        print(body_d)

    code_a, body_a = try_login("/api/auth/admin", PASSWORD)
    print(f"POST /api/auth/admin -> HTTP {code_a}")

    if code_d == 200:
        print(f"\nOK: https://camaplus.cafe24.com/admin/login")
        print(f"    ID: {LOGIN}")
        print(f"    PW: (as requested)")
        return 0
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
