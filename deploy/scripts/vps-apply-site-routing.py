#!/usr/bin/env python3
"""Apply CAMA site routing nginx + doctor-web /legacy context on VPS."""
from __future__ import annotations

import re
import sys
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
ACCESS_LOCAL = REPO_ROOT / "deploy" / "CAFE24_VPS_ACCESS.local.md"
NGINX_DIR = REPO_ROOT / "deploy" / "nginx"
COMPOSE = REPO_ROOT / "deploy" / "docker-compose.cafe24.yml"


def connect() -> paramiko.SSHClient:
    text = ACCESS_LOCAL.read_text(encoding="utf-8")
    host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
    password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)
    return c


def run(c: paramiko.SSHClient, cmd: str) -> tuple[int, str]:
    _, o, e = c.exec_command(cmd)
    code = o.channel.recv_exit_status()
    return code, o.read().decode() + e.read().decode()


def main() -> int:
    c = connect()
    sftp = c.open_sftp()
    sftp.put(str(SCRIPT_DIR / "apply-cama-site-routing.py"), "/tmp/apply-cama-site-routing.py")
    for name in [
        "cama-legacy-doctor-locations.conf",
        "cama-patient-spa-locations.conf",
        "cama-super-admin-locations.conf",
        "cama-site-fallback-locations.conf",
    ]:
        sftp.put(str(NGINX_DIR / name), f"/tmp/{name}")
    sftp.put(str(COMPOSE), "/opt/cama/deploy/docker-compose.cafe24.yml")
    sftp.close()

    steps = [
        "python3 /tmp/apply-cama-site-routing.py "
        "/tmp/cama-legacy-doctor-locations.conf "
        "/tmp/cama-patient-spa-locations.conf "
        "/tmp/cama-super-admin-locations.conf "
        "/tmp/cama-site-fallback-locations.conf",
        "nginx -t",
        "systemctl reload nginx",
    ]
    for cmd in steps:
        code, out = run(c, cmd)
        print(f">>> {cmd}\n{out}")
        if code != 0:
            c.close()
            return code

    checks = [
        "curl -sk -o /dev/null -w 'root:%{http_code} loc:%{redirect_url}\\n' https://127.0.0.1/ -H 'Host: camaplus.cafe24.com'",
        "curl -sk -o /dev/null -w 'login:%{http_code}\\n' https://127.0.0.1/login -H 'Host: camaplus.cafe24.com'",
        "curl -sk -o /dev/null -w 'home:%{http_code}\\n' https://127.0.0.1/home -H 'Host: camaplus.cafe24.com'",
        "curl -sk -o /dev/null -w 'legacy:%{http_code}\\n' https://127.0.0.1/legacy/login -H 'Host: camaplus.cafe24.com'",
        "curl -sk -o /dev/null -w 'legacy_cm:%{http_code} loc:%{redirect_url}\\n' https://127.0.0.1/content-management/treatment/done/list -H 'Host: camaplus.cafe24.com'",
        "curl -sk -o /dev/null -w 'admin:%{http_code}\\n' https://127.0.0.1/admin/login -H 'Host: camaplus.cafe24.com'",
    ]
    for cmd in checks:
        _, out = run(c, cmd)
        print(f">>> {cmd}\n{out}")

    c.close()
    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
