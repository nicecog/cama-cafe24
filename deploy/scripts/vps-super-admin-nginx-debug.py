#!/usr/bin/env python3
import re
import time
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

cmds = [
    "docker ps --filter name=cama-super-admin --format '{{.Names}} {{.Status}}'",
    "curl -sS -o /dev/null -w 'direct8083:%{http_code}\\n' http://127.0.0.1:8083/",
    "curl -sk -o /dev/null -w 'nginx_admin:%{http_code}\\n' https://127.0.0.1/admin/ -H 'Host: camaplus.cafe24.com'",
    "grep -n 'admin' /etc/nginx/sites-enabled/cama | head -20",
    "ls -la /opt/cama/www/super-admin/ | head -10",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)
for cmd in cmds:
    print(f"=== {cmd[:60]} ===")
    _, o, e = c.exec_command(cmd)
    time.sleep(1)
    print(o.read().decode(errors="replace"))
    err = e.read().decode(errors="replace")
    if err:
        print(err)
c.close()
