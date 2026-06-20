#!/usr/bin/env python3
"""Smoke: vital tables exist, API health, batch container up."""
from __future__ import annotations

import base64
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
API = os.environ.get("CAMA_API_BASE", "https://camaplus.cafe24.com").rstrip("/")


def load_ssh() -> tuple[str, str, str]:
    host, pw, user = "210.114.18.156", "admincama!", "root"
    if ACCESS.is_file():
        text = ACCESS.read_text(encoding="utf-8")
        if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
            host = m.group(1)
        if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
            pw = m.group(1)
        if m := re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text):
            user = m.group(1)
    return host, pw, user


def psql(c: paramiko.SSHClient, sql: str) -> str:
    b64 = base64.b64encode(sql.encode()).decode()
    cmd = (
        "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
        f"echo {b64} | base64 -d | docker exec -i \"$PG\" psql -U cama -d cama -t -A -v ON_ERROR_STOP=1"
    )
    _, o, e = c.exec_command(cmd, timeout=60)
    time.sleep(0.3)
    return (o.read() + e.read()).decode(errors="replace")


def http_get(url: str) -> int:
    req = urllib.request.Request(url, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.status
    except urllib.error.HTTPError as ex:
        return ex.code


def main() -> None:
    host, pw, user = load_ssh()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=pw, timeout=30, allow_agent=False, look_for_keys=False)

    checks: list[tuple[str, bool, str]] = []

    vital_tbl = psql(
        client,
        "SELECT count(*) FROM information_schema.tables WHERE table_name='account_vital_history';",
    ).strip()
    checks.append(("account_vital_history table", vital_tbl == "1", vital_tbl))

    stat_tbl = psql(
        client,
        "SELECT count(*) FROM information_schema.tables WHERE table_name='account_heart_rate_statistics';",
    ).strip()
    checks.append(("account_heart_rate_statistics table", stat_tbl == "1", stat_tbl))

    _, o, _ = client.exec_command("docker ps --format '{{.Names}}' | grep -E 'cama-plus-server|cama-back-batch'", timeout=30)
    containers = o.read().decode().strip()
    checks.append(("containers running", "cama-plus-server" in containers and "cama-back-batch" in containers, containers))

    _, o, _ = client.exec_command(
        "curl -s -o /dev/null -w '%{http_code}' -X POST http://127.0.0.1:8080/api/public/patient/recover/login-id "
        "-H 'Content-Type: application/json' -d '{\"name\":\"test\",\"phone\":\"01000000000\"}'",
        timeout=20,
    )
    time.sleep(0.3)
    api_local = o.read().decode().strip()
    checks.append(("API up (localhost)", api_local == "200", f"HTTP {api_local}"))

    _, o, _ = client.exec_command(
        "curl -s -o /dev/null -w '%{http_code}' -X PUT http://127.0.0.1:8080/api/track/service/vital "
        "-H 'Content-Type: application/json' -d '{}'",
        timeout=20,
    )
    time.sleep(0.3)
    vital_code = o.read().decode().strip()
    checks.append(("vital API registered", vital_code in ("401", "403"), f"HTTP {vital_code}"))

    client.close()

    print(json.dumps({"api": API, "checks": [{"name": n, "ok": ok, "detail": d} for n, ok, d in checks]}, indent=2))
    if not all(ok for _, ok, _ in checks):
        sys.exit(1)
    print("SMOKE OK")


if __name__ == "__main__":
    main()
