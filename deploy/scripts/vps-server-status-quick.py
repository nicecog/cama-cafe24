#!/usr/bin/env python3
import re
from pathlib import Path
import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
acc = {
    "host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1),
    "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1),
    "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1),
}
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)
script = """
docker ps -a --filter name=cama-plus-server --format '{{.Names}} {{.Status}}'
docker inspect cama-plus-server --format 'restart={{.RestartCount}}'
docker logs --tail 300 cama-plus-server 2>&1 | tail -80
curl -s -o /dev/null -w 'health HTTP %{http_code}\\n' http://127.0.0.1:8080/actuator/health || true
curl -s -o /dev/null -w 'recover HTTP %{http_code}\\n' -X POST http://127.0.0.1:8080/api/public/patient/recover/login-id -H 'Content-Type: application/json' -d '{"name":"최완규","phone":"01032984763"}' || true
"""
_, o, e = c.exec_command(script, timeout=90)
o.channel.recv_exit_status()
print(o.read().decode())
err = e.read().decode().strip()
if err:
    print("STDERR:", err[:500])
c.close()
