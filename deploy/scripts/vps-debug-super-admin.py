#!/usr/bin/env python3
"""Quick VPS checks for cama-super-admin."""
from __future__ import annotations

import os
import re
import sys
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
ACCESS_LOCAL = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"
DEFAULT_HOST = "210.114.18.156"
DEFAULT_USER = "root"
DEFAULT_PASSWORD = "admincama!"


def load_access() -> dict[str, str]:
    host = os.environ.get("CAMA_VPS_HOST", DEFAULT_HOST)
    user = os.environ.get("CAMA_VPS_USER", DEFAULT_USER)
    password = os.environ.get("CAMA_VPS_PASSWORD", DEFAULT_PASSWORD)
    if ACCESS_LOCAL.is_file():
        text = ACCESS_LOCAL.read_text(encoding="utf-8")
        if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
            host = m.group(1)
        if m := re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text):
            user = m.group(1)
        if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
            password = m.group(1)
    return {"host": host, "user": user, "password": password}


def main() -> int:
    acc = load_access()
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

    cmds = [
        'docker ps --filter name=cama-super-admin --format "{{.Names}} {{.Status}} {{.Ports}}"',
        "curl -s -o /dev/null -w '8083:%{http_code}\\n' http://127.0.0.1:8083/",
        "ls -la /opt/cama/www/super-admin/index.html",
        "curl -sk -o /dev/null -w 'public:%{http_code}\\n' https://camaplus.cafe24.com/admin/",
        "curl -sk https://camaplus.cafe24.com/admin/ 2>&1 | head -8",
        "grep -A6 'location /admin/' /etc/nginx/sites-enabled/cama 2>/dev/null | head -12",
    ]
    for cmd in cmds:
        _, stdout, stderr = client.exec_command(cmd, timeout=60)
        out = stdout.read().decode(errors="replace") + stderr.read().decode(errors="replace")
        print(f">>> {cmd}\n{out}")

    client.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
