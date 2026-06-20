#!/usr/bin/env python3
"""Start postgres + doctor-web on VPS."""
import re
from pathlib import Path
import paramiko

access = Path("deploy/CAFE24_VPS_ACCESS.local.md").read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", access).group(1)
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", access).group(1)
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)
cmds = [
    "docker start c6fdf0e55844_cama-cafe24-postgres",
    "sleep 6",
    "docker start cama-doctor-web",
    "sleep 20",
    "docker ps --format '{{.Names}} {{.Status}}' | grep -E 'postgres|doctor'",
    "curl -s -o /dev/null -w 'legacy_login:%{http_code}\\n' http://127.0.0.1:8081/legacy/login",
]
for cmd in cmds:
    _, o, e = c.exec_command(cmd)
    o.channel.recv_exit_status()
    print(">>>", cmd)
    print(o.read().decode() + e.read().decode())
c.close()
