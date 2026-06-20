#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

import paramiko

access = Path("deploy/CAFE24_VPS_ACCESS.local.md").read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", access).group(1)
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", access).group(1)
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)
_, o, _ = c.exec_command("sed -n '48,140p' /etc/nginx/sites-enabled/cama")
o.channel.recv_exit_status()
print(o.read().decode())
c.close()
