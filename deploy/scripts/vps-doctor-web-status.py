#!/usr/bin/env python3
import re
from pathlib import Path
import paramiko
access = Path("deploy/CAFE24_VPS_ACCESS.local.md").read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", access).group(1)
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", access).group(1)
c = paramiko.SSHClient(); c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)
for cmd in [
    "docker logs cama-doctor-web 2>&1 | tail -20",
    "docker ps --filter name=doctor --format '{{.Names}} {{.Status}}'",
    "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8081/legacy/login --connect-timeout 3",
]:
    _, o, _ = c.exec_command(cmd); o.channel.recv_exit_status()
    print(">>>", cmd); print(o.read().decode())
c.close()
