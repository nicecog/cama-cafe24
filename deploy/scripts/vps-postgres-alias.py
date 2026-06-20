#!/usr/bin/env python3
import json, re
from pathlib import Path
import paramiko
access = Path("deploy/CAFE24_VPS_ACCESS.local.md").read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", access).group(1)
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", access).group(1)
c = paramiko.SSHClient(); c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)
_, o, _ = c.exec_command("docker network inspect deploy_default")
o.channel.recv_exit_status()
net = json.loads(o.read().decode())[0]
for cinfo in net.get("Containers", {}).values():
    name = cinfo.get("Name", "")
    if "postgres" in name:
        print("postgres container:", name, "aliases:", cinfo.get("Aliases"))
c.close()
