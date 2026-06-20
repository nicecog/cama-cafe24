#!/usr/bin/env python3
import re
from pathlib import Path
import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
user = re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1)
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=user, password=password, timeout=30, allow_agent=False, look_for_keys=False)

_, o, _ = client.exec_command("docker logs cama-plus-server 2>&1 | tail -120")
o.channel.recv_exit_status()
print(o.read().decode())
client.close()
