#!/usr/bin/env python3
"""Upload full merged nginx site config to VPS."""
from __future__ import annotations

import re
import sys
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
NGINX_DIR = REPO_ROOT / "deploy" / "nginx"
ACCESS = REPO_ROOT / "deploy" / "CAFE24_VPS_ACCESS.local.md"

SNIPPETS = [
    "cama-legacy-doctor-locations.conf",
    "cama-patient-spa-locations.conf",
    "cama-super-admin-locations.conf",
    "cama-site-fallback-locations.conf",
]


def build_config() -> str:
    skeleton = (NGINX_DIR / "cama-sites-enabled.cama.conf").read_text(encoding="utf-8")
    merged = "\n".join(
        (NGINX_DIR / name).read_text(encoding="utf-8").strip() for name in SNIPPETS
    )
    placeholder = (
        "    # ── include blocks from deploy/nginx/*.conf "
        "(merged by vps-deploy-nginx-full.py) ──\n"
        "    # LEGACY_DOCTOR\n"
        "    # PATIENT_SPA\n"
        "    # SUPER_ADMIN\n"
        "    # SITE_FALLBACK\n"
    )
    return skeleton.replace(placeholder, merged + "\n\n")


def main() -> int:
    config = build_config()
    (NGINX_DIR / "cama-sites-enabled.cama.merged.conf").write_text(config, encoding="utf-8")

    text = ACCESS.read_text(encoding="utf-8")
    host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
    password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)
    sftp = c.open_sftp()
    remote = "/etc/nginx/sites-enabled/cama"
    sftp.put(str(NGINX_DIR / "cama-sites-enabled.cama.merged.conf"), remote)
    sftp.put(str(NGINX_DIR / "cama-sites-enabled.cama.merged.conf"), "/etc/nginx/sites-available/cama")
    sftp.close()

    for cmd in ["nginx -t", "systemctl reload nginx"]:
        _, o, e = c.exec_command(cmd)
        code = o.channel.recv_exit_status()
        out = o.read().decode() + e.read().decode()
        print(out)
        if code != 0:
            c.close()
            return code

    checks = [
        "curl -sk -o /dev/null -w 'root:%{http_code} loc:%{redirect_url}\\n' https://127.0.0.1/ -H 'Host: camaplus.cafe24.com'",
        "curl -sk -o /dev/null -w 'login:%{http_code}\\n' https://127.0.0.1/login -H 'Host: camaplus.cafe24.com'",
        "curl -sk -o /dev/null -w 'home:%{http_code}\\n' https://127.0.0.1/home -H 'Host: camaplus.cafe24.com'",
        "curl -sk -o /dev/null -w 'legacy:%{http_code}\\n' https://127.0.0.1/legacy/login -H 'Host: camaplus.cafe24.com'",
        "curl -sk -o /dev/null -w 'admin:%{http_code}\\n' https://127.0.0.1/admin/ -H 'Host: camaplus.cafe24.com'",
        "curl -sk https://127.0.0.1/admin/ -H 'Host: camaplus.cafe24.com' | grep -q 'CAMA-DOCTOR' && echo 'admin_title:OK' || echo 'admin_title:WRONG_SPA'",
    ]
    for cmd in checks:
        _, o, _ = c.exec_command(cmd)
        o.channel.recv_exit_status()
        print(cmd, "->", o.read().decode().strip())

    c.close()
    print("nginx deployed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
