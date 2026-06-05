#!/usr/bin/env python3
"""Smoke test GET /api/doctor/service via doctor-web proxy."""
from __future__ import annotations

import json
import re
import urllib.error
import urllib.request
from pathlib import Path

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
BASE = "https://camaplus.cafe24.com"


def main() -> None:
    text = ACCESS.read_text(encoding="utf-8")
    # Use internal test if we have doctor creds in access doc; else hit API directly on VPS via ssh
    import base64
    import paramiko

    host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
    pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)
    sql = "SELECT login_id FROM cm_doctor WHERE is_enabled LIMIT 1;"
    b64 = base64.b64encode(sql.encode()).decode()
    cmd = (
        "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
        f"echo {b64} | base64 -d | docker exec -i \"$PG\" psql -U cama -d cama -t -A"
    )
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)
    _, o, _ = c.exec_command(cmd, timeout=30)
    login_id = (o.read().decode().strip() or "").splitlines()[0] if o.read else ""
    _, o2, _ = c.exec_command(cmd, timeout=30)
    login_id = o2.read().decode().strip().splitlines()[0] if o2.read().decode().strip() else ""
    c.close()
    print("doctor login_id:", login_id or "(unknown)")

    # Direct API on VPS (no auth — expect 401/403, not 404)
    c2 = paramiko.SSHClient()
    c2.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c2.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)
    _, o3, _ = c2.exec_command(
        "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/api/doctor/service", timeout=30
    )
    code = o3.read().decode().strip()
    print("GET /api/doctor/service (no auth):", code, "(404=missing, 401/403=exists)")

    _, o4, _ = c2.exec_command(
        "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8081/proxy/api/doctor/service", timeout=30
    )
    print("GET /proxy/api/doctor/service (doctor-web):", o4.read().decode().strip())
    c2.close()


if __name__ == "__main__":
    main()
