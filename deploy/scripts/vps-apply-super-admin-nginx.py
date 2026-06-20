#!/usr/bin/env python3
"""Re-apply Super Admin /admin/ nginx block on VPS."""
from __future__ import annotations

import re
import sys
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
ACCESS_LOCAL = REPO_ROOT / "deploy" / "CAFE24_VPS_ACCESS.local.md"
snippet = REPO_ROOT / "deploy" / "nginx" / "cama-super-admin-locations.conf"
apply_py = SCRIPT_DIR / "apply-super-admin-nginx.py"

text = ACCESS_LOCAL.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)
sftp = c.open_sftp()
sftp.put(str(snippet), "/tmp/cama-super-admin-locations.conf")
sftp.put(str(apply_py), "/tmp/apply-super-admin-nginx.py")
sftp.close()

cmds = [
    "python3 /tmp/apply-super-admin-nginx.py /tmp/cama-super-admin-locations.conf",
    "nginx -t",
    "systemctl reload nginx",
    "grep -A8 'location /admin/' /etc/nginx/sites-enabled/cama",
    "curl -sk -o /dev/null -w 'admin:%{http_code}\\n' https://127.0.0.1/admin/ -H 'Host: camaplus.cafe24.com'",
]
for cmd in cmds:
    _, o, e = c.exec_command(cmd)
    code = o.channel.recv_exit_status()
    out = o.read().decode() + e.read().decode()
    print(f">>> {cmd} (exit {code})\n{out}")
    if code != 0 and "nginx -t" in cmd:
        sys.exit(code)

c.close()
print("Done.")
