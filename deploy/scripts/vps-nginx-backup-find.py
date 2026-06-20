#!/usr/bin/env python3
import re
from pathlib import Path
import paramiko
access = Path("deploy/CAFE24_VPS_ACCESS.local.md").read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", access).group(1)
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", access).group(1)
c = paramiko.SSHClient(); c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)
for p in ["/etc/nginx/sites-available/cama", "/etc/nginx/sites-available/cama.bak", "/opt/cama/deploy/nginx/cama-live.conf"]:
    _, o, _ = c.exec_command(f"test -f {p} && wc -l {p} || echo missing {p}")
    o.channel.recv_exit_status()
    print(o.read().decode())
_, o, _ = c.exec_command("ls -la /etc/nginx/sites-available/")
o.channel.recv_exit_status()
print(o.read().decode())
c.close()
