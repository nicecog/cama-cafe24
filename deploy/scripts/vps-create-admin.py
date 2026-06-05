#!/usr/bin/env python3
"""Create cm_admin account on Cafe24 VPS using DB from .env.cafe24."""
from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ACCESS = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"
ENV_PATH = "/opt/cama/deploy/.env.cafe24"
API_BASE = os.environ.get("CAMA_API_BASE", "https://camaplus.cafe24.com").rstrip("/")

LOGIN_ID = os.environ.get("CAMA_NEW_ADMIN_LOGIN", "happycog").strip()
ADMIN_NAME = os.environ.get("CAMA_NEW_ADMIN_NAME", "최완규").strip()
ADMIN_PASSWORD = os.environ.get("CAMA_NEW_ADMIN_PASSWORD", "CamaAdmin2026!").strip()


def bcrypt_hash(password: str) -> str:
    try:
        import bcrypt
    except ImportError:
        import subprocess

        subprocess.check_call([sys.executable, "-m", "pip", "install", "bcrypt", "-q"])
        import bcrypt

    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=10)).decode("ascii")


def load_ssh() -> tuple[str, str]:
    host, pw = "210.114.18.156", "admincama!"
    if ACCESS.is_file():
        text = ACCESS.read_text(encoding="utf-8")
        if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
            host = m.group(1)
        if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
            pw = m.group(1)
    return host, pw


def psql(host: str, ssh_pw: str, sql: str) -> str:
    import base64
    import paramiko

    b64 = base64.b64encode(sql.encode("utf-8")).decode("ascii")
    cmd = (
        "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
        f"echo {b64} | base64 -d | docker exec -i \"$PG\" psql -U cama -d cama"
    )
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=ssh_pw, timeout=30, allow_agent=False, look_for_keys=False)
    _, o, e = c.exec_command(cmd)
    time.sleep(2)
    out = o.read().decode(errors="replace")
    err = e.read().decode(errors="replace")
    c.close()
    if err.strip():
        print(err.strip(), file=sys.stderr)
    return out.strip()


def test_login(login_id: str, password: str) -> bool:
    body = json.dumps({"principal": login_id, "credentials": password}).encode("utf-8")
    req = urllib.request.Request(
        f"{API_BASE}/api/auth/admin",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            return bool(data.get("success")) and bool(data.get("response", {}).get("apiToken"))
    except urllib.error.HTTPError as e:
        print(f"login HTTP {e.code}: {e.read().decode(errors='replace')[:200]}", file=sys.stderr)
        return False


def main() -> None:
    if not LOGIN_ID or not ADMIN_PASSWORD:
        print("CAMA_NEW_ADMIN_LOGIN / CAMA_NEW_ADMIN_PASSWORD required", file=sys.stderr)
        raise SystemExit(1)

    host, ssh_pw = load_ssh()
    print(f"=== VPS DB @ {host} (.env: {ENV_PATH}) ===")

    existing = psql(host, ssh_pw, f"SELECT login_id FROM cm_admin WHERE login_id='{LOGIN_ID}';")
    if existing:
        print(f"SKIP: cm_admin.login_id '{LOGIN_ID}' already exists")
        print("Use CAMA_NEW_ADMIN_LOGIN for a different id, or reset password separately.")
        ok = test_login(LOGIN_ID, ADMIN_PASSWORD)
        print(f"login test: {'OK' if ok else 'FAIL (password may differ)'}")
        raise SystemExit(0 if ok else 1)

    hashed = bcrypt_hash(ADMIN_PASSWORD)
    safe_login = LOGIN_ID.replace("'", "''")
    safe_name = ADMIN_NAME.replace("'", "''")
    safe_hash = hashed.replace("'", "''")  # passed via base64 pipe, $ safe

    psql(
        host,
        ssh_pw,
        "SELECT setval('cm_admin_seq_seq', COALESCE((SELECT MAX(seq) FROM cm_admin), 1));",
    )

    insert_sql = (
        "INSERT INTO cm_admin (login_id, password, name, is_enabled) "
        f"VALUES ('{safe_login}', '{safe_hash}', '{safe_name}', true) "
        "RETURNING seq, login_id, name;"
    )
    result = psql(host, ssh_pw, insert_sql)
    print(f"INSERT OK: {result}")

    ok = test_login(LOGIN_ID, ADMIN_PASSWORD)
    print(f"POST /api/auth/admin: {'OK' if ok else 'FAIL'}")

    print("\n=== new admin (save locally, do not commit) ===")
    print(f"login_id: {LOGIN_ID}")
    print(f"password: {ADMIN_PASSWORD}")
    print(f"name: {ADMIN_NAME}")
    print(f"super-admin: https://camaplus.cafe24.com/admin/")

    raise SystemExit(0 if ok else 1)


if __name__ == "__main__":
    main()
