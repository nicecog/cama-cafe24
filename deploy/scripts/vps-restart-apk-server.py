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
    "docker run --rm -v /opt/cama/jars:/j eclipse-temurin:21-jre-jammy jar tf /j/cama-back-1.0-SNAPSHOT.jar | grep DoctorApk || echo no_apk_in_jar",
    "cd /opt/cama/deploy && docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 up -d --no-deps --force-recreate cama-plus-server",
]
for c in cmds:
    print(">>>", c)
    _, o, e = client.exec_command(c, timeout=180)
    o.channel.recv_exit_status()
    print(o.read().decode())
    err = e.read().decode().strip()
    if err:
        print("ERR:", err[:1000])

time.sleep(18)
_, o, _ = client.exec_command("""
docker inspect cama-plus-server --format '{{json .Mounts}}'
docker exec cama-plus-server ls -la /opt/cama/data/apk_down/
docker logs cama-plus-server 2>&1 | grep 'APK storage' | tail -1
curl -s -o /dev/null -w 'apk=%{http_code}\\n' http://127.0.0.1:8080/apk_down/cama-plus-cafe24-2026-06-17.apk
curl -s -X POST http://127.0.0.1:8080/api/auth/doctor -H 'Content-Type: application/json' -d '{"principal":"admin","credentials":"admincama!"}'
""")
o.channel.recv_exit_status()
print(o.read().decode())
client.close()
