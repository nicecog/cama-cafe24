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
    "jar tf /opt/cama/jars/cama-back-1.0-SNAPSHOT.jar | grep DoctorApk || echo jar_missing_apk",
    "ls -la /opt/cama/data/apk_down/",
    "docker inspect cama-plus-server --format '{{json .Mounts}}'",
    "cd /tmp/cama-plus-server && docker run --rm -v /tmp/cama-plus-server:/app -v /root/.m2:/root/.m2 -w /app maven:3.9-eclipse-temurin-21 mvn clean package -DskipTests 2>&1 | tail -20",
    "jar tf /tmp/cama-plus-server/target/cama-back-1.0-SNAPSHOT.jar | grep DoctorApk || echo built_jar_missing_apk",
    "cp -f /tmp/cama-plus-server/target/cama-back-1.0-SNAPSHOT.jar /opt/cama/jars/cama-back-1.0-SNAPSHOT.jar",
    "cd /opt/cama/deploy && docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 up -d --force-recreate cama-plus-server",
]
for c in cmds:
    print(">>>", c[:100])
    _, o, e = client.exec_command(c, timeout=300)
    o.channel.recv_exit_status()
    out = o.read().decode()
    print(out[-3000:] if len(out) > 3000 else out)
    err = e.read().decode().strip()
    if err:
        print("ERR:", err[:800])

time.sleep(15)
_, o, _ = client.exec_command(
    "docker exec cama-plus-server ls -la /opt/cama/data/apk_down/ && "
    "curl -s -o /dev/null -w 'apk=%{http_code}\\n' http://127.0.0.1:8080/apk_down/cama-plus-cafe24-2026-06-17.apk && "
    "docker logs cama-plus-server 2>&1 | grep 'APK storage' | tail -1"
)
o.channel.recv_exit_status()
print(o.read().decode())
client.close()
