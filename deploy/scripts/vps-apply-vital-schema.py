#!/usr/bin/env python3
"""Apply account_vital_history + account_heart_rate_statistics DDL on Cafe24 VPS."""
from __future__ import annotations

import base64
import os
import re
import sys
import time
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
DEPLOY_ROOT = SCRIPT_DIR.parent
ACCESS_LOCAL = DEPLOY_ROOT / "CAFE24_VPS_ACCESS.local.md"
SQL_FILES = [
    DEPLOY_ROOT / "sql" / "cafe24-account-vital-history.sql",
    DEPLOY_ROOT / "sql" / "cafe24-account-heart-rate-statistics.sql",
]


def load_access() -> dict[str, str]:
    host = os.environ.get("CAMA_VPS_HOST", "210.114.18.156")
    user = os.environ.get("CAMA_VPS_USER", "root")
    password = os.environ.get("CAMA_VPS_PASSWORD", "admincama!")
    if ACCESS_LOCAL.is_file():
        text = ACCESS_LOCAL.read_text(encoding="utf-8")
        if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
            host = m.group(1)
        if m := re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text):
            user = m.group(1)
        if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
            password = m.group(1)
    return {"host": host, "user": user, "password": password}


def psql(client: paramiko.SSHClient, sql: str) -> str:
    b64 = base64.b64encode(sql.encode("utf-8")).decode("ascii")
    cmd = (
        "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
        f"echo {b64} | base64 -d | docker exec -i \"$PG\" psql -U cama -d cama -v ON_ERROR_STOP=1"
    )
    _, stdout, stderr = client.exec_command(cmd, timeout=180)
    time.sleep(0.5)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    if stdout.channel.recv_exit_status() != 0:
        raise RuntimeError(err or out or "psql failed")
    return out + err


def main() -> None:
    for path in SQL_FILES:
        if not path.is_file():
            raise SystemExit(f"Missing SQL: {path}")

    acc = load_access()
    print(f"Connecting {acc['user']}@{acc['host']} ...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        acc["host"],
        username=acc["user"],
        password=acc["password"],
        timeout=30,
        allow_agent=False,
        look_for_keys=False,
    )

    for path in SQL_FILES:
        print(f"Applying {path.name} ...")
        sql = path.read_text(encoding="utf-8")
        result = psql(client, sql)
        if result.strip():
            print(result)

    verify = """
SELECT 'account_vital_history' AS tbl, count(*)::text AS cnt
  FROM information_schema.tables
 WHERE table_schema='public' AND table_name='account_vital_history'
UNION ALL
SELECT 'account_heart_rate_statistics', count(*)::text
  FROM information_schema.tables
 WHERE table_schema='public' AND table_name='account_heart_rate_statistics';
"""
    print(psql(client, verify))
    client.close()
    print("Vital schema applied.")


if __name__ == "__main__":
    main()
