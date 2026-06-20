#!/usr/bin/env python3
"""Inspect current VPS routing for camaplus.cafe24.com."""
from __future__ import annotations

import re
import sys
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
ACCESS = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"


def connect() -> paramiko.SSHClient:
    text = ACCESS.read_text(encoding="utf-8")
    host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
    password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)
    return c


def run(c: paramiko.SSHClient, cmd: str) -> str:
    _, o, e = c.exec_command(cmd)
    o.channel.recv_exit_status()
    return o.read().decode() + e.read().decode()


def main() -> int:
    c = connect()
    cmds = [
        "grep -n 'location' /etc/nginx/sites-enabled/cama",
        "curl -sk -o /dev/null -w 'root:%{http_code} redirect:%{redirect_url}\\n' https://127.0.0.1/ -H 'Host: camaplus.cafe24.com'",
        "curl -sk -o /dev/null -w 'login:%{http_code}\\n' https://127.0.0.1/login -H 'Host: camaplus.cafe24.com'",
        "curl -sk -o /dev/null -w 'admin_login:%{http_code}\\n' https://127.0.0.1/admin/login -H 'Host: camaplus.cafe24.com'",
        "curl -sk https://127.0.0.1/login -H 'Host: camaplus.cafe24.com' | head -5",
        "docker ps --format '{{.Names}} {{.Ports}}'",
        "ls -la /opt/cama/www/",
    ]
    for cmd in cmds:
        print(f">>> {cmd}\n{run(c, cmd)}\n")
    c.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
