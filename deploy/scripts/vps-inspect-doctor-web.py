#!/usr/bin/env python3
"""Set SERVER_SERVLET_CONTEXT_PATH=/legacy on cama-doctor-web container."""
from __future__ import annotations

import json
import re
from pathlib import Path

import paramiko

access = Path("deploy/CAFE24_VPS_ACCESS.local.md").read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", access).group(1)
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", access).group(1)
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)

_, o, _ = c.exec_command("docker inspect cama-doctor-web")
o.channel.recv_exit_status()
data = json.loads(o.read().decode())[0]
cfg = data["Config"]
print("Image:", cfg["Image"])
print("Cmd:", cfg.get("Cmd"))
print("Env sample:", [e for e in cfg.get("Env", []) if e.startswith("SERVER") or e.startswith("DOCTOR")][:10])
print("All env count:", len(cfg.get("Env", [])))
for e in cfg.get("Env", []):
    if not e.startswith("PATH=") and not e.startswith("JAVA_"):
        print(e)
ports = data.get("NetworkSettings", {}).get("Ports", {})
print("Ports:", ports)
mounts = data.get("Mounts", [])
print("Mounts:", mounts)
nets = data.get("NetworkSettings", {}).get("Networks", {})
print("Networks:", list(nets.keys()))

c.close()
