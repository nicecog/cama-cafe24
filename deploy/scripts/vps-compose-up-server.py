#!/usr/bin/env python3
import re, time
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

cmds = [
    "ls -la /opt/cama/jars/",
    "docker rm -f cama-plus-server 2>/dev/null; docker container prune -f",
    "cd /opt/cama/deploy && docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 up -d --no-deps cama-plus-server 2>&1",
]
for c in cmds:
    print(">>>", c)
    _, o, e = client.exec_command(c, timeout=120)
    o.channel.recv_exit_status()
    print(o.read().decode())
    err = e.read().decode().strip()
    if err: print("ERR:", err[:800])

time.sleep(35)
_, o, _ = client.exec_command("docker ps | grep cama-plus; curl -s -o /dev/null -w 'h=%{http_code}\\n' -X POST http://127.0.0.1:8080/api/public/patient/recover/login-id -H 'Content-Type: application/json' -d '{}'")
o.channel.recv_exit_status()
print(o.read().decode())
client.close()
