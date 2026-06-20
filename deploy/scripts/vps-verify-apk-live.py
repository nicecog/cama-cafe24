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
    "cd /opt/cama/deploy && docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 start postgres",
    "sleep 8",
    "docker restart cama-plus-server",
    "sleep 25",
    "curl -s -o /dev/null -w 'health=%{http_code}\\n' http://127.0.0.1:8080/api/public/patient/recover/login-id -X POST -H 'Content-Type: application/json' -d '{}'",
    "curl -s -o /dev/null -w 'apk=%{http_code}\\n' http://127.0.0.1:8080/apk_down/cama-plus-cafe24-2026-06-17.apk",
    """DT=$(curl -s -X POST http://127.0.0.1:8080/api/auth/doctor -H 'Content-Type: application/json' -d '{"principal":"cama","credentials":"admincama!"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['apiToken'])")
curl -s -X POST http://127.0.0.1:8080/api/doctor/apk/list -H 'Content-Type: application/json' -H "api_key: Bearer $DT" -d '{}'""",
    "curl -s -o /dev/null -w 'public_apk=%{http_code}\\n' https://camaplus.cafe24.com/apk_down/cama-plus-cafe24-2026-06-17.apk",
]
for c in cmds:
    print(">>>", c[:85])
    _, o, e = client.exec_command(c, timeout=120)
    o.channel.recv_exit_status()
    print(o.read().decode())
    err = e.read().decode().strip()
    if err:
        print("ERR:", err[:400])
client.close()
