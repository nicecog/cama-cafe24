#!/usr/bin/env python3
import re, time, paramiko
from pathlib import Path

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
host, pw = "210.114.18.156", "admincama!"
if ACCESS.is_file():
    t = ACCESS.read_text(encoding="utf-8")
    if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", t):
        host = m.group(1)
    if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", t):
        pw = m.group(1)

cmds = [
    "ls -la /opt/cama/data/cama-files/upload 2>&1 | head -5",
    "du -sh /opt/cama/data/cama-files 2>&1",
    "find /root /opt -maxdepth 5 -type d -name upload 2>/dev/null | head -10",
    "docker ps --format '{{.Names}}' | grep -E 'plus-server|postgres'",
    "for n in $(docker ps --format '{{.Names}}' | grep plus-server); do echo CONTAINER=$n; docker exec $n ls /opt/cama/data/cama-files/upload 2>&1 | head -3; done",
]
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=pw, timeout=30)
for cmd in cmds:
    _, o, e = c.exec_command(cmd)
    time.sleep(1)
    print(">", cmd)
    print((o.read() + e.read()).decode(errors="replace").strip()[:800])
    print()
c.close()
