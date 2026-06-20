#!/usr/bin/env python3
import json, re
from pathlib import Path
import paramiko
access = Path("deploy/CAFE24_VPS_ACCESS.local.md").read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", access).group(1)
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", access).group(1)
c = paramiko.SSHClient(); c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)
for cmd in [
    "docker network ls",
    "docker ps -a --format '{{.Names}}'",
    "docker inspect cama-doctor-web --format '{{json .NetworkSettings.Networks}}' 2>/dev/null || echo no container",
    "docker inspect c6fdf0e55844_cama-cafe24-postgres --format '{{json .NetworkSettings.Networks}}' 2>/dev/null || docker ps -a | grep postgres",
]:
    _, o, _ = c.exec_command(cmd); o.channel.recv_exit_status()
    print(">>>", cmd); print(o.read().decode()[:3000])
c.close()
